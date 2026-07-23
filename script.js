const db = window.lazoSupabase;

const ORDER_STATES = [
  'PENDIENTE_CONFIRMACION', 'ESPERANDO_COMPRA_GRUPAL', 'PREPARANDO',
  'LISTO_PARA_ENTREGA', 'EN_TRANSITO', 'ENTREGADO', 'COMPLETADO', 'CANCELADO'
];

const ORDER_LABELS = {
  PENDIENTE_CONFIRMACION: 'Pendiente de confirmación',
  ESPERANDO_COMPRA_GRUPAL: 'Esperando compra grupal',
  PREPARANDO: 'Preparando pedido',
  LISTO_PARA_ENTREGA: 'Listo para entrega',
  EN_TRANSITO: 'En tránsito',
  ENTREGADO: 'Entregado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

const PRODUCT_STATUS_LABELS = {
  OPEN: 'Disponible',
  CLOSED: 'Cerrado',
  SOLD_OUT: 'Agotado'
};

const PAYMENT_LABELS = {
  PENDIENTE: 'Transferencia pendiente',
  COMPROBANTE_ENVIADO: 'Comprobante enviado',
  PENDIENTE_EFECTIVO: 'Efectivo pendiente',
  CONFIRMADO: 'Pago confirmado',
  REEMBOLSO_SOLICITADO: 'Reembolso pendiente',
  REEMBOLSADO: 'Reembolsado',
  CANCELADO: 'Pago cancelado'
};

const PAYMENT_METHOD_LABELS = { transfer: 'Transferencia', cash: 'Efectivo' };
const DELIVERY_METHOD_LABELS = { pickup: 'Retiro', delivery: 'Despacho' };
const DETAIL_WEEKLY_TARGET_KG = 20;

const ADVANCE_LABELS = {
  ESPERANDO_COMPRA_GRUPAL: 'Iniciar preparación',
  PREPARANDO: 'Marcar como listo',
  LISTO_PARA_ENTREGA: 'Despachar o entregar',
  EN_TRANSITO: 'Marcar como entregado',
  ENTREGADO: 'Completar venta'
};

const q = (id) => document.getElementById(id);
const el = {
  header: document.querySelector('.header'), navHome: q('nav-home'),
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
  orderPayment: q('order-payment'), orderPaymentHelp: q('order-payment-help'),
  orderDelivery: q('order-delivery'), orderAddress: q('order-address'), orderAddressLabel: q('order-address-label'),
  closeOrder: q('close-order'), cancelOrderAction: q('cancel-order-action'),
  detailOrderModal: q('detail-order-modal'), detailOrderForm: q('detail-order-form'),
  detailProductId: q('detail-product-id'), detailOrderKg: q('detail-order-kg'),
  detailOrderTotal: q('detail-order-total'), detailStockHelp: q('detail-stock-help'),
  detailCustomerName: q('detail-customer-name'), detailCustomerEmail: q('detail-customer-email'),
  detailCustomerPhone: q('detail-customer-phone'), closeDetailOrder: q('close-detail-order'),
  detailOrderPayment: q('detail-order-payment'), detailOrderPaymentHelp: q('detail-order-payment-help'),
  detailOrderDelivery: q('detail-order-delivery'), detailOrderAddress: q('detail-order-address'),
  detailOrderAddressLabel: q('detail-order-address-label'),
  cancelDetailOrderAction: q('cancel-detail-order-action'),
  purchaseAlert: q('purchase-alert'), purchaseAlertText: q('purchase-alert-text'),
  purchaseAlertClose: q('purchase-alert-close'), toast: q('toast'),
  footerAdminLink: q('footer-admin-link'),
  adminModal: q('admin-modal'), closeAdmin: q('close-admin'),
  adminLoginSection: q('admin-login-section'), adminPanelSection: q('admin-panel-section'),
  adminLoginForm: q('admin-login-form'), adminEmail: q('admin-email'),
  adminPassword: q('admin-password'), adminLogout: q('admin-logout'),
  mainTabs: [...document.querySelectorAll('.main-tab')],
  adminViews: {
    resumen: q('admin-view-resumen'), preparacion: q('admin-view-preparacion'), crear: q('admin-view-crear'),
    'seguimiento-mayorista': q('admin-view-seguimiento-mayorista'),
    'seguimiento-detalle': q('admin-view-seguimiento-detalle'),
    terminadas: q('admin-view-terminadas'), financiero: q('admin-view-financiero')
  },
  binForm: q('bin-form'), binId: q('bin-id'), binProduct: q('bin-product'),
  binVariety: q('bin-variety'), binPrice: q('bin-price'), binSupplierCost: q('bin-supplier-cost'), binCapacity: q('bin-capacity'),
  binMinKg: q('bin-min-kg'), binImageFile: q('bin-image-file'),
  binImagePreview: q('bin-image-preview'), binImageEmpty: q('bin-image-empty'), binStatus: q('bin-status'),
  binNotes: q('bin-notes'), clearBinForm: q('clear-bin-form'),
  detailProductForm: q('detail-product-form'), detailAdminId: q('detail-admin-id'),
  detailAdminName: q('detail-admin-name'), detailAdminPrice: q('detail-admin-price'),
  detailAdminStock: q('detail-admin-stock'), detailAdminImageFile: q('detail-admin-image-file'),
  detailAdminImagePreview: q('detail-admin-image-preview'), detailAdminImageEmpty: q('detail-admin-image-empty'),
  clearDetailForm: q('clear-detail-form'), adminDetailProducts: q('admin-detail-products'),
  adminBinsOpen: q('admin-bins-open'), adminBinsSold: q('admin-bins-sold'),
  adminDetailOrders: q('admin-detail-orders'), kpiGrid: q('kpi-grid'),
  procurementSummary: q('procurement-summary'), procurementList: q('procurement-list'),
  kgChart: q('kg-chart'), kgLegend: q('kg-legend'), amountChart: q('amount-chart'),
  completedSummary: q('completed-summary'), completedChannelChart: q('completed-channel-chart'),
  completedProductChart: q('completed-product-chart'), completedSalesList: q('completed-sales-list'),
  financialKpis: q('financial-kpis'), financialChannelChart: q('financial-channel-chart'),
  financialStatusChart: q('financial-status-chart'), financialList: q('financial-list'),
  adminActionModal: q('admin-action-modal'), adminActionForm: q('admin-action-form'),
  adminActionTitle: q('admin-action-title'), adminActionMessage: q('admin-action-message'),
  adminActionReason: q('admin-action-reason'), confirmAdminAction: q('confirm-admin-action'),
  closeAdminAction: q('close-admin-action'), cancelAdminAction: q('cancel-admin-action')
};

const state = { products: [], rawProducts: [], lots: [], procurement: [], orders: [], customers: [], isAdmin: false, mode: null, pendingAdminAction: null };
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function showImagePreview(image, empty, source = '') {
  const url = safeImage(source);
  image.src = url;
  image.classList.toggle('hidden', !url);
  empty.classList.toggle('hidden', Boolean(url));
}

function previewSelectedImage(input, image, empty) {
  const file = input.files?.[0];
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
    input.value = '';
    toast('La imagen debe ser JPG, PNG o WebP y pesar como máximo 5 MB.', true);
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  image.onload = () => URL.revokeObjectURL(previewUrl);
  image.src = previewUrl;
  image.classList.remove('hidden');
  empty.classList.add('hidden');
}

async function uploadProductImage(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
    throw new Error('La imagen debe ser JPG, PNG o WebP y pesar como máximo 5 MB.');
  }
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await db.storage.from('product-images').upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type
  });
  if (error) throw error;
  const { data } = db.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

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
  const [productsResult, lotsResult] = await Promise.all([
    db.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false }),
    db.from('lots').select('*, product:products(*)').eq('is_published', true).order('created_at', { ascending: false })
  ]);
  if (productsResult.error) throw productsResult.error;
  if (lotsResult.error) throw lotsResult.error;
  const details = (productsResult.data || [])
    .filter((product) => product.season_status === 'available' && product.retail_enabled !== false && !product.archived_at)
    .map((product) => ({
    ...product, id: product.id, product_id: product.id, channel: 'DETALLE',
    price_per_kg: product.detail_price, stock_kg: product.retail_stock_kg,
    status: Number(product.retail_stock_kg) > 0 ? 'OPEN' : 'SOLD_OUT'
  }));
  const wholesale = (lotsResult.data || []).filter((lot) => !lot.archived_at).map((lot) => ({
    ...lot, id: lot.id, lot_id: lot.id, product_id: lot.product_id, channel: 'CROWDBUYING',
    name: lot.product?.name || 'Producto', variety: lot.product?.variety || '',
    notes: lot.product?.description || '', image_url: lot.product?.image_url || '',
    price_per_kg: lot.wholesale_price, supplier_cost_per_kg: Number(lot.supplier_cost_per_kg || 0), capacity_kg: lot.total_capacity_kg,
    min_order_kg: lot.minimum_purchase_kg,
    sold_kg: Number(lot.customer_paid_kg) + Number(lot.market_assumed_kg),
    lot_status: lot.status,
    status: lot.status === 'open' ? 'OPEN' : lot.status === 'full' ? 'SOLD_OUT' : 'CLOSED'
  }));
  state.products = [...wholesale, ...details];
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
        <span class="bin-status ${escapeHTML(product.status)}">${escapeHTML(PRODUCT_STATUS_LABELS[product.status] || product.status)}</span>
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
  el.detailProducts.innerHTML = detail.length ? detail.map(productCard).join('') : '<div class="empty-state"><strong>Todavía no hay productos al detalle</strong><p>Vuelve pronto para revisar el nuevo stock disponible.</p></div>';
  el.binsList.innerHTML = crowd.length ? crowd.map(productCard).join('') : '<div class="empty-state"><strong>Todavía no hay compras mayoristas</strong><p>Los nuevos lotes aparecerán aquí cuando estén abiertos.</p></div>';
}

