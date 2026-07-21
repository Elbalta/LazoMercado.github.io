# Lazo Mercado 2.0

Aplicación web en HTML, CSS y JavaScript puro conectada a PostgreSQL mediante Supabase. La Etapa 2 elimina `localStorage` y registra en la base de datos los clientes, pedidos, pagos, entregas, productos, lotes y estados operacionales.

## Configuración del cliente Supabase

1. Copia `config.example.js` como `config.js` si necesitas preparar otro entorno.
2. Completa únicamente una clave **publicable** de Supabase. Nunca expongas `service_role`, secretos ni contraseñas de PostgreSQL en el frontend.
3. Sirve el proyecto con un servidor HTTP estático.

## Instalar en Supabase

Desde **Supabase Dashboard → SQL Editor**, ejecuta los archivos completos en este orden:

1. [`supabase/schema.sql`](supabase/schema.sql): extensiones, tipos, siete tablas, relaciones, restricciones, índices y actualización automática de `updated_at`. Si detecta la tabla simplificada de ocho columnas, la conserva como…21023 tokens truncated…ex customers_phone_idx on public.customers (phone);
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
