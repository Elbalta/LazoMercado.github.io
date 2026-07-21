const db = window.lazoSupabase;

const ORDER_STATES = [
  'PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'ESPERA_CIERRE_BIN',
  'PENDIENTE_ENVIO', 'EN_TRANSITO', 'ENTREGADO', 'COMPLETADO', 'CANCELADO'
];

const ORDER_LABELS = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_CONFIRMADO: 'Pago confirmado',
  ESPERA_CIERRE_BIN: 'Esperando cierre mayorista',
  PENDIENTE_ENVIO: 'Pendiente de envío',
  EN_TRANSITO: 'En tránsito',
  ENTREGADO: 'Entregado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

const NEXT_DETAIL = {
  PENDIENTE_PAGO: 'PAGO_CONFIRMADO',
  PAGO_CONFIRMADO: 'EN_TRANSITO',
  ESPERA_CIERRE_BIN: 'EN_TRANSITO',
  PENDIENTE_ENVIO: 'EN_TRANSITO',
  EN_TRANSITO: 'ENTREGADO',
  ENTREGADO: 'COMPLETADO',
  CANCELADO: 'PENDIENTE_PAGO'
};

const q = (id) => document.getElementById(id);
const el = {
  header: document.querySelector('.header'),
  entryGate: q('entry-gate'), chooseDetail: q('choose-detail'), chooseCrowd: q('choose-crowd'),
  modeTabsWrap: q('mode-tabs'), modeTabs: [...document.querySelectorAll('.mode-tab')],
  detailView: q('detail-view'), crowdView: q('crowd-view'), trackingView: q('tracking-view'),
  detailProducts: q('detail-products'), binsList: q('bins-list'),
  trackingForm: q('tracking-form'), trackingPhone: q('tracking-phone'),
  trackingResults: q('tracking-results'), trackingClear: q('tracking-clear'),
  summaryPanel: q('summary-panel'), summaryProduct: q('summary-product'), summaryKg: q('summary-kg'),
  summaryUnit: q('summary-unit'), summaryTotal: q('summary-total'),
  orderModal: q('order-modal'), orderForm: q('order-form'), orderBinId: q('order-bin-id'),
  orderKg: q('order-kg'), orderKgLabelText: q('order-kg-label-text'), orderTotal: q('order-total'),
  orderStockHelp: q('order-stock-help'), customerName: q('customer-name'),
  customerEmail: q('customer-email'), customerPhone: q('customer-phone'),
  closeOrder: q('close-order'), cancelOrderAction: q('cancel-order-action'),
  detailOrderModal: q('detail-order-modal'), detailOrderForm: q('detail-order-form'),
  detailProductId: q('detail-product-id'), detailOrderKg: q('detail-order-kg'),
  detailOrderTotal: q('detail-order-total'), detailStockHelp: q('detail-stock-help'),
  detailCustomerName: q('detail-customer-name'), detailCustomerEmail: q('detail-customer-email'),
  detailCustomerPhone: q('detail-customer-phone'), closeDetailOrder: q('close-detail-order'),
  cancelDetailOrderAction: q('cancel-detail-order-action'),
  purchaseAlert: q('purchase-alert'), purchaseAlertText: q('purchase-alert-text'),
  purchaseAlertClose: q('purchase-alert-close'), toast: q('toast'),
  openAdminLink: q('open-admin-link'), adminModal: q('admin-modal'), closeAdmin: q('close-admin'),
  adminLoginSection: q('admin-login-section'), adminPanelSection: q('admin-panel-section'),
  adminLoginForm: q('admin-login-form'), adminEmail: q('admin-email'),
  adminPassword: q('admin-password'), adminLogout: q('admin-logout'),
  mainTabs: [...document.querySelectorAll('.main-tab')],
  adminViews: {
    resumen: q('admin-view-resumen'), crear: q('admin-view-crear'),
    'seguimiento-mayorista': q('admin-view-seguimiento-mayorista'),
    'seguimiento-detalle': q('admin-view-seguimiento-detalle'),
    terminadas: q('admin-view-terminadas'), financiero: q('admin-view-financiero')
  },
  binForm: q('bin-form'), binId: q('bin-id'), binProduct: q('bin-product'),
  binVariety: q('bin-variety'), binPrice: q('bin-price'), binCapacity: q('bin-capacity'),
  binMinKg: q('bin-min-kg'), binImage: q('bin-image'), binStatus: q('bin-status'),
  binNotes: q('bin-notes'), clearBinForm: q('clear-bin-form'),
  detailProductForm: q('detail-product-form'), detailAdminId: q('detail-admin-id'),
  detailAdminName: q('detail-admin-name'), detailAdminPrice: q('detail-admin-price'),
  detailAdminStock: q('detail-admin-stock'), detailAdminImage: q('detail-admin-image'),
  clearDetailForm: q('clear-detail-form'), adminDetailProducts: q('admin-detail-products'),
  adminBinsOpen: q('admin-bins-open'), adminBinsSold: q('admin-bins-sold'),
  adminDetailOrders: q('admin-detail-orders'), kpiGrid: q('kpi-grid'),
  kgChart: q('kg-chart'), kgLegend: q('kg-legend'), amountChart: q('amount-chart'),
  completedSummary: q('completed-summary'), completedChannelChart: q('completed-channel-chart'),
  completedProductChart: q('completed-product-chart'), completedSalesList: q('completed-sales-list'),
  financialKpis: q('financial-kpis'), financialChannelChart: q('financial-channel-chart'),
  financialStatusChart: q('financial-status-chart'), financialList: q('financial-list')
};