function setMode(mode) {
  state.mode = mode;
  el.navHome.classList.remove('active');
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

function syncDeliveryFields(delivery, label, address) {
  const needsAddress = delivery.value === 'delivery';
  label.classList.toggle('hidden', !needsAddress);
  address.required = needsAddress;
  if (!needsAddress) address.value = '';
}

function syncPaymentHelp(payment, target) {
  target.textContent = payment.value === 'transfer'
    ? 'La solicitud quedará pendiente hasta que confirmemos la transferencia.'
    : 'El pago en efectivo quedará pendiente hasta el retiro o la entrega.';
}

async function placeOrder(itemId, customer, kg, form, options) {
  setBusy(form, true);
  try {
    const item = productById(itemId);
    if (!item) throw new Error('Producto no encontrado.');
    const { data, error } = await db.rpc('place_customer_order', {
      p_product_id: item.product_id,
      p_lot_id: item.channel === 'CROWDBUYING' ? item.lot_id : null,
      p_channel: item.channel === 'CROWDBUYING' ? 'wholesale' : 'retail',
      p_name: customer.name,
      p_email: customer.email,
      p_phone: customer.phone,
      p_quantity: Number(kg),
      p_payment_method: options.payment,
      p_delivery_method: options.delivery,
      p_address: options.address || null
    });
    if (error) throw error;
    closeOrderDialogs();
    form.reset();
    const paymentNext = options.payment === 'transfer'
      ? 'La transferencia debe ser confirmada por Lazo Mercado.'
      : 'El pago en efectivo se confirmará al coordinar la entrega o el retiro.';
    el.purchaseAlertText.textContent = `Pedido ${String(data.id).slice(0, 8)} registrado por ${number(data.equivalent_kg)} kg de ${data.product_name}. Total: ${money(data.total_amount)}. ${paymentNext} Guarda este código y consulta el avance con el mismo teléfono.`;
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
    const { data, error } = await db.rpc('orders_by_phone', { p_phone: el.trackingPhone.value });
    if (error) throw error;
    el.trackingResults.innerHTML = data?.length ? data.map((order) => `
      <article class="tracking-card"><div class="tracking-head"><div><strong>${escapeHTML(order.product_name)}</strong><p class="bin-meta">Pedido ${escapeHTML(String(order.id).slice(0, 8))} · ${new Date(order.created_at).toLocaleString('es-CL')}</p></div><span class="channel-badge">${order.channel === 'retail' ? 'Detalle' : 'Mayorista'}</span></div>
      <p>${number(order.equivalent_kg)} kg · ${money(order.total_amount)} · ${escapeHTML(PAYMENT_LABELS[order.payment_status] || order.payment_status)}</p><span class="order-status ${escapeHTML(order.operational_status)}">${escapeHTML(ORDER_LABELS[order.operational_status] || order.operational_status)}</span></article>`).join('')
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
  const { data, error } = await db.rpc('is_lazo_admin');
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
  const [productsResult, lotsResult, procurementResult, ordersResult, customersResult] = await Promise.all([
    db.from('products').select('*').order('created_at', { ascending: false }),
    db.from('lots').select('*, product:products(*)').order('created_at', { ascending: false }),
    db.from('lot_procurement').select('*').order('updated_at', { ascending: false }),
    db.from('orders').select('*, product:products(*), customer:customers(*), lot:lots(*), delivery:delivery_details(*), payments(*), status_history:order_status_history(*)').order('created_at', { ascending: false }),
    db.from('customers').select('*').order('created_at', { ascending: false })
  ]);
  const procurementMissing = ['42P01', 'PGRST205'].includes(procurementResult.error?.code);
  const failed = [productsResult, lotsResult, ordersResult, customersResult, ...(procurementMissing ? [] : [procurementResult])].find((result) => result.error);
  if (failed) throw failed.error;
  const rawProducts = productsResult.data || [];
  const rawLots = lotsResult.data || [];
  const procurementByLot = new Map((procurementResult.data || []).map((item) => [item.lot_id, item]));
  const details = rawProducts.filter((product) => product.retail_enabled !== false && !product.archived_at).map((product) => ({
    ...product, id: product.id, product_id: product.id, channel: 'DETALLE',
    price_per_kg: product.detail_price, stock_kg: product.retail_stock_kg,
    status: Number(product.retail_stock_kg) > 0 ? 'OPEN' : 'SOLD_OUT'
  }));
  const wholesale = rawLots.filter((lot) => !lot.archived_at).map((lot) => ({
    ...lot, id: lot.id, lot_id: lot.id, channel: 'CROWDBUYING', name: lot.product?.name || 'Producto',
    variety: lot.product?.variety || '', notes: lot.product?.description || '', image_url: lot.product?.image_url || '',
    price_per_kg: lot.wholesale_price, supplier_cost_per_kg: Number(procurementByLot.get(lot.id)?.supplier_cost_per_kg || 0), capacity_kg: lot.total_capacity_kg, min_order_kg: lot.minimum_purchase_kg,
    sold_kg: Number(lot.customer_paid_kg) + Number(lot.market_assumed_kg),
    lot_status: lot.status,
    status: lot.status === 'open' ? 'OPEN' : lot.status === 'full' ? 'SOLD_OUT' : 'CLOSED'
  }));
  state.products = [...wholesale, ...details];
  state.rawProducts = rawProducts;
  state.lots = rawLots;
  state.procurement = procurementResult.data || [];
  state.orders = (ordersResult.data || []).map((order) => ({
    ...order, channel: order.channel === 'wholesale' ? 'CROWDBUYING' : 'DETALLE',
    kg: order.equivalent_kg, total_price: order.total_amount,
    status: order.operational_status,
    latestPayment: [...(order.payments || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null,
    delivery: Array.isArray(order.delivery) ? order.delivery[0] : order.delivery,
    statusHistory: [...(order.status_history || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }));
  state.customers = customersResult.data || [];
  renderProducts();
  renderAdmin();
}

function orderActions(order) {
  if (order.status === 'CANCELADO') return '';
  const actions = [];
  if (order.status === 'PENDIENTE_CONFIRMACION') {
    actions.push(`<button class="btn tiny" type="button" data-action="confirm-payment" data-id="${order.id}">Confirmar pago</button>`);
  } else {
    const blockedWholesale = order.channel === 'CROWDBUYING'
      && order.status === 'ESPERANDO_COMPRA_GRUPAL'
      && order.lot?.status !== 'full';
    if (!blockedWholesale && order.status !== 'COMPLETADO') {
      const label = order.status === 'LISTO_PARA_ENTREGA'
        ? (order.delivery_method === 'pickup' ? 'Marcar como retirado' : 'Iniciar despacho')
        : (ADVANCE_LABELS[order.status] || 'Avanzar');
      actions.push(`<button class="btn tiny" type="button" data-action="advance-order" data-id="${order.id}">${escapeHTML(label)}</button>`);
    }
    if (order.statusHistory?.some((entry) => entry.from_status)) {
      actions.push(`<button class="btn tiny secondary" type="button" data-action="revert-order" data-id="${order.id}">Corregir último estado</button>`);
    }
    if (order.payment_status === 'CONFIRMADO' && ['PREPARANDO', 'ESPERANDO_COMPRA_GRUPAL'].includes(order.status)) {
      actions.push(`<button class="btn tiny secondary" type="button" data-action="revert-payment" data-id="${order.id}">Revertir pago</button>`);
    }
  }
  if (!['EN_TRANSITO', 'ENTREGADO', 'COMPLETADO'].includes(order.status)) {
    actions.push(`<button class="btn tiny warn" type="button" data-action="cancel-order" data-id="${order.id}">Cancelar pedido</button>`);
  }
  return `<div class="order-actions">${actions.join('')}</div>`;
}

function orderAdminCard(order) {
  const delivery = DELIVERY_METHOD_LABELS[order.delivery_method] || order.delivery_method;
  const payment = PAYMENT_LABELS[order.payment_status] || order.payment_status;
  const address = order.delivery_method === 'delivery' && order.delivery?.address_line
    ? `<span><strong>Dirección:</strong> ${escapeHTML(order.delivery.address_line)}</span>` : '';
  const cancelled = order.cancellation_reason
    ? `<p class="order-note"><strong>Motivo:</strong> ${escapeHTML(order.cancellation_reason)}</p>` : '';
  return `<article class="admin-bin order-admin-card">
    <div class="admin-row"><div><strong>${escapeHTML(order.product?.name || 'Producto')}</strong><p class="bin-meta">Pedido ${escapeHTML(String(order.id).slice(0, 8))} · ${new Date(order.created_at).toLocaleString('es-CL')}</p></div><span class="order-status ${escapeHTML(order.status)}">${escapeHTML(ORDER_LABELS[order.status] || order.status)}</span></div>
    <div class="order-detail-grid"><span><strong>Cliente:</strong> ${escapeHTML(order.customer?.full_name || '')}</span><span><strong>Teléfono:</strong> ${escapeHTML(order.customer?.phone || '')}</span><span><strong>Cantidad:</strong> ${number(order.kg)} kg</span><span><strong>Total:</strong> ${money(order.total_price)}</span><span><strong>Pago:</strong> ${escapeHTML(PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method)} · ${escapeHTML(payment)}</span><span><strong>Entrega:</strong> ${escapeHTML(delivery)}</span>${address}</div>
    ${cancelled}${orderActions(order)}
  </article>`;
}

function productAdminCard(product) {
  const stockText = product.channel === 'DETALLE' ? `Stock: ${number(product.stock_kg)} kg` : `Vendido: ${number(product.sold_kg)} / ${number(product.capacity_kg)} kg`;
  return `<article class="admin-bin"><div class="admin-row"><div><strong>${escapeHTML(product.name)}</strong><p class="bin-meta">${stockText} · ${money(product.price_per_kg)}/kg</p></div><span class="bin-status ${escapeHTML(product.status)}">${escapeHTML(PRODUCT_STATUS_LABELS[product.status] || product.status)}</span></div><div class="order-actions"><button class="btn tiny secondary" type="button" data-action="edit-product" data-id="${product.id}">Editar</button><button class="btn tiny warn" type="button" data-action="archive-product" data-id="${product.id}">Archivar</button></div></article>`;
}

function barRows(values, emptyMessage = 'Todavía no hay datos para este gráfico.') {
  if (!values.some((item) => Number(item.value || 0) > 0)) {
    return `<div class="empty-state compact"><strong>Sin movimientos</strong><p>${escapeHTML(emptyMessage)}</p></div>`;
  }
  const max = Math.max(1, ...values.map((item) => Number(item.value || 0)));
  return values.map((item) => `<div class="bar-row"><span>${escapeHTML(item.label)}</span><div class="bar-track"><div class="bar-fill ${Number(item.value || 0) > 0 ? '' : 'zero'}" style="--w:${Math.round((Number(item.value || 0) / max) * 100)}%"></div></div><strong>${item.money ? money(item.value) : number(item.value)}</strong></div>`).join('');
}

function renderProcurement(detail, wholesale) {
  const activeOrders = state.orders.filter((order) => !['CANCELADO', 'COMPLETADO'].includes(order.status));
  const pendingKg = activeOrders.filter((order) => order.payment_status !== 'CONFIRMADO').reduce((sum, order) => sum + Number(order.kg), 0);
  const detailBuyKg = detail.reduce((total, product) => {
    const pendingForProduct = activeOrders.filter((order) => order.channel === 'DETALLE' && order.product_id === product.product_id && order.payment_status !== 'CONFIRMADO').reduce((sum, order) => sum + Number(order.kg), 0);
    return total + Math.max(0, DETAIL_WEEKLY_TARGET_KG - (Number(product.stock_kg) + pendingForProduct));
  }, 0);
  const readyLots = wholesale.filter((lot) => lot.lot_status === 'full' && Number(lot.capacity_kg) > 0);
  const wholesaleBuyKg = readyLots.reduce((sum, lot) => sum + Number(lot.capacity_kg), 0);
  const totalBuyKg = detailBuyKg + wholesaleBuyKg;
  const supplierBudget = readyLots.reduce((sum, lot) => sum + (Number(lot.capacity_kg) * Number(lot.supplier_cost_per_kg || 0)), 0);
  const missingSupplierCosts = readyLots.filter((lot) => Number(lot.supplier_cost_per_kg || 0) <= 0).length;
  el.procurementSummary.innerHTML = `<article class="kpi-card procurement-total ${totalBuyKg ? 'ready-to-buy' : ''}"><p>Total para comprar esta semana</p><strong>${number(totalBuyKg)} kg</strong><small>Detalle recomendado + lotes mayoristas completos</small></article><article class="kpi-card"><p>Comprar al detalle</p><strong>${number(detailBuyKg)} kg</strong><small>Para recuperar 20 kg libres por producto</small></article><article class="kpi-card"><p>Comprar mayorista</p><strong>${number(wholesaleBuyKg)} kg</strong><small>Solo lotes que ya se completaron</small></article><article class="kpi-card ${missingSupplierCosts ? 'needs-attention' : ''}"><p>Presupuesto mayorista</p><strong>${money(supplierBudget)}</strong>${missingSupplierCosts ? `<small>Falta definir costo en ${missingSupplierCosts} lote(s)</small>` : '<small>Calculado con el costo de proveedor registrado</small>'}</article><article class="kpi-card pending-card"><p>No comprar todavía</p><strong>${number(pendingKg)} kg</strong><small>Pedidos que todavía no tienen pago confirmado</small></article>`;

  const detailCards = detail.map((product) => {
    const orders = activeOrders.filter((order) => order.channel === 'DETALLE' && order.product_id === product.product_id);
    const confirmed = orders.filter((order) => order.payment_status === 'CONFIRMADO').reduce((sum, order) => sum + Number(order.kg), 0);
    const pending = orders.filter((order) => order.payment_status !== 'CONFIRMADO').reduce((sum, order) => sum + Number(order.kg), 0);
    const buyThisWeek = Math.max(0, DETAIL_WEEKLY_TARGET_KG - (Number(product.stock_kg) + pending));
    const action = buyThisWeek > 0 ? `Comprar esta semana: ${number(buyThisWeek)} kg` : confirmed > 0 ? 'Completar con stock disponible' : pending > 0 ? 'Esperar confirmación de pago' : 'Reserva semanal completa';
    return `<article class="procurement-card ${buyThisWeek > 0 ? 'requires-purchase' : ''}"><div class="admin-row"><div><strong>${escapeHTML(product.name)}</strong><p class="bin-meta">Venta al detalle · planificación semanal</p></div><span class="action-badge ${buyThisWeek > 0 ? 'ready' : ''}">${escapeHTML(action)}</span></div><div class="procurement-grid"><span>Comprar esta semana<strong>${number(buyThisWeek)} kg</strong></span><span>Pedidos pagados<strong>${number(confirmed)} kg</strong></span><span>Stock libre actual<strong>${number(product.stock_kg)} kg</strong></span><span>Reserva objetivo<strong>${number(DETAIL_WEEKLY_TARGET_KG)} kg</strong></span><span>Pendiente de pago<strong>${number(pending)} kg</strong></span></div></article>`;
  });

  const wholesaleCards = wholesale.map((lot) => {
    const orders = activeOrders.filter((order) => order.channel === 'CROWDBUYING' && order.lot_id === lot.lot_id);
    const pending = orders.filter((order) => order.payment_status !== 'CONFIRMADO').reduce((sum, order) => sum + Number(order.kg), 0);
    const confirmed = Number(lot.sold_kg || 0);
    const remaining = Math.max(0, Number(lot.capacity_kg) - confirmed);
    const ready = lot.lot_status === 'full' || remaining === 0;
    const supplierCost = Number(lot.supplier_cost_per_kg || 0);
    const purchaseBudget = supplierCost * Number(lot.capacity_kg);
    return `<article class="procurement-card ${ready ? 'requires-purchase' : ''}"><div class="admin-row"><div><strong>${escapeHTML(lot.name)}</strong><p class="bin-meta">Compra mayorista · lote de ${number(lot.capacity_kg)} kg</p></div><span class="action-badge ${ready ? 'ready' : ''}">${ready ? `Comprar lote: ${number(lot.capacity_kg)} kg` : `Esperar: faltan ${number(remaining)} kg`}</span></div><div class="procurement-grid"><span>Comprar ahora<strong>${ready ? number(lot.capacity_kg) : 0} kg</strong></span><span>Pedidos confirmados<strong>${number(confirmed)} kg</strong></span><span>No confirmado<strong>${number(pending)} kg</strong></span><span>Falta para completar<strong>${number(remaining)} kg</strong></span><span>Costo proveedor/kg<strong>${supplierCost > 0 ? money(supplierCost) : 'Sin definir'}</strong></span><span>Dinero para el lote<strong>${ready ? (supplierCost > 0 ? money(purchaseBudget) : 'Configurar costo') : 'Todavía no comprar'}</strong></span></div></article>`;
  });

  const deliveries = activeOrders.filter((order) => order.payment_status === 'CONFIRMADO' && order.delivery_method === 'delivery');
  const deliveryBoard = `<section class="dispatch-board"><div class="admin-row"><div><strong>Despachos por coordinar</strong><p class="bin-meta">${deliveries.length} destino(s) con pago confirmado</p></div><span class="action-badge ${deliveries.length ? 'ready' : ''}">${deliveries.length ? `${number(deliveries.reduce((sum, order) => sum + Number(order.kg), 0))} kg por despachar` : 'Sin despachos'}</span></div>${deliveries.length ? `<div class="dispatch-list">${deliveries.map((order) => `<article><strong>${escapeHTML(order.product?.name || 'Producto')} · ${number(order.kg)} kg</strong><span>${escapeHTML(order.customer?.full_name || '')} · ${escapeHTML(order.customer?.phone || '')}</span><span>${escapeHTML(order.delivery?.address_line || 'Dirección pendiente')} · ${escapeHTML(ORDER_LABELS[order.status] || order.status)}</span></article>`).join('')}</div>` : '<p class="hint">Los pedidos con despacho aparecerán aquí cuando el pago esté confirmado.</p>'}</section>`;
  const detailSection = `<section class="procurement-section"><div class="procurement-section-head"><div><span class="section-kicker">Al detalle</span><h5>Compra semanal por producto</h5></div><strong>${number(detailBuyKg)} kg para comprar</strong></div>${detailCards.join('') || '<div class="empty-state compact"><strong>Sin productos al detalle</strong><p>Crea o publica un producto para comenzar.</p></div>'}</section>`;
  const wholesaleSection = `<section class="procurement-section"><div class="procurement-section-head"><div><span class="section-kicker">Mayorista</span><h5>Lotes completos y lotes en espera</h5></div><strong>${number(wholesaleBuyKg)} kg para comprar</strong></div>${wholesaleCards.join('') || '<div class="empty-state compact"><strong>Sin lotes mayoristas</strong><p>Crea o publica un lote para comenzar.</p></div>'}</section>`;
  el.procurementList.innerHTML = `${detailSection}${wholesaleSection}${deliveryBoard}`;
}

function setHome() {
  state.mode = null;
  el.entryGate.classList.remove('hidden');
  el.modeTabsWrap.classList.add('hidden');
  el.detailView.classList.add('hidden');
  el.crowdView.classList.add('hidden');
  el.trackingView.classList.add('hidden');
  el.modeTabs.forEach((tab) => tab.classList.remove('active'));
  el.navHome.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAdmin() {
  const wholesale = state.products.filter((p) => p.channel === 'CROWDBUYING');
  const detail = state.products.filter((p) => p.channel === 'DETALLE');
  const wholesaleOrders = state.orders.filter((o) => o.channel === 'CROWDBUYING');
  const detailOrders = state.orders.filter((o) => o.channel === 'DETALLE');
  const activeWholesaleOrders = wholesaleOrders.filter((order) => !['CANCELADO', 'COMPLETADO'].includes(order.status));
  const activeDetailOrders = detailOrders.filter((order) => !['CANCELADO', 'COMPLETADO'].includes(order.status));
  el.adminBinsOpen.innerHTML = wholesale.filter((p) => p.status !== 'SOLD_OUT').map(productAdminCard).join('') || '<div class="empty-state compact"><strong>Sin lotes activos</strong><p>Crea o publica un producto mayorista.</p></div>';
  el.adminBinsSold.innerHTML = wholesale.filter((p) => p.status === 'SOLD_OUT').map(productAdminCard).join('') || '<div class="empty-state compact"><strong>Sin lotes completos</strong><p>Los lotes completos aparecerán aquí.</p></div>';
  el.adminDetailProducts.innerHTML = detail.map(productAdminCard).join('') || '<div class="empty-state compact"><strong>Sin productos al detalle</strong><p>Crea el primer producto para publicarlo.</p></div>';
  el.adminDetailOrders.innerHTML = activeDetailOrders.map(orderAdminCard).join('') || '<div class="empty-state"><strong>Sin pedidos al detalle pendientes</strong><p>Los pedidos completados y cancelados están en Terminadas.</p></div>';

  const validOrders = state.orders.filter((order) => order.status !== 'CANCELADO');
  const totalKg = validOrders.reduce((sum, order) => sum + Number(order.kg), 0);
  const totalAmount = validOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const activeProductCount = state.rawProducts.filter((product) => !product.archived_at && product.is_published).length;
  el.kpiGrid.innerHTML = `<article class="kpi-card"><p>Productos únicos activos</p><strong>${activeProductCount}</strong></article><article class="kpi-card"><p>Clientes</p><strong>${state.customers.length}</strong></article><article class="kpi-card"><p>Pedidos activos</p><strong>${validOrders.filter((order) => order.status !== 'COMPLETADO').length}</strong></article><article class="kpi-card"><p>Monto activo y completado</p><strong>${money(totalAmount)}</strong></article>`;
  const wholesaleCapacity = wholesale.reduce((sum, p) => sum + Number(p.capacity_kg), 0);
  const wholesaleSold = wholesale.reduce((sum, p) => sum + Number(p.sold_kg), 0);
  const wholesalePending = wholesaleOrders.filter((order) => order.payment_status !== 'CONFIRMADO' && order.status !== 'CANCELADO').reduce((sum, order) => sum + Number(order.kg), 0);
  const soldPct = wholesaleCapacity ? Math.min(100, Math.round((wholesaleSold / wholesaleCapacity) * 100)) : 0;
  const pendingPct = wholesaleCapacity ? Math.min(100 - soldPct, Math.round((wholesalePending / wholesaleCapacity) * 100)) : 0;
  el.kgChart.classList.toggle('hidden', wholesaleCapacity === 0);
  el.kgChart.style.setProperty('--part1', `${soldPct}%`); el.kgChart.style.setProperty('--part2', `${pendingPct}%`);
  el.kgChart.innerHTML = '<div></div><div></div><div></div>';
  el.kgLegend.innerHTML = wholesaleCapacity
    ? `<span>Confirmado: <strong>${number(wholesaleSold)} kg (${soldPct}%)</strong></span><span>Pendiente de pago: <strong>${number(wholesalePending)} kg</strong></span><span>Disponible: <strong>${number(Math.max(0, wholesaleCapacity - wholesaleSold))} kg</strong></span><span>Total solicitado: <strong>${number(totalKg)} kg</strong></span>`
    : '<div class="empty-state compact"><strong>Sin lotes mayoristas</strong><p>Crea un lote para visualizar su avance.</p></div>';
  el.amountChart.innerHTML = barRows(ORDER_STATES.map((status) => ({ label: ORDER_LABELS[status], value: state.orders.filter((o) => o.status === status).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })));

  renderProcurement(detail, wholesale);

  const completed = state.orders.filter((o) => o.status === 'COMPLETADO');
  const cancelledOrders = state.orders.filter((o) => o.status === 'CANCELADO');
  const terminalOrders = state.orders.filter((o) => ['COMPLETADO', 'CANCELADO'].includes(o.status));
  const completedAmount = completed.reduce((sum, o) => sum + Number(o.total_price), 0);
  el.completedSummary.innerHTML = `<article class="kpi-card"><p>Ventas completadas</p><strong>${completed.length}</strong></article><article class="kpi-card"><p>Monto vendido</p><strong>${money(completedAmount)}</strong></article><article class="kpi-card"><p>Solicitudes canceladas</p><strong>${cancelledOrders.length}</strong></article>`;
  el.completedChannelChart.innerHTML = barRows(['CROWDBUYING', 'DETALLE'].map((channel) => ({ label: channel === 'DETALLE' ? 'Detalle' : 'Mayorista', value: completed.filter((o) => o.channel === channel).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })), 'Todavía no existen ventas completadas.');
  const byProduct = completed.reduce((map, order) => { const name = order.product?.name || 'Producto'; map[name] = (map[name] || 0) + Number(order.kg); return map; }, {});
  el.completedProductChart.innerHTML = barRows(Object.entries(byProduct).map(([label, value]) => ({ label, value })), 'Los productos vendidos aparecerán al completar una venta.');
  el.completedSalesList.innerHTML = terminalOrders.map(orderAdminCard).join('') || '<div class="empty-state"><strong>Sin historial finalizado</strong><p>Las ventas completadas y cancelaciones aparecerán aquí.</p></div>';

  const confirmedOrders = state.orders.filter((order) => order.payment_status === 'CONFIRMADO');
  const confirmedAmount = confirmedOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const pendingAmount = state.orders.filter((order) => !['CONFIRMADO', 'CANCELADO', 'REEMBOLSO_SOLICITADO', 'REEMBOLSADO'].includes(order.payment_status)).reduce((sum, order) => sum + Number(order.total_price), 0);
  const refundPending = state.orders.filter((order) => order.payment_status === 'REEMBOLSO_SOLICITADO').reduce((sum, order) => sum + Number(order.total_price), 0);
  const cancelledWithoutCharge = state.orders.filter((order) => order.status === 'CANCELADO' && order.payment_status === 'CANCELADO').reduce((sum, order) => sum + Number(order.total_price), 0);
  el.financialKpis.innerHTML = `<article class="kpi-card"><p>Ingresos confirmados</p><strong>${money(confirmedAmount)}</strong></article><article class="kpi-card"><p>Pendiente de cobro</p><strong>${money(pendingAmount)}</strong></article><article class="kpi-card"><p>Ventas completadas</p><strong>${money(completedAmount)}</strong></article><article class="kpi-card ${refundPending ? 'needs-attention' : ''}"><p>Reembolsos por resolver</p><strong>${money(refundPending)}</strong></article><article class="kpi-card"><p>Cancelado sin cobro</p><strong>${money(cancelledWithoutCharge)}</strong></article>`;
  el.financialChannelChart.innerHTML = barRows(['CROWDBUYING', 'DETALLE'].map((channel) => ({ label: channel === 'DETALLE' ? 'Detalle' : 'Mayorista', value: confirmedOrders.filter((o) => o.channel === channel).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })), 'Confirma un pago para reconocerlo como ingreso.');
  el.financialStatusChart.innerHTML = barRows(ORDER_STATES.filter((status) => status !== 'CANCELADO').map((status) => ({ label: ORDER_LABELS[status], value: state.orders.filter((o) => o.status === status).reduce((sum, o) => sum + Number(o.total_price), 0), money: true })), 'Todavía no existen movimientos financieros activos.');
  el.financialList.innerHTML = state.orders.map(orderAdminCard).join('') || '<div class="empty-state"><strong>Sin movimientos</strong><p>Los pedidos aparecerán aquí con su estado de pago.</p></div>';

  const hiddenWholesaleOrders = activeWholesaleOrders.length ? '' : '<div class="empty-state compact"><strong>Sin pedidos mayoristas pendientes</strong><p>Los pedidos completados y cancelados están en Terminadas.</p></div>';
  el.adminBinsOpen.insertAdjacentHTML('beforeend', `<div class="admin-divider"><span>Pedidos mayoristas activos</span></div>${hiddenWholesaleOrders}${activeWholesaleOrders.map(orderAdminCard).join('')}`);
}

function switchAdminView(view) {
  Object.entries(el.adminViews).forEach(([name, section]) => section.classList.toggle('hidden', name !== view));
  el.mainTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
}

function clearBinForm() { el.binForm.reset(); el.binId.value = ''; el.binSupplierCost.value = 0; el.binCapacity.value = 500; el.binMinKg.value = 50; showImagePreview(el.binImagePreview, el.binImageEmpty); }
function clearDetailForm() { el.detailProductForm.reset(); el.detailAdminId.value = ''; showImagePreview(el.detailAdminImagePreview, el.detailAdminImageEmpty); }

async function saveWholesale(event) {
  event.preventDefault(); setBusy(el.binForm, true);
  try {
    const current = el.binId.value ? productById(el.binId.value) : null;
    const uploadedImage = await uploadProductImage(el.binImageFile.files?.[0]);
    const imageUrl = uploadedImage || current?.image_url || '';
    if (!imageUrl) throw new Error('Selecciona una imagen para el producto.');
    const { error } = await db.rpc('admin_save_wholesale_product', {
      p_lot_id: el.binId.value || null,
      p_name: el.binProduct.value.trim(),
      p_variety: el.binVariety.value.trim(),
      p_description: el.binNotes.value.trim(),
      p_image_url: imageUrl,
      p_price: Number(el.binPrice.value),
      p_supplier_cost: Number(el.binSupplierCost.value),
      p_capacity: Number(el.binCapacity.value),
      p_minimum: Number(el.binMinKg.value),
      p_status: el.binStatus.value === 'OPEN' ? 'open' : el.binStatus.value === 'SOLD_OUT' ? 'full' : 'closed'
    });
    if (error) throw error;
    clearBinForm(); await loadAdminData(); toast('Producto mayorista guardado.');
  } catch (error) { toast(errorMessage(error), true); } finally { setBusy(el.binForm, false); }
}

async function saveDetail(event) {
  event.preventDefault(); setBusy(el.detailProductForm, true);
  const current = el.detailAdminId.value ? productById(el.detailAdminId.value) : null;
  try {
    const uploadedImage = await uploadProductImage(el.detailAdminImageFile.files?.[0]);
    const imageUrl = uploadedImage || current?.image_url || '';
    if (!imageUrl) throw new Error('Selecciona una imagen para el producto.');
    const payload = { name: el.detailAdminName.value.trim(), variety: current?.variety || '', description: current?.notes || '', image_url: imageUrl, sale_unit: 'kilo', equivalent_weight_kg: 1, wholesale_price: Number(current?.wholesale_price || el.detailAdminPrice.value), detail_price: Number(el.detailAdminPrice.value), minimum_quantity: 1, retail_stock_kg: Number(el.detailAdminStock.value), retail_enabled: true, archived_at: null, season_status: 'available', is_published: true };
    const query = el.detailAdminId.value ? db.from('products').update(payload).eq('id', el.detailAdminId.value) : db.from('products').insert(payload);
    const { error } = await query; if (error) throw error;
    clearDetailForm(); await loadAdminData(); toast('Producto al detalle guardado.');
  } catch (error) { toast(errorMessage(error), true); } finally { setBusy(el.detailProductForm, false); }
}

function editProduct(id) {
  const product = productById(id); if (!product) return;
  switchAdminView('crear');
  if (product.channel === 'CROWDBUYING') {
    el.binId.value = product.id; el.binProduct.value = product.name; el.binVariety.value = product.variety;
    el.binNotes.value = product.notes; el.binPrice.value = product.price_per_kg; el.binSupplierCost.value = Number(product.supplier_cost_per_kg || 0); el.binCapacity.value = product.capacity_kg;
    el.binMinKg.value = product.min_order_kg; el.binStatus.value = product.status;
    showImagePreview(el.binImagePreview, el.binImageEmpty, product.image_url);
  } else {
    el.detailAdminId.value = product.id; el.detailAdminName.value = product.name;
    el.detailAdminPrice.value = product.price_per_kg; el.detailAdminStock.value = product.stock_kg;
    showImagePreview(el.detailAdminImagePreview, el.detailAdminImageEmpty, product.image_url);
  }
}

async function archiveProduct(id) {
  const item = productById(id);
  if (!item) return;
  const label = item.channel === 'CROWDBUYING' ? 'lote mayorista' : 'producto al detalle';
  if (!window.confirm(`¿Archivar este ${label}? Dejará de aparecer para los clientes, pero conservará sus pedidos.`)) return;
  const { error } = item.channel === 'CROWDBUYING'
    ? await db.rpc('admin_archive_lot', { p_lot_id: item.lot_id })
    : await db.rpc('admin_archive_retail_product', { p_product_id: item.product_id });
  if (error) return toast(errorMessage(error), true);
  await loadAdminData(); toast('Producto archivado sin perder su historial.');
}

function orderSummary(id) {
  const order = state.orders.find((item) => item.id === id);
  return order ? `${order.product?.name || 'Producto'} · ${number(order.kg)} kg · ${money(order.total_price)}` : 'este pedido';
}

async function advanceOrder(id) {
  if (!window.confirm(`¿Confirmas el siguiente avance para ${orderSummary(id)}?`)) return;
  const { error } = await db.rpc('admin_advance_order', { p_order_id: id });
  if (error) return toast(errorMessage(error), true);
  await loadAdminData(); toast('Pedido actualizado. Puedes corregir el último estado si fue un error.');
}

async function confirmOrderPayment(id) {
  if (!window.confirm(`¿Confirmas que recibiste el pago de ${orderSummary(id)}?`)) return;
  const { error } = await db.rpc('admin_confirm_order_payment', { p_order_id: id });
  if (error) return toast(errorMessage(error), true);
  await loadAdminData(); toast('Pago confirmado y pedido actualizado.');
}

const ADMIN_REASON_ACTIONS = {
  'revert-status': {
    title: 'Corregir último estado',
    message: (id) => `El pedido ${orderSummary(id)} volverá al estado anterior.`,
    rpc: 'admin_revert_order_status',
    success: 'Último cambio de estado corregido.'
  },
  'revert-payment': {
    title: 'Revertir pago confirmado',
    message: (id) => `El pago de ${orderSummary(id)} volverá a pendiente y se ajustará la capacidad del lote.`,
    rpc: 'admin_revert_order_payment',
    success: 'Pago revertido a pendiente.'
  },
  'cancel-order': {
    title: 'Cancelar pedido',
    message: (id) => `Se cancelará ${orderSummary(id)}. El stock se devolverá y, si estaba pagado, quedará un reembolso por resolver.`,
    rpc: 'admin_cancel_order',
    success: 'Pedido cancelado con motivo registrado.'
  }
};

function closeAdminActionDialog() {
  state.pendingAdminAction = null;
  el.adminActionForm.reset();
  if (el.adminActionModal.open) el.adminActionModal.close();
}

function openAdminActionDialog(type, id) {
  const config = ADMIN_REASON_ACTIONS[type];
  if (!config || !state.orders.some((order) => order.id === id)) return;
  state.pendingAdminAction = { type, id };
  el.adminActionTitle.textContent = config.title;
  el.adminActionMessage.textContent = config.message(id);
  el.confirmAdminAction.textContent = type === 'cancel-order' ? 'Cancelar pedido' : 'Confirmar corrección';
  el.adminActionReason.value = '';
  el.adminActionModal.showModal();
  el.adminActionReason.focus();
}

async function submitAdminAction(event) {
  event.preventDefault();
  const pending = state.pendingAdminAction;
  const reason = el.adminActionReason.value.trim();
  const config = pending ? ADMIN_REASON_ACTIONS[pending.type] : null;
  if (!pending || !config) return closeAdminActionDialog();
  if (reason.length < 3) return toast('Escribe un motivo de al menos 3 caracteres.', true);
  setBusy(el.adminActionForm, true);
  try {
    const { error } = await db.rpc(config.rpc, { p_order_id: pending.id, p_reason: reason });
    if (error) throw error;
    closeAdminActionDialog();
    await loadAdminData();
    toast(config.success);
  } catch (error) {
    toast(errorMessage(error), true);
  } finally {
    setBusy(el.adminActionForm, false);
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const { action, id } = button.dataset;
  if (action === 'order-crowd') openCrowdOrder(id);
  if (action === 'order-detail') openDetailOrder(id);
  if (action === 'edit-product') editProduct(id);
  if (action === 'archive-product') archiveProduct(id);
  if (action === 'advance-order') advanceOrder(id);
  if (action === 'revert-order') openAdminActionDialog('revert-status', id);
  if (action === 'revert-payment') openAdminActionDialog('revert-payment', id);
  if (action === 'cancel-order') openAdminActionDialog('cancel-order', id);
  if (action === 'confirm-payment') confirmOrderPayment(id);
});

el.chooseDetail.addEventListener('click', () => setMode('detail'));
el.chooseCrowd.addEventListener('click', () => setMode('crowd'));
el.modeTabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
el.orderKg.addEventListener('input', () => updateOrderPreview(productById(el.orderBinId.value), el.orderKg.value, el.orderTotal));
el.detailOrderKg.addEventListener('input', () => updateOrderPreview(productById(el.detailProductId.value), el.detailOrderKg.value, el.detailOrderTotal));
el.orderDelivery.addEventListener('change', () => syncDeliveryFields(el.orderDelivery, el.orderAddressLabel, el.orderAddress));
el.detailOrderDelivery.addEventListener('change', () => syncDeliveryFields(el.detailOrderDelivery, el.detailOrderAddressLabel, el.detailOrderAddress));
el.orderPayment.addEventListener('change', () => syncPaymentHelp(el.orderPayment, el.orderPaymentHelp));
el.detailOrderPayment.addEventListener('change', () => syncPaymentHelp(el.detailOrderPayment, el.detailOrderPaymentHelp));
el.orderForm.addEventListener('submit', (event) => { event.preventDefault(); placeOrder(el.orderBinId.value, { name: el.customerName.value.trim(), email: el.customerEmail.value.trim(), phone: el.customerPhone.value.trim() }, el.orderKg.value, el.orderForm, { payment: el.orderPayment.value, delivery: el.orderDelivery.value, address: el.orderAddress.value.trim() }); });
el.detailOrderForm.addEventListener('submit', (event) => { event.preventDefault(); placeOrder(el.detailProductId.value, { name: el.detailCustomerName.value.trim(), email: el.detailCustomerEmail.value.trim(), phone: el.detailCustomerPhone.value.trim() }, el.detailOrderKg.value, el.detailOrderForm, { payment: el.detailOrderPayment.value, delivery: el.detailOrderDelivery.value, address: el.detailOrderAddress.value.trim() }); });
el.closeOrder.addEventListener('click', closeOrderDialogs); el.cancelOrderAction.addEventListener('click', closeOrderDialogs);
el.closeDetailOrder.addEventListener('click', closeOrderDialogs); el.cancelDetailOrderAction.addEventListener('click', closeOrderDialogs);
el.purchaseAlertClose.addEventListener('click', () => el.purchaseAlert.classList.add('hidden'));
el.trackingForm.addEventListener('submit', trackOrders);
el.trackingClear.addEventListener('click', () => { el.trackingForm.reset(); el.trackingResults.innerHTML = '<p class="hint">Ingresa tu teléfono para consultar tus pedidos.</p>'; });
async function openAdmin(event) { event.preventDefault(); el.adminModal.showModal(); await syncAdmin(); }
el.footerAdminLink.addEventListener('click', openAdmin);
el.navHome.addEventListener('click', setHome);
el.closeAdmin.addEventListener('click', () => el.adminModal.close());
el.adminActionForm.addEventListener('submit', submitAdminAction);
el.closeAdminAction.addEventListener('click', closeAdminActionDialog);
el.cancelAdminAction.addEventListener('click', closeAdminActionDialog);
el.adminActionModal.addEventListener('close', () => { state.pendingAdminAction = null; el.adminActionForm.reset(); });
el.adminLoginForm.addEventListener('submit', loginAdmin);
el.adminLogout.addEventListener('click', async () => { await db.auth.signOut(); state.isAdmin = false; await syncAdmin(); toast('Sesión cerrada.'); });
el.mainTabs.forEach((tab) => tab.addEventListener('click', () => switchAdminView(tab.dataset.view)));
el.binForm.addEventListener('submit', saveWholesale); el.detailProductForm.addEventListener('submit', saveDetail);
el.clearBinForm.addEventListener('click', clearBinForm); el.clearDetailForm.addEventListener('click', clearDetailForm);
el.binImageFile.addEventListener('change', () => previewSelectedImage(el.binImageFile, el.binImagePreview, el.binImageEmpty));
el.detailAdminImageFile.addEventListener('change', () => previewSelectedImage(el.detailAdminImageFile, el.detailAdminImagePreview, el.detailAdminImageEmpty));

async function init() {
  syncDeliveryFields(el.orderDelivery, el.orderAddressLabel, el.orderAddress);
  syncDeliveryFields(el.detailOrderDelivery, el.detailOrderAddressLabel, el.detailOrderAddress);
  syncPaymentHelp(el.orderPayment, el.orderPaymentHelp);
  syncPaymentHelp(el.detailOrderPayment, el.detailOrderPaymentHelp);
  try { await loadProducts(); }
  catch (error) {
    const message = 'No fue posible cargar los productos. Ejecuta supabase/schema.sql en el SQL Editor.';
    el.detailProducts.innerHTML = `<p class="hint">${message}</p>`; el.binsList.innerHTML = `<p class="hint">${message}</p>`;
    toast(errorMessage(error), true);
  }
}

init();
