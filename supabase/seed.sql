-- Datos mínimos de demostración. Ejecutar opcionalmente después de security.sql.
begin;

insert into public.products (
  id, name, variety, description, image_url, sale_unit, equivalent_weight_kg,
  wholesale_price, detail_price, minimum_quantity, season_status, is_published
) values (
  '10000000-0000-4000-8000-000000000001',
  'Palta',
  'Hass',
  'Palta Hass de temporada',
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1200&q=80',
  'kilo', 1, 2500, 3200, 1, 'available', true
)
on conflict (id) do update set
  name = excluded.name,
  variety = excluded.variety,
  description = excluded.description,
  image_url = excluded.image_url,
  wholesale_price = excluded.wholesale_price,
  detail_price = excluded.detail_price,
  season_status = excluded.season_status,
  is_published = excluded.is_published;

insert into public.lots (
  id, product_id, total_capacity_kg, minimum_purchase_kg, wholesale_price,
  opens_at, initial_deadline, market_assumption_max_percent, status, is_published
) values (
  '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  500, 50, 2500, now(), now() + interval '7 days', 20, 'open', true
)
on conflict (id) do update set
  total_capacity_kg = excluded.total_capacity_kg,
  minimum_purchase_kg = excluded.minimum_purchase_kg,
  wholesale_price = excluded.wholesale_price,
  opens_at = excluded.opens_at,
  initial_deadline = excluded.initial_deadline,
  market_assumption_max_percent = excluded.market_assumption_max_percent,
  status = excluded.status,
  is_published = excluded.is_published;

commit;
