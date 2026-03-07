# COPIAR Y PEGAR — RECUPERACIÓN

Este archivo contiene el contenido completo y actualizado de `index.html`, `style.css` y `script.js`.
Copia y pega cada bloque en su archivo correspondiente.

## index.html

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lazo Mercado | Compra detalle y mayorista</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="header">
    <div>
      <p class="eyebrow">Compra simple, rápida y clara</p>
      <h1><a id="open-admin-link" class="admin-secret-link" href="#" title="Administrador">Lazo Mercado · Compra Fácil</a></h1>
    </div>
  </header>

  <main class="layout">
    <section id="entry-gate" class="panel gate-panel">
      <div class="gate-hero">
        <p class="gate-kicker">Elige cómo quieres comprar</p>
        <h2><strong>Elige cómo</strong> quieres comprar</h2>
        <p class="hint">Tenemos 2 caminos para ti: <strong>Compra al detalle</strong> o <strong>Compra mayorista</strong>. Elige según la cantidad que necesitas y el tipo de compra que prefieres.</p>
      </div>

      <div class="gate-options">
        <article class="gate-card gate-detail">
          <div class="gate-image" style="background-image:url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80')"></div>
          <div class="gate-content">
            <h3>Compra al detalle</h3>
            <p>Compra <strong>directa por kilo</strong>. Ideal si necesitas poca cantidad y despacho rápido.</p>
            <ul>
              <li>✔ Compra directa por kilo</li>
              <li>✔ Desde 1 kg</li>
              <li>✔ Entrega según disponibilidad</li>
            </ul>
            <button id="choose-detail" class="btn">Entrar a detalle</button>
          </div>
        </article>

        <div class="gate-vs">VS</div>

        <article class="gate-card gate-crowd featured">
          <div class="gate-image" style="background-image:url('https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80')"></div>
          <div class="gate-content">
            <h3>Compra mayorista</h3>
            <p>Únete a otros <strong>compradores</strong> para completar una compra grande y <strong>obtener un mejor precio por kilo</strong>. Cada persona reserva la cantidad que necesita y el sistema va <strong>sumando los pedidos</strong> del grupo.</p>
            <ul>
              <li>✔ Compra desde 50 kg</li>
              <li>✔ Precio más bajo por volumen</li>
              <li>✔ Avance del grupo en tiempo real</li>
            </ul>
            <button id="choose-crowd" class="btn">Entrar a mayorista</button>
          </div>
        </article>
      </div>
    </section>

    <section id="mode-tabs" class="panel mode-tabs hidden">
      <button class="mode-tab" data-mode="detail">Detalle</button>
      <button class="mode-tab" data-mode="crowd">Mayorista</button>
      <button class="mode-tab" data-mode="tracking">Seguimiento</button>
    </section>

    <section id="detail-view" class="panel hidden">
      <div class="panel-header centered">
        <h2>Compra al detalle</h2>
        <p>Elige cuántos kilos necesitas y confirma tu pedido.</p>
      </div>
      <div id="detail-products" class="bins-grid"></div>
    </section>

    <section id="crowd-view" class="hidden crowd-layout">
      <section class="panel client-panel">
        <div class="panel-header centered">
          <h2>Canal Mayorista</h2>
          <p>Funciona como compra en grupo: cuando el lote llega al 100% de avance, se cierra la venta y se liberan los pedidos para despacho.</p>
        </div>
        <div id="bins-list" class="bins-grid"></div>
      </section>

      <aside id="summary-panel" class="panel summary-panel hidden">
        <h2>Resumen de tu pedido</h2>
        <div class="summary-item"><span>Producto</span><strong id="summary-product">—</strong></div>
        <div class="summary-item"><span>Kilos</span><strong id="summary-kg">0 kg</strong></div>
        <div class="summary-item"><span>Precio unitario</span><strong id="summary-unit">$0</strong></div>
        <div class="summary-item total"><span>Total</span><strong id="summary-total">$0</strong></div>
        <p class="hint">Este panel aparece solo cuando seleccionas un producto.</p>
      </aside>
    </section>

    <section id="tracking-view" class="panel hidden">
      <div class="panel-header centered">
        <h2>Seguimiento de pedidos</h2>
        <p>Revisa el estado de tus pedidos usando tu número de teléfono.</p>
      </div>
      <form id="tracking-form" class="tracking-form">
        <label>Teléfono
          <input id="tracking-phone" placeholder="Ej. +5699988777" required />
        </label>
        <div class="tracking-actions">
          <button class="btn" type="submit">Buscar pedidos</button>
          <button id="tracking-clear" class="btn secondary" type="button">Limpiar</button>
        </div>
      </form>
      <div id="tracking-results" class="admin-bins"></div>
    </section>
  </main>

  <dialog id="order-modal" class="modal">
    <form id="order-form" class="modal-content" method="dialog">
      <div class="modal-head">
        <h3>Confirmar pedido mayorista</h3>
        <button type="button" id="close-order" class="icon-btn">✕</button>
      </div>
      <input type="hidden" id="order-bin-id" />
      <label>Nombre<input id="customer-name" required /></label>
      <label>Email<input id="customer-email" type="email" required /></label>
      <label>Teléfono<input id="customer-phone" required /></label>
      <label id="order-kg-label"><span id="order-kg-label-text">Kilos a comprar</span><input id="order-kg" type="number" min="1" step="1" required /></label>
      <p id="order-stock-help" class="hint"></p>
      <p id="order-total" class="total-preview">Total: $0</p>
      <div class="modal-actions">
        <button type="button" id="cancel-order-action" class="btn secondary">Cancelar</button>
        <button type="submit" class="btn">Aceptar compra</button>
      </div>
    </form>
  </dialog>

  <dialog id="detail-order-modal" class="modal">
    <form id="detail-order-form" class="modal-content" method="dialog">
      <div class="modal-head">
        <h3>Confirmar pedido detalle</h3>
        <button type="button" id="close-detail-order" class="icon-btn">✕</button>
      </div>
      <input type="hidden" id="detail-product-id" />
      <label>Nombre<input id="detail-customer-name" required /></label>
      <label>Email<input id="detail-customer-email" type="email" required /></label>
      <label>Teléfono<input id="detail-customer-phone" required /></label>
      <label>Kilos a comprar<input id="detail-order-kg" type="number" min="1" step="1" required /></label>
      <p id="detail-stock-help" class="hint"></p>
      <p id="detail-order-total" class="total-preview">Total: $0</p>
      <div class="modal-actions">
        <button type="button" id="cancel-detail-order-action" class="btn secondary">Cancelar</button>
        <button type="submit" class="btn">Aceptar compra</button>
      </div>
    </form>
  </dialog>

  <div id="purchase-alert" class="purchase-alert hidden">
    <div class="purchase-alert-card">
      <h3>✅ Compra registrada</h3>
      <p id="purchase-alert-text">Tu pedido fue ingresado correctamente.</p>
      <button id="purchase-alert-close" class="btn">Entendido</button>
    </div>
  </div>

  <dialog id="admin-modal" class="modal admin-modal">
    <div class="modal-content admin-shell">
      <div class="modal-head">
        <h3>Panel administrador</h3>
        <button type="button" id="close-admin" class="icon-btn">✕</button>
      </div>

      <section id="admin-login-section">
        <form id="admin-login-form" class="stack">
          <label>Email<input id="admin-email" type="email" required /></label>
          <label>Contraseña<input id="admin-password" type="password" required /></label>
          <button class="btn" type="submit">Ingresar</button>
        </form>
      </section>

      <section id="admin-panel-section" class="hidden">
        <div class="admin-toolbar">
          <h4>Gestión de ventas (mayorista y detalle)</h4>
          <button id="admin-logout" class="btn secondary">Cerrar sesión</button>
        </div>

        <div class="admin-main-tabs">
          <button class="main-tab active" data-view="resumen">Resumen general</button>
          <button class="main-tab" data-view="crear">Crear productos</button>
          <button class="main-tab" data-view="seguimiento-mayorista">Seguimiento mayorista</button>
          <button class="main-tab" data-view="seguimiento-detalle">Seguimiento detalle</button>
          <button class="main-tab" data-view="terminadas">Ventas terminadas</button>
          <button class="main-tab" data-view="financiero">Resumen financiero</button>
        </div>

        <section id="admin-view-resumen" class="admin-view">
          <div class="kpi-grid" id="kpi-grid"></div>
          <div class="charts-grid">
            <article class="chart-card">
              <h5>Progreso de venta global (kg)</h5>
              <div id="kg-chart" class="progress-chart"></div>
              <div id="kg-legend" class="chart-legend"></div>
            </article>
            <article class="chart-card">
              <h5>Montos por estado de pedido</h5>
              <div id="amount-chart" class="bars-chart"></div>
            </article>
          </div>
        </section>

        <section id="admin-view-crear" class="admin-view hidden">
          <form id="bin-form" class="admin-form">
            <input type="hidden" id="bin-id" />
            <label>Producto<input id="bin-product" required /></label>
            <label>Variedad / calibre<input id="bin-variety" placeholder="Ej: Hass, calibre 22" /></label>
            <label>Precio por kilo<input id="bin-price" type="number" min="1" required /></label>
            <label>Capacidad (kg)<input id="bin-capacity" type="number" min="1" value="500" required /></label>
            <label>Mínimo por pedido (kg)<input id="bin-min-kg" type="number" min="1" value="50" required /></label>
            <label>Imagen URL<input id="bin-image" type="url" required /></label>
            <label>Estado
              <select id="bin-status">
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
              </select>
            </label>
            <label class="span-all">Resumen del lote
              <textarea id="bin-notes" rows="2" placeholder="Ej: Fruta homogénea, llegada semanal, venta mayorista completa."></textarea>
            </label>
            <button class="btn" type="submit">Guardar mayorista</button>
            <button id="clear-bin-form" class="btn secondary" type="button">Limpiar</button>
          </form>

          <div class="admin-divider" role="separator" aria-label="Separador entre formularios">
            <span>Productos al detalle</span>
          </div>

          <form id="detail-product-form" class="admin-form">
            <input type="hidden" id="detail-admin-id" />
            <label>Producto detalle<input id="detail-admin-name" required /></label>
            <label>Precio por kilo<input id="detail-admin-price" type="number" min="1" required /></label>
            <label>Stock (kg)<input id="detail-admin-stock" type="number" min="0" required /></label>
            <label>Imagen URL<input id="detail-admin-image" type="url" required /></label>
            <button class="btn" type="submit">Guardar producto detalle</button>
            <button id="clear-detail-form" class="btn secondary" type="button">Limpiar</button>
          </form>

          <div id="admin-detail-products" class="admin-bins"></div>
        </section>

        <section id="admin-view-seguimiento-mayorista" class="admin-view hidden">
          <div id="admin-bins-open" class="admin-bins"></div>
          <div id="admin-bins-sold" class="admin-bins"></div>
        </section>

        <section id="admin-view-seguimiento-detalle" class="admin-view hidden">
          <div id="admin-detail-orders" class="admin-bins"></div>
        </section>

        <section id="admin-view-terminadas" class="admin-view hidden">
          <div id="completed-summary" class="kpi-grid"></div>
          <div class="charts-grid">
            <article class="chart-card">
              <h5>Ventas completadas por canal</h5>
              <div id="completed-channel-chart" class="bars-chart"></div>
            </article>
            <article class="chart-card">
              <h5>Top productos vendidos</h5>
              <div id="completed-product-chart" class="bars-chart"></div>
            </article>
          </div>
          <div id="completed-sales-list" class="admin-bins"></div>
        </section>

        <section id="admin-view-financiero" class="admin-view hidden">
          <div id="financial-kpis" class="kpi-grid"></div>
          <div class="charts-grid">
            <article class="chart-card">
              <h5>Ingresos por canal</h5>
              <div id="financial-channel-chart" class="bars-chart"></div>
            </article>
            <article class="chart-card">
              <h5>Ingresos por estado</h5>
              <div id="financial-status-chart" class="bars-chart"></div>
            </article>
          </div>
          <div id="financial-list" class="admin-bins"></div>
        </section>
      </section>
    </div>
  </dialog>

  <p id="toast" class="toast"></p>
  <script src="script.js"></script>
