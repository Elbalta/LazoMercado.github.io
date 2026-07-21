-- Lazo Mercado 2.0 - Etapa 2: pedidos reales, seguimiento y administración.
-- Ejecutar después de schema.sql, functions.sql y security.sql.
begin;

alter table public.products
  add column if not exists retail_stock_kg numeric(12,3) not null default 0
  check (retail_stock_kg >= 0);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_lazo_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.place_customer_order(
  p_product_id uuid,
  p_lot_id uuid,
  p_channel public.sales_channel,
  p_name text,
  p_email text,
  p_phone text,
  p_quantity numeric,
  p_payment_method public.payment_method default 'transfer',
  p_delivery_method public.delivery_method default 'pickup',
  p_address text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product public.products%rowtype;
  v_lot public.lots%rowtype;
  v_customer public.customers%rowtype;
  v_order public.orders%rowtype;
  v_payment public.payments%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g');
  v_equivalent_kg numeric;
  v_unit_price numeric;
  v_payment_status public.payment_status;
begin
  if char_length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Ingresa un nombre válido.'; end if;
  if position('@' in v_email) <= 1 then raise exception 'Ingresa un email válido.'; end if;
  if char_length(v_phone) < 8 then raise exception 'Ingresa un teléfono válido.'; end if;
  if p_quantity is null or p_quantity <= 0 then raise exception 'La cantidad debe ser mayor que cero.'; end if;
  if p_delivery_method = 'delivery' and nullif(trim(coalesce(p_address, '')), '') is null then
    raise exception 'Ingresa una dirección para el despacho.';
  end if;

  select * into v_product from public.products
  where id = p_product_id and is_published = true
  for update;
  if not found then raise exception 'Producto no encontrado o no publicado.'; end if;
  if v_product.season_status <> 'available' then raise exception 'El producto no está disponible.'; end if;

  v_equivalent_kg := p_quantity * v_product.equivalent_weight_kg;

  if p_channel = 'wholesale' then
    if p_lot_id is null then raise exception 'Debes seleccionar un lote mayorista.'; end if;
    select * into v_lot from public.lots
    where id = p_lot_id and product_id = p_product_id and is_published = true
    for update;
    if not found then raise exception 'Lote no encontrado o no publicado.'; end if;
    if v_lot.status <> 'open' then raise exception 'El lote no está abierto.'; end if;
    if v_equivalent_kg < v_lot.minimum_purchase_kg then
      raise exception 'El pedido mínimo es de % kg.', v_lot.minimum_purchase_kg;
    end if;
    if v_equivalent_kg > v_lot.total_capacity_kg - v_lot.customer_paid_kg - v_lot.market_assumed_kg then
      raise exception 'La cantidad supera el remanente disponible del lote.';
    end if;
    v_unit_price := v_lot.wholesale_price;
  else
    if p_lot_id is not null then raise exception 'Un pedido al detalle no puede indicar un lote.'; end if;
    if v_equivalent_kg > v_product.retail_stock_kg then
      raise exception 'Stock insuficiente. Quedan % kg.', v_product.retail_stock_kg;
    end if;
    v_unit_price := v_product.detail_price;
    update public.products set retail_stock_kg = retail_stock_kg - v_equivalent_kg where id = v_product.id;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_email, 0));
  select * into v_customer from public.customers where lower(email) = v_email limit 1 for update;
  if found then
    update public.customers set full_name = trim(p_name), phone = v_phone
    where id = v_customer.id returning * into v_customer;
  else
    insert into public.customers(full_name, email, phone)
    values (trim(p_name), v_email, v_phone) returning * into v_customer;
  end if;

  v_payment_status := case
    when p_payment_method = 'cash' then 'PENDIENTE_EFECTIVO'::public.payment_status
    else 'PENDIENTE'::public.payment_status
  end;

  insert into public.orders(
    customer_id, product_id, lot_id, channel, commercial_quantity,
    equivalent_kg, unit_price, total_amount, payment_method,
    payment_status, operational_status, delivery_method
  ) values (
    v_customer.id, v_product.id, p_lot_id, p_channel, p_quantity,
    v_equivalent_kg, v_unit_price, v_equivalent_kg * v_unit_price,
    p_payment_method, v_payment_status, 'PENDIENTE_CONFIRMACION', p_delivery_method
  ) returning * into v_order;

  insert into public.payments(order_id, method, status, amount)
  values (v_order.id, p_payment_method, v_payment_status, v_order.total_amount)
  returning * into v_payment;

  insert into public.delivery_details(
    order_id, recipient_name, recipient_phone, address_line, status
  ) values (
    v_order.id, v_customer.full_name, v_customer.phone,
    case when p_delivery_method = 'delivery' then trim(p_address) else null end,
    'pending'
  );

  return jsonb_build_object(
    'id', v_order.id,
    'product_name', v_product.name,
    'quantity', v_order.commercial_quantity,
    'equivalent_kg', v_order.equivalent_kg,
    'total_amount', v_order.total_amount,
    'payment_status', v_order.payment_status,
    'operational_status', v_order.operational_status,
    'created_at', v_order.created_at
  );
