# Lazo Mercado 2.0

Aplicación web en HTML, CSS y JavaScript puro conectada a PostgreSQL mediante Supabase. La Etapa 2 elimina `localStorage` y registra en la base de datos los clientes, pedidos, pagos, entregas, productos, lotes y estados operacionales.

## Configuración del cliente Supabase

1. Copia `config.example.js` como `config.js` si necesitas preparar otro entorno.
2. Completa únicamente una clave **publicable** de Supabase. Nunca expongas `service_role`, secretos ni contraseñas de PostgreSQL en el frontend.
3. Sirve el proyecto con un servidor HTTP estático.

## Instalar en Supabase

Desde **Supabase Dashboard → SQL Editor**, ejecuta los archivos completos en este orden:

1. [`supabase/schema.sql`](supabase/schema.sql): extensiones, tipos, siete tablas, relaciones, restricciones, índices y actualización automática de `updated_at`.
2. [`supabase/functions.sql`](supabase/functions.sql): funciones transaccionales para confirmar pagos mayoristas y asumir manualmente el remanente permitido de un lote.
3. [`supabase/security.sql`](supabase/security.sql): RLS, lectura pública limitada y permisos de ejecución administrativos.
4. [`supabase/seed.sql`](supabase/seed.sql) **opcional**: un producto y un lote publicados para comprobar lecturas.
5. [`supabase/stage2-orders-api.sql`](supabase/stage2-orders-api.sql): stock al detalle, usuarios administradores, registro transaccional de pedidos, seguimiento por teléfono, confirmación de pagos y políticas administrativas.

`stage2-orders-api.sql` puede aplicarse sobre una Etapa 1 existente. No vuelvas a ejecutar `schema.sql` si las tablas ya existen.

## Administrador

1. Crea el usuario en **Authentication → Users**.
2. Ejecuta la inserción comentada al final de `stage2-orders-api.sql`, usando el email real del administrador.
3. El panel usa `signInWithPassword`; ninguna contraseña queda escrita en el repositorio.

## Flujo de pedidos

- `place_customer_order` valida el producto, lote, cantidad, stock, pago y entrega dentro de una transacción.
- Registra o actualiza al cliente, crea el pedido, crea el pago y guarda el detalle de entrega.
- En ventas al detalle reserva stock inmediatamente.
- En mayorista el cupo se consolida al confirmar el pago, usando la función transaccional original.
- `orders_by_phone` permite al cliente consultar el estado de su solicitud.
- Las acciones administrativas requieren una sesión incluida en `admin_users` y están protegidas con RLS.

## Seguridad inicial

- Los roles `anon` y `authenticated` solo pueden leer productos y lotes cuyo campo `is_published` sea `true`.
- Clientes, pedidos, pagos, detalles de entrega y notificaciones de temporada tienen RLS activo y no poseen políticas públicas.
- `confirm_payment_manually` y `assume_lot_remainder` no se conceden al navegador; solo `service_role` puede ejecutarlas. Durante esta etapa deben invocarse desde SQL Editor o, en el futuro, desde un backend seguro.
- Tanto transferencias como efectivo quedan pendientes hasta la confirmación manual. Solo `confirm_payment_manually` incrementa `customer_paid_kg`, por lo que únicamente un pago confirmado asegura cupo en el lote.

## Comprobaciones manuales recomendadas

Después de instalar los SQL:

```sql
select id, name, sale_unit, season_status
from public.products
where is_published = true;

select id, total_capacity_kg, customer_paid_kg, market_assumed_kg, status
from public.lots
where is_published = true;
```

Antes de usar las funciones administrativas, crea un cliente, un pedido mayorista y su pago pendiente desde SQL Editor. Luego ejecuta:

```sql
select public.confirm_payment_manually('<payment-uuid>'::uuid, null);
select public.assume_lot_remainder('<lot-uuid>'::uuid, 10);
```

Comprueba que una confirmación concurrente o sin capacidad suficiente falle, que el pedido pase a `ESPERANDO_COMPRA_GRUPAL` y que `market_assumed_kg` nunca supere el porcentaje configurado (20% como máximo inicial).