</body>
</html>

```

## style.css

```css
:root {
  --bg: #dbeafe;
  --card: #fffdf8;
  --text: #1f2937;
  --muted: #6b7280;
  --brand: #7c3aed;
  --brand-strong: #5b21b6;
  --ok: #16a34a;
  --danger: #dc2626;
  --warn: #d97706;
  --border: #dbe3ef;
  --header-height: 86px;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: var(--text);
  background: var(--bg);
}
body.wholesale-mode {
  background: linear-gradient(160deg, #e2e8f0, #cbd5e1 55%, #94a3b8);
}

.header {
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.admin-secret-link {
  color: inherit;
  text-decoration: none;
}
.admin-secret-link:hover,
.admin-secret-link:focus-visible {
  text-decoration: underline;
  text-decoration-color: rgba(15, 23, 42, 0.32);
}

h1, h2, h3, h4, h5, p { margin: 0; }
h1 { font-size: 1.5rem; }
.eyebrow { color: var(--muted); font-weight: 600; margin-bottom: 0.2rem; }
.layout { width: min(1180px, 94vw); margin: 1.5rem auto; display: grid; gap: 1rem; }
.panel { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; }
.client-panel { max-width: 1040px; margin: 0 auto; width: 100%; }
.centered { text-align: center; }
.panel-header p { color: var(--muted); margin-top: 0.25rem; }

.gate-panel {
  background: radial-gradient(circle at 8% 6%, #ffedd5 0%, transparent 36%),
              radial-gradient(circle at 92% 8%, #e9d5ff 0%, transparent 34%),
              linear-gradient(160deg, #fffdf8, #fff7ed 55%, #fef3c7);
  border: 1px solid #fcd9bd;
}
.gate-hero {
  text-align: center;
  max-width: 920px;
  margin: 0 auto;
}
.gate-kicker {
  display: inline-block;
  margin-bottom: .35rem;
  color: #7c3aed;
  font-weight: 800;
  font-size: .82rem;
  letter-spacing: .09em;
  text-transform: uppercase;
}
.gate-hero h2 { margin-bottom: 0.35rem; font-size: 2.35rem; color: #111827; }
.gate-hero .hint { font-size: 1.08rem; color: #374151; line-height: 1.45; }
.gate-options {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: .9rem;
  align-items: center;
}
.gate-card {
  border: 2px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
  position: relative;
}
.gate-detail { border-color: #f59e0b; }
.gate-crowd { border-color: #8b5cf6; }
.gate-image {
  height: 170px;
  background-size: cover;
  background-position: center;
}
.gate-content {
  padding: .9rem;
  display: grid;
  gap: .5rem;
}
.gate-content ul li { margin-bottom: 0.2rem; }
.gate-content h3 { font-size: 1.9rem; }
.gate-content p { font-size: 1.03rem; color: #334155; }
.gate-content ul {
  margin: 0;
  padding-left: 1rem;
  color: #334155;
  font-size: .95rem;
}
.gate-vs {
  width: 74px;
  height: 74px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 1.05rem;
  color: #6d28d9;
  background: linear-gradient(145deg, #f3e8ff, #ddd6fe);
  border: 3px solid #a78bfa;
  box-shadow: 0 10px 24px rgba(124, 58, 237, 0.28);
}
.gate-card.featured {
  border-color: #60a5fa;
  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.2);
}
.gate-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 5px;
  background: linear-gradient(90deg, rgba(124,58,237,.18), rgba(37,99,235,.28));
}
#choose-detail,
#choose-crowd {
  margin-top: .25rem;
  width: 100%;
  min-height: 54px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
}
#choose-detail {
  background: linear-gradient(120deg, #f59e0b, #d97706);
}
#choose-crowd {
  background: linear-gradient(120deg, #8b5cf6, #6d28d9);
}
.mode-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .5rem;
  align-items: center;
}
.mode-tab {
  border:1px solid var(--border);
  background:#eef2ff;
  border-radius:999px;
  padding:.5rem .75rem;
  cursor:pointer;
  font-weight:700;
  text-align:center;
  min-height:44px;
}
.mode-tab.active {
  background:#dbeafe;
  border-color:#93c5fd;
}

.crowd-layout { display: grid; grid-template-columns: 1fr; }
.bins-grid { margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.8rem; }
.bin-card { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: transform .15s ease, box-shadow .15s ease; }
.bin-card:hover { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(15, 23, 42, 0.08); }
.bin-image { width: 100%; height: 160px; object-fit: cover; }
.bin-body { padding: 0.8rem; display: grid; gap: 0.42rem; }
.bin-meta { color: var(--muted); font-size: 0.9rem; }
.bin-notes { padding: 0.5rem; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #334155; font-size: 0.82rem; }
.bin-status { width: fit-content; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em; padding: 0.2rem 0.45rem; border-radius: 999px; background: #eff6ff; color: #1e3a8a; }
.bin-status.CLOSED { background: #fff7ed; color: #9a3412; }
.bin-status.SOLD_OUT { background: #ecfdf5; color: #047857; }
.order-status { font-size: 0.74rem; border-radius: 999px; padding: 0.15rem 0.45rem; font-weight: 700; }
.order-status.PENDIENTE_PAGO { background: #eff6ff; color: #1e40af; }
.order-status.PAGO_CONFIRMADO { background: #e0f2fe; color: #0c4a6e; }
.order-status.ESPERA_CIERRE_BIN { background: #fef9c3; color: #854d0e; }
.order-status.PENDIENTE_ENVIO { background: #dcfce7; color: #166534; }
.order-status.EN_TRANSITO { background: #e0f2fe; color: #075985; }
.order-status.ENTREGADO { background: #f0fdf4; color: #166534; }
.order-status.COMPLETADO { background: #ecfdf5; color: #047857; }
.order-status.CANCELADO { background: #fef2f2; color: #b91c1c; }

.progress-wrap { margin-top: 0.25rem; }
.progress-mem { height: 18px; border-radius: 999px; overflow: hidden; display: grid; grid-template-columns: var(--sold, 0%) auto; border: 1px solid #cbd5e1; background: #f1f5f9; }
.progress-sold { background: linear-gradient(90deg, #0ea5e9 0%, #34d399 42%, #16a34a 100%); }
.progress-available { background: repeating-linear-gradient(135deg, #e2e8f0, #e2e8f0 8px, #f8fafc 8px, #f8fafc 16px); }
.progress-text { margin-top: 0.35rem; display: grid; gap: 0.1rem; font-size: 0.83rem; color: #334155; }

.btn { border: 0; border-radius: 10px; padding: 0.6rem 0.8rem; background: linear-gradient(120deg, var(--brand), var(--brand-strong)); color: #fff; font-weight: 600; cursor: pointer; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn.secondary { background: #f8fafc; border: 1px solid var(--border); color: #0f172a; }
.btn.tiny { border-radius: 8px; padding: 0.35rem 0.5rem; font-size: 0.78rem; }
.btn.warn { background: linear-gradient(120deg, #f59e0b, #d97706); }

.summary-panel { position: fixed; right: 1rem; top: 86px; width: min(350px, 92vw); z-index: 11; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.15); }
.summary-item { display: flex; justify-content: space-between; padding: 0.45rem 0; border-bottom: 1px dashed var(--border); }
.summary-item.total { font-size: 1.1rem; border-bottom: 0; }
.hint { color: var(--muted); font-size: 0.9rem; margin-top: 0.8rem; }

.modal { border: 0; border-radius: 14px; width: min(560px, 92vw); padding: 0; }
.modal::backdrop { background: rgba(15, 23, 42, 0.45); }
.modal-content { padding: 1rem; display: grid; gap: 0.75rem; }
.modal-head { display: flex; justify-content: space-between; align-items: center; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
label { font-size: 0.9rem; font-weight: 600; color: #334155; display: grid; gap: 0.3rem; }
input, select, textarea { width: 100%; padding: 0.56rem; border-radius: 8px; border: 1px solid #cbd5e1; font: inherit; }
.icon-btn { border: 0; width: 2rem; height: 2rem; border-radius: 50%; cursor: pointer; }
.total-preview { font-weight: 700; color: var(--brand-strong); }

.purchase-alert { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; background: rgba(15, 23, 42, 0.42); }
.purchase-alert-card { width: min(560px, 94vw); background: #fff; border-radius: 16px; padding: 1.4rem; border: 1px solid var(--border); text-align: center; box-shadow: 0 24px 54px rgba(15, 23, 42, 0.3); }
.purchase-alert-card h3 { margin-bottom: 0.4rem; font-size: 1.6rem; }
.purchase-alert-card p { color: #334155; margin-bottom: 1rem; font-size: 1.05rem; }

.admin-modal { width: min(1200px, 96vw); }
.admin-shell { max-height: 86vh; overflow: auto; }
.hidden { display: none !important; }
.stack { display: grid; gap: 0.7rem; }
.admin-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.wholesale-focus { border: 1px solid #93c5fd; background: linear-gradient(120deg,#eff6ff,#dbeafe); color:#1e3a8a; padding:0.6rem 0.8rem; border-radius: 10px; margin-bottom: 0.8rem; }
.admin-main-tabs { display: flex; gap: 0.45rem; border-bottom: 1px solid var(--border); margin-bottom: 0.8rem; flex-wrap: wrap; overflow-x: auto; }
.main-tab { border: 1px solid transparent; border-radius: 10px 10px 0 0; padding: 0.45rem 0.7rem; background: #eef2ff; color: #334155; font-weight: 600; cursor: pointer; flex: 0 0 auto; }
.main-tab.active { background: #fff; border-color: var(--border); border-bottom: 1px solid #fff; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.6rem; }
.kpi-card { border: 1px solid var(--border); border-radius: 12px; padding: 0.65rem; background: #fff; }
.kpi-card p { font-size: 0.78rem; color: var(--muted); }
.kpi-card strong { font-size: 1.2rem; }
.charts-grid { margin-top: 0.75rem; display: grid; grid-template-columns: 1.4fr 1fr; gap: 0.6rem; }
.chart-card { border: 1px solid var(--border); border-radius: 12px; padding: 0.65rem; background: #fff; }
.chart-card h5 { margin-bottom: 0.4rem; }
.progress-chart { height: 16px; border-radius: 999px; overflow: hidden; display: grid; grid-template-columns: var(--part1, 0%) var(--part2, 0%) auto; border: 1px solid #cbd5e1; }
.progress-chart > div:nth-child(1) { background: #22c55e; }
.progress-chart > div:nth-child(2) { background: #60a5fa; }
.progress-chart > div:nth-child(3) { background: #e2e8f0; }
.chart-legend { margin-top: 0.4rem; color: #475569; font-size: 0.82rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
.bars-chart { display: grid; gap: 0.45rem; }
.bar-row { display: grid; grid-template-columns: 130px 1fr auto; gap: 0.45rem; align-items: center; font-size: 0.82rem; }
.bar-track { height: 9px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.bar-fill { height: 100%; border-radius: inherit; width: var(--w, 0%); background: linear-gradient(90deg, #38bdf8, #2563eb); }
.admin-form { margin-top: 0.75rem; border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.65rem; }
.admin-divider {
  margin: 1.05rem 0 0.45rem;
  border-top: 2px solid #94a3b8;
  position: relative;
  display: flex;
  justify-content: center;
}
.admin-divider span {
  position: relative;
  top: -0.78rem;
  padding: 0.2rem 0.75rem;
  border: 1px solid #94a3b8;
  border-radius: 999px;
  background: linear-gradient(120deg, #eff6ff, #dbeafe);
  color: #1e3a8a;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}
.span-all { grid-column: 1 / -1; }
.admin-bins { margin-top: 0.75rem; display: grid; gap: 0.6rem; }
.admin-bin { border: 1px solid var(--border); border-radius: 12px; padding: 0.65rem; }
.admin-row { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.bin-summary-grid { margin-top: 0.55rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.45rem; }
.summary-chip { padding: 0.4rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; font-size: 0.78rem; }
.summary-chip strong { display: block; font-size: 0.95rem; color: #0f172a; }
.order-list { margin-top: 0.55rem; font-size: 0.88rem; color: #1e293b; }
.order-item { display: grid; grid-template-columns: 1.2fr 1.2fr auto; gap: 0.45rem; align-items: center; padding: 0.35rem 0; border-bottom: 1px dashed #e2e8f0; }
.order-actions { display: flex; gap: 0.3rem; justify-content: flex-end; flex-wrap: wrap; }
.toast { position: fixed; left: 50%; transform: translateX(-50%); bottom: 1rem; padding: 0.7rem 0.9rem; border-radius: 10px; color: #fff; background: #0f172a; opacity: 0; transition: all .22s; z-index: 30; }
.toast.show { opacity: 1; }
.toast.error { background: var(--danger); }
.toast.success { background: var(--ok); }

.tracking-form {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
  align-items: end;
}
.tracking-actions {
  display: flex;
  gap: 0.45rem;
}
.tracking-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.7rem;
  background: #fff;
}
.tracking-head {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.channel-badge {
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
  background: #eef2ff;
  color: #3730a3;
}

@media (max-width: 980px) {
  .gate-options, .kpi-grid, .bin-summary-grid, .admin-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gate-vs { display:none; }
  .charts-grid { grid-template-columns: 1fr; }
  .order-item { grid-template-columns: 1fr; }
  .order-actions { justify-content: flex-start; }
  .summary-panel { left: 50%; right: auto; transform: translateX(-50%); top: 84px; }
  .admin-modal { width: min(1000px, 98vw); }
}
@media (max-width: 640px) {
  .header {
    padding: 0.85rem 0.9rem;
    align-items: flex-start;
  }
  h1 { font-size: 1.05rem; }
  .eyebrow { font-size: 0.78rem; }

  .layout { width: min(1180px, 96vw); margin: 0.8rem auto 1rem; }
  .panel { border-radius: 14px; padding: 0.8rem; }

  .gate-panel {
    padding: 0.9rem 0.75rem;
    border-radius: 18px;
  }
  .gate-hero { max-width: 100%; }
  .gate-kicker { font-size: .74rem; }
  .gate-hero .hint { font-size: 0.95rem; }

  .admin-main-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
    overflow: visible;
    border-bottom: 0;
  }
  .main-tab {
    white-space: normal;
    text-align: center;
    border-radius: 10px;
    border: 1px solid var(--border);
    min-height: 44px;
    padding: 0.48rem 0.55rem;
    font-size: 0.82rem;
    line-height: 1.15;
  }
  .main-tab.active { border-bottom: 1px solid var(--border); }

  .admin-modal {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  .admin-shell {
    max-height: calc(100vh - 56px);
    padding-top: 0.7rem;
    padding-bottom: 1rem;
  }
  .admin-toolbar {
    position: sticky;
    top: 0;
    z-index: 4;
    background: #fff;
    padding: 0.4rem 0 0.45rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.45rem;
    display: grid;
    gap: 0.42rem;
    align-items: stretch;
  }
  .admin-toolbar h4 { font-size: 0.9rem; line-height: 1.2; }
  #admin-logout { width: 100%; min-height: 42px; }
  .admin-main-tabs {
    position: sticky;
    top: 5.35rem;
    z-index: 3;
    background: #fff;
    padding-bottom: 0.35rem;
    margin-bottom: 0.45rem;
  }

  .gate-options, .kpi-grid, .bin-summary-grid, .admin-form { grid-template-columns: 1fr; }
  .gate-hero h2 { font-size: 1.95rem; }
  .gate-content h3 { font-size: 1.6rem; }
  .gate-image { height: 190px; }
  .gate-content { padding: 0.75rem; }
  #choose-detail,
  #choose-crowd,
  .bin-body .btn { min-height: 48px; }

  .mode-tabs {
    position: sticky;
    top: calc(var(--header-height) + 0.35rem);
    z-index: 4;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    border-radius: 14px;
    padding: 0.35rem;
  }
  .mode-tab {
    min-height: 44px;
    font-size: 0.92rem;
    padding: 0.45rem 0.35rem;
  }

  .bins-grid {
    gap: 0.65rem;
    grid-template-columns: 1fr;
  }
  .bin-card { border-radius: 16px; }
  .bin-image { height: 170px; }
  .bin-body { gap: 0.35rem; }

  .tracking-card { border-radius: 14px; }
  .tracking-head { gap: 0.5rem; }
  .channel-badge,
  .order-status { display: inline-block; margin-top: 0.2rem; }

  .kpi-card strong { font-size: 1.45rem; }
  .chart-card h5 { font-size: 1.05rem; }
  .chart-legend { gap: 0.25rem; flex-direction: column; }
  .bar-row { grid-template-columns: 1fr; }
  .bar-row strong { margin-top: -0.15rem; }

  .modal-actions { flex-direction: column; }
  .tracking-form { grid-template-columns: 1fr; }
  .tracking-actions { flex-direction: column; }
}

@media (max-width: 420px) {
  .header { padding: 0.72rem 0.72rem; }
  h1 { font-size: 0.95rem; line-height: 1.15; }
  .gate-hero h2 { font-size: 1.75rem; }
  .gate-content h3 { font-size: 1.35rem; }
  .panel { padding: 0.7rem; }
  .modal-content { padding: 0.8rem; }
  .admin-toolbar h4 { font-size: 0.84rem; }
  .admin-main-tabs { grid-template-columns: 1fr; }
  .main-tab { font-size: 0.8rem; }
}

```

## script.js

```javascript
const STORAGE_KEY = 'crowdbuying-db-v5';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';
const MODE_KEY = 'crowdbuying-mode';

const ORDER_STATES = ['PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'ESPERA_CIERRE_BIN', 'PENDIENTE_ENVIO', 'EN_TRANSITO', 'ENTREGADO', 'COMPLETADO', 'CANCELADO'];
const NEXT_STATE_CROWD = {
  PENDIENTE_PAGO: 'PAGO_CONFIRMADO',
  PAGO_CONFIRMADO: 'ESPERA_CIERRE_BIN',
  ESPERA_CIERRE_BIN: 'PENDIENTE_ENVIO',
  PENDIENTE_ENVIO: 'EN_TRANSITO',
  EN_TRANSITO: 'ENTREGADO',
  ENTREGADO: 'COMPLETADO',
  COMPLETADO: null,
  CANCELADO: 'PENDIENTE_PAGO'
};

const NEXT_STATE_DETAIL = {
  PENDIENTE_PAGO: 'PAGO_CONFIRMADO',
  PAGO_CONFIRMADO: 'EN_TRANSITO',
  ESPERA_CIERRE_BIN: 'EN_TRANSITO',
  EN_TRANSITO: 'ENTREGADO',
  ENTREGADO: 'COMPLETADO',
  COMPLETADO: null,
  CANCELADO: 'PENDIENTE_PAGO'
};

const DEFAULT_CROWD_MIN_KG = 50;

const ORDER_LABELS = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_CONFIRMADO: 'Pago confirmado',
  ESPERA_CIERRE_BIN: 'Pago confirmado · esperando cierre mayorista',
  PENDIENTE_ENVIO: 'Pendiente de envío',
  EN_TRANSITO: 'En tránsito',
  ENTREGADO: 'Entregado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

const el = {
  header: document.querySelector('.header'),
  chooseDetail: document.getElementById('choose-detail'),
  chooseCrowd: document.getElementById('choose-crowd'),
  entryGate: document.getElementById('entry-gate'),
  modeTabsWrap: document.getElementById('mode-tabs'),
  modeTabs: Array.from(document.querySelectorAll('.mode-tab')),
  detailView: document.getElementById('detail-view'),
  crowdView: document.getElementById('crowd-view'),
  detailProducts: document.getElementById('detail-products'),

  binsList: document.getElementById('bins-list'),
  summaryPanel: document.getElementById('summary-panel'),
  summaryProduct: document.getElementById('summary-product'),
  summaryKg: document.getElementById('summary-kg'),
  summaryUnit: document.getElementById('summary-unit'),
  summaryTotal: document.getElementById('summary-total'),

  orderModal: document.getElementById('order-modal'),
  orderForm: document.getElementById('order-form'),
  orderBinId: document.getElementById('order-bin-id'),
  orderKg: document.getElementById('order-kg'),
  orderKgLabel: document.getElementById('order-kg-label'),
  orderKgLabelText: document.getElementById('order-kg-label-text'),
  orderTotal: document.getElementById('order-total'),
  orderStockHelp: document.getElementById('order-stock-help'),
  cancelOrderAction: document.getElementById('cancel-order-action'),
  closeOrder: document.getElementById('close-order'),
  customerName: document.getElementById('customer-name'),
  customerEmail: document.getElementById('customer-email'),
  customerPhone: document.getElementById('customer-phone'),

  detailOrderModal: document.getElementById('detail-order-modal'),
  detailOrderForm: document.getElementById('detail-order-form'),
  detailProductId: document.getElementById('detail-product-id'),
  detailOrderKg: document.getElementById('detail-order-kg'),
  detailOrderTotal: document.getElementById('detail-order-total'),
  detailStockHelp: document.getElementById('detail-stock-help'),
  cancelDetailOrderAction: document.getElementById('cancel-detail-order-action'),
  closeDetailOrder: document.getElementById('close-detail-order'),
  detailCustomerName: document.getElementById('detail-customer-name'),
  detailCustomerEmail: document.getElementById('detail-customer-email'),
  detailCustomerPhone: document.getElementById('detail-customer-phone'),

  openAdminLink: document.getElementById('open-admin-link'),
  adminModal: document.getElementById('admin-modal'),
  closeAdmin: document.getElementById('close-admin'),
  adminLoginSection: document.getElementById('admin-login-section'),
  adminPanelSection: document.getElementById('admin-panel-section'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminEmail: document.getElementById('admin-email'),
  adminPassword: document.getElementById('admin-password'),
  adminLogout: document.getElementById('admin-logout'),

  mainTabs: Array.from(document.querySelectorAll('.main-tab')),
  adminViews: {
    resumen: document.getElementById('admin-view-resumen'),
    crear: document.getElementById('admin-view-crear'),
    'seguimiento-mayorista': document.getElementById('admin-view-seguimiento-mayorista'),
    'seguimiento-detalle': document.getElementById('admin-view-seguimiento-detalle'),
    terminadas: document.getElementById('admin-view-terminadas'),
    financiero: document.getElementById('admin-view-financiero')
  },

  binForm: document.getElementById('bin-form'),
  binId: document.getElementById('bin-id'),
  binProduct: document.getElementById('bin-product'),
  binVariety: document.getElementById('bin-variety'),
  binPrice: document.getElementById('bin-price'),
  binCapacity: document.getElementById('bin-capacity'),
  binMinKg: document.getElementById('bin-min-kg'),
  binImage: document.getElementById('bin-image'),
  binStatus: document.getElementById('bin-status'),
  binNotes: document.getElementById('bin-notes'),
  clearBinForm: document.getElementById('clear-bin-form'),
  detailProductForm: document.getElementById('detail-product-form'),
  detailAdminId: document.getElementById('detail-admin-id'),
  detailAdminName: document.getElementById('detail-admin-name'),
  detailAdminPrice: document.getElementById('detail-admin-price'),
  detailAdminStock: document.getElementById('detail-admin-stock'),
  detailAdminImage: document.getElementById('detail-admin-image'),
  clearDetailForm: document.getElementById('clear-detail-form'),
  adminBinsOpen: document.getElementById('admin-bins-open'),
  adminBinsSold: document.getElementById('admin-bins-sold'),
  adminDetailOrders: document.getElementById('admin-detail-orders'),
  adminDetailProducts: document.getElementById('admin-detail-products'),
  completedSummary: document.getElementById('completed-summary'),
  completedChannelChart: document.getElementById('completed-channel-chart'),
  completedProductChart: document.getElementById('completed-product-chart'),
  completedSalesList: document.getElementById('completed-sales-list'),
  financialKpis: document.getElementById('financial-kpis'),
  financialChannelChart: document.getElementById('financial-channel-chart'),
  financialStatusChart: document.getElementById('financial-status-chart'),
  financialList: document.getElementById('financial-list'),

  kpiGrid: document.getElementById('kpi-grid'),
  kgChart: document.getElementById('kg-chart'),
  amountChart: document.getElementById('amount-chart'),
  kgLegend: document.getElementById('kg-legend'),

  purchaseAlert: document.getElementById('purchase-alert'),
  purchaseAlertText: document.getElementById('purchase-alert-text'),
  purchaseAlertClose: document.getElementById('purchase-alert-close'),
  toast: document.getElementById('toast')
  ,
  trackingView: document.getElementById('tracking-view'),
  trackingForm: document.getElementById('tracking-form'),
  trackingPhone: document.getElementById('tracking-phone'),
  trackingResults: document.getElementById('tracking-results'),
  trackingClear: document.getElementById('tracking-clear')
};

const uid = () => crypto.randomUUID();
const CLP = new Intl.NumberFormat('es-CL');
let currentAdminView = 'resumen';
let currentMode = 'detail';
let currentMainView = 'detail';

function seedDB() {
  const now = new Date().toISOString();
  const paltaId = uid();
  const naranjaId = uid();

  const users = [
    { id: uid(), name: 'Administrador', email: 'admin@lazo.cl', phone: '+56900000000', role: 'ADMIN', password: 'admin123', created_at: now },
    { id: uid(), name: 'Juan Pérez', email: 'juan@email.com', phone: '+56999888777', role: 'CUSTOMER', created_at: now },
    { id: uid(), name: 'Mini Market Norte', email: 'compras@market.cl', phone: '+56911222333', role: 'CUSTOMER', created_at: now }
  ];

  const bins = [
    {
      id: paltaId,
      product_name: 'Palta Hass',
      variety: 'Hass calibre 22',
      notes: 'Homogénea, ideal para venta por mayor. Se entrega en pallet.',
      price_per_kg: 2690,
      capacity_kg: 500,
      min_order_kg: 50,
      sold_kg: 320,
      status: 'OPEN',
      image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80',
      created_at: now
    },
    {
      id: naranjaId,
      product_name: 'Naranja Valencia',
      variety: 'Valencia tardía',
      notes: 'Lote uniforme para jugo y mesa. Venta mayorista completa.',
      price_per_kg: 1290,
      capacity_kg: 500,
      min_order_kg: 50,
      sold_kg: 500,
      status: 'SOLD_OUT',
      image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
      created_at: now
    }
  ];

  const detailProducts = [
    { id: uid(), name: 'Tomate Larga Vida', price_per_kg: 1490, stock_kg: 180, image_url: 'https://images.unsplash.com/photo-1546470427-e212b94d5c32?auto=format&fit=crop&w=1200&q=80' },
    { id: uid(), name: 'Cebolla Morada', price_per_kg: 990, stock_kg: 240, image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80' }
  ];

  const orders = [
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[1].id, kg: 220, unit_price: 1290, total_price: 283800, status: 'COMPLETADO', created_at: now },
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[2].id, kg: 280, unit_price: 1290, total_price: 361200, status: 'ENTREGADO', created_at: now },
    { id: uid(), channel: 'DETALLE', bin_id: null, detail_product_id: detailProducts[0].id, customer_id: users[1].id, kg: 12, unit_price: 1490, total_price: 17880, status: 'PENDIENTE_PAGO', created_at: now }
  ];

  return { users, bins, detailProducts, orders };
}

function isBinCompleted(bin) {
  return Boolean(bin) && (bin.status === 'SOLD_OUT' || bin.sold_kg >= bin.capacity_kg);
}

function syncCrowdOrdersForBin(db, bin) {
  if (!bin) return false;
  const completed = isBinCompleted(bin);
  let changed = false;
  db.orders.forEach((order) => {
    if (order.channel !== 'CROWDBUYING' || order.bin_id !== bin.id) return;
    if (completed && (order.status === 'PAGO_CONFIRMADO' || order.status === 'ESPERA_CIERRE_BIN')) {
      order.status = 'PENDIENTE_ENVIO';
      changed = true;
    }
    if (!completed && order.status === 'PENDIENTE_ENVIO') {
      order.status = 'ESPERA_CIERRE_BIN';
      changed = true;
    }
  });
  return changed;
}

function getCrowdNextStatus(order, bin) {
  if (!order) return null;
  if (order.status === 'PAGO_CONFIRMADO') return isBinCompleted(bin) ? 'PENDIENTE_ENVIO' : 'ESPERA_CIERRE_BIN';
  if (order.status === 'ESPERA_CIERRE_BIN') return isBinCompleted(bin) ? 'PENDIENTE_ENVIO' : null;
  return NEXT_STATE_CROWD[order.status] || null;
}

function normalizeCrowdFlow(db) {
  let changed = false;
  db.bins.forEach((bin) => {
    const minOrder = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
    bin.min_order_kg = Math.max(1, Number.isFinite(minOrder) ? minOrder : DEFAULT_CROWD_MIN_KG);

    const clamped = Math.max(0, Math.min(bin.sold_kg, bin.capacity_kg));
    if (clamped !== bin.sold_kg) {
      bin.sold_kg = clamped;
      changed = true;
    }
    const shouldBeSoldOut = isBinCompleted(bin);
    const nextStatus = shouldBeSoldOut ? 'SOLD_OUT' : (bin.status === 'SOLD_OUT' ? 'OPEN' : bin.status);
    if (bin.status !== nextStatus) {
      bin.status = nextStatus;
      changed = true;
    }
    if (syncCrowdOrdersForBin(db, bin)) changed = true;
  });
  return changed;
}

function getDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seedDB();
    normalizeCrowdFlow(initial);
    saveDB(initial);
    return initial;
  }
  const parsed = JSON.parse(raw);
  if (normalizeCrowdFlow(parsed)) saveDB(parsed);
  return parsed;
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function normalizePhone(value = '') {
  return String(value).replace(/\s+/g, '').trim();
}

const api = {
  getBins() { return getDB().bins; },
  getBin(id) { return getDB().bins.find((b) => b.id === id); },
  getDetailProducts() { return getDB().detailProducts; },
  getDetailProduct(id) { return getDB().detailProducts.find((p) => p.id === id); },
  createDetailProduct(payload) {
    const db = getDB();
    const product = {
      id: uid(),
      name: payload.name,
      price_per_kg: Number(payload.price_per_kg),
      stock_kg: Number(payload.stock_kg),
      image_url: payload.image_url
    };
    db.detailProducts.unshift(product);
    saveDB(db);
    return product;
  },
  updateDetailProduct(productId, payload) {
    const db = getDB();
    const product = db.detailProducts.find((p) => p.id === productId);
    if (!product) throw new Error('Producto detalle no encontrado.');
    Object.assign(product, {
      name: payload.name,
      price_per_kg: Number(payload.price_per_kg),
      stock_kg: Number(payload.stock_kg),
      image_url: payload.image_url
    });
    saveDB(db);
    return product;
  },
  getOrders(channel = null) {
    const orders = getDB().orders;
    return channel ? orders.filter((o) => o.channel === channel) : orders;
  },
  getOrdersByPhone(phone) {
    const db = getDB();
    const needle = normalizePhone(phone);
    if (!needle) return [];
    const customerIds = db.users
      .filter((u) => normalizePhone(u.phone) === needle)
      .map((u) => u.id);
    if (!customerIds.length) return [];
    return db.orders
      .filter((o) => customerIds.includes(o.customer_id))
      .map((o) => ({
        ...o,
        customer: db.users.find((u) => u.id === o.customer_id),
        product: o.channel === 'DETALLE'
          ? db.detailProducts.find((p) => p.id === o.detail_product_id)
          : db.bins.find((b) => b.id === o.bin_id)
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  createOrder(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Mayorista no encontrado.');
    if (bin.status !== 'OPEN') throw new Error('La venta mayorista no está abierta para compra.');

    const requestedKg = Number(payload.kg);
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    const minKg = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
    if (requestedKg < minKg) throw new Error(`La compra mayorista es desde ${minKg} kg por pedido.`);
    if (requestedKg > available) throw new Error(`Stock insuficiente. Solo quedan ${available} kg.`);

    const customer = { id: uid(), name: payload.name, email: payload.email, phone: payload.phone, role: 'CUSTOMER', created_at: new Date().toISOString() };
    db.users.push(customer);

    const order = {
      id: uid(), channel: 'CROWDBUYING', bin_id: bin.id, detail_product_id: null, customer_id: customer.id,
      kg: requestedKg, unit_price: bin.price_per_kg, total_price: requestedKg * bin.price_per_kg,
      status: 'PENDIENTE_PAGO', created_at: new Date().toISOString()
    };

    bin.sold_kg += requestedKg;
    if (bin.sold_kg >= bin.capacity_kg) { bin.sold_kg = bin.capacity_kg; bin.status = 'SOLD_OUT'; }

    db.orders.push(order);
    syncCrowdOrdersForBin(db, bin);
    saveDB(db);
    return order;
  },
  createDetailOrder(productId, payload) {
    const db = getDB();
    const product = db.detailProducts.find((p) => p.id === productId);
    if (!product) throw new Error('Producto detalle no encontrado.');
    const requestedKg = Number(payload.kg);
    if (requestedKg <= 0 || requestedKg > product.stock_kg) throw new Error(`Stock detalle insuficiente. Solo quedan ${product.stock_kg} kg.`);

    const customer = { id: uid(), name: payload.name, email: payload.email, phone: payload.phone, role: 'CUSTOMER', created_at: new Date().toISOString() };
    db.users.push(customer);

    const order = {
      id: uid(), channel: 'DETALLE', bin_id: null, detail_product_id: product.id, customer_id: customer.id,
      kg: requestedKg, unit_price: product.price_per_kg, total_price: requestedKg * product.price_per_kg,
      status: 'PENDIENTE_PAGO', created_at: new Date().toISOString()
    };

    product.stock_kg -= requestedKg;
    db.orders.push(order);
    syncCrowdOrdersForBin(db, bin);
    saveDB(db);
    return order;
  },
  login(email, password) {
    const admin = getDB().users.find((u) => u.role === 'ADMIN' && u.email === email && u.password === password);
    if (!admin) throw new Error('Credenciales inválidas.');
    localStorage.setItem(ADMIN_SESSION_KEY, admin.id);
    return admin;
  },
  logout() { localStorage.removeItem(ADMIN_SESSION_KEY); },
  isAdmin() { return Boolean(localStorage.getItem(ADMIN_SESSION_KEY)); },
  createBin(payload) {
    const db = getDB();
    const bin = { id: uid(), product_name: payload.product_name, variety: payload.variety || '', notes: payload.notes || '', price_per_kg: Number(payload.price_per_kg), capacity_kg: Number(payload.capacity_kg || 500), min_order_kg: Number(payload.min_order_kg || DEFAULT_CROWD_MIN_KG), sold_kg: 0, status: payload.status || 'OPEN', image_url: payload.image_url, created_at: new Date().toISOString() };
    db.bins.unshift(bin);
    saveDB(db);
    return bin;
  },
  updateBin(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Mayorista no encontrado.');
    Object.assign(bin, { product_name: payload.product_name, variety: payload.variety || '', notes: payload.notes || '', price_per_kg: Number(payload.price_per_kg), capacity_kg: Number(payload.capacity_kg), min_order_kg: Number(payload.min_order_kg || DEFAULT_CROWD_MIN_KG), image_url: payload.image_url, status: payload.status });
    if (bin.sold_kg >= bin.capacity_kg) { bin.sold_kg = bin.capacity_kg; bin.status = 'SOLD_OUT'; }
    saveDB(db);
    return bin;
  },
  getOrdersByBin(binId) {
    const db = getDB();
    return db.orders.filter((o) => o.bin_id === binId).map((order) => ({ ...order, customer: db.users.find((u) => u.id === order.customer_id) }));
  },
  getDetailOrders() {
    const db = getDB();
    return db.orders.filter((o) => o.channel === 'DETALLE').map((order) => ({ ...order, customer: db.users.find((u) => u.id === order.customer_id), product: db.detailProducts.find((p) => p.id === order.detail_product_id) }));
  },
  updateOrderStatus(orderId, status) {
    const db = getDB();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado.');
    if (!ORDER_STATES.includes(status)) throw new Error('Estado inválido.');

    if (order.channel === 'CROWDBUYING') {
      const bin = db.bins.find((b) => b.id === order.bin_id);
      if (!bin) throw new Error('Mayorista asociado no encontrado.');

      const fromCancelled = order.status === 'CANCELADO' && status !== 'CANCELADO';
      const toCancelled = order.status !== 'CANCELADO' && status === 'CANCELADO';

      const completed = isBinCompleted(bin);
      if (status === 'EN_TRANSITO' && order.status !== 'PENDIENTE_ENVIO') {
        throw new Error('Primero debes pasar el pedido a Pendiente de envío.');
      }

      if (status === 'ESPERA_CIERRE_BIN' && completed) {
        status = 'PENDIENTE_ENVIO';
      }

      if (status === 'PAGO_CONFIRMADO' && completed) {
        status = 'PENDIENTE_ENVIO';
      }

      if (status === 'PENDIENTE_ENVIO' && !completed) {
        throw new Error('Aún no se completa el mayorista para liberar despachos.');
      }

      if (toCancelled) {
        bin.sold_kg = Math.max(0, bin.sold_kg - order.kg);
        if (bin.status === 'SOLD_OUT' && bin.sold_kg < bin.capacity_kg) bin.status = 'OPEN';
      }

      if (fromCancelled) {
        const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
        if (order.kg > available) throw new Error(`No se puede reactivar: solo hay ${available} kg disponibles.`);
        bin.sold_kg += order.kg;
        if (bin.sold_kg >= bin.capacity_kg) { bin.sold_kg = bin.capacity_kg; bin.status = 'SOLD_OUT'; }
      }

      syncCrowdOrdersForBin(db, bin);
    }

    if (order.channel === 'DETALLE') {
      const product = db.detailProducts.find((p) => p.id === order.detail_product_id);
      if (!product) throw new Error('Producto detalle asociado no encontrado.');

      const fromCancelled = order.status === 'CANCELADO' && status !== 'CANCELADO';
      const toCancelled = order.status !== 'CANCELADO' && status === 'CANCELADO';

      if (toCancelled) product.stock_kg += order.kg;
      if (fromCancelled) {
        if (product.stock_kg < order.kg) throw new Error('No hay stock detalle para reactivar el pedido.');
        product.stock_kg -= order.kg;
      }
    }

    order.status = status;
    saveDB(db);
    return order;
  }
};

function money(value) { return `$${CLP.format(Math.round(value || 0))}`; }
function toast(message, isError = false) {
  el.toast.textContent = message;
  el.toast.className = `toast show ${isError ? 'error' : 'success'}`;
  setTimeout(() => (el.toast.className = 'toast'), 2600);
}
function showPurchaseAlert(message) {
  el.purchaseAlertText.textContent = message;
  el.purchaseAlert.classList.remove('hidden');
}
function hidePurchaseAlert() { el.purchaseAlert.classList.add('hidden'); }
function statusTag(status) {
  const labels = { OPEN: 'En venta', CLOSED: 'Pausado', SOLD_OUT: 'Completo 100%' };
  return `<span class="bin-status ${status}">${labels[status] || status}</span>`;
}


function updateStickyOffsets() {
  if (!el.header) return;
  const headerHeight = Math.ceil(el.header.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
}

function scrollToModeView(view = currentMainView) {
  const target = view === 'tracking'
    ? el.trackingView
    : (view === 'crowd' ? el.crowdView : el.detailView);
  if (!target || window.innerWidth > 768) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function updateMainPanels() {
  el.detailView.classList.toggle('hidden', currentMainView !== 'detail');
  el.crowdView.classList.toggle('hidden', currentMainView !== 'crowd');
  el.trackingView.classList.toggle('hidden', currentMainView !== 'tracking');
}

function setMainView(view, { shouldScroll = true } = {}) {
  const normalized = ['detail', 'crowd', 'tracking'].includes(view) ? view : 'detail';
  currentMainView = normalized;
  if (normalized !== 'tracking') {
    currentMode = normalized;
    localStorage.setItem(MODE_KEY, currentMode);
  }

  el.entryGate.classList.add('hidden');
  el.modeTabsWrap.classList.remove('hidden');
  el.modeTabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === currentMainView));
  document.body.classList.toggle('wholesale-mode', currentMainView === 'crowd');
  updateMainPanels();
  if (shouldScroll) scrollToModeView(currentMainView);
}

function initMode() {
  localStorage.removeItem(MODE_KEY);
  currentMode = 'detail';
  currentMainView = 'detail';
  el.entryGate.classList.remove('hidden');
  el.modeTabsWrap.classList.add('hidden');
  el.detailView.classList.add('hidden');
  el.crowdView.classList.add('hidden');
  el.trackingView.classList.add('hidden');
  resetTrackingResults();
  document.body.classList.remove('wholesale-mode');
}

function renderBins() {
  const bins = api.getBins();
  el.binsList.innerHTML = bins.map((bin) => {
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
    const minKg = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
    const buyDisabled = bin.status !== 'OPEN' || available < minKg;

    return `
      <article class="bin-card">
        <img class="bin-image" src="${bin.image_url}" alt="${bin.product_name}" />
        <div class="bin-body">
          <h3>${bin.product_name}</h3>
          ${statusTag(bin.status)}
          <p class="bin-meta">Variedad: <strong>${bin.variety || 'No especificada'}</strong></p>
          <p class="bin-meta">Precio por kilo: <strong>${money(bin.price_per_kg)}</strong></p>
          <p class="bin-meta">Capacidad total: ${bin.capacity_kg} kg</p>
          <p class="bin-meta">Mínimo por pedido: ${Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG)} kg</p>
          <div class="progress-wrap">
            <div class="progress-mem" style="--sold:${pct}%"><div class="progress-sold"></div><div class="progress-available"></div></div>
            <div class="progress-text"><span>${bin.sold_kg} kg vendidos</span><span>${available} kg disponibles</span><strong>${pct}% completado</strong></div>
          </div>
          ${bin.notes ? `<div class="bin-notes">${bin.notes}</div>` : ''}
          <button class="btn buy-btn" data-id="${bin.id}" ${buyDisabled ? 'disabled' : ''}>Comprar kilos</button>
        </div>
      </article>
    `;
  }).join('');

  el.binsList.querySelectorAll('.buy-btn').forEach((btn) => btn.addEventListener('click', () => openOrderModal(btn.dataset.id)));
}

function renderDetailProducts() {
  const products = api.getDetailProducts();
  el.detailProducts.innerHTML = products.map((p) => {
    const out = p.stock_kg <= 0;
    return `
      <article class="bin-card">
        <img class="bin-image" src="${p.image_url}" alt="${p.name}" />
        <div class="bin-body">
          <h3>${p.name}</h3>
          <p class="bin-meta">Precio por kilo: <strong>${money(p.price_per_kg)}</strong></p>
          <p class="bin-meta">Stock disponible: ${p.stock_kg} kg</p>
          <button class="btn detail-buy" data-id="${p.id}" ${out ? 'disabled' : ''}>Comprar al detalle</button>
        </div>
      </article>
    `;
  }).join('');
  el.detailProducts.querySelectorAll('.detail-buy').forEach((btn) => btn.addEventListener('click', () => openDetailOrderModal(btn.dataset.id)));
}

function updateSummary(bin, kg = 0) {
  const total = kg * (bin?.price_per_kg || 0);
  el.summaryProduct.textContent = bin ? bin.product_name : '—';
  el.summaryKg.textContent = `${kg || 0} kg`;
  el.summaryUnit.textContent = bin ? money(bin.price_per_kg) : '$0';
  el.summaryTotal.textContent = money(total);
}

function openOrderModal(binId) {
  const bin = api.getBin(binId);
  if (!bin) return;
  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
  const minKg = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
  el.orderForm.reset();
  el.orderBinId.value = bin.id;
  el.orderKg.min = String(minKg);
  el.orderKg.max = String(available);
  el.orderKg.value = String(Math.min(Math.max(minKg, 0), available));
  if (el.orderKgLabelText) el.orderKgLabelText.textContent = `Kilos a comprar (mínimo ${minKg} kg por pedido)`;
  el.orderStockHelp.textContent = `${available} kg disponibles para ${bin.product_name}. Mínimo por pedido: ${minKg} kg.`;
  updateSummary(bin, 0);
  el.orderTotal.textContent = `Total: ${money(0)}`;
  el.summaryPanel.classList.remove('hidden');
  el.orderModal.showModal();
}

function closeOrderFlow() {
  el.orderModal.close();
  el.summaryPanel.classList.add('hidden');
}

function openDetailOrderModal(productId) {
  const p = api.getDetailProduct(productId);
  if (!p) return;
  el.detailOrderForm.reset();
  el.detailProductId.value = p.id;
  el.detailOrderKg.max = String(p.stock_kg);
  el.detailStockHelp.textContent = `${p.stock_kg} kg disponibles para ${p.name}.`;
  el.detailOrderTotal.textContent = `Total: ${money(0)}`;
  el.detailOrderModal.showModal();
}

function closeDetailOrderFlow() {
  el.detailOrderModal.close();
}

function fillAdminForm(bin) {
  el.binId.value = bin.id;
  el.binProduct.value = bin.product_name;
  el.binVariety.value = bin.variety || '';
  el.binPrice.value = bin.price_per_kg;
  el.binCapacity.value = bin.capacity_kg;
  el.binMinKg.value = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
  el.binImage.value = bin.image_url;
  el.binStatus.value = bin.status;
  el.binNotes.value = bin.notes || '';
}

function clearAdminForm() {
  el.binForm.reset();
  el.binId.value = '';
  el.binCapacity.value = '500';
  el.binMinKg.value = String(DEFAULT_CROWD_MIN_KG);
  el.binStatus.value = 'OPEN';
}

function fillDetailAdminForm(product) {
  el.detailAdminId.value = product.id;
  el.detailAdminName.value = product.name;
  el.detailAdminPrice.value = product.price_per_kg;
  el.detailAdminStock.value = product.stock_kg;
  el.detailAdminImage.value = product.image_url;
}

function clearDetailAdminForm() {
  el.detailProductForm.reset();
  el.detailAdminId.value = '';
}

function renderDetailProductsAdmin() {
  const products = api.getDetailProducts();
  el.adminDetailProducts.innerHTML = products.length ? products.map((p) => `
    <article class="admin-bin">
      <div class="admin-row">
        <div>
          <h4>${p.name}</h4>
          <p class="bin-meta">${money(p.price_per_kg)} / kg · Stock ${p.stock_kg} kg</p>
        </div>
        <div><button class="btn secondary edit-detail-product" data-id="${p.id}">Editar</button></div>
      </div>
    </article>
  `).join('') : '<p class="hint">No hay productos detalle creados.</p>';
}

function computeBinSummary(bin, orders) {
  let soldAmount = 0;
  let recaudado = 0;
  let waitingToDispatch = 0;
  orders.forEach((o) => {
    soldAmount += o.total_price;
    if (o.status === 'COMPLETADO') recaudado += o.total_price;
    if (o.status === 'ESPERA_CIERRE_BIN' || o.status === 'PENDIENTE_ENVIO') waitingToDispatch += o.total_price;
  });
  return { soldAmount, recaudado, waitingToDispatch };
}

function orderItemTemplate(order, isSoldView, bin = null) {
  const next = order.channel === 'DETALLE' ? NEXT_STATE_DETAIL[order.status] : getCrowdNextStatus(order, bin);
  const canMove = Boolean(next);
  return `
    <div class="order-item">
      <div><strong>${order.customer?.name || 'Cliente'}</strong><div>${order.kg} kg · ${money(order.total_price)}</div></div>
      <div><span class="order-status ${order.status}">${ORDER_LABELS[order.status]}</span><div>${order.customer?.phone || 'Sin teléfono'} · ${order.customer?.email || ''}</div></div>
      <div class="order-actions">
        ${canMove ? `<button class="btn tiny warn order-next" data-order-id="${order.id}" data-next="${next}">Pasar a: ${ORDER_LABELS[next]}</button>` : ''}
        ${order.status !== 'CANCELADO' && order.status !== 'COMPLETADO' ? `<button class="btn tiny secondary order-cancel" data-order-id="${order.id}">Cancelar</button>` : ''}
        ${isSoldView ? '<span class="hint">Mayorista cerrado</span>' : ''}
      </div>
    </div>
  `;
}

function renderAdminBinCard(bin, isSoldView = false) {
  const orders = api.getOrdersByBin(bin.id);
  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
  const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
  const summary = computeBinSummary(bin, orders);

  return `
    <article class="admin-bin">
      <div class="admin-row">
        <div>
          <h4>${bin.product_name}</h4>
          <p class="bin-meta">${money(bin.price_per_kg)} / kg · ${bin.sold_kg}/${bin.capacity_kg} kg · ${pct}%</p>
          <p class="bin-meta">Variedad: ${bin.variety || 'No especificada'}</p>
          ${statusTag(bin.status)}
        </div>
        <div>${isSoldView ? '<span class="hint">Lote completo (sin edición)</span>' : `<button class="btn secondary edit-bin" data-id="${bin.id}">Editar</button>`}</div>
      </div>
      <div class="progress-wrap"><div class="progress-mem" style="--sold:${pct}%"><div class="progress-sold"></div><div class="progress-available"></div></div></div>
      <div class="bin-summary-grid">
        <div class="summary-chip"><span>Disponible</span><strong>${available} kg</strong></div>
        <div class="summary-chip"><span>Vendido</span><strong>${bin.sold_kg} kg</strong></div>
        <div class="summary-chip"><span>Recaudado</span><strong>${money(summary.recaudado)}</strong></div>
        <div class="summary-chip"><span>Espera despacho</span><strong>${money(summary.waitingToDispatch)}</strong></div>
      </div>
      ${bin.notes ? `<div class="bin-notes">${bin.notes}</div>` : ''}
      <div class="order-list"><strong>Pedidos (${orders.length}):</strong>${orders.length === 0 ? '<p>Sin pedidos.</p>' : orders.map((order) => orderItemTemplate(order, isSoldView, bin)).join('')}</div>
    </article>
  `;
}

function renderDetailOrdersAdmin() {
  const orders = api.getDetailOrders();
  el.adminDetailOrders.innerHTML = orders.length ? orders.map((o) => `
    <article class="admin-bin">
      <div class="admin-row">
        <div>
          <h4>${o.product?.name || 'Producto detalle'}</h4>
          <p class="bin-meta">Cliente: ${o.customer?.name || 'Cliente'} · ${o.kg} kg · ${money(o.total_price)}</p>
          <span class="order-status ${o.status}">${ORDER_LABELS[o.status]}</span>
        </div>
        <div class="order-actions">
          ${NEXT_STATE_DETAIL[o.status] ? `<button class="btn tiny warn order-next" data-order-id="${o.id}" data-next="${NEXT_STATE_DETAIL[o.status]}">Pasar a: ${ORDER_LABELS[NEXT_STATE_DETAIL[o.status]]}</button>` : ''}
          ${o.status !== 'CANCELADO' && o.status !== 'COMPLETADO' ? `<button class="btn tiny secondary order-cancel" data-order-id="${o.id}">Cancelar</button>` : ''}
        </div>
      </div>
    </article>
  `).join('') : '<p class="hint">Sin pedidos detalle aún.</p>';
}

function renderTrackingResults(phone) {
  const orders = api.getOrdersByPhone(phone);
  if (!orders.length) {
    el.trackingResults.innerHTML = '<p class="hint">No encontramos pedidos con ese teléfono.</p>';
    return;
  }

  el.trackingResults.innerHTML = orders.map((o) => {
    const productName = o.channel === 'DETALLE' ? (o.product?.name || 'Producto detalle') : (o.product?.product_name || 'Producto mayorista');
    return `
      <article class="tracking-card">
        <div class="tracking-head">
          <div>
            <h4>${productName}</h4>
            <p class="bin-meta">${o.kg} kg · ${money(o.total_price)} · ${new Date(o.created_at).toLocaleDateString('es-CL')}</p>
          </div>
          <div>
            <span class="channel-badge">${o.channel === 'DETALLE' ? 'Detalle' : 'Mayorista'}</span>
            <span class="order-status ${o.status}">${ORDER_LABELS[o.status]}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function resetTrackingResults() {
  el.trackingResults.innerHTML = '<p class="hint">Ingresa tu teléfono y presiona "Buscar pedidos" para consultar tus pedidos.</p>';
}

function renderKpisAndCharts() {
  const db = getDB();
  const bins = db.bins;
  const orders = db.orders;

  const totalCapacity = bins.reduce((acc, b) => acc + b.capacity_kg, 0);
  const totalSoldKg = bins.reduce((acc, b) => acc + b.sold_kg, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalSoldKg);

  const crowdOrders = orders.filter((o) => o.channel === 'CROWDBUYING').length;
  const detailOrders = orders.filter((o) => o.channel === 'DETALLE').length;

  const statusAmounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + order.total_price;
    return acc;
  }, {});

  el.kpiGrid.innerHTML = `
    <article class="kpi-card"><p>Mayoristas activos</p><strong>${bins.filter((b) => b.status === 'OPEN').length}</strong></article>
    <article class="kpi-card"><p>Mayoristas completados</p><strong>${bins.filter((b) => b.status === 'SOLD_OUT').length}</strong></article>
    <article class="kpi-card"><p>Pedidos mayorista</p><strong>${crowdOrders}</strong></article>
    <article class="kpi-card"><p>Pedidos detalle</p><strong>${detailOrders}</strong></article>
  `;

  const soldPct = totalCapacity ? Math.round((totalSoldKg / totalCapacity) * 100) : 0;
  const waitingAmount = (statusAmounts.ESPERA_CIERRE_BIN || 0) + (statusAmounts.PENDIENTE_ENVIO || 0);
  const waitingPct = waitingAmount ? Math.min(100, Math.round((waitingAmount / Math.max(1, Object.values(statusAmounts).reduce((a, b) => a + b, 0))) * 100)) : 0;
  el.kgChart.style.setProperty('--part1', `${soldPct}%`);
  el.kgChart.style.setProperty('--part2', `${waitingPct}%`);
  el.kgChart.innerHTML = '<div></div><div></div><div></div>';
  el.kgLegend.innerHTML = `<span>Vendido: <strong>${totalSoldKg} kg (${soldPct}%)</strong></span><span>Disponible: <strong>${totalAvailable} kg</strong></span><span>Pendiente de envío: <strong>${money(waitingAmount)}</strong></span>`;

  const maxAmount = Math.max(1, ...ORDER_STATES.map((state) => statusAmounts[state] || 0));
  el.amountChart.innerHTML = ORDER_STATES.map((state) => {
    const value = statusAmounts[state] || 0;
    const w = Math.round((value / maxAmount) * 100);
    return `<div class="bar-row"><span>${ORDER_LABELS[state]}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('');
}

function renderCompletedSalesAdmin() {
  const db = getDB();
  const completed = db.orders.filter((o) => o.status === 'COMPLETADO' || o.status === 'ENTREGADO');
  const totalAmount = completed.reduce((acc, o) => acc + o.total_price, 0);
  const byChannel = completed.reduce((acc, o) => {
    acc[o.channel] = (acc[o.channel] || 0) + o.total_price;
    return acc;
  }, {});
  const byProduct = completed.reduce((acc, o) => {
    const name = o.channel === 'DETALLE'
      ? (db.detailProducts.find((p) => p.id === o.detail_product_id)?.name || 'Detalle')
      : (db.bins.find((b) => b.id === o.bin_id)?.product_name || 'Mayorista');
    acc[name] = (acc[name] || 0) + o.total_price;
    return acc;
  }, {});

  el.completedSummary.innerHTML = `
    <article class="kpi-card"><p>Ventas completadas</p><strong>${completed.length}</strong></article>
    <article class="kpi-card"><p>Monto total completado</p><strong>${money(totalAmount)}</strong></article>
    <article class="kpi-card"><p>Canal mayorista</p><strong>${money(byChannel.CROWDBUYING || 0)}</strong></article>
    <article class="kpi-card"><p>Canal detalle</p><strong>${money(byChannel.DETALLE || 0)}</strong></article>
  `;

  const channelMax = Math.max(1, ...Object.values(byChannel), 1);
  const channels = [{ k: 'CROWDBUYING', n: 'Mayorista' }, { k: 'DETALLE', n: 'Detalle' }];
  el.completedChannelChart.innerHTML = channels.map((c) => {
    const value = byChannel[c.k] || 0;
    const w = Math.round((value / channelMax) * 100);
    return `<div class="bar-row"><span>${c.n}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('');

  const topProducts = Object.entries(byProduct).sort((a,b) => b[1]-a[1]).slice(0,5);
  const productMax = Math.max(1, ...topProducts.map(([,v]) => v), 1);
  el.completedProductChart.innerHTML = topProducts.length ? topProducts.map(([name, value]) => {
    const w = Math.round((value / productMax) * 100);
    return `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('') : '<p class="hint">Sin ventas completadas todavía.</p>';

  el.completedSalesList.innerHTML = completed.length ? completed.map((o) => {
    const customer = db.users.find((u) => u.id === o.customer_id);
    const product = o.channel === 'DETALLE'
      ? (db.detailProducts.find((p) => p.id === o.detail_product_id)?.name || 'Detalle')
      : (db.bins.find((b) => b.id === o.bin_id)?.product_name || 'Mayorista');
    return `<article class="admin-bin"><div class="admin-row"><div><h4>${product}</h4><p class="bin-meta">${o.channel === 'CROWDBUYING' ? 'Mayorista' : 'Detalle'} · ${o.kg} kg · ${money(o.total_price)}</p><span class="order-status ${o.status}">${ORDER_LABELS[o.status]}</span></div><div class="hint">${customer?.name || 'Cliente'} · ${customer?.email || ''}</div></div></article>`;
  }).join('') : '<p class="hint">Aún no hay ventas completadas para mostrar.</p>';
}

function renderFinancialSummary() {
  const db = getDB();
  const orders = db.orders;
  const total = orders.reduce((acc, o) => acc + o.total_price, 0);
  const completed = orders.filter((o) => o.status === 'COMPLETADO' || o.status === 'ENTREGADO').reduce((acc, o) => acc + o.total_price, 0);
  const pending = orders.filter((o) => o.status !== 'COMPLETADO' && o.status !== 'ENTREGADO' && o.status !== 'CANCELADO').reduce((acc, o) => acc + o.total_price, 0);
  const cancelled = orders.filter((o) => o.status === 'CANCELADO').reduce((acc, o) => acc + o.total_price, 0);

  const byChannel = orders.reduce((acc, o) => {
    acc[o.channel] = (acc[o.channel] || 0) + o.total_price;
    return acc;
  }, {});

  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + o.total_price;
    return acc;
  }, {});

  el.financialKpis.innerHTML = `
    <article class="kpi-card"><p>Ingresos totales registrados</p><strong>${money(total)}</strong></article>
    <article class="kpi-card"><p>Ingresos completados</p><strong>${money(completed)}</strong></article>
    <article class="kpi-card"><p>Ingresos en proceso</p><strong>${money(pending)}</strong></article>
    <article class="kpi-card"><p>Monto cancelado</p><strong>${money(cancelled)}</strong></article>
  `;

  const channelMax = Math.max(1, ...Object.values(byChannel), 1);
  const channels = [['CROWDBUYING', 'Mayorista'], ['DETALLE', 'Detalle']];
  el.financialChannelChart.innerHTML = channels.map(([key, label]) => {
    const value = byChannel[key] || 0;
    const w = Math.round((value / channelMax) * 100);
    return `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('');

  const statusMax = Math.max(1, ...ORDER_STATES.map((state) => byStatus[state] || 0), 1);
  el.financialStatusChart.innerHTML = ORDER_STATES.map((state) => {
    const value = byStatus[state] || 0;
    const w = Math.round((value / statusMax) * 100);
    return `<div class="bar-row"><span>${ORDER_LABELS[state]}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('');

  el.financialList.innerHTML = orders.length ? orders.map((o) => {
    const customer = db.users.find((u) => u.id === o.customer_id);
    const product = o.channel === 'DETALLE'
      ? (db.detailProducts.find((p) => p.id === o.detail_product_id)?.name || 'Detalle')
      : (db.bins.find((b) => b.id === o.bin_id)?.product_name || 'Mayorista');
    return `<article class="admin-bin"><div class="admin-row"><div><h4>${product}</h4><p class="bin-meta">${o.channel === 'CROWDBUYING' ? 'Mayorista' : 'Detalle'} · ${o.kg} kg · ${money(o.total_price)}</p><span class="order-status ${o.status}">${ORDER_LABELS[o.status]}</span></div><div class="hint">${customer?.name || 'Cliente'} · ${new Date(o.created_at).toLocaleDateString('es-CL')}</div></div></article>`;
  }).join('') : '<p class="hint">Sin movimientos financieros todavía.</p>';
}

function bindAdminActions() {
  document.querySelectorAll('.edit-bin').forEach((btn) => btn.addEventListener('click', () => { const bin = api.getBin(btn.dataset.id); if (bin) { fillAdminForm(bin); switchAdminView('crear'); } }));
  document.querySelectorAll('.edit-detail-product').forEach((btn) => btn.addEventListener('click', () => {
    const product = api.getDetailProduct(btn.dataset.id);
    if (product) {
      fillDetailAdminForm(product);
      switchAdminView('crear');
    }
  }));
  document.querySelectorAll('.order-next').forEach((btn) => btn.addEventListener('click', () => {
    try { api.updateOrderStatus(btn.dataset.orderId, btn.dataset.next); renderAll(); toast(`Pedido actualizado: ${ORDER_LABELS[btn.dataset.next]}.`); }
    catch (error) { toast(error.message, true); }
  }));
  document.querySelectorAll('.order-cancel').forEach((btn) => btn.addEventListener('click', () => {
    try { api.updateOrderStatus(btn.dataset.orderId, 'CANCELADO'); renderAll(); toast('Pedido cancelado y stock reingresado.'); }
    catch (error) { toast(error.message, true); }
  }));
}

function renderAdminBins() {
  const bins = api.getBins();
  const selling = bins.filter((b) => b.status === 'OPEN' || b.status === 'CLOSED');
  const recaudados = bins.filter((b) => b.status === 'SOLD_OUT');
  el.adminBinsOpen.innerHTML = selling.length ? selling.map((bin) => renderAdminBinCard(bin, false)).join('') : '<p class="hint">No hay mayoristas en venta.</p>';
  el.adminBinsSold.innerHTML = recaudados.length ? recaudados.map((bin) => renderAdminBinCard(bin, true)).join('') : '<p class="hint">No hay mayoristas completados todavía.</p>';
  renderDetailOrdersAdmin();
  renderDetailProductsAdmin();
  renderKpisAndCharts();
  renderCompletedSalesAdmin();
  renderFinancialSummary();
  bindAdminActions();
}

function switchAdminView(view) {
  const fallback = el.adminViews[view] ? view : 'resumen';
  currentAdminView = fallback;
  el.mainTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.view === fallback));
  Object.entries(el.adminViews).forEach(([key, node]) => node.classList.toggle('hidden', key !== fallback));
}

function syncAdminView() {
  const isAdmin = api.isAdmin();
  el.adminLoginSection.classList.toggle('hidden', isAdmin);
  el.adminPanelSection.classList.toggle('hidden', !isAdmin);
  if (isAdmin) { renderAdminBins(); switchAdminView(currentAdminView); }
}

function renderAll() {
  renderBins();
  renderDetailProducts();
  syncAdminView();
}

el.orderKg.addEventListener('input', () => {
  const bin = api.getBin(el.orderBinId.value);
  if (!bin) return;
  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
  const minKg = Number(bin.min_order_kg || DEFAULT_CROWD_MIN_KG);
  const kg = Number(el.orderKg.value || 0);
  const safeKg = Math.min(Math.max(kg, minKg), available);
  if (kg !== safeKg) el.orderKg.value = String(safeKg);
  el.orderTotal.textContent = `Total: ${money(safeKg * bin.price_per_kg)}`;
  el.summaryProduct.textContent = bin.product_name;
  el.summaryKg.textContent = `${safeKg} kg`;
  el.summaryUnit.textContent = money(bin.price_per_kg);
  el.summaryTotal.textContent = money(safeKg * bin.price_per_kg);
});

el.detailOrderKg.addEventListener('input', () => {
  const p = api.getDetailProduct(el.detailProductId.value);
  if (!p) return;
  const kg = Math.min(Math.max(Number(el.detailOrderKg.value || 0), 0), p.stock_kg);
  el.detailOrderKg.value = String(kg);
  el.detailOrderTotal.textContent = `Total: ${money(kg * p.price_per_kg)}`;
});

el.orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const order = api.createOrder(el.orderBinId.value, { name: el.customerName.value.trim(), email: el.customerEmail.value.trim(), phone: el.customerPhone.value.trim(), kg: Number(el.orderKg.value) });
    const bin = api.getBin(el.orderBinId.value);
    closeOrderFlow();
    renderAll();
    showPurchaseAlert(`Pedido mayorista registrado: ${order.kg} kg de ${bin.product_name} por ${money(order.total_price)}.`);
  } catch (error) { toast(error.message, true); }
});

el.detailOrderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const order = api.createDetailOrder(el.detailProductId.value, { name: el.detailCustomerName.value.trim(), email: el.detailCustomerEmail.value.trim(), phone: el.detailCustomerPhone.value.trim(), kg: Number(el.detailOrderKg.value) });
    const p = api.getDetailProduct(el.detailProductId.value);
    closeDetailOrderFlow();
    renderAll();
    showPurchaseAlert(`Pedido detalle registrado: ${order.kg} kg de ${p.name} por ${money(order.total_price)}.`);
  } catch (error) { toast(error.message, true); }
});

el.chooseDetail.addEventListener('click', () => setMainView('detail'));
el.chooseCrowd.addEventListener('click', () => setMainView('crowd'));
el.modeTabs.forEach((tab) => tab.addEventListener('click', () => setMainView(tab.dataset.mode)));

el.openAdminLink.addEventListener('click', (event) => {
  event.preventDefault();
  syncAdminView();
  el.adminModal.showModal();
});
el.closeOrder.addEventListener('click', closeOrderFlow);
el.cancelOrderAction.addEventListener('click', closeOrderFlow);
el.closeDetailOrder.addEventListener('click', closeDetailOrderFlow);
el.cancelDetailOrderAction.addEventListener('click', closeDetailOrderFlow);
el.closeAdmin.addEventListener('click', () => el.adminModal.close());
el.purchaseAlertClose.addEventListener('click', hidePurchaseAlert);
el.purchaseAlert.addEventListener('click', (event) => { if (event.target === el.purchaseAlert) hidePurchaseAlert(); });

el.trackingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const phone = normalizePhone(el.trackingPhone.value);
  renderTrackingResults(phone);
});

el.trackingPhone.addEventListener('input', () => {
  if (!normalizePhone(el.trackingPhone.value)) {
    resetTrackingResults();
  }
});

el.trackingClear.addEventListener('click', () => {
  el.trackingPhone.value = '';
  resetTrackingResults();
  el.trackingPhone.focus();
});

el.adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try { api.login(el.adminEmail.value.trim(), el.adminPassword.value.trim()); syncAdminView(); toast('Inicio de sesión de administrador exitoso.'); }
  catch (error) { toast(error.message, true); }
});
el.adminLogout.addEventListener('click', () => { api.logout(); syncAdminView(); toast('Sesión cerrada.'); });

el.binForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const payload = {
      product_name: el.binProduct.value.trim(),
      variety: el.binVariety.value.trim(),
      notes: el.binNotes.value.trim(),
      price_per_kg: Number(el.binPrice.value),
      capacity_kg: Number(el.binCapacity.value || 500),
      min_order_kg: Number(el.binMinKg.value || DEFAULT_CROWD_MIN_KG),
      image_url: el.binImage.value.trim(),
      status: el.binStatus.value
    };
    if (el.binId.value) { api.updateBin(el.binId.value, payload); toast('Mayorista actualizado correctamente.'); }
    else { api.createBin(payload); toast('Mayorista creado correctamente.'); }
    clearAdminForm();
    renderAll();
  } catch (error) { toast(error.message, true); }
});

el.detailProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const payload = {
      name: el.detailAdminName.value.trim(),
      price_per_kg: Number(el.detailAdminPrice.value),
      stock_kg: Number(el.detailAdminStock.value),
      image_url: el.detailAdminImage.value.trim()
    };
    if (el.detailAdminId.value) {
      api.updateDetailProduct(el.detailAdminId.value, payload);
      toast('Producto detalle actualizado correctamente.');
    } else {
      api.createDetailProduct(payload);
      toast('Producto detalle creado correctamente.');
    }
    clearDetailAdminForm();
    renderAll();
  } catch (error) { toast(error.message, true); }
});

el.clearBinForm.addEventListener('click', clearAdminForm);
el.clearDetailForm.addEventListener('click', clearDetailAdminForm);
el.mainTabs.forEach((tab) => tab.addEventListener('click', () => switchAdminView(tab.dataset.view)));

updateStickyOffsets();
window.addEventListener('resize', updateStickyOffsets);

initMode();
renderAll();