const state = { products: [], orders: [], customers: [], isAdmin: false, mode: null };
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const money = (value) => CLP.format(Number(value || 0));
const number = (value) => new Intl.NumberFormat('es-CL').format(Number(value || 0));
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));
const safeImage = (value = '') => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
};

function toast(message, error = false) {
  el.toast.textContent = message;
  el.toast.className = `toast show ${error ? 'error' : 'success'}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.toast.className = 'toast'; }, 3600);
}

function errorMessage(error) {
  return error?.message || error?.details || 'Ocurrió un error inesperado.';
}

function setBusy(form, busy) {
  form.querySelectorAll('button, input, select, textarea').forEach((control) => {
    control.disabled = busy;
  });
}

async function loadProducts() {
  const { data, error } = await db.from('lazo_products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  state.products = data || [];
  renderProducts();
}

function productById(id) { return state.products.find((product) => product.id === id); }

function productCard(product) {
  const isDetail = product.channel === 'DETALLE';
  const available = isDetail ? Number(product.stock_kg) : Math.max(0, Number(product.capacity_kg) - Number(product.sold_kg));
  const soldPct = isDetail ? 0 : Math.min(100, Math.round((Number(product.sold_kg) / Number(product.capacity_kg)) * 100));
  const disabled = product.status !== 'OPEN' || available <= 0;
  const image = safeImage(product.image_url);
  return `
    <article class="bin-card">
      ${image ? `<img class="bin-image" src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy">` : ''}
      <div class="bin-body">
        <span class="bin-status ${escapeHTML(product.status)}">${escapeHTML(product.status)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        ${product.variety ? `<p class="bin-meta">${escapeHTML(product.variety)}</p>` : ''}
        ${product.notes ? `<p class="bin-notes">${escapeHTML(product.notes)}</p>` : ''}
        <strong>${money(product.price_per_kg)} / kg</strong>
        ${isDetail ? `<p class="bin-meta">Stock: ${number(available)} kg</p>` : `
          <div class="progress-wrap"><div class="progress-mem" style="--sold:${soldPct}%"><div class="progress-sold"></div><div class="progress-available"></div></div>
          <p class="bin-meta">${number(product.sold_kg)} de ${number(product.capacity_kg)} kg vendidos · mínimo ${number(product.min_order_kg)} kg</p></div>`}
        <button class="btn" type="button" data-action="${isDetail ? 'order-detail' : 'order-crowd'}" data-id="${product.id}" ${disabled ? 'disabled' : ''}>
          ${disabled ? 'Sin disponibilidad' : 'Solicitar pedido'}
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  const detail = state.products.filter((p) => p.channel === 'DETALLE');
  const crowd = state.products.filter((p) => p.channel === 'CROWDBUYING');
  el.detailProducts.innerHTML = detail.length ? detail.map(productCard).join('') : '<p class="hint">No hay productos al detalle disponibles.</p>';
  el.binsList.innerHTML = crowd.length ? crowd.map(productCard).join('') : '<p class="hint">No hay compras mayoristas disponibles.</p>';
}

function setMode(mode) {
  state.mode = mode;
  el.entryGate.classList.add('hidden');
  el.modeTabsWrap.classList.remove('hidden');
  el.detailView.classList.toggle('hidden', mode !== 'detail');
  el.crowdView.classList.toggle('hidden', mode !== 'crowd');
  el.trackingView.classList.toggle('hidden', mode !== 'tracking');
  el.modeTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.mode === mode));
}

