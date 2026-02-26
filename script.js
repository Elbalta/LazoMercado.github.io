const STORAGE_KEY = 'crowdbuying-db-v1';
const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';

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
  binPrice: document.getElementById('bin-price'),
  binCapacity: document.getElementById('bin-capacity'),
  binImage: document.getElementById('bin-image'),
  binStatus: document.getElementById('bin-status'),
  clearBinForm: document.getElementById('clear-bin-form'),
  adminBins: document.getElementById('admin-bins'),
  toast: document.getElementById('toast')
};

const uid = () => crypto.randomUUID();
const CLP = new Intl.NumberFormat('es-CL');

function seedDB() {
  const now = new Date().toISOString();
  return {
    users: [
      { id: uid(), name: 'Administrador', email: 'admin@lazo.cl', phone: '+56900000000', role: 'ADMIN', password: 'admin123', created_at: now }
    ],
    bins: [
      {
        id: uid(),
        product_name: 'Palta Hass',
        price_per_kg: 2690,
        capacity_kg: 500,
        sold_kg: 320,
        status: 'OPEN',
        image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80',
        created_at: now
      },
      {
        id: uid(),
        product_name: 'Naranja Valencia',
        price_per_kg: 1290,
        capacity_kg: 500,
        sold_kg: 500,
        status: 'SOLD_OUT',
        image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
        created_at: now
      }
    ],
    orders: []
  };
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

// API simulada según endpoints del enunciado.
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

    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    if (payload.kg <= 0 || payload.kg > available) {
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
      kg: Number(payload.kg),
      unit_price: bin.price_per_kg,
      total_price: Number(payload.kg) * bin.price_per_kg,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    bin.sold_kg += Number(payload.kg);
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
  getAdminBins() {
    return getDB().bins;
  },
  getOrdersByBin(binId) {
    const db = getDB();
    return db.orders
      .filter((o) => o.bin_id === binId)
      .map((order) => {
        const user = db.users.find((u) => u.id === order.customer_id);
        return { ...order, customer: user };
      });
  }
};

function money(value) {
  return `$${CLP.format(value)}`;
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
  el.binPrice.value = bin.price_per_kg;
  el.binCapacity.value = bin.capacity_kg;
  el.binImage.value = bin.image_url;
  el.binStatus.value = bin.status;
}

function clearAdminForm() {
  el.binForm.reset();
  el.binId.value = '';
  el.binCapacity.value = '500';
  el.binStatus.value = 'OPEN';
}

function renderAdminBins() {
  const bins = api.getAdminBins();
  el.adminBins.innerHTML = bins.map((bin) => {
    const orders = api.getOrdersByBin(bin.id);
    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);

    return `
      <article class="admin-bin">
        <div class="admin-row">
          <div>
            <h4>${bin.product_name}</h4>
            <p class="bin-meta">${money(bin.price_per_kg)} / kg · ${bin.sold_kg}/${bin.capacity_kg} kg · ${pct}%</p>
            ${statusTag(bin.status)}
          </div>
          <div>
            <button class="btn secondary edit-bin" data-id="${bin.id}">Editar</button>
          </div>
        </div>
        <p class="bin-meta">Disponibles: ${available} kg</p>
        <div class="order-list">
          <strong>Pedidos (${orders.length}):</strong>
          ${orders.length === 0 ? '<p>Sin pedidos.</p>' : `<ul>${orders.map((o) => `<li>${o.customer?.name || 'Cliente'} · ${o.kg} kg · ${money(o.total_price)} · ${o.status}</li>`).join('')}</ul>`}
        </div>
      </article>
    `;
  }).join('');

  el.adminBins.querySelectorAll('.edit-bin').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bin = api.getBin(btn.dataset.id);
      if (bin) fillAdminForm(bin);
    });
  });
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

renderBins();
syncAdminView();
