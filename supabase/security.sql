-- Lazo Mercado 2.0 - RLS y permisos iniciales de mínimo privilegio.
-- Ejecutar después de schema.sql y functions.sql.
begin;

alter table public.products enable row level security;
alter table public.lots enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.delivery_details enable row level security;
alter table public.season_notifications enable row level security;

revoke all on table public.products from anon, authenticated;
revoke all on table public.lots from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant select on table public.lots to anon, authenticated;

create policy "public_can_read_published_products"
on public.products
for select
to anon, authenticated
using (is_published = true);

create policy "public_can_read_published_lots"
on public.lots
for select
to anon, authenticated
using (is_published = true);

-- No se crean políticas públicas para clientes, pedidos, pagos, direcciones
-- ni notificaciones. Con RLS activo, anon/authenticated no pueden accederlos.
revoke all on table public.customers from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.payments from anon, authenticated;
revoke all on table public.delivery_details from anon, authenticated;
revoke all on table public.season_notifications from anon, authenticated;

revoke all on function public.confirm_payment_manually(uuid, uuid) from public, anon, authenticated;
revoke all on function public.assume_lot_remainder(uuid, numeric) from public, anon, authenticated;
grant execute on function public.confirm_payment_manually(uuid, uuid) to service_role;
grant execute on function public.assume_lot_remainder(uuid, numeric) to service_role;

commit;