function updateOrderPreview(product, kg, target) {
  const quantity = Number(kg || 0);
  target.textContent = `Total: ${money(quantity * Number(product?.price_per_kg || 0))}`;
  el.summaryProduct.textContent = product?.name || '—';
  el.summaryKg.textContent = number(quantity);
  el.summaryUnit.textContent = money(product?.price_per_kg || 0);
  el.summaryTotal.textContent = money(quantity * Number(product?.price_per_kg || 0));
}

function openCrowdOrder(id) {
  const product = productById(id);
  if (!product) return toast('Producto no encontrado.', true);
  const available = Math.max(0, Number(product.capacity_kg) - Number(product.sold_kg));
  el.orderBinId.value = id;
  el.orderKg.min = product.min_order_kg;
  el.orderKg.max = available;
  el.orderKg.value = product.min_order_kg;
  el.orderKgLabelText.textContent = `Kilos a comprar (mínimo ${number(product.min_order_kg)})`;
  el.orderStockHelp.textContent = `Disponibles: ${number(available)} kg.`;
  updateOrderPreview(product, el.orderKg.value, el.orderTotal);
  el.summaryPanel.classList.remove('hidden');
  el.orderModal.showModal();
}

function openDetailOrder(id) {
  const product = productById(id);
  if (!product) return toast('Producto no encontrado.', true);
  el.detailProductId.value = id;
  el.detailOrderKg.max = product.stock_kg;
  el.detailOrderKg.value = 1;
  el.detailStockHelp.textContent = `Disponibles: ${number(product.stock_kg)} kg.`;
  updateOrderPreview(product, 1, el.detailOrderTotal);
  el.summaryPanel.classList.remove('hidden');
  el.detailOrderModal.showModal();
}

function closeOrderDialogs() {
  if (el.orderModal.open) el.orderModal.close();
  if (el.detailOrderModal.open) el.detailOrderModal.close();
  el.summaryPanel.classList.add('hidden');
}

async function placeOrder(productId, customer, kg, form) {
  setBusy(form, true);
  try {
    const { data, error } = await db.rpc('lazo_place_order', {
      p_product_id: productId,
      p_name: customer.name,
      p_email: customer.email,
      p_phone: customer.phone,
      p_kg: Number(kg)
    });
    if (error) throw error;
    closeOrderDialogs();
    form.reset();
    el.purchaseAlertText.textContent = `Pedido ${String(data.id).slice(0, 8)} registrado por ${number(data.kg)} kg de ${data.product_name}. Total: ${money(data.total_price)}.`;
    el.purchaseAlert.classList.remove('hidden');
    await loadProducts();
  } catch (error) {
    toast(errorMessage(error), true);
  } finally {
    setBusy(form, false);
  }
}

async function trackOrders(event) {
  event.preventDefault();
  setBusy(el.trackingForm, true);
  try {
    const { data, error } = await db.rpc('lazo_orders_by_phone', { p_phone: el.trackingPhone.value });
    if (error) throw error;
    el.trackingResults.innerHTML = data?.length ? data.map((order) => `
      <article class="tracking-card"><div class="tracking-head"><div><strong>${escapeHTML(order.product_name)}</strong><p class="bin-meta">Pedido ${escapeHTML(String(order.id).slice(0, 8))} · ${new Date(order.created_at).toLocaleString('es-CL')}</p></div><span class="channel-badge">${order.channel === 'DETALLE' ? 'Detalle' : 'Mayorista'}</span></div>
      <p>${number(order.kg)} kg · ${money(order.total_price)}</p><span class="order-status ${escapeHTML(order.status)}">${escapeHTML(ORDER_LABELS[order.status] || order.status)}</span></article>`).join('')
      : '<p class="hint">No encontramos pedidos con ese teléfono.</p>';
  } catch (error) {
    el.trackingResults.innerHTML = `<p class="hint">${escapeHTML(errorMessage(error))}</p>`;
  } finally {
    setBusy(el.trackingForm, false);
  }
}

