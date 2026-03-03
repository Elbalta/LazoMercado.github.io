const STORAGE_KEY = 'crowdbuying-db-v5';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';
const MODE_KEY = 'crowdbuying-mode';

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

const REALIZED_STATES = new Set(['ENTREGADO', 'COMPLETADO']);
const ACTIVE_STATES = new Set(['PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'ESPERA_CIERRE_BIN', 'EN_TRANSITO']);

const el = {
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
    nuevo: document.getElementById('admin-view-nuevo'),
    seguimiento: document.getElementById('admin-view-seguimiento'),
    recaudado: document.getElementById('admin-view-recaudado'),
    detalle: document.getElementById('admin-view-detalle'),
    completadas: document.getElementById('admin-view-completadas'),
    crm: document.getElementById('admin-view-crm')
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
  adminDetailPendingOrders: document.getElementById('admin-detail-pending-orders'),
  adminDetailCompletedOrders: document.getElementById('admin-detail-completed-orders'),
  detailStatusChart: document.getElementById('detail-status-chart'),
  completedSummary: document.getElementById('completed-summary'),
  completedChannelChart: document.getElementById('completed-channel-chart'),
  completedProductChart: document.getElementById('completed-product-chart'),
  completedSalesList: document.getElementById('completed-sales-list'),
  crmKpis: document.getElementById('crm-kpis'),
  crmFunnel: document.getElementById('crm-funnel'),
  crmNextActions: document.getElementById('crm-next-actions'),
  crmList: document.getElementById('crm-list'),

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
let currentAdminView = 'resumen';

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
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[2].id, kg: 280, unit_price: 1290, total_price: 361200, status: 'ENTREGADO', created_at: now },
    { id: uid(), channel: 'DETALLE', bin_id: null, detail_product_id: detailProducts[0].id, customer_id: users[1].id, kg: 12, unit_price: 1490, total_price: 17880, status: 'PENDIENTE_PAGO', created_at: now }
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
    const STORAGE_KEY = 'crowdbuying-db-v5';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';
const MODE_KEY = 'crowdbuying-mode';

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

const REALIZED_STATES = new Set(['ENTREGADO', 'COMPLETADO']);
const ACTIVE_STATES = new Set(['PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'ESPERA_CIERRE_BIN', 'EN_TRANSITO']);

const el = {
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
    nuevo: document.getElementById('admin-view-nuevo'),
    seguimiento: document.getElementById('admin-view-seguimiento'),
    recaudado: document.getElementById('admin-view-recaudado'),
    detalle: document.getElementById('admin-view-detalle'),
    completadas: document.getElementById('admin-view-completadas'),
    crm: document.getElementById('admin-view-crm')
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
  adminDetailPendingOrders: document.getElementById('admin-detail-pending-orders'),
  adminDetailCompletedOrders: document.getElementById('admin-detail-completed-orders'),
  detailStatusChart: document.getElementById('detail-status-chart'),
  completedSummary: document.getElementById('completed-summary'),
  completedChannelChart: document.getElementById('completed-channel-chart'),
  completedProductChart: document.getElementById('completed-product-chart'),
  completedSalesList: document.getElementById('completed-sales-list'),
  crmKpis: document.getElementById('crm-kpis'),
  crmFunnel: document.getElementById('crm-funnel'),
  crmNextActions: document.getElementById('crm-next-actions'),
  crmList: document.getElementById('crm-list'),

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
let currentAdminView = 'resumen';

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
    { id: uid(), channel: 'CROWDBUYING', bin_id: naranjaId, detail_product_id: null, customer_id: users[2].id, kg: 280, unit_price: 1290, total_price: 361200, status: 'ENTREGADO', created_at: now },
    { id: uid(), channel: 'DETALLE', bin_id: null, detail_product_id: detailProducts[0].id, customer_id: users[1].id, kg: 12, unit_price: 1490, total_price: 17880, status: 'PENDIENTE_PAGO', created_at: now }
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
