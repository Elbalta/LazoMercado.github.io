const db = window.lazoSupabase;

const ORDER_STATES = [
  'PENDIENTE_CONFIRMACION', 'ESPERANDO_COMPRA_GRUPAL', 'PREPARANDO',
  'LISTO_PARA_ENTREGA', 'EN_TRANSITO', 'ENTREGADO', 'COMPLETADO', 'CANCELADO'
];

const ORDER_LABELS = {
  PENDIENTE_CONFIRMACION: 'Pendiente de confirmaciÃ³n',
  ESPERANDO_COMPRA_GRUPAL: 'Esperando compra grupal',
  PREPARANDO: 'Preparando pedido',
  LISTO_PARA_ENTREGA: 'Listo para entrega',
  EN_TRANSITO: 'En trÃ¡nsito',
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

const ADVANCE_LABELS = {
  ESPERANDO_COMPRA_GRUPAL: 'Iniciar preparaciÃ³n',
  PREPARANDO: 'Marcar como listo',
  LISTO_PARA_ENTREGA: 'Despachar o entregar',
  EN_TRANSITO: 'Marcar como entregado',
  ENTREGADO: 'Completar venta'
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
  openAdminLink: q('open-admin-link'), footerAdminLink: q('footer-admin-link'),
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
  binVariety: q('bin-variety'), binPrice: q('bin-price'), binCapacity: q('bin-capacity'),
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
  financialStatusChart: q('financial-status-chart'), financialList: q('financial-list')
};

const state = { products: [], rawProducts: [], lots: [], orders: [], customers: [], isAdmin: false, mode: null };
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
    toast('La imagen debe ser JPG, PNG o WebP y pesar como mÃ¡ximo 5 MB.', true);
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
    throw new Error('La imagen debe ser JPG, PNG o WebP y pesar como mÃ¡ximo 5 MB.');
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
  return error?.message || error?.details || 'OcurriÃ³ un error inesperado.';
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
    price_per_kg: lot.wholesale_price, capacity_kg: lot.total_capacity_kg,
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
          <p class="bin-meta">${number(product.sold_kg)} de ${number(product.capacity_kg)} kg vendidos Â· mÃ­nimo ${number(product.min_order_kg)} kg</p></div>`}
        <button class="btn" type="button" data-action="${isDetail ? 'order-detail' : 'order-crowd'}" data-id="${product.id}" ${disabled ? 'disabled' : ''}>
          ${disabled ? 'Sin disponibilidad' : 'Solicitar pedido'}
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  const detail = state.products.filter((p) => p.channel === 'DETALLE');
  const crowd = state.products.filter((p) => p.channel === 'CROWDBUYING');
  el.detailProducts.innerHTML = detail.length ? detail.map(productCard).join('') : '<div class="empty-state"><strong>TodavÃ­a no hay productos al detalle</strong><p>Vuelve pronto para revisar el nuevo stock disponible.</p></div>';
  el.binsList.innerHTML = crowd.length ? crowd.map(productCard).join('') : '<div class="empty-state"><strong>TodavÃ­a no hay compras mayoristas</strong><p>Los nuevos lotes aparecerÃ¡n aquÃ­ cuando estÃ©n abiertos.</p></div>';
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
  el.summaryProduct.textContent = product?.name || 'â€”';
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
  el.orderKgLabelText.textContent = `Kilos a comprar (mÃ­nimo ${number(product.min_order_kg)})`;
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
  const needsAddress = delivery.value === ën´¶‰ËkºwµçQ•‘MÕµµ…Éä¹¥¹¹•É!Q50€ô€ñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀùY•¹Ñ…Ì½µÁ±•Ñ…‘…Ìğ½ÀøñÍÑÉ½¹œø‘í½µÁ±•Ñ•¹±•¹Ñ¡ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”øñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀù5½¹Ñ¼½µÁ±•Ñ…‘¼ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡½µÁ±•Ñ•‘µ½Õ¹Ğ¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”ù€ì(€•°¹½µÁ±•Ñ•‘¡…¹¹•±¡…ÉĞ¹¥¹¹•É!Q50€ô‰…ÉI½İÌ¡lI=]	Ue%9œ°€Q11t¹µ…À ¡¡…¹¹•°¤€ôø€¡ì±…‰•°è¡…¹¹•°€ôôô€Q11œ€ü€•Ñ…±±”œ€è€5…å½É¥ÍÑ„œ°Ù…±Õ”è½µÁ±•Ñ•¹™¥±Ñ•È ¡¼¤€ôø¼¹¡…¹¹•°€ôôô¡…¹¹•°¤¹É•‘Õ” ¡ÍÕ´°¼¤€ôøÍÕ´€¬9Õµ‰•È¡¼¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤°µ½¹•äèÑÉÕ”ô¤¤°€Q½‘…Ûµ„¹¼•á¥ÍÑ•¸Ù•¹Ñ…Ì½µÁ±•Ñ…‘…Ì¸œ¤ì(€½¹ÍĞ‰åAÉ½‘ÕĞ€ô½µÁ±•Ñ•¹É•‘Õ” ¡µ…À°½É‘•È¤€ôøì½¹ÍĞ¹…µ”€ô½É‘•È¹ÁÉ½‘ÕĞü¹¹…µ”ñğ€AÉ½‘ÕÑ¼œìµ…Ám¹…µ•t€ô€¡µ…Ám¹…µ•tñğ€À¤€¬9Õµ‰•È¡½É‘•È¹­œ¤ìÉ•ÑÕÉ¸µ…Àìô°íô¤ì(€•°¹½µÁ±•Ñ•‘AÉ½‘ÕÑ¡…ÉĞ¹¥¹¹•É!Q50€ô‰…ÉI½İÌ¡=‰©•Ğ¹•¹ÑÉ¥•Ì¡‰åAÉ½‘ÕĞ¤¹µ…À ¡m±…‰•°°Ù…±Õ•t¤€ôø€¡ì±…‰•°°Ù…±Õ”ô¤¤°€1½ÌÁÉ½‘ÕÑ½ÌÙ•¹‘¥‘½Ì…Á…É••Ë…¸…°½µÁ±•Ñ…ÈÕ¹„Ù•¹Ñ„¸œ¤ì(€•°¹½µÁ±•Ñ•‘M…±•Í1¥ÍĞ¹¥¹¹•É!Q50€ô½µÁ±•Ñ•¹µ…À¡½É‘•É‘µ¥¹…É¤¹©½¥¸ œœ¤ñğ€œñ‘¥Ø±…ÍÌô‰•µÁÑäµÍÑ…Ñ”ˆøñÍÑÉ½¹œùM¥¸Ù•¹Ñ…Ì½µÁ±•Ñ…‘…Ìğ½ÍÑÉ½¹œøñÀùÕ…¹‘¼™¥¹…±¥•ÌÕ¹„•¹ÑÉ•„…Á…É••Ë„…Å×´¸ğ½Àøğ½‘¥Øøœì((€½¹ÍĞ½¹™¥Éµ•‘=É‘•ÉÌ€ôÍÑ…Ñ”¹½É‘•ÉÌ¹™¥±Ñ•È ¡½É‘•È¤€ôø½É‘•È¹Á…åµ•¹Ñ}ÍÑ…ÑÕÌ€ôôô€=9%I5<œ¤ì(€½¹ÍĞ½¹™¥Éµ•‘µ½Õ¹Ğ€ô½¹™¥Éµ•‘=É‘•ÉÌ¹É•‘Õ” ¡ÍÕ´°½É‘•È¤€ôøÍÕ´€¬9Õµ‰•È¡½É‘•È¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤ì(€½¹ÍĞÁ•¹‘¥¹µ½Õ¹Ğ€ôÍÑ…Ñ”¹½É‘•ÉÌ¹™¥±Ñ•È ¡½É‘•È¤€ôø€…l=9%I5<œ°€91<œ°€I5	=1M=}M=1%%Q<œ°€I5	=1M<t¹¥¹±Õ‘•Ì¡½É‘•È¹Á…åµ•¹Ñ}ÍÑ…ÑÕÌ¤¤¹É•‘Õ” ¡ÍÕ´°½É‘•È¤€ôøÍÕ´€¬9Õµ‰•È¡½É‘•È¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤ì(€½¹ÍĞ…¹•±±•€ôÍÑ…Ñ”¹½É‘•ÉÌ¹™¥±Ñ•È ¡¼¤€ôø¼¹ÍÑ…ÑÕÌ€ôôô€91<œ¤¹É•‘Õ” ¡ÍÕ´°¼¤€ôøÍÕ´€¬9Õµ‰•È¡¼¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤ì(€½¹ÍĞÉ•™Õ¹‘A•¹‘¥¹œ€ôÍÑ…Ñ”¹½É‘•ÉÌ¹™¥±Ñ•È ¡½É‘•È¤€ôø½É‘•È¹Á…åµ•¹Ñ}ÍÑ…ÑÕÌ€ôôô€I5	=1M=}M=1%%Q<œ¤¹É•‘Õ” ¡ÍÕ´°½É‘•È¤€ôøÍÕ´€¬9Õµ‰•È¡½É‘•È¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤ì(€•°¹™¥¹…¹¥…±-Á¥Ì¹¥¹¹•É!Q50€ô€ñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀùA…¼½¹™¥Éµ…‘¼ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡½¹™¥Éµ•‘µ½Õ¹Ğ¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”øñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀùA•¹‘¥•¹Ñ”‘”Á…¼ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡Á•¹‘¥¹µ½Õ¹Ğ¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”øñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀù½µÁ±•Ñ…‘¼ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡½µÁ±•Ñ•‘µ½Õ¹Ğ¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”øñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀùI••µ‰½±Í¼Á•¹‘¥•¹Ñ”ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡É•™Õ¹‘A•¹‘¥¹œ¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”øñ…ÉÑ¥±”±…ÍÌô‰­Á¤µ…ÉˆøñÀù…¹•±…‘¼ğ½ÀøñÍÑÉ½¹œø‘íµ½¹•ä¡…¹•±±•¥ôğ½ÍÑÉ½¹œøğ½…ÉÑ¥±”ù€ì(€•°¹™¥¹…¹¥…±¡…¹¹•±¡…ÉĞ¹¥¹¹•É!Q50€ô‰…ÉI½İÌ¡lI=]	Ue%9œ°€Q11t¹µ…À ¡¡…¹¹•°¤€ôø€¡ì±…‰•°è¡…¹¹•°€ôôô€Q11œ€ü€•Ñ…±±”œ€è€5…å½É¥ÍÑ„œ°Ù…±Õ”è½¹™¥Éµ•‘=É‘•ÉÌ¹™¥±Ñ•È ¡¼¤€ôø¼¹¡…¹¹•°€ôôô¡…¹¹•°¤¹É•‘Õ” ¡ÍÕ´°¼¤€ôøÍÕ´€¬9Õµ‰•È¡¼¹Ñ½Ñ…±}ÁÉ¥”¤°€À¤°µ½¹•äèÑÉÕ”ô¤¤°€½¹™¥Éµ„Õ¸Á…¼Á…É„É•½¹½•É±¼½µ¼¥¹É•Í¼¸œ¤ì(€•°¹™¥¹…¹¥…±MÑ…ÑÕÍ¡…ÉĞ¹¥¹¹•É!Q50€ô•°¹…µ½Õ¹Ñ¡…ÉĞ¹¥¹¹•É!Q50ì(€•°¹™¥¹…¹¥…±1¥ÍĞ¹¥¹¹•É!Q50€ôÍÑ…Ñ”¹½É‘•ÉÌ¹µ…À¡½É‘•É‘µ¥¹…É¤¹©½¥¸ œœ¤ñğ€œñ‘¥Ø±…ÍÌô‰•µÁÑäµÍÑ…Ñ”ˆøñÍÑÉ½¹œùM¥¸µ½Ù¥µ¥•¹Ñ½Ìğ½ÍÑÉ½¹œøñÀù1½ÌÁ•‘¥‘½Ì…Á…É••Ë…¸…Å×´½¸ÍÔ•ÍÑ…‘¼‘”Á…¼¸ğ½Àøğ½‘¥Øøœì((€½¹ÍĞ¡¥‘‘•¹]¡½±•Í…±•=É‘•ÉÌ€ôİ¡½±•Í…±•=É‘•ÉÌ¹±•¹Ñ €ü€œœ€è€œñ‘¥Ø±…ÍÌô‰•µÁÑäµÍÑ…Ñ”½µÁ…ĞˆøñÍÑÉ½¹œùM¥¸Á•‘¥‘½Ìµ…å½É¥ÍÑ…Ìğ½ÍÑÉ½¹œøñÀù1½ÌÁ•‘¥‘½Ì‘•°±½Ñ”…Á…É••Ë…¸…Å×´¸ğ½Àøğ½‘¥Øøœì(€•°¹…‘µ¥¹	¥¹Í=Á•¸¹¥¹Í•ÉÑ‘©…•¹Ñ!Q50 ‰•™½É••¹œ°€ñ‘¥Ø±…ÍÌô‰…‘µ¥¸µ‘¥Ù¥‘•ÈˆøñÍÁ…¸ùA•‘¥‘½Ìµ…å½É¥ÍÑ…Ìğ½ÍÁ…¸øğ½‘¥Øø‘í¡¥‘‘•¹]¡½±•Í…±•=É‘•ÉÍô‘íİ¡½±•Í…±•=É‘•ÉÌ¹µ…À¡½É‘•É‘µ¥¹…É¤¹©½¥¸ œœ¥õ€¤ì)ô()™Õ¹Ñ¥½¸Íİ¥Ñ¡‘µ¥¹Y¥•Ü¡Ù¥•Ü¤ì(€=‰©•Ğ¹•¹ÑÉ¥•Ì¡•°¹…‘µ¥¹Y¥•İÌ¤¹™½É…  ¡m¹…µ”°Í•Ñ¥½¹t¤€ôøÍ•Ñ¥½¸¹±…ÍÍ1¥ÍĞ¹Ñ½±” ¡¥‘‘•¸œ°¹…µ”€„ôôÙ¥•Ü¤¤ì(€•°¹µ…¥¹Q…‰Ì¹™½É…  ¡Ñ…ˆ¤€ôøÑ…ˆ¹±…ÍÍ1¥ÍĞ¹Ñ½±” …Ñ¥Ù”œ°Ñ…ˆ¹‘…Ñ…Í•Ğ¹Ù¥•Ü€ôôôÙ¥•Ü¤¤ì)ô()™Õ¹Ñ¥½¸±•…É	¥¹½É´ ¤ì•°¹‰¥¹½É´¹É•Í•Ğ ¤ì•°¹‰¥¹%¹Ù…±Õ”€ô€œœì•°¹‰¥¹…Á…¥Ñä¹Ù…±Õ”€ô€ÔÀÀì•°¹‰¥¹5¥¹-œ¹Ù…±Õ”€ô€ÔÀìÍ¡½İ%µ…•AÉ•Ù¥•Ü¡•°¹‰¥¹%µ…•AÉ•Ù¥•Ü°•°¹‰¥¹%µ…•µÁÑä¤ìô)™Õ¹Ñ¥½¸±•…É•Ñ…¥±½É´ ¤ì•°¹‘•Ñ…¥±AÉ½‘ÕÑ½É´¹É•Í•Ğ ¤ì•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”€ô€œœìÍ¡½İ%µ…•AÉ•Ù¥•Ü¡•°¹‘•Ñ…¥±‘µ¥¹%µ…•AÉ•Ù¥•Ü°•°¹‘•Ñ…¥±‘µ¥¹%µ…•µÁÑä¤ìô()…Íå¹Œ™Õ¹Ñ¥½¸Í…Ù•]¡½±•Í…±”¡•Ù•¹Ğ¤ì(€•Ù•¹Ğ¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ìÍ•Ñ	ÕÍä¡•°¹‰¥¹½É´°ÑÉÕ”¤ì(€ÑÉäì(€€€½¹ÍĞÕÉÉ•¹Ğ€ô•°¹‰¥¹%¹Ù…±Õ”€üÁÉ½‘ÕÑ	å%¡•°¹‰¥¹%¹Ù…±Õ”¤€è¹Õ±°ì(€€€½¹ÍĞÕÁ±½…‘•‘%µ…”€ô…İ…¥ĞÕÁ±½…‘AÉ½‘ÕÑ%µ…”¡•°¹‰¥¹%µ…•¥±”¹™¥±•Ìü¹lÁt¤ì(€€€½¹ÍĞ¥µ…•UÉ°€ôÕÁ±½…‘•‘%µ…”ñğÕÉÉ•¹Ğü¹¥µ…•}ÕÉ°ñğ€œœì(€€€¥˜€ …¥µ…•UÉ°¤Ñ¡É½Ü¹•ÜÉÉ½È M•±•¥½¹„Õ¹„¥µ…•¸Á…É„•°ÁÉ½‘ÕÑ¼¸œ¤ì(€€€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}Í…Ù•}İ¡½±•Í…±•}ÁÉ½‘ÕĞœ°ì(€€€€€Á}±½Ñ}¥è•°¹‰¥¹%¹Ù…±Õ”ñğ¹Õ±°°(€€€€€Á}¹…µ”è•°¹‰¥¹AÉ½‘ÕĞ¹Ù…±Õ”¹ÑÉ¥´ ¤°(€€€€€Á}Ù…É¥•Ñäè•°¹‰¥¹Y…É¥•Ñä¹Ù…±Õ”¹ÑÉ¥´ ¤°(€€€€€Á}‘•ÍÉ¥ÁÑ¥½¸è•°¹‰¥¹9½Ñ•Ì¹Ù…±Õ”¹ÑÉ¥´ ¤°(€€€€€Á}¥µ…•}ÕÉ°è¥µ…•UÉ°°(€€€€€Á}ÁÉ¥”è9Õµ‰•È¡•°¹‰¥¹AÉ¥”¹Ù…±Õ”¤°(€€€€€Á}…Á…¥Ñäè9Õµ‰•È¡•°¹‰¥¹…Á…¥Ñä¹Ù…±Õ”¤°(€€€€€Á}µ¥¹¥µÕ´è9Õµ‰•È¡•°¹‰¥¹5¥¹-œ¹Ù…±Õ”¤°(€€€€€Á}ÍÑ…ÑÕÌè•°¹‰¥¹MÑ…ÑÕÌ¹Ù…±Õ”€ôôô€=A8œ€ü€½Á•¸œ€è•°¹‰¥¹MÑ…ÑÕÌ¹Ù…±Õ”€ôôô€M=1}=UPœ€ü€™Õ±°œ€è€±½Í•œ(€€€ô¤ì(€€€¥˜€¡•ÉÉ½È¤Ñ¡É½Ü•ÉÉ½Èì(€€€±•…É	¥¹½É´ ¤ì…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ AÉ½‘ÕÑ¼µ…å½É¥ÍÑ„Õ…É‘…‘¼¸œ¤ì(€ô…Ñ €¡•ÉÉ½È¤ìÑ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ìô™¥¹…±±äìÍ•Ñ	ÕÍä¡•°¹‰¥¹½É´°™…±Í”¤ìô)ô()…Íå¹Œ™Õ¹Ñ¥½¸Í…Ù••Ñ…¥°¡•Ù•¹Ğ¤ì(€•Ù•¹Ğ¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ìÍ•Ñ	ÕÍä¡•°¹‘•Ñ…¥±AÉ½‘ÕÑ½É´°ÑÉÕ”¤ì(€½¹ÍĞÕÉÉ•¹Ğ€ô•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”€üÁÉ½‘ÕÑ	å%¡•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”¤€è¹Õ±°ì(€ÑÉäì(€€€½¹ÍĞÕÁ±½…‘•‘%µ…”€ô…İ…¥ĞÕÁ±½…‘AÉ½‘ÕÑ%µ…”¡•°¹‘•Ñ…¥±‘µ¥¹%µ…•¥±”¹™¥±•Ìü¹lÁt¤ì(€€€½¹ÍĞ¥µ…•UÉ°€ôÕÁ±½…‘•‘%µ…”ñğÕÉÉ•¹Ğü¹¥µ…•}ÕÉ°ñğ€œœì(€€€¥˜€ …¥µ…•UÉ°¤Ñ¡É½Ü¹•ÜÉÉ½È M•±•¥½¹„Õ¹„¥µ…•¸Á…É„•°ÁÉ½‘ÕÑ¼¸œ¤ì(€€€½¹ÍĞÁ…å±½…€ôì¹…µ”è•°¹‘•Ñ…¥±‘µ¥¹9…µ”¹Ù…±Õ”¹ÑÉ¥´ ¤°Ù…É¥•ÑäèÕÉÉ•¹Ğü¹Ù…É¥•Ñäñğ€œœ°‘•ÍÉ¥ÁÑ¥½¸èÕÉÉ•¹Ğü¹¹½Ñ•Ìñğ€œœ°¥µ…•}ÕÉ°è¥µ…•UÉ°°Í…±•}Õ¹¥Ğè€­¥±¼œ°•ÅÕ¥Ù…±•¹Ñ}İ•¥¡Ñ}­œè€Ä°İ¡½±•Í…±•}ÁÉ¥”è9Õµ‰•È¡ÕÉÉ•¹Ğü¹İ¡½±•Í…±•}ÁÉ¥”ñğ•°¹‘•Ñ…¥±‘µ¥¹AÉ¥”¹Ù…±Õ”¤°‘•Ñ…¥±}ÁÉ¥”è9Õµ‰•È¡•°¹‘•Ñ…¥±‘µ¥¹AÉ¥”¹Ù…±Õ”¤°µ¥¹¥µÕµ}ÅÕ…¹Ñ¥Ñäè€Ä°É•Ñ…¥±}ÍÑ½­}­œè9Õµ‰•È¡•°¹‘•Ñ…¥±‘µ¥¹MÑ½¬¹Ù…±Õ”¤°É•Ñ…¥±}•¹…‰±•èÑÉÕ”°…É¡¥Ù•‘}…Ğè¹Õ±°°Í•…Í½¹}ÍÑ…ÑÕÌè€…Ù…¥±…‰±”œ°¥Í}ÁÕ‰±¥Í¡•èÑÉÕ”ôì(€€€½¹ÍĞÅÕ•Éä€ô•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”€ü‘ˆ¹™É½´ ÁÉ½‘ÕÑÌœ¤¹ÕÁ‘…Ñ”¡Á…å±½…¤¹•Ä ¥œ°•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”¤€è‘ˆ¹™É½´ ÁÉ½‘ÕÑÌœ¤¹¥¹Í•ÉĞ¡Á…å±½…¤ì(€€€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥ĞÅÕ•Éäì¥˜€¡•ÉÉ½È¤Ñ¡É½Ü•ÉÉ½Èì(€€€±•…É•Ñ…¥±½É´ ¤ì…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ AÉ½‘ÕÑ¼…°‘•Ñ…±±”Õ…É‘…‘¼¸œ¤ì(€ô…Ñ €¡•ÉÉ½È¤ìÑ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ìô™¥¹…±±äìÍ•Ñ	ÕÍä¡•°¹‘•Ñ…¥±AÉ½‘ÕÑ½É´°™…±Í”¤ìô)ô()™Õ¹Ñ¥½¸•‘¥ÑAÉ½‘ÕĞ¡¥¤ì(€½¹ÍĞÁÉ½‘ÕĞ€ôÁÉ½‘ÕÑ	å%¡¥¤ì¥˜€ …ÁÉ½‘ÕĞ¤É•ÑÕÉ¸ì(€Íİ¥Ñ¡‘µ¥¹Y¥•Ü É•…Èœ¤ì(€¥˜€¡ÁÉ½‘ÕĞ¹¡…¹¹•°€ôôô€I=]	Ue%9œ¤ì(€€€•°¹‰¥¹%¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹¥ì•°¹‰¥¹AÉ½‘ÕĞ¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹¹…µ”ì•°¹‰¥¹Y…É¥•Ñä¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹Ù…É¥•Ñäì(€€€•°¹‰¥¹9½Ñ•Ì¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹¹½Ñ•Ìì•°¹‰¥¹AÉ¥”¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹ÁÉ¥•}Á•É}­œì•°¹‰¥¹…Á…¥Ñä¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹…Á…¥Ñå}­œì(€€€•°¹‰¥¹5¥¹-œ¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹µ¥¹}½É‘•É}­œì•°¹‰¥¹MÑ…ÑÕÌ¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹ÍÑ…ÑÕÌì(€€€Í¡½İ%µ…•AÉ•Ù¥•Ü¡•°¹‰¥¹%µ…•AÉ•Ù¥•Ü°•°¹‰¥¹%µ…•µÁÑä°ÁÉ½‘ÕĞ¹¥µ…•}ÕÉ°¤ì(€ô•±Í”ì(€€€•°¹‘•Ñ…¥±‘µ¥¹%¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹¥ì•°¹‘•Ñ…¥±‘µ¥¹9…µ”¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹¹…µ”ì(€€€•°¹‘•Ñ…¥±‘µ¥¹AÉ¥”¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹ÁÉ¥•}Á•É}­œì•°¹‘•Ñ…¥±‘µ¥¹MÑ½¬¹Ù…±Õ”€ôÁÉ½‘ÕĞ¹ÍÑ½­}­œì(€€€Í¡½İ%µ…•AÉ•Ù¥•Ü¡•°¹‘•Ñ…¥±‘µ¥¹%µ…•AÉ•Ù¥•Ü°•°¹‘•Ñ…¥±‘µ¥¹%µ…•µÁÑä°ÁÉ½‘ÕĞ¹¥µ…•}ÕÉ°¤ì(€ô)ô()…Íå¹Œ™Õ¹Ñ¥½¸…É¡¥Ù•AÉ½‘ÕĞ¡¥¤ì(€½¹ÍĞ¥Ñ•´€ôÁÉ½‘ÕÑ	å%¡¥¤ì(€¥˜€ …¥Ñ•´¤É•ÑÕÉ¸ì(€½¹ÍĞ±…‰•°€ô¥Ñ•´¹¡…¹¹•°€ôôô€I=]	Ue%9œ€ü€±½Ñ”µ…å½É¥ÍÑ„œ€è€ÁÉ½‘ÕÑ¼…°‘•Ñ…±±”œì(€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´¡ƒ
ıÉ¡¥Ù…È•ÍÑ”€‘í±…‰•±ôü•©…Ë„‘”…Á…É••ÈÁ…É„±½Ì±¥•¹Ñ•Ì°Á•É¼½¹Í•ÉÙ…Ë„ÍÕÌÁ•‘¥‘½Ì¹€¤¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô¥Ñ•´¹¡…¹¹•°€ôôô€I=]	Ue%9œ(€€€€ü…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}…É¡¥Ù•}±½Ğœ°ìÁ}±½Ñ}¥è¥Ñ•´¹±½Ñ}¥ô¤(€€€€è…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}…É¡¥Ù•}É•Ñ…¥±}ÁÉ½‘ÕĞœ°ìÁ}ÁÉ½‘ÕÑ}¥è¥Ñ•´¹ÁÉ½‘ÕÑ}¥ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ AÉ½‘ÕÑ¼…É¡¥Ù…‘¼Í¥¸Á•É‘•ÈÍÔ¡¥ÍÑ½É¥…°¸œ¤ì)ô()™Õ¹Ñ¥½¸½É‘•ÉMÕµµ…Éä¡¥¤ì(€½¹ÍĞ½É‘•È€ôÍÑ…Ñ”¹½É‘•ÉÌ¹™¥¹ ¡¥Ñ•´¤€ôø¥Ñ•´¹¥€ôôô¥¤ì(€É•ÑÕÉ¸½É‘•È€ü€‘í½É‘•È¹ÁÉ½‘ÕĞü¹¹…µ”ñğ€AÉ½‘ÕÑ¼ôƒ
Ü€‘í¹Õµ‰•È¡½É‘•È¹­œ¥ô­œƒ
Ü€‘íµ½¹•ä¡½É‘•È¹Ñ½Ñ…±}ÁÉ¥”¥õ€€è€•ÍÑ”Á•‘¥‘¼œì)ô()…Íå¹Œ™Õ¹Ñ¥½¸…‘Ù…¹•=É‘•È¡¥¤ì(€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´¡ƒ
ı½¹™¥Éµ…Ì•°Í¥Õ¥•¹Ñ”…Ù…¹”Á…É„€‘í½É‘•ÉMÕµµ…Éä¡¥¥ôı€¤¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}…‘Ù…¹•}½É‘•Èœ°ìÁ}½É‘•É}¥è¥ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ A•‘¥‘¼…ÑÕ…±¥é…‘¼¸AÕ•‘•Ì½ÉÉ•¥È•°ƒé±Ñ¥µ¼•ÍÑ…‘¼Í¤™Õ”Õ¸•ÉÉ½È¸œ¤ì)ô()…Íå¹Œ™Õ¹Ñ¥½¸½¹™¥Éµ=É‘•ÉA…åµ•¹Ğ¡¥¤ì(€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´¡ƒ
ı½¹™¥Éµ…ÌÅÕ”É•¥‰¥ÍÑ”•°Á…¼‘”€‘í½É‘•ÉMÕµµ…Éä¡¥¥ôı€¤¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}½¹™¥Éµ}½É‘•É}Á…åµ•¹Ğœ°ìÁ}½É‘•É}¥è¥ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ A…¼½¹™¥Éµ…‘¼äÁ•‘¥‘¼…ÑÕ…±¥é…‘¼¸œ¤ì)ô()…Íå¹Œ™Õ¹Ñ¥½¸É•Ù•ÉÑ=É‘•È¡¥¤ì(€½¹ÍĞÉ•…Í½¸€ôİ¥¹‘½Ü¹ÁÉ½µÁĞ %¹‘¥„•°µ½Ñ¥Ù¼Á…É„½ÉÉ•¥È•°ƒé±Ñ¥µ¼•ÍÑ…‘¼èœ¤ì(€¥˜€ …É•…Í½¸¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}É•Ù•ÉÑ}½É‘•É}ÍÑ…ÑÕÌœ°ìÁ}½É‘•É}¥è¥°Á}É•…Í½¸èÉ•…Í½¸¹ÑÉ¥´ ¤ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ Ÿi±Ñ¥µ¼…µ‰¥¼‘”•ÍÑ…‘¼½ÉÉ•¥‘¼¸œ¤ì)ô()…Íå¹Œ™Õ¹Ñ¥½¸É•Ù•ÉÑA…åµ•¹Ğ¡¥¤ì(€½¹ÍĞÉ•…Í½¸€ôİ¥¹‘½Ü¹ÁÉ½µÁĞ %¹‘¥„Á½ÈÅ×¤‘•‰•ÌÉ•Ù•ÉÑ¥È±„½¹™¥Éµ…§Í¸‘•°Á…¼èœ¤ì(€¥˜€ …É•…Í½¸¤É•ÑÕÉ¸ì(€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´¡°Á…¼‘”€‘í½É‘•ÉMÕµµ…Éä¡¥¥ôÙ½±Ù•Ë„„Á•¹‘¥•¹Ñ”¸ƒ
ı½¹Ñ¥¹Õ…Èı€¤¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}É•Ù•ÉÑ}½É‘•É}Á…åµ•¹Ğœ°ìÁ}½É‘•É}¥è¥°Á}É•…Í½¸èÉ•…Í½¸¹ÑÉ¥´ ¤ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ A…¼É•Ù•ÉÑ¥‘¼„Á•¹‘¥•¹Ñ”¸œ¤ì)ô()…Íå¹Œ™Õ¹Ñ¥½¸…¹•±=É‘•È¡¥¤ì(€½¹ÍĞÉ•…Í½¸€ôİ¥¹‘½Ü¹ÁÉ½µÁĞ %¹‘¥„•°µ½Ñ¥Ù¼‘”±„…¹•±…§Í¸èœ¤ì(€¥˜€ …É•…Í½¸¤É•ÑÕÉ¸ì(€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´¡ƒ
ı…¹•±…È‘•™¥¹¥Ñ¥Ù…µ•¹Ñ”€‘í½É‘•ÉMÕµµ…Éä¡¥¥ôü°ÍÑ½¬Í”‘•Ù½±Ù•Ë„ä°Í¤•ÍÑ…‰„Á……‘¼°ÅÕ•‘…Ë„Õ¸É••µ‰½±Í¼Á•¹‘¥•¹Ñ”¹€¤¤É•ÑÕÉ¸ì(€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥Ğ‘ˆ¹ÉÁŒ …‘µ¥¹}…¹•±}½É‘•Èœ°ìÁ}½É‘•É}¥è¥°Á}É•…Í½¸èÉ•…Í½¸¹ÑÉ¥´ ¤ô¤ì(€¥˜€¡•ÉÉ½È¤É•ÑÕÉ¸Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€…İ…¥Ğ±½…‘‘µ¥¹…Ñ„ ¤ìÑ½…ÍĞ A•‘¥‘¼…¹•±…‘¼½¸µ½Ñ¥Ù¼É•¥ÍÑÉ…‘¼¸œ¤ì)ô()‘½Õµ•¹Ğ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€¡•Ù•¹Ğ¤€ôøì(€½¹ÍĞ‰ÕÑÑ½¸€ô•Ù•¹Ğ¹Ñ…É•Ğ¹±½Í•ÍĞ m‘…Ñ„µ…Ñ¥½¹tœ¤ì¥˜€ …‰ÕÑÑ½¸¤É•ÑÕÉ¸ì(€½¹ÍĞì…Ñ¥½¸°¥ô€ô‰ÕÑÑ½¸¹‘…Ñ…Í•Ğì(€¥˜€¡…Ñ¥½¸€ôôô€½É‘•ÈµÉ½İœ¤½Á•¹É½İ‘=É‘•È¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€½É‘•Èµ‘•Ñ…¥°œ¤½Á•¹•Ñ…¥±=É‘•È¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€•‘¥ĞµÁÉ½‘ÕĞœ¤•‘¥ÑAÉ½‘ÕĞ¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€…É¡¥Ù”µÁÉ½‘ÕĞœ¤…É¡¥Ù•AÉ½‘ÕĞ¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€…‘Ù…¹”µ½É‘•Èœ¤…‘Ù…¹•=É‘•È¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€É•Ù•ÉĞµ½É‘•Èœ¤É•Ù•ÉÑ=É‘•È¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€É•Ù•ÉĞµÁ…åµ•¹Ğœ¤É•Ù•ÉÑA…åµ•¹Ğ¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€…¹•°µ½É‘•Èœ¤…¹•±=É‘•È¡¥¤ì(€¥˜€¡…Ñ¥½¸€ôôô€½¹™¥É´µÁ…åµ•¹Ğœ¤½¹™¥Éµ=É‘•ÉA…åµ•¹Ğ¡¥¤ì)ô¤ì()•°¹¡½½Í••Ñ…¥°¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôøÍ•Ñ5½‘” ‘•Ñ…¥°œ¤¤ì)•°¹¡½½Í•É½İ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôøÍ•Ñ5½‘” É½İœ¤¤ì)•°¹µ½‘•Q…‰Ì¹™½É…  ¡Ñ…ˆ¤€ôøÑ…ˆ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôøÍ•Ñ5½‘”¡Ñ…ˆ¹‘…Ñ…Í•Ğ¹µ½‘”¤¤¤ì)•°¹½É‘•É-œ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¥¹ÁÕĞœ°€ ¤€ôøÕÁ‘…Ñ•=É‘•ÉAÉ•Ù¥•Ü¡ÁÉ½‘ÕÑ	å%¡•°¹½É‘•É	¥¹%¹Ù…±Õ”¤°•°¹½É‘•É-œ¹Ù…±Õ”°•°¹½É‘•ÉQ½Ñ…°¤¤ì)•°¹‘•Ñ…¥±=É‘•É-œ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¥¹ÁÕĞœ°€ ¤€ôøÕÁ‘…Ñ•=É‘•ÉAÉ•Ù¥•Ü¡ÁÉ½‘ÕÑ	å%¡•°¹‘•Ñ…¥±AÉ½‘ÕÑ%¹Ù…±Õ”¤°•°¹‘•Ñ…¥±=É‘•É-œ¹Ù…±Õ”°•°¹‘•Ñ…¥±=É‘•ÉQ½Ñ…°¤¤ì)•°¹½É‘•É•±¥Ù•Éä¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÍå¹•±¥Ù•Éå¥•±‘Ì¡•°¹½É‘•É•±¥Ù•Éä°•°¹½É‘•É‘‘É•ÍÍ1…‰•°°•°¹½É‘•É‘‘É•ÍÌ¤¤ì)•°¹‘•Ñ…¥±=É‘•É•±¥Ù•Éä¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÍå¹•±¥Ù•Éå¥•±‘Ì¡•°¹‘•Ñ…¥±=É‘•É•±¥Ù•Éä°•°¹‘•Ñ…¥±=É‘•É‘‘É•ÍÍ1…‰•°°•°¹‘•Ñ…¥±=É‘•É‘‘É•ÍÌ¤¤ì)•°¹½É‘•ÉA…åµ•¹Ğ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÍå¹A…åµ•¹Ñ!•±À¡•°¹½É‘•ÉA…åµ•¹Ğ°•°¹½É‘•ÉA…åµ•¹Ñ!•±À¤¤ì)•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ğ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÍå¹A…åµ•¹Ñ!•±À¡•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ğ°•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ñ!•±À¤¤ì)•°¹½É‘•É½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°€¡•Ù•¹Ğ¤€ôøì•Ù•¹Ğ¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ìÁ±…•=É‘•È¡•°¹½É‘•É	¥¹%¹Ù…±Õ”°ì¹…µ”è•°¹ÕÍÑ½µ•É9…µ”¹Ù…±Õ”¹ÑÉ¥´ ¤°•µ…¥°è•°¹ÕÍÑ½µ•Éµ…¥°¹Ù…±Õ”¹ÑÉ¥´ ¤°Á¡½¹”è•°¹ÕÍÑ½µ•ÉA¡½¹”¹Ù…±Õ”¹ÑÉ¥´ ¤ô°•°¹½É‘•É-œ¹Ù…±Õ”°•°¹½É‘•É½É´°ìÁ…åµ•¹Ğè•°¹½É‘•ÉA…åµ•¹Ğ¹Ù…±Õ”°‘•±¥Ù•Éäè•°¹½É‘•É•±¥Ù•Éä¹Ù…±Õ”°…‘‘É•ÍÌè•°¹½É‘•É‘‘É•ÍÌ¹Ù…±Õ”¹ÑÉ¥´ ¤ô¤ìô¤ì)•°¹‘•Ñ…¥±=É‘•É½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°€¡•Ù•¹Ğ¤€ôøì•Ù•¹Ğ¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ìÁ±…•=É‘•È¡•°¹‘•Ñ…¥±AÉ½‘ÕÑ%¹Ù…±Õ”°ì¹…µ”è•°¹‘•Ñ…¥±ÕÍÑ½µ•É9…µ”¹Ù…±Õ”¹ÑÉ¥´ ¤°•µ…¥°è•°¹‘•Ñ…¥±ÕÍÑ½µ•Éµ…¥°¹Ù…±Õ”¹ÑÉ¥´ ¤°Á¡½¹”è•°¹‘•Ñ…¥±ÕÍÑ½µ•ÉA¡½¹”¹Ù…±Õ”¹ÑÉ¥´ ¤ô°•°¹‘•Ñ…¥±=É‘•É-œ¹Ù…±Õ”°•°¹‘•Ñ…¥±=É‘•É½É´°ìÁ…åµ•¹Ğè•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ğ¹Ù…±Õ”°‘•±¥Ù•Éäè•°¹‘•Ñ…¥±=É‘•É•±¥Ù•Éä¹Ù…±Õ”°…‘‘É•ÍÌè•°¹‘•Ñ…¥±=É‘•É‘‘É•ÍÌ¹Ù…±Õ”¹ÑÉ¥´ ¤ô¤ìô¤ì)•°¹±½Í•=É‘•È¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±½Í•=É‘•É¥…±½Ì¤ì•°¹…¹•±=É‘•ÉÑ¥½¸¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±½Í•=É‘•É¥…±½Ì¤ì)•°¹±½Í••Ñ…¥±=É‘•È¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±½Í•=É‘•É¥…±½Ì¤ì•°¹…¹•±•Ñ…¥±=É‘•ÉÑ¥½¸¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±½Í•=É‘•É¥…±½Ì¤ì)•°¹ÁÕÉ¡…Í•±•ÉÑ±½Í”¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôø•°¹ÁÕÉ¡…Í•±•ÉĞ¹±…ÍÍ1¥ÍĞ¹…‘ ¡¥‘‘•¸œ¤¤ì)•°¹ÑÉ…­¥¹½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°ÑÉ…­=É‘•ÉÌ¤ì)•°¹ÑÉ…­¥¹±•…È¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôøì•°¹ÑÉ…­¥¹½É´¹É•Í•Ğ ¤ì•°¹ÑÉ…­¥¹I•ÍÕ±ÑÌ¹¥¹¹•É!Q50€ô€œñÀ±…ÍÌô‰¡¥¹Ğˆù%¹É•Í„ÑÔÑ•³¥™½¹¼Á…É„½¹ÍÕ±Ñ…ÈÑÕÌÁ•‘¥‘½Ì¸ğ½Àøœìô¤ì)…Íå¹Œ™Õ¹Ñ¥½¸½Á•¹‘µ¥¸¡•Ù•¹Ğ¤ì•Ù•¹Ğ¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ì•°¹…‘µ¥¹5½‘…°¹Í¡½İ5½‘…° ¤ì…İ…¥ĞÍå¹‘µ¥¸ ¤ìô)•°¹½Á•¹‘µ¥¹1¥¹¬¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°½Á•¹‘µ¥¸¤ì)•°¹™½½Ñ•É‘µ¥¹1¥¹¬¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°½Á•¹‘µ¥¸¤ì)•°¹±½Í•‘µ¥¸¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôø•°¹…‘µ¥¹5½‘…°¹±½Í” ¤¤ì)•°¹…‘µ¥¹1½¥¹½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°±½¥¹‘µ¥¸¤ì)•°¹…‘µ¥¹1½½ÕĞ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°…Íå¹Œ€ ¤€ôøì…İ…¥Ğ‘ˆ¹…ÕÑ ¹Í¥¹=ÕĞ ¤ìÍÑ…Ñ”¹¥Í‘µ¥¸€ô™…±Í”ì…İ…¥ĞÍå¹‘µ¥¸ ¤ìÑ½…ÍĞ M•Í§Í¸•ÉÉ…‘„¸œ¤ìô¤ì)•°¹µ…¥¹Q…‰Ì¹™½É…  ¡Ñ…ˆ¤€ôøÑ…ˆ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°€ ¤€ôøÍİ¥Ñ¡‘µ¥¹Y¥•Ü¡Ñ…ˆ¹‘…Ñ…Í•Ğ¹Ù¥•Ü¤¤¤ì)•°¹‰¥¹½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°Í…Ù•]¡½±•Í…±”¤ì•°¹‘•Ñ…¥±AÉ½‘ÕÑ½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°Í…Ù••Ñ…¥°¤ì)•°¹±•…É	¥¹½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±•…É	¥¹½É´¤ì•°¹±•…É•Ñ…¥±½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°±•…É•Ñ…¥±½É´¤ì)•°¹‰¥¹%µ…•¥±”¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÁÉ•Ù¥•İM•±•Ñ•‘%µ…”¡•°¹‰¥¹%µ…•¥±”°•°¹‰¥¹%µ…•AÉ•Ù¥•Ü°•°¹‰¥¹%µ…•µÁÑä¤¤ì)•°¹‘•Ñ…¥±‘µ¥¹%µ…•¥±”¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°€ ¤€ôøÁÉ•Ù¥•İM•±•Ñ•‘%µ…”¡•°¹‘•Ñ…¥±‘µ¥¹%µ…•¥±”°•°¹‘•Ñ…¥±‘µ¥¹%µ…•AÉ•Ù¥•Ü°•°¹‘•Ñ…¥±‘µ¥¹%µ…•µÁÑä¤¤ì()…Íå¹Œ™Õ¹Ñ¥½¸¥¹¥Ğ ¤ì(€Íå¹•±¥Ù•Éå¥•±‘Ì¡•°¹½É‘•É•±¥Ù•Éä°•°¹½É‘•É‘‘É•ÍÍ1…‰•°°•°¹½É‘•É‘‘É•ÍÌ¤ì(€Íå¹•±¥Ù•Éå¥•±‘Ì¡•°¹‘•Ñ…¥±=É‘•É•±¥Ù•Éä°•°¹‘•Ñ…¥±=É‘•É‘‘É•ÍÍ1…‰•°°•°¹‘•Ñ…¥±=É‘•É‘‘É•ÍÌ¤ì(€Íå¹A…åµ•¹Ñ!•±À¡•°¹½É‘•ÉA…åµ•¹Ğ°•°¹½É‘•ÉA…åµ•¹Ñ!•±À¤ì(€Íå¹A…åµ•¹Ñ!•±À¡•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ğ°•°¹‘•Ñ…¥±=É‘•ÉA…åµ•¹Ñ!•±À¤ì(€ÑÉäì…İ…¥Ğ±½…‘AÉ½‘ÕÑÌ ¤ìô(€…Ñ €¡•ÉÉ½È¤ì(€€€½¹ÍĞµ•ÍÍ…”€ô€9¼™Õ”Á½Í¥‰±”…É…È±½ÌÁÉ½‘ÕÑ½Ì¸©•ÕÑ„ÍÕÁ…‰…Í”½Í¡•µ„¹ÍÅ°•¸•°ME0‘¥Ñ½È¸œì(€€€•°¹‘•Ñ…¥±AÉ½‘ÕÑÌ¹¥¹¹•É!Q50€ô€ñÀ±…ÍÌô‰¡¥¹Ğˆø‘íµ•ÍÍ…•ôğ½Àù€ì•°¹‰¥¹Í1¥ÍĞ¹¥¹¹•É!Q50€ô€ñÀ±…ÍÌô‰¡¥¹Ğˆø‘íµ•ÍÍ…•ôğ½Àù€ì(€€€Ñ½…ÍĞ¡•ÉÉ½É5•ÍÍ…”¡•ÉÉ½È¤°ÑÉÕ”¤ì(€ô)ô()¥¹¥Ğ ¤ì(