async function isCurrentUserAdmin() {
  const { data: sessionData } = await db.auth.getSession();
  if (!sessionData.session) return false;
  const { data, error } = await db.rpc('lazo_is_admin');
  if (error) throw error;
  return data === true;
}

async function syncAdmin() {
  try { state.isAdmin = await isCurrentUserAdmin(); }
  catch { state.isAdmin = false; }
  el.adminLoginSection.classList.toggle('hidden', state.isAdmin);
  el.adminPanelSection.classList.toggle('hidden', !state.isAdmin);
  if (state.isAdmin) await loadAdminData();
}

async function loginAdmin(event) {
  event.preventDefault();
  setBusy(el.adminLoginForm, true);
  try {
    const { error } = await db.auth.signInWithPassword({ email: el.adminEmail.value.trim(), password: el.adminPassword.value });
    if (error) throw error;
    if (!(await isCurrentUserAdmin())) {
      await db.auth.signOut();
      throw new Error('La cuenta no tiene permisos de administrador.');
    }
    el.adminLoginForm.reset();
    await syncAdmin();
    toast('Sesión administrativa iniciada.');
  } catch (error) { toast(errorMessage(error), true); }
  finally { setBusy(el.adminLoginForm, false); }
}

async function loadAdminData() {
  const [productsResult, ordersResult, customersResult] = await Promise.all([
    db.from('lazo_products').select('*').order('created_at', { ascending: false }),
    db.from('lazo_orders').select('*, product:lazo_products(*), customer:lazo_customers(*)').order('created_at', { ascending: false }),
    db.from('lazo_customers').select('*').order('created_at', { ascending: false })
  ]);
  const failed = [productsResult, ordersResult, customersResult].find((result) => result.error);
  if (failed) throw failed.error;
  state.products = productsResult.data || [];
  state.orders = ordersResult.data || [];
  state.customers = customersResult.data || [];
  renderProducts();
  renderAdmin();
}

function orderActions(order) {
  if (order.status === 'COMPLETADO') return '';
  const product = order.product || productById(order.product_id);
  let next = NEXT_DETAIL[order.status];
  if (order.channel === 'CROWDBUYING' && order.status === 'PAGO_CONFIRMADO') next = product?.status === 'SOLD_OUT' ? 'PENDIENTE_ENVIO' : 'ESPERA_CIERRE_BIN';
  if (order.channel === 'CROWDBUYING' && order.status === 'ESPERA_CIERRE_BIN') next = product?.status === 'SOLD_OUT' ? 'PENDIENTE_ENVIO' : null;
  return `<div class="order-actions">${next ? `<button class="btn tiny" type="button" data-action="order-status" data-id="${order.id}" data-status="${next}">Avanzar</button>` : ''}${order.status !== 'CANCELADO' ? `<button class="btn tiny warn" type="button" data-action="order-status" data-id="${order.id}" data-status="CANCELADO">Cancelar</button>` : ''}</div>`;
}

function orderAdminCard(order) {
  return `<article class="admin-bin"><div class="admin-row"><div><strong>${escapeHTML(order.product?.name || 'Producto')}</strong><p class="bin-meta">${escapeHTML(order.customer?.name || '')} · ${escapeHTML(order.customer?.phone || '')} · ${number(order.kg)} kg · ${money(order.total_price)}</p></div><span class="order-status ${escapeHTML(order.status)}">${escapeHTML(ORDER_LABELS[order.status] || order.status)}</span></div>${orderActions(order)}</article>`;
}

function productAdminCard(product) {
  const stockText = product.channel === 'DETALLE' ? `Stock: ${number(product.stock_kg)} kg` : `Vendido: ${number(product.sold_kg)} / ${number(product.capacity_kg)} kg`;
  return `<article class="admin-bin"><div class="admin-row"><div><strong>${escapeHTML(product.name)}</strong><p class="bin-meta">${stockText} · ${money(product.price_per_kg)}/kg</p></div><span class="bin-status ${escapeHTML(product.status)}">${escapeHTML(product.status)}</span></div><div class="order-actions"><button class="btn tiny secondary" type="button" data-action="edit-product" data-id="${product.id}">Editar</button><button class="btn tiny warn" type="button" data-action="delete-product" data-id="${product.id}">Eliminar</button></div></article>`;
}

