-- Lazo Mercado 2.0 - Etapa 1: modelo relacional inicial.
-- Ejecutar primero en un proyecto Supabase vacío.
begin;

create extension if not exists pgcrypto;

-- Compatibilidad con la primera integración simplificada. Conserva la tabla
-- original como respaldo y permite instalar el modelo relacional sin perderla.
do $$
begin
  if to_regclass('public.products') is not null
     and not exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'products'
         and column_name = 'wholesale_price'
     ) then
    if to_regclass('public.products_legacy') is not null then
      raise exception 'Ya existe public.products_legacy; revisa el respaldo antes de continuar.';
    end if;
    alter table public.products rename to products_legacy;
  end if;
end;
$$;

do $$ begin
  create type public.sale_unit as enum (
    'kilo', 'caja', 'malla', 'bandeja', 'saco', 'unidad', 'personalizada'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.product_status as enum (
    'available', 'upcoming', 'out_of_season', 'paused'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.lot_status as enum (
    'draft', 'open', 'full', 'closed', 'cancelled'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.sales_channel as enum ('wholesale', 'retail');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_method as enum ('transfer', 'cash');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_status as enum (
    'PENDIENTE',
    'COMPROBANTE_ENVIADO',
    'PENDIENTE_EFECTIVO',
    'CONFIRMADO',
    'REEMBOLSO_SOLICITADO',
    'REEMBOLSADO',
    'CANCELADO'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_status as enum (
    'PENDIENTE_CONFIRMACION',
    'ESPERANDO_COMPRA_GRUPAL',
    'PREPARANDO',
    'LISTO_PARA_ENTREGA',
    'EN_TRANSITO',
    'ENTREGADO',
    'COMPLETADO',
    'CANCELADO'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.delivery_method as enum ('pickup', 'delivery');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.delivery_status as enum (
    'pending', 'scheduled', 'in_transit', 'delivered', 'cancelled'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.notification_status as enum ('pending', 'sent', 'cancelled');
exception when duplicate_object then null; end $$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 160),
  variety text,
  description text,
  image_url text,
  sale_unit public.sale_unit not null default 'kilo',
  custom_sale_unit text,
  equivalent_weight_kg numeric(12,3) not null default 1 check (equivalent_weight_kg > 0),
  wholesale_price numeric(14,2) not null check (wholesale_price >= 0),
  detail_price numeric(14,2) not null check (detail_price >= 0),
  minimum_quantity numeric(12,3) not null default 1 check (minimum_quantity > 0),
  season_status public.product_status not null default 'available',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_custom_unit_check check (
    (sale_unit = 'personalizada' and nullif(btrim(custom_sale_unit), '') is not null)
    or (sale_unit <> 'personalizada' and custom_sale_unit is null)
  )
);

-- Migra los ocho campos de la tabla antigua al modelo nuevo. La tabla de
-- respaldo se mantiene con RLS y sin acceso desde el navegador.
do $$
begin
  if to_regclass('public.products_legacy') is not null then
    execute $migration$
      insert into public.products (
        id, name, description, sale_unit, equivalent_weight_kg,
        wholesale_price, detail_price, minimum_quantity, season_status,
        image_url, is_published, created_at, updated_at
      )
      select
        id,
        name,
        description,
        case lower(coalesce(sale_unit::text, 'kilo'))
          when 'kilo' then 'kilo'::public.sale_unit
          when 'kg' then 'kilo'::public.sale_unit
          when 'caja' then 'caja'::public.sale_unit
          when 'malla' then 'malla'::public.sale_unit
          when 'bandeja' then 'bandeja'::public.sale_unit
          when 'saco' then 'saco'::public.sale_unit
          when 'unidad' then 'unidad'::public.sale_unit
          else 'kilo'::public.sale_unit
        end,
        1,
        greatest(coalesce(detail_price, 0), 0),
        greatest(coalesce(detail_price, 0), 0),
        1,
        case lower(coalesce(season_status::text, 'available'))
          when 'upcoming' then 'upcoming'::public.product_status
          when 'out_of_season' then 'out_of_season'::public.product_status
          when 'paused' then 'paused'::public.product_status
          else 'available'::public.product_status
        end,
        image_url,
        true,
        coalesce(created_at, now()),
        now()
      from public.products_legacy
      on conflict (id) do nothing
    $migration$;

    alter table public.products_legacy enable row level security;
    revoke all on table public.products_legacy from anon, authenticated;
  end if;
end;
$$;

create table public.lots (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update cascade on delete restrict,
  total_capacity_kg numeric(12,3) not null check (total_capacity_kg > 0),
  minimum_purchase_kg numeric(12,3) not null check (minimum_purchase_kg > 0),
  wholesale_price numeric(14,2) not null check (wholesale_price >= 0),
  opens_at timestamptz not null default now(),
  initial_deadline timestamptz not null,
  market_assumption_max_percent numeric(5,2) not null default 20
    check (market_assumption_max_percent between 0 and 20),
  customer_paid_kg numeric(12,3) not null default 0 check (customer_paid_kg >= 0),
  market_assumed_kg numeric(12,3) not null default 0 check (market_assumed_kg >= 0),
  status public.lot_status not null default 'draft',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lots_minimum_within_capacity check (minimum_purchase_kg <= total_capacity_kg),
  constraint lots_initial_deadline_check check (
    initial_deadline >= opens_at and initial_deadline <= opens_at + interval '7 days'
  ),
  constraint lots_committed_capacity_check check (
    customer_paid_kg + market_assumed_kg <= total_capacity_kg
  ),
  constraint lots_market_assumption_check check (
    market_assumed_kg <= total_capacity_kg * market_assumption_max_percent / 100
  )
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(btrim(full_name)) between 1 and 180),
  email text,
  phone text not null check (length(btrim(phone)) between 7 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on update cascade on delete restrict,
  product_id uuid not null references public.products(id) on update cascade on delete restrict,
  lot_id uuid references public.lots(id) on update cascade on delete restrict,
  channel public.sales_channel not null,
  commercial_quantity numeric(12,3) not null check (commercial_quantity > 0),
  equivalent_kg numeric(12,3) not null check (equivalent_kg > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  total_amount numeric(14,2) not null check (total_amount >= 0),
  payment_method public.payment_method not null,
  payment_status public.payment_status not null,
  operational_status public.order_status not null default 'PENDIENTE_CONFIRMACION',
  delivery_method public.delivery_method not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_channel_lot_check check (
    (channel = 'wholesale' and lot_id is not null)
    or (channel = 'retail' and lot_id is null)
  ),
  constraint orders_payment_method_status_check check (
    (payment_method = 'transfer' and payment_status <> 'PENDIENTE_EFECTIVO')
    or (payment_method = 'cash' and payment_status <> 'COMPROBANTE_ENVIADO')
  )
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on update cascade on delete restrict,
  method public.payment_method not null,
  status public.payment_status not null,
  amount numeric(14,2) not null check (amount > 0),
  receipt_url text,
  submitted_at timestamptz,
  confirmed_at timestamptz,
  confirmed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_method_status_check check (
    (method = 'transfer' and status <> 'PENDIENTE_EFECTIVO')
    or (method = 'cash' and status <> 'COMPROBANTE_ENVIADO')
  ),
  constraint payments_confirmation_fields_check check (
    (status = 'CONFIRMADO' and confirmed_at is not null)
    or (status <> 'CONFIRMADO')
  )
);

create table public.delivery_details (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on update cascade on delete cascade,
  recipient_name text not null,
  recipient_phone text not null,
  address_line text,
  commune text,
  region text,
  delivery_notes text,
  scheduled_for timestamptz,
  status public.delivery_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.season_notifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update cascade on delete cascade,
  customer_id uuid references public.customers(id) on update cascade on delete cascade,
  email text,
  phone text,
  status public.notification_status not null default 'pending',
  requested_at timestamptz not null default now(),
  sent_at timestamptz,
  constraint season_notifications_contact_check check (
    customer_id is not null or nullif(btrim(email), '') is not null or nullif(btrim(phone), '') is not null
  )
);

create unique index customers_email_unique_idx on public.customers (lower(email)) where email is not null;
create index customers_phone_idx on public.customers (phone);
create index products_public_catalog_idx on public.products (season_status, created_at desc) where is_published;
create index lots_product_status_idx on public.lots (product_id, status, initial_deadline);
create index lots_public_idx on public.lots (status, initial_deadline) where is_published;
create index orders_customer_created_idx on public.orders (customer_id, created_at desc);
create index orders_lot_status_idx on public.orders (lot_id, payment_status) where lot_id is not null;
create index payments_order_status_idx on public.payments (order_id, status);
create unique index payments_one_confirmed_per_order_idx on public.payments (order_id) where status = 'CONFIRMADO';
create index season_notifications_product_status_idx on public.season_notifications (product_id, status);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger lots_set_updated_at before update on public.lots
for each row execute function public.set_updated_at();
create trigger customers_set_updated_at before update on public.customers
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();
create trigger delivery_details_set_updated_at before update on public.delivery_details
for each row execute function public.set_updated_at();

commit;