end;
$$;

create or replace function public.orders_by_phone(p_phone text)
returns table (
  id uuid,
  channel public.sales_channel,
  product_name text,
  commercial_quantity numeric,
  equivalent_kg numeric,
  total_amount numeric,
  payment_status public.payment_status,
  operational_status public.order_status,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g');
begin
  if char_length(v_phone) < 8 then raise exception 'Ingresa un teléfono válido.'; end if;
  return query
  select o.id, o.channel, p.name, o.commercial_quantity, o.equivalent_kg,
         o.total_amount, o.payment_status, o.operational_status, o.created_at
  from public.orders o
  join public.customers c on c.id = o.customer_id
  join public.products p on p.id = o.product_id
  where regexp_replace(c.phone, '[^0-9+]', '', 'g') = v_phone
  order by o.created_at desc;
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
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  select * into v_payment from public.payments where order_id = p_order_id and status <> 'CANCELADO' order by created_at desc limit 1 for update;
  if not found then raise exception 'Pago no encontrado.'; end if;

  if v_order.channel = 'wholesale' then
    return public.confirm_payment_manually(v_payment.id, auth.uid());
  end if;

  update public.payments set status = 'CONFIRMADO', confirmed_at = now(), confirmed_by = auth.uid()
  where id = v_payment.id;
  update public.orders set payment_status = 'CONFIRMADO', operational_status = 'PREPARANDO'
  where id = v_order.id returning * into v_order;
  return v_order;
end;
$$;

create or replace function public.admin_set_order_status(
  p_order_id uuid,
  p_status public.order_status
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_updated public.orders%rowtype;
begin
  if not public.is_lazo_admin() then raise exception 'Acceso denegado.'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if v_order.operational_status = 'COMPLETADO' then raise exception 'Una venta completada no puede modificarse.'; end if;

  if p_status = 'CANCELADO' and v_order.operational_status <> 'CANCELADO' then
    if v_order.channel = 'retail' then
      update public.products set retail_stock_kg = retail_stock_kg + v_order.equivalent_kg
      where id = v_order.product_id;
    elsif v_order.payment_status = 'CONFIRMADO' then
      update public.lots set customer_paid_kg = greatest(0, customer_paid_kg - v_order.equivalent_kg),
        status = case when status = 'full' then 'open'::public.lot_status else status end
      where id = v_order.lot_id;
    end if;
    update public.payments set status = 'CANCELADO' where order_id = v_order.id and status <> 'REEMBOLSADO';
  end if;

  update public.orders
  set operational_status = p_status,
      payment_status = case when p_status = 'CANCELADO' then 'CANCELADO'::public.payment_status else payment_status end
  where id = v_order.id returning * into v_updated;
  return v_updated;
end;
$$;

drop policy if exists "admins_see_own_membership" on public.admin_users;
create policy "admins_see_own_membership" on public.admin_users
for select to authenticated using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['products','lots','customers','orders','payments','delivery_details','season_notifications']
  loop
    execute format('drop policy if exists %I on public.%I', 'lazo_admin_all_' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select public.is_lazo_admin())) with check ((select public.is_lazo_admin()))',
      'lazo_admin_all_' || t, t
    );
  end loop;
end $$;

grant select, insert, update, delete on public.products, public.lots, public.customers,
  public.orders, public.payments, public.delivery_details, public.season_notifications to authenticated;
grant select on public.admin_users to authenticated;

revoke all on function public.place_customer_order(uuid, uuid, public.sales_channel, text, text, text, numeric, public.payment_method, public.delivery_method, text) from public;
grant execute on function public.place_customer_order(uuid, uuid, public.sales_channel, text, text, text, numeric, public.payment_method, public.delivery_method, text) to anon, authenticated;
revoke all on function public.orders_by_phone(text) from public;
grant execute on function public.orders_by_phone(text) to anon, authenticated;
revoke all on function public.admin_confirm_order_payment(uuid) from public;
grant execute on function public.admin_confirm_order_payment(uuid) to authenticated;
revoke all on function public.admin_set_order_status(uuid, public.order_status) from public;
grant execute on function public.admin_set_order_status(uuid, public.order_status) to authenticated;
grant execute on function public.is_lazo_admin() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_can_view_product_images" on storage.objects;
create policy "public_can_view_product_images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "admins_can_upload_product_images" on storage.objects;
create policy "admins_can_upload_product_images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and (select public.is_lazo_admin()));

drop policy if exists "admins_can_update_product_images" on storage.objects;
create policy "admins_can_update_product_images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and (select public.is_lazo_admin()))
with check (bucket_id = 'product-images' and (select public.is_lazo_admin()));

drop policy if exists "admins_can_delete_product_images" on storage.objects;
create policy "admins_can_delete_product_images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and (select public.is_lazo_admin()));

update public.products
set retail_stock_kg = 180
where id = '10000000-0000-4000-8000-000000000001'
  and retail_stock_kg = 0;

commit;

-- Crear primero el usuario en Authentication > Users. Después ejecutar:
-- insert into public.admin_users(user_id)
-- select id from auth.users where email = 'admin@lazo.cl' on conflict do nothing;
