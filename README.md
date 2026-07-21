# Lazo Mercado 2.0

AplicaciÃ³n web en HTML, CSS y JavaScript puro conectada a PostgreSQL mediante Supabase. La Etapa 2 elimina `localStorage` y registra en la base de datos los clientes, pedidos, pagos, entregas, productos, lotes y estados operacionales.

## ConfiguraciÃ³n del cliente Supabase

1. Copia `config.example.js` como `config.js` si necesitas preparar otro entorno.
2. Completa Ãºnicamente una clave **publicable** de Supabase. Nunca expongas `service_role`, secretos ni contraseÃ±as de PostgreSQL en el frontend.
3. Sirve el proyecto con un servidor HTTP estÃ¡tico.

## Instalar en Supabase

Desde **Supabase Dashboard â†’ SQL Editor**, ejecuta los archivos completos en este orden:

1. [`supabase/schema.sql`](supabase/schema.sql): extensiones, tipos, siete tablas, relaciones, restricciones, Ã­ndices y actualizaciÃ³n automÃ¡tica de `updated_at`. Si detecta la tabla simplificada de ocho columnas, la conserva como `products_legacy` y migra sus productos al modelo nuevo.
2. [`supabase/functions.sql`](supabase/functions.sql): funciones transaccionales para confirmar pagos mayoristas y asumir manualmente el remanente permitido de un lote.
3. [`supabase/security.sql`](supabase/security.sql): RLS, lectura pÃºblica limitada y permisos de ejecuciÃ³n administrativos.
4. [`supabase/seed.sql`](supabase/seed.sql) **opcional**: un producto y un lote publicados para comprobar lecturas.
5. [`supabase/stage2-orders-api.sql`](supabase/stage2-orders-api.sql): stock al detalle, usuarios administradores, registro transaccional de pedidos, seguimiento por telÃ©fono, confirmaciÃ³n de pagos, bucket `product-images` y polÃ­ticas administrativas.
6. [`supabase/stage3-admin-operations.sql`](supabase/stage3-admin-operations.sql): separaciÃ³n de canales, archivado seguro, historial de estados, correcciÃ³n de errores administrativos, cancelaciones con motivo y creaciÃ³n transaccional de productos mayoristas.
7. [`supabase/stage4-procurement-and-admin-ux.sql`](supabase/stage4-procurement-and-admin-ux.sql): costo privado del proveedor por lote y presupuesto de abastecimiento visible solo para administradores.

`stage2-orders-api.sql` puede aplicarse sobre una Etapa 1 existente. No vuelvas a ejecutar `schema.sql` si las tablas ya existen.

Si ya instalaste la Etapa 3, ejecuta solamente `stage4-procurement-and-admin-ux.sql`. La migraciÃ³n conserva productos y pedidos existentes. El costo del proveedor se guarda en una tabla privada separada para que no quede expuesto en el catÃ¡logo pÃºblico.

## Administrador

1. Crea el usuario en **Authentication â†’ Users**.
2. Ejecuta la inserciÃ³n comentada al final de `stage2-orders-api.sql`, usando el email real del administrador.
3. El panel usa `signInWithPassword`; ninguna contraseÃ±a queda escrita en el repositorio.

## Productos e imÃ¡genes

- En **Panel administrador â†’ Crear productos** se puede elegir una imagen JPG, PNG o WebP de hasta 5 MB.
- La imagen se muestra antes de guardar y se sube al bucket pÃºblico `product-images` de Supabase Storage.
- Solo un usuario registrado en `admin_users` puede crear, reemplazar o eliminar archivos del bucket.
- Al editar sin seleccionar otro archivo se conserva la imagen actual.
- Cada producto al detalle administra nombre, precio, stock e imagen. Cada compra mayorista administra ademÃ¡s variedad, capacidad, compra mÃ­nima, estado y descripciÃ³n.
- Cada lote mayorista puede guardar su costo de proveedor por kilo; el panel calcula el dinero estimado para abastecerlo cuando se completa.
- Los productos se archivan en lugar de eliminarse cuando deben conservar historial. Archivar los oculta de la tienda sin borrar pedidos.
- Un producto mayorista ya no aparece automÃ¡ticamente como producto al detalle con stock cero.
- Los productos heredados se migran con stock inicial cero para evitar ventas sobre una cantidad inventada; define el stock real desde el panel antes de publicarlos para compra.

## Flujo de pedidos

- `place_customer_order` valida el producto, lote, cantidad, stock, pago y entrega dentro de una transacciÃ³n.
- Registra o actualiza al cliente, crea el pedido, crea el pago y guarda el detalle de entrega.
- En ventas al detalle reserva stock inmediatamente.
- En mayorista el cupo se consolida al confirmar el pago, usando la funciÃ³n transaccional original.
- `orders_by_phone` permite al cliente consultar el estado de su solicitud.
- Las acciones administrativas requieren una sesiÃ³n incluida en `admin_users` y estÃ¡n protegidas con RLS.
- La pestaÃ±a **PreparaciÃ³n** agrupa kilos confirmados, pendientes y listos para comprar al proveedor.
- **PreparaciÃ³n** tambiÃ©n muestra el presupuesto del proveedor y una lista consolidada de destinos con despacho confirmado.
- Confirmar, avanzar y cancelar requieren confirmaciÃ³n. Las correcciones quedan registradas en `order_status_history`.
- Corregir, revertir pago y cancelar usan un formulario interno con motivo, compatible con navegadores mÃ³viles e integrados.
- Los pedidos completados y cancelados se separan de las pestaÃ±as activas y quedan reunidos en **Terminadas**.
- Los pedidos para retiro saltan de **Listo para entrega** a **Entregado**; los despachos pasan primero por **En trÃ¡nsito**.
- Una cancelaciÃ³n pagada queda como reembolso solicitado, en vez de confundirse con un pedido nunca pagado.

## Seguridad inicial

- Los roles `anon` y `authenticated` solo pueden leer productos y lotes cuyo campo `is_published` sea `true`.
- Clientes, pedidos, pagos, detalles de entrega y notificaciones de temporada tienen RLS activo y no poseen polÃ­ticas pÃºblicas.
- `confirm_payment_manually` y `assume_lot_remainder` no se conceden al navegador; solo `service_role` puede ejecutarlas. Durante esta etapa deben invocarse desde SQL Editor o, en el futuro, desde un backend seguro.
- Tanto transferencias como efectivo quedan pendientes hasta la confirmaciÃ³n manual. Solo `confirm_payment_manually` incrementa `customer_paid_kg`, por lo que Ãºnicamente un pago confirmado asegura cupo en el lote.

## Comprobaciones manuales recomendadas

DespuÃ©s de instalar los SQL:

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

Comprueba que una confirmaciÃ³n concurrente o sin capacidad suficiente falle, que el pedido pase a `ESPERANDO_COMPRA_GRUPAL` y que `market_assumed_kg` nunca supere el porcentaje configurado (20% como mÃ¡ximo inicial).

