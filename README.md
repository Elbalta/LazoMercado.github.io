# Lazo Mercado 2.0

Aplicación web en HTML, CSS y JavaScript puro. La **Etapa 1 de migración** mantiene la interfaz y el almacenamiento local existentes, y agrega el modelo inicial de PostgreSQL para Supabase. Todavía no conecta pedidos, pagos, clientes, WhatsApp, autenticación ni administración desde el navegador.

## Configuración del cliente Supabase

1. Copia `config.example.js` como `config.js` si necesitas preparar otro entorno.
2. Completa únicamente una clave **publicable** de Supabase. Nunca expongas `service_role`, secretos ni contraseñas de PostgreSQL en el frontend.
3. Sirve el proyecto con un servidor HTTP estático.

## Instalar la Etapa 1 en Supabase

Desde **Supabase Dashboard → SQL Editor**, ejecuta los archivos completos en este orden:

1. [`supabase/schema.sql`](supabase/schema.sql): extensiones, tipos, siete tablas, relaciones, restricciones, índices y actualización automática de `updated_at`.
2. [`supabase/functions.sql`](supabase/functions.sql): funciones transaccionales para confirmar pagos mayoristas y asumir manualmente el remanente permitido de un lote.
3. [`supabase/security.sql`](supabase/security.sql): RLS, lectura pública limitada y permisos de ejecución administrativos.
4. [`supabase/seed.sql`](supabase/seed.sql) **opcional**: un producto y un lote publicados para comprobar lecturas.

Los scripts están pensados para un proyecto nuevo y se ejecutan dentro de transacciones. Si una sentencia falla, revisa el error antes de volver a ejecutar; no ejecutes `schema.sql` dos veces sobre el mismo esquema sin antes preparar una migración de actualización.

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