function barRows(values) {
  const max = Math.max(1, ...values.map((item) => Number(item.value || 0)));
  return values.map((item) => `<div class="bar-row"><span>${escapeHTML(item.label)}</span><div class="bar-track"><div class="bar-fill" style="--w:${Math.round((Number(item.value || 0) / max) * 100)}%"></div></div><strong>${item.money ? money(item.value) : number(item.value)}</strong></div>`).join('');
}

function renderAdmin() {
  const wholesale = state.products.filter((p) => p.channel === 'CROWDBUYING');
  const detail = state.products.filter((p) => p.channel === 'DETALLE');
  const wholesaleOrders = state.orders.filter((o) => o.channel === 'CROWDBUYING');
  const detailOrders = state.orders.filter((o) => o.channel === 'DETALLE');
  el.adminBinsOpen.innerHTML = wholesale.filter((p) => p.status !== 'SOLD_OUT').map(productAdminCard).join('') || '<p class="hint">Sin productos mayoristas activos.</p>';
  el.adminBinsSold.innerHTML = wholesale.filter((p) => p.status === 'SOLD_OUT').map(productAdminCard).join('') || '<p class="hint">Sin productos mayoristas agotados.</p>';
  el.adminDetailProducts.innerHTML = detail.map(productAdminCard).join('') || '<p class="hint">Sin productos al detalle.</p>';
  el.adminDetailOrders.innerHTML = detailOrders.map(orderAdminCard).join('') || '<p class="hint">Sin pedidos al detalle.</p>';

  const totalKg = state.orders.reduce((sum, order) => sum + Number(order.kg), 0);
  const totalAmount = state.orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  el.kpiGrid.innerHTML = `<article class="kpi-card"><p>Productos</p><strong>${state.products.length}</strong></article><article class="kpi-card"><p>Clientes</p><strong>${state.customers.length}</strong></article><article class="kpi-card"><p>Pedidos</p><strong>${state.orders.length}</strong></article><article class="kpi-card"><p>Monto registrado</p><strong>${money(totalAmount)}</strong></article>`;
  const wholesaleCapacity = wholesale.reduce((sum, p) => sum + Number(p.capacity_kg), 0);
  const wholesaleSold = wholesale.reduce((sum, p) => sum + Number(p.sold_kg), 0);
  const pct = wholesaleCapacity ? Math.round((wholesaleSold / wholesaleCapacity) * 100) : 0;
  el.kgChart.style.setProperty('--part1', `${pct}%`); el.kgChart.style.setProperty('--part2', '0%');
  el.kgChart.innerHTML = '<div></div><div></div><div></div>';
  el.kgLegend.innerHTML = `<span>Mayorista vendido: <strong>${number(wholesaleSold)} kg (${pct}%)</strong></span><span>Total solicitado: <strong>${number(totalKg)} kg</strong></span>`;
  el.amountChart.innerHTML = barRows(ORDER_STATES.map((status) => ({ label: ORDER_LABELS[status], value: state.orders.filter((o) => o.status === status).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })));

  const completed = state.orders.filter((o) => o.status === 'COMPLETADO');
  const completedAmount = completed.reduce((sum, o) => sum + Number(o.total_price), 0);
  el.completedSummary.innerHTML = `<article class="kpi-card"><p>Ventas completadas</p><strong>${completed.length}</strong></article><article class="kpi-card"><p>Monto completado</p><strong>${money(completedAmount)}</strong></article>`;
  el.completedChannelChart.innerHTML = barRows(['CROWDBUYING', 'DETALLE'].map((channel) => ({ label: channel === 'DETALLE' ? 'Detalle' : 'Mayorista', value: completed.filter((o) => o.channel === channel).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })));
  const byProduct = completed.reduce((map, order) => { const name = order.product?.name || 'Producto'; map[name] = (map[name] || 0) + Number(order.kg); return map; }, {});
  el.completedProductChart.innerHTML = barRows(Object.entries(byProduct).map(([label, value]) => ({ label, value })));
  el.completedSalesList.innerHTML = completed.map(orderAdminCard).join('') || '<p class="hint">Sin ventas completadas.</p>';

  const active = state.orders.filter((o) => !['COMPLETADO', 'CANCELADO'].includes(o.status)).reduce((sum, o) => sum + Number(o.total_price), 0);
  const cancelled = state.orders.filter((o) => o.status === 'CANCELADO').reduce((sum, o) => sum + Number(o.total_price), 0);
  el.financialKpis.innerHTML = `<article class="kpi-card"><p>Total registrado</p><strong>${money(totalAmount)}</strong></article><article class="kpi-card"><p>Completado</p><strong>${money(completedAmount)}</strong></article><article class="kpi-card"><p>En proceso</p><strong>${money(active)}</strong></article><article class="kpi-card"><p>Cancelado</p><strong>${money(cancelled)}</strong></article>`;
  el.financialChannelChart.innerHTML = barRows(['CROWDBUYING', 'DETALLE'].map((channel) => ({ label: channel === 'DETALLE' ? 'Detalle' : 'Mayorista', value: state.orders.filter((o) => o.channel === channel).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })));
  el.financialStatusChart.innerHTML = el.amountChart.innerHTML;
  el.financialList.innerHTML = state.orders.map(orderAdminCard).join('') || '<p class="hint">Sin movimientos.</p>';

  const hiddenWholesaleOrders = wholesaleOrders.length ? '' : '<p class="hint">Todavía no hay pedidos mayoristas.</p>';
  el.adminBinsOpen.insertAdjacentHTML('beforeend', `<div class="admin-divider"><span>Pedidos mayoristas</span></div>${hiddenWholesaleOrders}${wholesaleOrders.map(orderAdminCard).join('')}`);
}

