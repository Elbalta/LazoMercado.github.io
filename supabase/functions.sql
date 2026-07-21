-- Lazo Mercado 2.0 - funciones transaccionales administrativas.
-- Ejecutar después de schema.sql.
begin;

create or replace function public.confirm_payment_manually(
  p_payment_id uuid,
  p_confirmed_by uuid default null
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
  v_order public.orders%rowtype;
  v_lot public.lots%rowtype;
  v_updated_order public.orders%rowtype;
begin
  select * into v_payment
  from public.payments
  where id = p_payment_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Pago no encontrado';
  end if;

  if v_payment.status = 'CONFIRMADO' then
    raise exception using errcode = '23505', message = 'El pago ya fue confirmado';
  end if;

  if v_payment.status not in ('PENDIENTE', 'COMPROBANTE_ENVIADO', 'PENDIENTE_EFECTIVO') then
    raise exception using errcode = '23514', message = 'El pago no está en un estado confirmable';
  end if;

  select * into v_order
  from public.orders
  where id = v_payment.order_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Pedido no encontrado';
  end if;

  if v_payment.method <> v_order.payment_method then
    raise exception using errcode = '23514', message = 'La forma de pago no coincide con el pedido';
  end if;

  if v_payment.amount <> v_order.total_amount then
    raise exception using errcode = '23514', message = 'El monto del pago no coincide con el total del pedido';
  end if;

  if v_order.channel <> 'wholesale' or v_order.lot_id is null then
    raise exception using errcode = '23514', message = 'Esta función solo confirma pedidos mayoristas asociados a un lote';
  end if;

  select * into v_lot
  from public.lots
  where id = v_order.lot_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Lote no encontrado';
  end if;

  if v_lot.status <> 'open' then
    raise exception using errcode = '23514', message = 'El lote no está abierto';
  end if;

  if v_order.operational_status = 'CANCELADO' then
    raise exception using errcode = '23514', message = 'No se puede confirmar un pedido cancelado';
  end if;

  if v_order.equivalent_kg < v_lot.minimum_purchase_kg then
    raise exception using errcode = '23514', message = 'El pedido no alcanza la compra mínima del lote';
  end if;

  if v_order.equivalent_kg > v_lot.total_capacity_kg - v_lot.customer_paid_kg - v_lot.market_assumed_kg then
    raise exception using errcode = '23514', message = 'No hay kilos disponibles suficientes en el lote';
  end if;

  update public.payments
  set status = 'CONFIRMADO',
      confirmed_at = now(),
      confirmed_by = p_confirmed_by
  where id = v_payment.id;

  update public.orders
  set payment_status = 'CONFIRMADO',
      operational_status = 'ESPERANDO_COMPRA_GRUPAL'
  where id = v_order.id
  returning * into v_updated_order;

  update public.lots
  set customer_paid_kg = customer_paid_kg + v_order.equivalent_kg,
      status = case
        when customer_paid_kg + market_assumed_kg + v_order.equivalent_kg = total_capacity_kg then 'full'::public.lot_status
        else status
      end
  where id = v_lot.id;

  return v_updated_order;
end;
$$;

create or replace function public.assume_lot_remainder(
  p_lot_id uuid,
  p_kilograms numeric
)
returns public.lots
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lot public.lots%rowtype;
  v_updated_lot public.lots%rowtype;
begin
  if p_kilograms is null or p_kilograms <= 0 then
    raise exception using errcode = '22023', message = 'Los kilos a asumir deben ser mayores que cero';
  end if;

  select * into v_lot
  from public.lots
  where id = p_lot_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Lote no encontrado';
  end if;

  if v_lot.status <> 'open' then
    raise exception using errcode = '23514', message = 'El lote no está abierto';
  end if;

  if p_kilograms > v_lot.total_capacity_kg - v_lot.customer_paid_kg - v_lot.market_assumed_kg then
    raise exception using errcode = '23514', message = 'Los kilos exceden el remanente disponible';
  end if;

  if v_lot.market_assumed_kg + p_kilograms
      > v_lot.total_capacity_kg * v_lot.market_assumption_max_percent / 100 then
    raise exception using errcode = '23514', message = 'La operación supera el porcentaje máximo asumible por Lazo Mercado';
  end if;

  update public.lots
  set market_assumed_kg = market_assumed_kg + p_kilograms,
      status = case
        when customer_paid_kg + market_assumed_kg + p_kilograms = total_capacity_kg then 'full'::public.lot_status
        else status
      end
  where id = v_lot.id
  returning * into v_updated_lot;

  return v_updated_lot;
end;
$$;

commit;

