const STORAGE_KEY = 'crowdbuying-db-v2';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';

const ORDER_STATES = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
const NEXT_STATE = {
  PENDING: 'IN_TRANSIT',
  IN_TRANSIT: 'DELIVERED',
  DELIVERED: 'COMPLETED',
  COMPLETED: null,
  CANCELLED: null
};

const el = {
  binsList: document.getElementById('bins-list'),
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
  customerName: document.getElementById('customer-name'),
  customerEmail: document.getElementById('customer-email'),
  customerPhone: document.getElementById('customer-phone'),
  openAdmin: document.getElementById('open-admin'),
  closeOrder: document.getElementById('close-order'),
  adminModal: document.getElementById('admin-modal'),
  closeAdmin: document.getElementById('close-admin'),
  adminLoginSection: document.getElementById('admin-login-section'),
  adminPanelSection: document.getElementById('admin-panel-section'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminEmail: document.getElementById('admin-email'),
  adminPassword: document.getElementById('admin-password'),
  adminLogout: document.getElementById('admin-logout'),
  binForm: document.getElementById('bin-form'),
  binId: document.getElementById('bin-id'),
  binProduct: document.getElementById('bin-product'),
  binVariety: document.getElementById('bin-variety'),
  binPrice: document.getElementById('bin-price'),
  binCapacity: document.getElementById('bin-capacity'),
  binPackaging: document.getElementById('bin-packaging'),
  binImage: document.getElementById('bin-image'),
  binStatus: document.getElementById('bin-status'),
  binNotes: document.getElementById('bin-notes'),
  clearBinForm: document.getElementById('clear-bin-form'),
  adminBinsOpen: document.getElementById('admin-bins-open'),
  adminBinsSold: document.getElementById('admin-bins-sold'),
  kpiGrid: document.getElementById('kpi-grid'),
  kgChart: document.getElementById('kg-chart'),
  amountChart: document.getElementById('amount-chart'),
  kgLegend: document.getElementById('kg-legend'),
  toast: document.getElementById('toast')
};

const uid = () => crypto.randomUUID();
const CLP = new Intl.NumberFormat('es-CL');

function seedDB() {
  const now = new Date().toISOString();
  const adminId = uid();
  const paltaId = uid();
  const naranjaId = uid();

  const users = [
    { id: adminId, name: 'Administrador', email: 'admin@lazo.cl', phone: '+56900000000', role: 'ADMIN', password: 'admin123', created_at: now },
    { id: uid(), name: 'Juan Pérez', email: 'juan@email.com', phone: '+56999888777', role: 'CUSTOMER', created_at: now },
    { id: uid(), name: 'Mini Market Norte', email: 'compras@market.cl', phone: '+56911222333', role: 'CUSTOMER', created_at: now }
  ];

  const bins = [
    {
      id: paltaId,
      product_name: 'Palta Hass',
      variety: 'Hass calibre 22',
      packaging: 'GRANEL',
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
      packaging: 'GRANEL',
      notes: 'Lote uniforme para jugo y mesa. Venta por bin completo.',
      price_per_kg: 1290,
      capacity_kg: 500,
      sold_kg: 500,
      status: 'SOLD_OUT',
      image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
      created_at: now
    }
  ];

  const orders = [
    {
      id: uid(),
      bin_id: naranjaId,
      customer_id: users[1].id,
      kg: 220,
      unit_price: 1290,
      total_price: 283800,
      status: 'COMPLETED',
      created_at: now
    },
    {
      id: uid(),
      bin_id: naranjaId,
      customer_id: users[2].id,
      kg: 280,
      unit_price: 1290,
      total_price: 361200,
      status: 'DELIVERED',
      created_at: now
    }
  ];

  return { users, bins, orders };
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
  getBins() {
    return getDB().bins;
  },
  getBin(id) {
    return getDB().bins.find((b) => b.id === id);
  },
  createOrder(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Bin no encontrado.');
    if (bin.status !== 'OPEN') throw new Error('El bin no está abierto para compra.');

    const requestedKg = Number(payload.kg);
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    if (requestedKg <= 0 || requestedKg > available) {
      throw new Error(`Stock insuficiente. Solo quedan ${available} kg.`);
    }

    const customer = {
      id: uid(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: 'CUSTOMER',
      created_at: new Date().toISOString()
    };

    db.users.push(customer);

    const order = {
      id: uid(),
      bin_id: bin.id,
      customer_id: customer.id,
      kg: requestedKg,
      unit_price: bin.price_per_kg,
      total_price: requestedKg * bin.price_per_kg,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    bin.sold_kg += requestedKg;
    if (bin.sold_kg >= bin.capacity_kg) {
      bin.sold_kg = bin.capacity_kg;
      bin.status = 'SOLD_OUT';
    }

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
  logout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },
  isAdmin() {
    return Boolean(localStorage.getItem(ADMIN_SESSION_KEY));
  },
  createBin(payload) {
    const db = getDB();
    const bin = {
      id: uid(),
      product_name: payload.product_name,
      variety: payload.variety || '',
      packaging: payload.packaging || 'GRANEL',
      notes: payload.notes || '',
      price_per_kg: Number(payload.price_per_kg),
      capacity_kg: Number(payload.capacity_kg || 500),
      sold_kg: 0,
      status: payload.status || 'OPEN',
      image_url: payload.image_url,
      created_at: new Date().toISOString()
    };

    db.bins.unshift(bin);
    saveDB(db);
    return bin;
  },
  updateBin(binId, payload) {
    const db = getDB();
    const bin = db.bins.find((b) => b.id === binId);
    if (!bin) throw new Error('Bin no encontrado.');

    Object.assign(bin, {
      product_name: payload.product_name,
      variety: payload.variety || '',
      packaging: payload.packaging || 'GRANEL',
      notes: payload.notes || '',
      price_per_kg: Number(payload.price_per_kg),
      capacity_kg: Number(payload.capacity_kg),
      image_url: payload.image_url,
      status: payload.status
    });

    if (bin.sold_kg >= bin.capacity_kg) {
      bin.sold_kg = bin.capacity_kg;
      bin.status = 'SOLD_OUT';
    }

    saveDB(db);
    return bin;
  },
  getOrdersByBin(binId) {
    const db = getDB();
    return db.orders
      .filter((o) => o.bin_id === binId)
      .map((order) => {
        const user = db.users.find((u) => u.id === order.customer_id);
        return { ...order, customer: user };
      });
  },
  updateOrderStatus(orderId, status) {
    const db = getDB();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado.');
    if (!ORDER_STATES.includes(status)) throw new Error('Estado inválido.');
    order.status = status;
    saveDB(db);
    return order;
  }
};

function money(value) {
  return `$${CLP.format(Math.round(value || 0))}`;
}

function toast(message, isError = false) {
  el.toast.textContent = message;
  el.toast.className = `toast show ${isError ? 'error' : 'success'}`;
  setTimeout(() => (el.toast.className = 'toast'), 2800);
}

function statusTag(status) {
  return `<span class="bin-status ${status}">${status}</span>`;
}

function renderBins() {
  const bins = api.getBins();

  el.binsList.innerHTML = bins.map((bin) => {
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
    const buyDisabled = bin.status !== 'OPEN' || available <= 0;

    return `
      <article class="bin-card">
        <img class="bin-image" src="${bin.image_url}" alt="${bin.product_name}" />
        <div class="bin-body">
          <h3>${bin.product_name}</h3>
          ${statusTag(bin.status)}
          <p class="bin-meta">Variedad: <strong>${bin.variety || 'No especificada'}</strong></p>
          <p class="bin-meta">Tipo: <strong>${bin.packaging || 'GRANEL'}</strong></p>
          <p class="bin-meta">Precio por kilo: <strong>${money(bin.price_per_kg)}</strong></p>
          <p class="bin-meta">Capacidad total: ${bin.capacity_kg} kg</p>

          <div class="progress-wrap">
            <div class="progress-mem" style="--sold:${pct}%">
              <div class="progress-sold"></div>
              <div class="progress-available"></div>
            </div>
            <div class="progress-text">
              <span>${bin.sold_kg} kg vendidos</span>
              <span>${available} kg disponibles</span>
              <strong>${pct}% completado</strong>
            </div>
          </div>

          ${bin.notes ? `<div class="bin-notes">${bin.notes}</div>` : ''}
          <button class="btn buy-btn" data-id="${bin.id}" ${buyDisabled ? 'disabled' : ''}>Comprar kilos</button>
        </div>
      </article>
    `;
  }).join('');

  el.binsList.querySelectorAll('.buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(btn.dataset.id));
  });
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
  el.orderKg.max = String(available);
  el.orderStockHelp.textContent = `${available} kg disponibles para ${bin.product_name}.`;
  updateSummary(bin, 0);
  el.orderTotal.textContent = `Total: ${money(0)}`;
  el.orderModal.showModal();
}

function fillAdminForm(bin) {
  el.binId.value = bin.id;
  el.binProduct.value = bin.product_name;
  el.binVariety.value = bin.variety || '';
  el.binPrice.value = bin.price_per_kg;
  el.binCapacity.value = bin.capacity_kg;
  el.binPackaging.value = bin.packaging || 'GRANEL';
  el.binImage.value = bin.image_url;
  el.binStatus.value = bin.status;
  el.binNotes.value = bin.notes || '';
}

function clearAdminForm() {
  el.binForm.reset();
  el.binId.value = '';
  el.binCapacity.value = '500';
  el.binStatus.value = 'OPEN';
  el.binPackaging.value = 'GRANEL';
}

function computeBinSummary(bin, orders) {
  const byStatus = {
    PENDING: 0,
    IN_TRANSIT: 0,
    DELIVERED: 0,
    COMPLETED: 0,
    CANCELLED: 0
  };

  let soldAmount = 0;
  let recaudado = 0;
  let inTransit = 0;

  orders.forEach((o) => {
    byStatus[o.status] += 1;
    soldAmount += o.total_price;
    if (o.status === 'COMPLETED') recaudado += o.total_price;
    if (o.status === 'IN_TRANSIT' || o.status === 'DELIVERED') inTransit += o.total_price;
  });

  return {
    soldAmount,
    recaudado,
    inTransit,
    pendingAmount: soldAmount - recaudado - inTransit,
    byStatus
  };
}

function orderItemTemplate(order, bin) {
  const next = NEXT_STATE[order.status];
  const canMove = Boolean(next);

  return `
    <div class="order-item">
      <div>
        <strong>${order.customer?.name || 'Cliente'}</strong>
        <div>${order.kg} kg · ${money(order.total_price)}</div>
      </div>
      <div>
        <span class="order-status ${order.status}">${order.status}</span>
        <div>${order.customer?.phone || 'Sin teléfono'} · ${order.customer?.email || ''}</div>
      </div>
      <div class="order-actions">
        ${canMove ? `<button class="btn tiny warn order-next" data-order-id="${order.id}" data-next="${next}" data-bin-id="${bin.id}">Pasar a ${next}</button>` : ''}
        ${order.status !== 'CANCELLED' && order.status !== 'COMPLETED' ? `<button class="btn tiny secondary order-cancel" data-order-id="${order.id}" data-bin-id="${bin.id}">Cancelar</button>` : ''}
      </div>
    </div>
  `;
}

function renderAdminBinCard(bin) {
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
          <p class="bin-meta">Variedad: ${bin.variety || 'No especificada'} · Tipo: ${bin.packaging || 'GRANEL'}</p>
          ${statusTag(bin.status)}
        </div>
        <div>
          <button class="btn secondary edit-bin" data-id="${bin.id}">Editar</button>
        </div>
      </div>

      <div class="progress-wrap">
        <div class="progress-mem" style="--sold:${pct}%">
          <div class="progress-sold"></div>
          <div class="progress-available"></div>
        </div>
      </div>

      <div class="bin-summary-grid">
        <div class="summary-chip"><span>Disponible</span><strong>${available} kg</strong></div>
        <div class="summary-chip"><span>Vendido</span><strong>${bin.sold_kg} kg</strong></div>
        <div class="summary-chip"><span>Recaudado</span><strong>${money(summary.recaudado)}</strong></div>
        <div class="summary-chip"><span>En tránsito</span><strong>${money(summary.inTransit)}</strong></div>
      </div>

      ${bin.notes ? `<div class="bin-notes">${bin.notes}</div>` : ''}

      <div class="order-list">
        <strong>Pedidos (${orders.length}):</strong>
        ${orders.length === 0 ? '<p>Sin pedidos.</p>' : orders.map((order) => orderItemTemplate(order, bin)).join('')}
      </div>
    </article>
  `;
}

function renderKpisAndCharts() {
  const db = getDB();
  const bins = db.bins;
  const orders = db.orders;

  const totalCapacity = bins.reduce((acc, b) => acc + b.capacity_kg, 0);
  const totalSoldKg = bins.reduce((acc, b) => acc + b.sold_kg, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalSoldKg);
  const revenuePotential = bins.reduce((acc, b) => acc + (b.sold_kg * b.price_per_kg), 0);

  const statusAmounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + order.total_price;
    return acc;
  }, {});

  const recaudado = statusAmounts.COMPLETED || 0;
  const inTransit = (statusAmounts.IN_TRANSIT || 0) + (statusAmounts.DELIVERED || 0);

  el.kpiGrid.innerHTML = `
    <article class="kpi-card"><p>Bins activos</p><strong>${bins.filter((b) => b.status === 'OPEN').length}</strong></article>
    <article class="kpi-card"><p>Bins recaudados</p><strong>${bins.filter((b) => b.status === 'SOLD_OUT').length}</strong></article>
    <article class="kpi-card"><p>Kg vendidos</p><strong>${totalSoldKg}</strong></article>
    <article class="kpi-card"><p>Monto vendido</p><strong>${money(revenuePotential)}</strong></article>
  `;

  const soldPct = totalCapacity ? Math.round((totalSoldKg / totalCapacity) * 100) : 0;
  const transitPct = revenuePotential ? Math.round((inTransit / revenuePotential) * 100) : 0;

  el.kgChart.style.setProperty('--part1', `${soldPct}%`);
  el.kgChart.style.setProperty('--part2', `${Math.max(0, transitPct)}%`);
  el.kgChart.innerHTML = '<div></div><div></div><div></div>';
  el.kgLegend.innerHTML = `
    <span>Vendido: <strong>${totalSoldKg} kg (${soldPct}%)</strong></span>
    <span>Disponible: <strong>${totalAvailable} kg</strong></span>
    <span>Logística activa: <strong>${money(inTransit)}</strong></span>
  `;

  const maxAmount = Math.max(1, ...ORDER_STATES.map((state) => statusAmounts[state] || 0));
  el.amountChart.innerHTML = ORDER_STATES.map((state) => {
    const value = statusAmounts[state] || 0;
    const w = Math.round((value / maxAmount) * 100);
    return `
      <div class="bar-row">
        <span>${state}</span>
        <div class="bar-track"><div class="bar-fill" style="--w:${w}%"></div></div>
        <strong>${money(value)}</strong>
      </div>
    `;
  }).join('');

  void recaudado;
}

function bindAdminBinActions() {
  document.querySelectorAll('.edit-bin').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bin = api.getBin(btn.dataset.id);
      if (bin) fillAdminForm(bin);
    });
  });

  document.querySelectorAll('.order-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      try {
        api.updateOrderStatus(btn.dataset.orderId, btn.dataset.next);
        renderAdminBins();
        renderBins();
        toast(`Pedido actualizado a ${btn.dataset.next}.`);
      } catch (error) {
        toast(error.message, true);
      }
    });
  });

  document.querySelectorAll('.order-cancel').forEach((btn) => {
    btn.addEventListener('click', () => {
      try {
        api.updateOrderStatus(btn.dataset.orderId, 'CANCELLED');
        renderAdminBins();
        toast('Pedido cancelado.');
      } catch (error) {
        toast(error.message, true);
      }
    });
  });
}

function renderAdminBins() {
  const bins = api.getBins();
  const selling = bins.filter((b) => b.status === 'OPEN' || b.status === 'CLOSED');
  const recaudados = bins.filter((b) => b.status === 'SOLD_OUT');

  el.adminBinsOpen.innerHTML = selling.length ? selling.map(renderAdminBinCard).join('') : '<p class="hint">No hay bins en venta.</p>';
  el.adminBinsSold.innerHTML = recaudados.length ? recaudados.map(renderAdminBinCard).join('') : '<p class="hint">No hay bins recaudados todavía.</p>';

  bindAdminBinActions();
  renderKpisAndCharts();
}

function syncAdminView() {
  const isAdmin = api.isAdmin();
  el.adminLoginSection.classList.toggle('hidden', isAdmin);
  el.adminPanelSection.classList.toggle('hidden', !isAdmin);
  if (isAdmin) renderAdminBins();
}

el.orderKg.addEventListener('input', () => {
  const bin = api.getBin(el.orderBinId.value);
  if (!bin) return;
  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
  const kg = Number(el.orderKg.value || 0);
  const safeKg = Math.min(Math.max(kg, 0), available);
  if (kg !== safeKg) el.orderKg.value = String(safeKg);
  el.orderTotal.textContent = `Total: ${money(safeKg * bin.price_per_kg)}`;
  updateSummary(bin, safeKg);
});

el.orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const order = api.createOrder(el.orderBinId.value, {
      name: el.customerName.value.trim(),
      email: el.customerEmail.value.trim(),
      phone: el.customerPhone.value.trim(),
      kg: Number(el.orderKg.value)
    });
    el.orderModal.close();
    renderBins();
    syncAdminView();
    toast(`Pedido creado: ${order.kg} kg (${order.status}).`);
  } catch (error) {
    toast(error.message, true);
  }
});

el.openAdmin.addEventListener('click', () => {
  syncAdminView();
  el.adminModal.showModal();
});

el.closeOrder.addEventListener('click', () => el.orderModal.close());
el.closeAdmin.addEventListener('click', () => el.adminModal.close());

el.adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    api.login(el.adminEmail.value.trim(), el.adminPassword.value.trim());
    syncAdminView();
    toast('Login de administrador exitoso.');
  } catch (error) {
    toast(error.message, true);
  }
});

el.adminLogout.addEventListener('click', () => {
  api.logout();
  syncAdminView();
  toast('Sesión cerrada.');
});

el.binForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const payload = {
      product_name: el.binProduct.value.trim(),
      variety: el.binVariety.value.trim(),
      packaging: el.binPackaging.value,
      notes: el.binNotes.value.trim(),
      price_per_kg: Number(el.binPrice.value),
      capacity_kg: Number(el.binCapacity.value || 500),
      image_url: el.binImage.value.trim(),
      status: el.binStatus.value
    };

    if (el.binId.value) {
      api.updateBin(el.binId.value, payload);
      toast('Bin actualizado correctamente.');
    } else {
      api.createBin(payload);
      toast('Bin creado correctamente.');
    }

    clearAdminForm();
    renderBins();
    renderAdminBins();
  } catch (error) {
    toast(error.message, true);
  }
});

el.clearBinForm.addEventListener('click', clearAdminForm);

Array.from(document.querySelectorAll('.tab-btn')).forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
    tabBtn.classList.add('active');
    const tab = tabBtn.dataset.tab;
    el.adminBinsOpen.classList.toggle('hidden', tab !== 'open');
    el.adminBinsSold.classList.toggle('hidden', tab !== 'sold');
  });
});

renderBins();
syncAdminView();
