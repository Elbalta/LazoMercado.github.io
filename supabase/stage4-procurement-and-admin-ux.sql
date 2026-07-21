-- Lazo Mercado 2.0 - Etapa 4: costos privados de abastecimiento.
-- Ejecutar después de stage3-admin-operations.sql.

begin;

create table if not exists public.lot_procurement (
  lot_id uuid primary key references public.lots(id) on delete cascade,
  supplier_cost_per_kg numeric(14,2) not null default 0 check (supplier_cost_per_kg >= 0),
  updated_at timestamptz not null default now()
);

alter table public.lot_procurement enable row level security;

drop policy if exists lot_procurement_admin_select on public.lot_procurement;
create policy lot_procurement_admin_select
on public.lot_procurement for select
to authenticated
using (public.is_lazo_admin());

revoke all on public.lot_procurement from public, anon;
grant select on public.lot_procurement to authenticated;

create or replace function public.admin_save_wholesale_product(
  p_lot_id uuid,
  p_name text,
  p_variety text,
  p_description text,
  p_image_url text,
  p_price numeric,
  p_supplier_cost numeric,
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
  if p_price <= 0 or p_supplier_cost < 0 or p_capacity <= 0 or p_minimum <= 0 or p_minimum > p_capacity then
    raise exception 'Revisa precio, costo proveedor, capacidad y compra mínima.';
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

  insert into public.lot_procurement(lot_id, supplier_cost_per_kg, updated_at)
  values (v_lot.id, p_supplier_cost, now())
  on conflict (lot_id) do update
  set supplier_cost_per_kg = excluded.supplier_cost_per_kg,
      updated_at = now();

  return v_lot;
end;
$$;

revoke all on function public.admin_save_wholesale_product(uuid, text, text, text, text, numeric, numeric, numeric, numeric, public.lot_status) from public, anon;
grant execute on function public.admin_save_wholesale_product(uuid, text, text, text, text, numeric, numeric, numeric, numeric, public.lot_status) to authenticated;

commit;