function switchAdminView(view) {
  Object.entries(el.adminViews).forEach(([name, section]) => section.classList.toggle('hidden', name !== view));
  el.mainTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
}

function clearBinForm() { el.binForm.reset(); el.binId.value = ''; el.binCapacity.value = 500; el.binMinKg.value = 50; }
function clearDetailForm() { el.detailProductForm.reset(); el.detailAdminId.value = ''; }

async function saveWholesale(event) {
  event.preventDefault(); setBusy(el.binForm, true);
  const payload = { channel: 'CROWDBUYING', name: el.binProduct.value.trim(), variety: el.binVariety.value.trim(), notes: el.binNotes.value.trim(), price_per_kg: Number(el.binPrice.value), capacity_kg: Number(el.binCapacity.value), min_order_kg: Number(el.binMinKg.value), stock_kg: null, status: el.binStatus.value, image_url: el.binImage.value.trim() };
  try {
    const query = el.binId.value ? db.from('lazo_products').update(payload).eq('id', el.binId.value) : db.from('lazo_products').insert(payload);
    const { error } = await query; if (error) throw error;
    clearBinForm(); await loadAdminData(); toast('Producto mayorista guardado.');
  } catch (error) { toast(errorMessage(error), true); } finally { setBusy(el.binForm, false); }
}

async function saveDetail(event) {
  event.preventDefault(); setBusy(el.detailProductForm, true);
  const payload = { channel: 'DETALLE', name: el.detailAdminName.value.trim(), variety: '', notes: '', price_per_kg: Number(el.detailAdminPrice.value), capacity_kg: null, min_order_kg: 1, stock_kg: Number(el.detailAdminStock.value), sold_kg: 0, status: Number(el.detailAdminStock.value) > 0 ? 'OPEN' : 'SOLD_OUT', image_url: el.detailAdminImage.value.trim() };
  try {
    if (el.detailAdminId.value) delete payload.sold_kg;
    const query = el.detailAdminId.value ? db.from('lazo_products').update(payload).eq('id', el.detailAdminId.value) : db.from('lazo_products').insert(payload);
    const { error } = await query; if (error) throw error;
    clearDetailForm(); await loadAdminData(); toast('Producto al detalle guardado.');
  } catch (error) { toast(errorMessage(error), true); } finally { setBusy(el.detailProductForm, false); }
}

function editProduct(id) {
  const product = productById(id); if (!product) return;
  switchAdminView('crear');
  if (product.channel === 'CROWDBUYING') {
    el.binId.value = product.id; el.binProduct.value = product.name; el.binVariety.value = product.variety;
    el.binNotes.value = product.notes; el.binPrice.value = product.price_per_kg; el.binCapacity.value = product.capacity_kg;
    el.binMinKg.value = product.min_order_kg; el.binImage.value = product.image_url; el.binStatus.value = product.status;
  } else {
    el.detailAdminId.value = product.id; el.detailAdminName.value = product.name;
    el.detailAdminPrice.value = product.price_per_kg; el.detailAdminStock.value = product.stock_kg; el.detailAdminImage.value = product.image_url;
  }
}

