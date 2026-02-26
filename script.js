const STORAGE_KEY = 'crowdbuying-db-v5';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';
const MODE_KEY = 'crowdbuying-mode';
const THEME_KEY = 'crowdbuying-theme';

const ORDER_STATES = ['PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'ESPERA_CIERRE_BIN', 'EN_TRANSITO', 'ENTREGADO', 'COMPLETADO', 'CANCELADO'];
const NEXT_STATE = {
  PENDIENTE_PAGO: 'PAGO_CONFIRMADO',
  PAGO_CONFIRMADO: 'ESPERA_CIERRE_BIN',
  ESPERA_CIERRE_BIN: 'EN_TRANSITO',
  EN_TRANSITO: 'ENTREGADO',
  ENTREGADO: 'COMPLETADO',
  COMPLETADO: null,
  CANCELADO: 'PENDIENTE_PAGO'
};

const CROWD_MIN_KG = 50;

const ORDER_LABELS = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_CONFIRMADO: 'Pago confirmado',
  ESPERA_CIERRE_BIN: 'Pagado · esperando cierre del bin',
  EN_TRANSITO: 'En tránsito',
  ENTREGADO: 'Entregado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

const el = {
  chooseDetail: document.getElementById('choose-detail'),
  themeButtons: Array.from(document.querySelectorAll('.theme-btn')),
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

  openAdmin: document.getElementById('open-admin'),
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
    venta: document.getElementById('admin-view-venta'),
    recaudado: document.getElementById('admin-view-recaudado'),
    detalle: document.getElementById('admin-view-detalle')
  },

  binForm: document.getElementById('bin-form'),
  binId: document.getElementById('bin-id'),
  binProduct: document.getElementById('bin-product'),
  binVariety: document.getElementById('bin-variety'),
  binPrice: document.getElementById('bin-price'),
  binCapacity: document.getElementById('bin-capacity'),
  binImage: document.getElementById('bin-image'),
  binStatus: document.getElementById('bin-status'),
  binNotes: document.getElementById('bin-notes'),
  clearBinForm: document.getElementById('clear-bin-form'),
  adminBinsOpen: document.getElementById('admin-bins-open'),
  adminBinsSold: document.getElementById('admin-bins-sold'),
  adminDetailOrders: document.getElementById('admin-detail-orders'),

  kpiGrid: document.getElementById('kpi-grid'),
  kgChart: document.getElementById('kg-chart'),
  amountChart: document.getElementById('amount-chart'),
  kgLegend: document.getElementById('kg-legend'),

  purchaseAlert: document.getElementById('purchase-alert'),
  purchaseAlertText: document.getElementById('purchase-alert-text'),
  purchaseAlertClose: document.getElementById('purchase-alert-close'),
  toast: document.getElementById('toast')
};

const uid = () => crypto.randomUUID();
const CLP = new Intl.NumberFormat('es-CL');

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
      sold_kg: 320,
      status: 'OPEN',
      image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80',
      created_at: now
    },
    {
      id: naranjaId,
      product_name: 'Naranja Valencia',
      variety: 'Valencia tardía',
      notes: 'Lote uniforme para jugo y mesa. Venta por bin completo.',
      price_per_kg: 1290,
      capacity_kg: 500,
      sold_kg: 500,
      status: 'SOLD_OUT',
      image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
      created_at: now
    }
  ];

  const detailProducts = [
    { id: uid(), name: 'Tomate Larga Vida', price_per_kg: 1490, stock_kg: 180, image_url: 'https://images.unsplash.com/photo-1546470427-e212b94d5c32?auto=format&fit=crop&w=1200&q=80' },
    { id: uid(), name: 'Cebolla Amarilla', price_per_kg: 990, stock_kg: 240, image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80' }
  ];

  const orders = [
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[1].id, kg: 220, unit_price: 1290, total_price: 283800, status: 'COMPLETADO', created_at: now },
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[2].id, kg: 280, unit_price: 1290, total_price: 361200, status: 'ENTREGADO', created_at: now }
  ];

  return { users, bins, detailProducts, orders };
}

function getDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seedDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

