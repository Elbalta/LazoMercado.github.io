-- Lazo Mercado 2.0 - Etapa 3: operación administrativa segura.
-- Ejecutar después de stage2-orders-api.sql.
begin;

alter table public.products
  add column if not exists retail_enabled boolean not null default true,
  add column if not exists archived_at timestamptz;

alter table public.lots
  add column if not exists archived_at timestamptz;

alter table public.orders
  add column if not exists cancellation_reason text;

-- Los productos creados exclusivamente para un lote mayorista se ocultaban como
-- productos al detalle agotados. Esta migración los separa sin perderlos.
update public.products p
set retail_enabled = false
where coalesce(p.retail_stock_kg, 0) = 0
  and exists (select 1 from public.lots l where l.product_id = p.id);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists order_status_history_order_created_idx
  on public.order_status_history(order_id, created_at desc);

alter table public.order_status_history enable row level security;

drop policy if exists "lazo_admin_all_order_status_history" on public.order_status_history;
create policy "lazo_admin_all_order_status_history"
on public.order_status_history
for all to authenticated
using ((select public.is_lazo_admin()))
with check ((select public.is_lazo_admin()));

grant select, insert on public.order_status_history to authenticated;

insert into public.order_status_history(order_id, from_status, to_status, reason, created_at)
select o.id, null, o.operational_status, 'Estado existente antes de instalar Etapa 3', o.created_at
from public.orders o
where not exists (
  select 1 from public.order_status_history h where h.order_id = o.id
);