async function deleteProduct(id) {
  if (!window.confirm('¿Eliminar este producto? Solo es posible si no tiene pedidos asociados.')) return;
  const { error } = await db.from('lazo_products').delete().eq('id', id);
  if (error) return toast(errorMessage(error), true);
  await loadAdminData(); toast('Producto eliminado.');
}

async function setOrderStatus(id, status) {
  if (!ORDER_STATES.includes(status)) return;
  const { error } = await db.rpc('lazo_set_order_status', { p_order_id: id, p_status: status });
  if (error) return toast(errorMessage(error), true);
  await loadAdminData(); toast('Estado del pedido actualizado.');
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const { action, id, status } = button.dataset;
  if (action === 'order-crowd') openCrowdOrder(id);
  if (action === 'order-detail') openDetailOrder(id);
  if (action === 'edit-product') editProduct(id);
  if (action === 'delete-product') deleteProduct(id);
  if (action === 'order-status') setOrderStatus(id, status);
});

el.chooseDetail.addEventListener('click', () => setMode('detail'));
el.chooseCrowd.addEventListener('click', () => setMode('crowd'));
el.modeTabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
el.orderKg.addEventListener('input', () => updateOrderPreview(productById(el.orderBinId.value), el.orderKg.value, el.orderTotal));
el.detailOrderKg.addEventListener('input', () => updateOrderPreview(productById(el.detailProductId.value), el.detailOrderKg.value, el.detailOrderTotal));
el.orderForm.addEventListener('submit', (event) => { event.preventDefault(); placeOrder(el.orderBinId.value, { name: el.customerName.value.trim(), email: el.customerEmail.value.trim(), phone: el.customerPhone.value.trim() }, el.orderKg.value, el.orderForm); });
el.detailOrderForm.addEventListener('submit', (event) => { event.preventDefault(); placeOrder(el.detailProductId.value, { name: el.detailCustomerName.value.trim(), email: el.detailCustomerEmail.value.trim(), phone: el.detailCustomerPhone.value.trim() }, el.detailOrderKg.value, el.detailOrderForm); });
el.closeOrder.addEventListener('click', closeOrderDialogs); el.cancelOrderAction.addEventListener('click', closeOrderDialogs);
el.closeDetailOrder.addEventListener('click', closeOrderDialogs); el.cancelDetailOrderAction.addEventListener('click', closeOrderDialogs);
el.purchaseAlertClose.addEventListener('click', () => el.purchaseAlert.classList.add('hidden'));
el.trackingForm.addEventListener('submit', trackOrders);
el.trackingClear.addEventListener('click', () => { el.trackingForm.reset(); el.trackingResults.innerHTML = '<p class="hint">Ingresa tu teléfono para consultar tus pedidos.</p>'; });
el.openAdminLink.addEventListener('click', async (event) => { event.preventDefault(); el.adminModal.showModal(); await syncAdmin(); });
el.closeAdmin.addEventListener('click', () => el.adminModal.close());
el.adminLoginForm.addEventListener('submit', loginAdmin);
el.adminLogout.addEventListener('click', async () => { await db.auth.signOut(); state.isAdmin = false; await syncAdmin(); toast('Sesión cerrada.'); });
el.mainTabs.forEach((tab) => tab.addEventListener('click', () => switchAdminView(tab.dataset.view)));
el.binForm.addEventListener('submit', saveWholesale); el.detailProductForm.addEventListener('submit', saveDetail);
el.clearBinForm.addEventListener('click', clearBinForm); el.clearDetailForm.addEventListener('click', clearDetailForm);

async function init() {
  try { await loadProducts(); }
  catch (error) {
    const message = 'No fue posible cargar los productos. Ejecuta supabase/schema.sql en el SQL Editor.';
    el.detailProducts.innerHTML = `<p class="hint">${message}</p>`; el.binsList.innerHTML = `<p class="hint">${message}</p>`;
    toast(errorMessage(error), true);
  }
}

init();