const api = {
  getBins() { return getDB().bins; },
  getBin(id) { return getDB().bins.find((b) => b.id === id); },
  getDetailProducts() { return getDB().detailProducts; },
  getDetailProduct(id) { return getDB().detailProducts.find((p) => p.id === id); },
  getOrders(channel = null) {
    const orders = getDB().orders;
    return channel ? orders.filter((o) => o.channel === channel) : orders;
  },
  createOrder(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Bin no encontrado.');
    if (bin.status !== 'OPEN') throw new Error('El bin no está abierto para compra.');

    const requestedKg = Number(payload.kg);
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    if (requestedKg < CROWD_MIN_KG) throw new Error(`La compra colaborativa es desde ${CROWD_MIN_KG} kg.`);
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
    const bin = { id: uid(), product_name: payload.product_name, variety: payload.variety || '', notes: payload.notes || '', price_per_kg: Number(payload.price_per_kg), capacity_kg: Number(payload.capacity_kg || 500), sold_kg: 0, status: payload.status || 'OPEN', image_url: payload.image_url, created_at: new Date().toISOString() };
    db.bins.unshift(bin);
    saveDB(db);
    return bin;
  },
  updateBin(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Bin no encontrado.');
    Object.assign(bin, { product_name: payload.product_name, variety: payload.variety || '', notes: payload.notes || '', price_per_kg: Number(payload.price_per_kg), capacity_kg: Number(payload.capacity_kg), image_url: payload.image_url, status: payload.status });
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
      if (!bin) throw new Error('Bin asociado no encontrado.');

      const fromCancelled = order.status === 'CANCELADO' && status !== 'CANCELADO';
      const toCancelled = order.status !== 'CANCELADO' && status === 'CANCELADO';

      if (status === 'EN_TRANSITO' && bin.sold_kg < bin.capacity_kg) {
        throw new Error('No puedes despachar hasta completar el bin (100% vendido).');
      }

      if (status === 'ESPERA_CIERRE_BIN' && bin.sold_kg >= bin.capacity_kg) {
        status = 'EN_TRANSITO';
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
function statusTag(status) { return `<span class="bin-status ${status}">${status}</span>`; }


function setTheme(theme) {
  const allowed = ['theme-green', 'theme-blue', 'theme-dark'];
  const selected = allowed.includes(theme) ? theme : 'theme-green';
  document.body.classList.remove(...allowed);
  document.body.classList.add(selected);
  localStorage.setItem(THEME_KEY, selected);
  el.themeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.theme === selected));
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'theme-green';
  setTheme(saved);
  el.themeButtons.forEach((btn) => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
}

function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
  el.entryGate.classList.add('hidden');
  el.modeTabsWrap.classList.remove('hidden');
  el.modeTabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
  el.detailView.classList.toggle('hidden', mode !== 'detail');
  el.crowdView.classList.toggle('hidden', mode !== 'crowd');
}

function initMode() {
  const saved = localStorage.getItem(MODE_KEY);
  if (saved === 'detail' || saved === 'crowd') setMode(saved);
}

function renderBins() {
  const bins = api.getBins();
  el.binsList.innerHTML = bins.map((bin) => {
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
    const buyDisabled = bin.status !== 'OPEN' || available < CROWD_MIN_KG;

    return `
      <article class="bin-card">
        <img class="bin-image" src="${bin.image_url}" alt="${bin.product_name}" />
        <div class="bin-body">
          <h3>${bin.product_name}</h3>
          ${statusTag(bin.status)}
          <p class="bin-meta">Variedad: <strong>${bin.variety || 'No especificada'}</strong></p>
          <p class="bin-meta">Precio por kilo: <strong>${money(bin.price_per_kg)}</strong></p>
          <p class="bin-meta">Capacidad total: ${bin.capacity_kg} kg</p>
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
  el.orderForm.reset();
  el.orderBinId.value = bin.id;
  el.orderKg.min = String(CROWD_MIN_KG);
  el.orderKg.max = String(available);
  el.orderKg.value = String(Math.min(Math.max(CROWD_MIN_KG, 0), available));
  el.orderStockHelp.textContent = `${available} kg disponibles para ${bin.product_name}. Mínimo por compra colaborativa: ${CROWD_MIN_KG} kg.`;
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
  el.binImage.value = bin.image_url;
  el.binStatus.value = bin.status;
  el.binNotes.value = bin.notes || '';
}

function clearAdminForm() {
  el.binForm.reset();
  el.binId.value = '';
  el.binCapacity.value = '500';
  el.binStatus.value = 'OPEN';
}

function computeBinSummary(bin, orders) {
  let soldAmount = 0;
  let recaudado = 0;
  let waitingToDispatch = 0;
  orders.forEach((o) => {
    soldAmount += o.total_price;
    if (o.status === 'COMPLETADO') recaudado += o.total_price;
    if (o.status === 'ESPERA_CIERRE_BIN') waitingToDispatch += o.total_price;
  });
  return { soldAmount, recaudado, waitingToDispatch };
}

function orderItemTemplate(order, isSoldView) {
  const next = NEXT_STATE[order.status];
  const canMove = Boolean(next);
  return `
    <div class="order-item">
      <div><strong>${order.customer?.name || 'Cliente'}</strong><div>${order.kg} kg · ${money(order.total_price)}</div></div>
      <div><span class="order-status ${order.status}">${ORDER_LABELS[order.status]}</span><div>${order.customer?.phone || 'Sin teléfono'} · ${order.customer?.email || ''}</div></div>
      <div class="order-actions">
        ${canMove ? `<button class="btn tiny warn order-next" data-order-id="${order.id}" data-next="${next}">Pasar a: ${ORDER_LABELS[next]}</button>` : ''}
        ${order.status !== 'CANCELADO' && order.status !== 'COMPLETADO' ? `<button class="btn tiny secondary order-cancel" data-order-id="${order.id}">Cancelar</button>` : ''}
        ${isSoldView ? '<span class="hint">Bin cerrado</span>' : ''}
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
        <div>${isSoldView ? '<span class="hint">Producto recaudado (sin edición)</span>' : `<button class="btn secondary edit-bin" data-id="${bin.id}">Editar</button>`}</div>
      </div>
      <div class="progress-wrap"><div class="progress-mem" style="--sold:${pct}%"><div class="progress-sold"></div><div class="progress-available"></div></div></div>
      <div class="bin-summary-grid">
        <div class="summary-chip"><span>Disponible</span><strong>${available} kg</strong></div>
        <div class="summary-chip"><span>Vendido</span><strong>${bin.sold_kg} kg</strong></div>
        <div class="summary-chip"><span>Recaudado</span><strong>${money(summary.recaudado)}</strong></div>
        <div class="summary-chip"><span>Espera despacho</span><strong>${money(summary.waitingToDispatch)}</strong></div>
      </div>
      ${bin.notes ? `<div class="bin-notes">${bin.notes}</div>` : ''}
      <div class="order-list"><strong>Pedidos (${orders.length}):</strong>${orders.length === 0 ? '<p>Sin pedidos.</p>' : orders.map((order) => orderItemTemplate(order, isSoldView)).join('')}</div>
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
          ${NEXT_STATE[o.status] ? `<button class="btn tiny warn order-next" data-order-id="${o.id}" data-next="${NEXT_STATE[o.status]}">Pasar a: ${ORDER_LABELS[NEXT_STATE[o.status]]}</button>` : ''}
          ${o.status !== 'CANCELADO' && o.status !== 'COMPLETADO' ? `<button class="btn tiny secondary order-cancel" data-order-id="${o.id}">Cancelar</button>` : ''}
        </div>
      </div>
    </article>
  `).join('') : '<p class="hint">Sin pedidos detalle aún.</p>';
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
    <article class="kpi-card"><p>Bins activos</p><strong>${bins.filter((b) => b.status === 'OPEN').length}</strong></article>
    <article class="kpi-card"><p>Bins recaudados</p><strong>${bins.filter((b) => b.status === 'SOLD_OUT').length}</strong></article>
    <article class="kpi-card"><p>Pedidos colaborativos</p><strong>${crowdOrders}</strong></article>
    <article class="kpi-card"><p>Pedidos detalle</p><strong>${detailOrders}</strong></article>
  `;

  const soldPct = totalCapacity ? Math.round((totalSoldKg / totalCapacity) * 100) : 0;
  const waitingPct = statusAmounts.ESPERA_CIERRE_BIN ? Math.min(100, Math.round((statusAmounts.ESPERA_CIERRE_BIN / Math.max(1, Object.values(statusAmounts).reduce((a, b) => a + b, 0))) * 100)) : 0;
  el.kgChart.style.setProperty('--part1', `${soldPct}%`);
  el.kgChart.style.setProperty('--part2', `${waitingPct}%`);
  el.kgChart.innerHTML = '<div></div><div></div><div></div>';
  el.kgLegend.innerHTML = `<span>Vendido: <strong>${totalSoldKg} kg (${soldPct}%)</strong></span><span>Disponible: <strong>${totalAvailable} kg</strong></span><span>Pagado sin despacho: <strong>${money(statusAmounts.ESPERA_CIERRE_BIN || 0)}</strong></span>`;

  const maxAmount = Math.max(1, ...ORDER_STATES.map((state) => statusAmounts[state] || 0));
  el.amountChart.innerHTML = ORDER_STATES.map((state) => {
    const value = statusAmounts[state] || 0;
    const w = Math.round((value / maxAmount) * 100);
    return `<div class="bar-row"><span>${ORDER_LABELS[state]}</span><div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div><strong>${money(value)}</strong></div>`;
  }).join('');
}

function bindAdminActions() {
  document.querySelectorAll('.edit-bin').forEach((btn) => btn.addEventListener('click', () => { const bin = api.getBin(btn.dataset.id); if (bin) { fillAdminForm(bin); switchAdminView('venta'); } }));
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
  el.adminBinsOpen.innerHTML = selling.length ? selling.map((bin) => renderAdminBinCard(bin, false)).join('') : '<p class="hint">No hay bins en venta.</p>';
  el.adminBinsSold.innerHTML = recaudados.length ? recaudados.map((bin) => renderAdminBinCard(bin, true)).join('') : '<p class="hint">No hay bins recaudados todavía.</p>';
  renderDetailOrdersAdmin();
  renderKpisAndCharts();
  bindAdminActions();
}

function switchAdminView(view) {
  el.mainTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
  Object.entries(el.adminViews).forEach(([key, node]) => node.classList.toggle('hidden', key !== view));
}

function syncAdminView() {
  const isAdmin = api.isAdmin();
  el.adminLoginSection.classList.toggle('hidden', isAdmin);
  el.adminPanelSection.classList.toggle('hidden', !isAdmin);
  if (isAdmin) { renderAdminBins(); switchAdminView('resumen'); }
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
  const kg = Number(el.orderKg.value || 0);
  const safeKg = Math.min(Math.max(kg, CROWD_MIN_KG), available);
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
    showPurchaseAlert(`Pedido colaborativo registrado: ${order.kg} kg de ${bin.product_name} por ${money(order.total_price)}.`);
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

el.chooseDetail.addEventListener('click', () => setMode('detail'));
el.chooseCrowd.addEventListener('click', () => setMode('crowd'));
el.modeTabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));

el.openAdmin.addEventListener('click', () => { syncAdminView(); el.adminModal.showModal(); });
el.closeOrder.addEventListener('click', closeOrderFlow);
el.cancelOrderAction.addEventListener('click', closeOrderFlow);
el.closeDetailOrder.addEventListener('click', closeDetailOrderFlow);
el.cancelDetailOrderAction.addEventListener('click', closeDetailOrderFlow);
el.closeAdmin.addEventListener('click', () => el.adminModal.close());
el.purchaseAlertClose.addEventListener('click', hidePurchaseAlert);
el.purchaseAlert.addEventListener('click', (event) => { if (event.target === el.purchaseAlert) hidePurchaseAlert(); });

el.adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try { api.login(el.adminEmail.value.trim(), el.adminPassword.value.trim()); syncAdminView(); toast('Login de administrador exitoso.'); }
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
      image_url: el.binImage.value.trim(),
      status: el.binStatus.value
    };
    if (el.binId.value) { api.updateBin(el.binId.value, payload); toast('Bin actualizado correctamente.'); }
    else { api.createBin(payload); toast('Bin creado correctamente.'); }
    clearAdminForm();
    renderAll();
  } catch (error) { toast(error.message, true); }
});

el.clearBinForm.addEventListener('click', clearAdminForm);
el.mainTabs.forEach((tab) => tab.addEventListener('click', () => switchAdminView(tab.dataset.view)));

initTheme();
initMode();
renderAll();