create or replace function public.record_order_status_change(
  p_order_id uuid,
  p_from public.order_status,
  p_to public.order_status,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.order_status_history(order_id, from_status, to_status, changed_by, reason)
  values (p_order_id, p_from, p_to, auth.uid(), nullif(trim(coalesce(p_reason, '')), ''));
end;
$$;

create or replace function public.admin_confirm_order_payment(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_payment public.payments%rowtype;
  v_updated public.orders%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if v_order.operational_status <> 'PENDIENTE_CONFIRMACION' then
    raise exception 'Solo se puede confirmar un pedido pendiente de confirmación.';
  end if;
  if v_order.payment_status = 'CONFIRMADO' then raise exception 'El pago ya está confirmado.'; end if;

  select * into v_payment
  from public.payments
  where order_id = p_order_id and status <> 'CANCELADO'
  order by created_at desc limit 1 for update;
  if not found then raise exception 'Pago no encontrado.'; end if;

  if v_order.channel = 'wholesale' then
    v_updated := public.confirm_payment_manually(v_payment.id, auth.uid());
  else
    update public.payments
    set status = 'CONFIRMADO', confirmed_at = now(), confirmed_by = auth.uid()
    where id = v_payment.id;

    update public.orders
    set payment_status = 'CONFIRMADO', operational_status = 'PREPARANDO'
    where id = v_order.id returning * into v_updated;
  end if;

  perform public.record_order_status_change(
    v_order.id,
    v_order.operational_status,
    v_updated.operational_status,
    'Pago confirmado'
  );
  return v_updated;
end;
$$;

create or replace function public.admin_advance_order(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_lot public.lots%rowtype;
  v_next public.order_status;
  v_updated public.orders%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;

  if v_order.operational_status = 'PENDIENTE_CONFIRMACION' then
    raise exception 'Confirma primero el pago.';
  elsif v_order.operational_status = 'ESPERANDO_COMPRA_GRUPAL' then
    select * into v_lot from public.lots where id = v_order.lot_id for update;
    if not found or v_lot.status <> 'full' then
      raise exception 'El lote mayorista todavía no está completo.';
    end if;
    v_next := 'PREPARANDO';
  elsif v_order.operational_status = 'PREPARANDO' then
    v_next := 'LISTO_PARA_ENTREGA';
  elsif v_order.operational_status = 'LISTO_PARA_ENTREGA' then
    v_next := case
      when v_order.delivery_method = 'pickup' then 'ENTREGADO'::public.order_status
      else 'EN_TRANSITO'::public.order_status
    end;
  elsif v_order.operational_status = 'EN_TRANSITO' then
    v_next := 'ENTREGADO';
  elsif v_order.operational_status = 'ENTREGADO' then
    v_next := 'COMPLETADO';
  else
    raise exception 'Este pedido no puede avanzar desde su estado actual.';
  end if;

  update public.orders set operational_status = v_next
  where id = v_order.id returning * into v_updated;

  update public.delivery_details
  set status = case
    when v_next = 'EN_TRANSITO' then 'in_transit'::public.delivery_status
    when v_next in ('ENTREGADO', 'COMPLETADO') then 'delivered'::public.delivery_status
    else status
  end
  where order_id = v_order.id;

  perform public.record_order_status_change(v_order.id, v_order.operational_status, v_next, 'Avance operativo');
  return v_updated;
end;
$$;

create or replace function public.admin_revert_order_status(
  p_order_id uuid,
  p_reason text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_previous public.order_status;
  v_updated public.orders%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'Indica el motivo de la corrección.'; end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if v_order.operational_status in ('PENDIENTE_CONFIRMACION', 'CANCELADO') then
    raise exception 'Este estado no puede corregirse con esta acción.';
  end if;

  select h.from_status into v_previous
  from public.order_status_history h
  where h.order_id = v_order.id
    and h.to_status = v_order.operational_status
    and h.from_status is not null
  order by h.created_at desc
  limit 1;

  if v_previous is null then raise exception 'No existe un estado anterior recuperable.'; end if;
  if v_previous = 'PENDIENTE_CONFIRMACION' and v_order.payment_status = 'CONFIRMADO' then
    raise exception 'Usa Revertir pago para volver a pendiente.';
  end if;

  update public.orders set operational_status = v_previous
  where id = v_order.id returning * into v_updated;

  update public.delivery_details
  set status = case
    when v_previous = 'EN_TRANSITO' then 'in_transit'::public.delivery_status
    when v_previous in ('ENTREGADO', 'COMPLETADO') then 'delivered'::public.delivery_status
    else 'pending'::public.delivery_status
  end
  where order_id = v_order.id;

  perform public.record_order_status_change(v_order.id, v_order.operational_status, v_previous, p_reason);
  return v_updated;
end;
$$;

create or replace function public.admin_revert_order_payment(
  p_order_id uuid,
  p_reason text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_payment_status public.payment_status;
  v_updated public.orders%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'Indica el motivo de la corrección.'; end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if v_order.payment_status <> 'CONFIRMADO' then raise exception 'El pago no está confirmado.'; end if;
  if v_order.operational_status not in ('PREPARANDO', 'ESPERANDO_COMPRA_GRUPAL') then
    raise exception 'El pedido ya avanzó demasiado para revertir el pago directamente.';
  end if;

  v_payment_status := case
    when v_order.payment_method = 'cash' then 'PENDIENTE_EFECTIVO'::public.payment_status
    else 'PENDIENTE'::public.payment_status
  end;

  if v_order.channel = 'wholesale' then
    update public.lots
    set customer_paid_kg = greatest(0, customer_paid_kg - v_order.equivalent_kg),
        status = case when status = 'full' then 'open'::public.lot_status else status end
    where id = v_order.lot_id;
  end if;

  update public.payments
  set status = v_payment_status, confirmed_at = null, confirmed_by = null
  where order_id = v_order.id and status = 'CONFIRMADO';

  update public.orders
  set payment_status = v_payment_status,
      operational_status = 'PENDIENTE_CONFIRMACION'
  where id = v_order.id returning * into v_updated;

  perform public.record_order_status_change(
    v_order.id, v_order.operational_status, 'PENDIENTE_CONFIRMACION', p_reason
  );
  return v_updated;
end;
$$;

create or replace function public.admin_cancel_order(
  p_order_id uuid,
  p_reason text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_updated public.orders%rowtype;
  v_paid boolean;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'Indica el motivo de la cancelación.'; end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if v_order.operational_status = 'CANCELADO' then raise exception 'El pedido ya está cancelado.'; end if;
  if v_order.operational_status in ('EN_TRANSITO', 'ENTREGADO', 'COMPLETADO') then
    raise exception 'Este pedido requiere un proceso de devolución; no puede cancelarse directamente.';
  end if;

  v_paid := v_order.payment_status = 'CONFIRMADO';

  if v_order.channel = 'retail' then
    update public.products
    set retail_stock_kg = retail_stock_kg + v_order.equivalent_kg
    where id = v_order.product_id;
  elsif v_paid then
    update public.lots
    set customer_paid_kg = greatest(0, customer_paid_kg - v_order.equivalent_kg),
        status = case when status = 'full' then 'open'::public.lot_status else status end
    where id = v_order.lot_id;
  end if;

  update public.payments
  set status = case
    when v_paid then 'REEMBOLSO_SOLICITADO'::public.payment_status
    else 'CANCELADO'::public.payment_status
  end
  where order_id = v_order.id and status <> 'REEMBOLSADO';

  update public.delivery_details set status = 'cancelled' where order_id = v_order.id;

  update public.orders
  set operational_status = 'CANCELADO',
      payment_status = case
        when v_paid then 'REEMBOLSO_SOLICITADO'::public.payment_status
        else 'CANCELADO'::public.payment_status
      end,
      cancellation_reason = trim(p_reason)
  where id = v_order.id returning * into v_updated;

  perform public.record_order_status_change(v_order.id, v_order.operational_status, 'CANCELADO', p_reason);
  return v_updated;
end;
$$;

create or replace function public.admin_archive_retail_product(p_product_id uuid)
returns public.products
language plpgsql
security definer
set search_path = ''
as $$
declare v_product public.products%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  update public.products
  set retail_enabled = false,
      is_published = exists (
        select 1 from public.lots l
        where l.product_id = p_product_id and l.is_published and l.archived_at is null
      ),
      archived_at = case
        when exists (
          select 1 from public.lots l
          where l.product_id = p_product_id and l.is_published and l.archived_at is null
        ) then null else now()
      end
  where id = p_product_id
  returning * into v_product;
  if not found then raise exception 'Producto no encontrado.'; end if;
  return v_product;
end;
$$;

create or replace function public.admin_archive_lot(p_lot_id uuid)
returns public.lots
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lot public.lots%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  update public.lots
  set is_published = false, status = 'closed', archived_at = now()
  where id = p_lot_id
  returning * into v_lot;
  if not found then raise exception 'Lote no encontrado.'; end if;

  update public.products p
  set is_published = false, archived_at = now()
  where p.id = v_lot.product_id
    and not p.retail_enabled
    and not exists (
      select 1 from public.lots l
      where l.product_id = p.id and l.is_published and l.archived_at is null
    );
  return v_lot;
end;
$$;

create or replace function public.admin_save_wholesale_product(
  p_lot_id uuid,
  p_name text,
  p_variety text,
  p_description text,
  p_image_url text,
  p_price numeric,
  p_capacity numeric,
  p_minimum numeric,
  p_status public.lot_status
)
returns public.lots
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_id uuid;
  v_lot public.lots%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Ingresa un nombre válido.'; end if;
  if p_price <= 0 or p_capacity <= 0 or p_minimum <= 0 or p_minimum > p_capacity then
    raise exception 'Revisa precio, capacidad y compra mínima.';
  end if;
  if nullif(trim(coalesce(p_image_url, '')), '') is null then raise exception 'Selecciona una imagen.'; end if;

  if p_lot_id is null then
    insert into public.products(
      name, variety, description, image_url, sale_unit, equivalent_weight_kg,
      wholesale_price, detail_price, minimum_quantity, retail_stock_kg,
      retail_enabled, season_status, is_published, archived_at
    ) values (
      trim(p_name), nullif(trim(coalesce(p_variety, '')), ''), nullif(trim(coalesce(p_description, '')), ''),
      trim(p_image_url), 'kilo', 1, p_price, p_price, 1, 0,
      false, 'available', true, null
    ) returning id into v_product_id;

    insert into public.lots(
      product_id, total_capacity_kg, minimum_purchase_kg, wholesale_price,
      opens_at, initial_deadline, market_assumption_max_percent,
      status, is_published, archived_at
    ) values (
      v_product_id, p_capacity, p_minimum, p_price,
      now(), now() + interval '7 days', 20,
      p_status, true, null
    ) returning * into v_lot;
  else
    select * into v_lot from public.lots where id = p_lot_id for update;
    if not found then raise exception 'Lote no encontrado.'; end if;
    v_product_id := v_lot.product_id;

    update public.products
    set name = trim(p_name),
        variety = nullif(trim(coalesce(p_variety, '')), ''),
        description = nullif(trim(coalesce(p_description, '')), ''),
        image_url = trim(p_image_url),
        wholesale_price = p_price,
        is_published = true,
        archived_at = null
    where id = v_product_id;

    update public.lots
    set total_capacity_kg = p_capacity,
        minimum_purchase_kg = p_minimum,
        wholesale_price = p_price,
        status = p_status,
        is_published = true,
        archived_at = null
    where id = p_lot_id returning * into v_lot;
  end if;
  return v_lot;
end;
$$;

revoke all on function public.record_order_status_change(uuid, public.order_status, public.order_status, text) from public;
revoke all on function public.admin_set_order_status(uuid, public.order_status) from public, anon, authenticated;
revoke all on function public.admin_advance_order(uuid) from public;
revoke all on function public.admin_revert_order_status(uuid, text) from public;
revoke all on function public.admin_revert_order_payment(uuid, text) from public;
revoke all on function public.admin_cancel_order(uuid, text) from public;
revoke all on function public.admin_archive_retail_product(uuid) from public;
revoke all on function public.admin_archive_lot(uuid) from public;
revoke all on function public.admin_save_wholesale_product(uuid, text, text, text, text, numeric, numeric, numeric, public.lot_status) from public;

grant execute on function public.admin_advance_order(uuid) to authenticated;
grant execute on function public.admin_revert_order_status(uuid, text) to authenticated;
grant execute on function public.admin_revert_order_payment(uuid, text) to authenticated;
grant execute on function public.admin_cancel_order(uuid, text) to authenticated;
grant execute on function public.admin_archive_retail_product(uuid) to authenticated;
grant execute on function public.admin_archive_lot(uuid) to authenticated;
grant execute on function public.admin_save_wholesale_product(uuid, text, text, text, text, numeric, numeric, numeric, public.lot_status) to authenticated;

-- Los pedidos y pagos solo cambian mediante las funciones anteriores, para que
-- las validaciones, el inventario y el historial no puedan omitirse.
revoke insert, update, delete on public.customers, public.orders, public.payments,
  public.delivery_details from authenticated;
grant select on public.customers, public.orders, public.payments,
  public.delivery_details to authenticated;

commit;
