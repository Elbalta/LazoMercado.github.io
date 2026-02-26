diff --git a/script.js b/script.js
index 87fc080289fbeaf6c19b08c549a8eb6f87fb2d56..df41e4df7e3eb03a015dc39c30bf12a5e787ffa4 100644
--- a/script.js
+++ b/script.js
@@ -1,843 +1,423 @@
-// Datos iniciales
-let pedidos = [];
-let isAdmin = false;
-let adminEmail = "";
-let metaVentas = 0;
-let costosProductos = {
-    producto1: 2500,  // Costo por kilo de paltas
-    producto2: 800,   // Costo por kilo de papas
-    producto3: 1000,  // Costo por kilo de limones
-    producto4: 400    // Costo por unidad de lechugas
-};
+const STORAGE_KEY = 'crowdbuying-db-v1';
+const ADMIN_SESSION_KEY = 'crowdbuying-admin-session';
 
-// Configuración de productos
-let productosConfig = {
-    producto1: {
-        nombre: "Paltas",
-        precio: 3500,
-        disponible: true,
-        unidad: "kg",
-        tipo: "por peso"
-    },
-    producto2: {
-        nombre: "Papas",
-        precio: 1500,
-        disponible: true,
-        unidad: "kg",
-        tipo: "por peso"
-    },
-    producto3: {
-        nombre: "Limones",
-        precio: 1800,
-        disponible: true,
-        unidad: "kg",
-        tipo: "por peso"
-    },
-    producto4: {
-        nombre: "Lechugas",
-        precio: 800,
-        disponible: true,
-        unidad: "unidad",
-        tipo: "por unidad"
-    }
+const el = {
+  binsList: document.getElementById('bins-list'),
+  summaryProduct: document.getElementById('summary-product'),
+  summaryKg: document.getElementById('summary-kg'),
+  summaryUnit: document.getElementById('summary-unit'),
+  summaryTotal: document.getElementById('summary-total'),
+  orderModal: document.getElementById('order-modal'),
+  orderForm: document.getElementById('order-form'),
+  orderBinId: document.getElementById('order-bin-id'),
+  orderKg: document.getElementById('order-kg'),
+  orderTotal: document.getElementById('order-total'),
+  orderStockHelp: document.getElementById('order-stock-help'),
+  customerName: document.getElementById('customer-name'),
+  customerEmail: document.getElementById('customer-email'),
+  customerPhone: document.getElementById('customer-phone'),
+  openAdmin: document.getElementById('open-admin'),
+  closeOrder: document.getElementById('close-order'),
+  adminModal: document.getElementById('admin-modal'),
+  closeAdmin: document.getElementById('close-admin'),
+  adminLoginSection: document.getElementById('admin-login-section'),
+  adminPanelSection: document.getElementById('admin-panel-section'),
+  adminLoginForm: document.getElementById('admin-login-form'),
+  adminEmail: document.getElementById('admin-email'),
+  adminPassword: document.getElementById('admin-password'),
+  adminLogout: document.getElementById('admin-logout'),
+  binForm: document.getElementById('bin-form'),
+  binId: document.getElementById('bin-id'),
+  binProduct: document.getElementById('bin-product'),
+  binPrice: document.getElementById('bin-price'),
+  binCapacity: document.getElementById('bin-capacity'),
+  binImage: document.getElementById('bin-image'),
+  binStatus: document.getElementById('bin-status'),
+  clearBinForm: document.getElementById('clear-bin-form'),
+  adminBins: document.getElementById('admin-bins'),
+  toast: document.getElementById('toast')
 };
 
-// Elementos DOM
-const solicitanteForm = document.getElementById('solicitante-form');
-const adminContainer = document.getElementById('admin-container');
-const adminLoginLink = document.getElementById('admin-login-link');
-const loginModal = document.getElementById('login-modal');
-const closeLogin = document.getElementById('close-login');
-const loginBtn = document.getElementById('login-btn');
-const loginError = document.getElementById('login-error');
-const logoutBtn = document.getElementById('logout-btn');
-const enviarPedidoBtn = document.getElementById('enviar-pedido');
-const ordersBody = document.getElementById('orders-body');
-const notification = document.getElementById('notification');
-const notificationText = document.getElementById('notification-text');
-const exportBtn = document.getElementById('export-btn');
-const refreshBtn = document.getElementById('refresh-btn');
-const totalPedidosElement = document.getElementById('total-pedidos');
-const pedidosPendientesElement = document.getElementById('pedidos-pendientes');
-const pedidosEntregadosElement = document.getElementById('pedidos-entregados');
-const pedidosCompletadosElement = document.getElementById('pedidos-completados');
-const addOrderBtn = document.getElementById('add-order-btn');
-const addOrderModal = document.getElementById('add-order-modal');
-const closeAddOrderModal = document.getElementById('close-add-order');
-const adminEnviarPedidoBtn = document.getElementById('admin-enviar-pedido');
-const comprasBtn = document.getElementById('compras-btn');
-const comprasModal = document.getElementById('compras-modal');
-const closeComprasModal = document.getElementById('close-compras');
-const comprasProducto1 = document.getElementById('compras-producto1');
-const comprasPapas = document.getElementById('compras-papas');
-const comprasProducto3 = document.getElementById('compras-limones');
-const comprasProducto4 = document.getElementById('compras-lechugas');
-const comprasBody = document.getElementById('compras-body');
-const printComprasBtn = document.getElementById('print-compras');
-const savePricesBtn = document.getElementById('save-prices');
-const totalIngresosElement = document.getElementById('total-ingresos');
-const totalCostosElement = document.getElementById('total-costos');
-const margenGananciaElement = document.getElementById('margen-ganancia');
-const margenBar = document.getElementById('margen-bar');
-const metaVentasElement = document.getElementById('meta-ventas');
-const metaInput = document.getElementById('meta-input');
-const metaBar = document.getElementById('meta-bar');
-const metaProgresoElement = document.getElementById('meta-progreso');
-const resumenIngresos = document.getElementById('resumen-ingresos');
-const resumenCostos = document.getElementById('resumen-costos');
-const resumenGanancias = document.getElementById('resumen-ganancias');
-const resumenMargen = document.getElementById('resumen-margen');
-
-// Inputs de costos
-const producto1CostInput = document.getElementById('producto1-cost-input');
-const producto2CostInput = document.getElementById('producto2-cost-input');
-const producto3CostInput = document.getElementById('producto3-cost-input');
-const producto4CostInput = document.getElementById('producto4-cost-input');
-
-// Tabs de administrador
-const adminTabs = document.querySelectorAll('.admin-tab');
-const adminTabContents = document.querySelectorAll('.admin-tab-content');
-
-// Función para manejar botones de cantidad
-function handleQuantityBtnClick() {
-    const target = this.dataset.target;
-    const action = this.dataset.action;
-    const input = document.getElementById(target);
-    let value = parseInt(input.value) || 0;
-    
-    if (action === 'increase') {
-        value += 1;
-    } else if (action === 'decrease' && value > 0) {
-        value -= 1;
-    }
-    
-    input.value = value;
+const uid = () => crypto.randomUUID();
+const CLP = new Intl.NumberFormat('es-CL');
+
+function seedDB() {
+  const now = new Date().toISOString();
+  return {
+    users: [
+      { id: uid(), name: 'Administrador', email: 'admin@lazo.cl', phone: '+56900000000', role: 'ADMIN', password: 'admin123', created_at: now }
+    ],
+    bins: [
+      {
+        id: uid(),
+        product_name: 'Palta Hass',
+        price_per_kg: 2690,
+        capacity_kg: 500,
+        sold_kg: 320,
+        status: 'OPEN',
+        image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80',
+        created_at: now
+      },
+      {
+        id: uid(),
+        product_name: 'Naranja Valencia',
+        price_per_kg: 1290,
+        capacity_kg: 500,
+        sold_kg: 500,
+        status: 'SOLD_OUT',
+        image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
+        created_at: now
+      }
+    ],
+    orders: []
+  };
 }
 
-// Delegación de eventos para botones de cantidad
-document.addEventListener('click', function(event) {
-    if (event.target.classList.contains('quantity-btn')) {
-        handleQuantityBtnClick.call(event.target);
-    }
-});
+function getDB() {
+  const raw = localStorage.getItem(STORAGE_KEY);
+  if (!raw) {
+    const initial = seedDB();
+    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
+    return initial;
+  }
+  return JSON.parse(raw);
+}
 
-// Actualizar nombres y precios en la interfaz
-function actualizarProductosUI() {
-    // Actualizar nombres en formulario solicitante
-    document.getElementById('producto1-name').textContent = productosConfig.producto1.nombre;
-    document.getElementById('producto2-name').textContent = productosConfig.producto2.nombre;
-    document.getElementById('producto3-name').textContent = productosConfig.producto3.nombre;
-    document.getElementById('producto4-name').textContent = productosConfig.producto4.nombre;
-    
-    // Actualizar precios en formulario solicitante
-    document.getElementById('producto1-price').textContent = '$' + productosConfig.producto1.precio.toLocaleString();
-    document.getElementById('producto2-price').textContent = '$' + productosConfig.producto2.precio.toLocaleString();
-    document.getElementById('producto3-price').textContent = '$' + productosConfig.producto3.precio.toLocaleString();
-    document.getElementById('producto4-price').textContent = '$' + productosConfig.producto4.precio.toLocaleString();
-    
-    // Actualizar en modal de admin
-    document.getElementById('admin-producto1-name').textContent = productosConfig.producto1.nombre;
-    document.getElementById('admin-producto2-name').textContent = productosConfig.producto2.nombre;
-    document.getElementById('admin-producto3-name').textContent = productosConfig.producto3.nombre;
-    document.getElementById('admin-producto4-name').textContent = productosConfig.producto4.nombre;
-    
-    document.getElementById('admin-producto1-price').textContent = productosConfig.producto1.precio.toLocaleString();
-    document.getElementById('admin-producto2-price').textContent = productosConfig.producto2.precio.toLocaleString();
-    document.getElementById('admin-producto3-price').textContent = productosConfig.producto3.precio.toLocaleString();
-    document.getElementById('admin-producto4-price').textContent = productosConfig.producto4.precio.toLocaleString();
-    
-    // Actualizar disponibilidad
-    actualizarDisponibilidadProductos();
-    
-    // Actualizar títulos en resumen de compras
-    document.getElementById('compras-title1').textContent = productosConfig.producto1.nombre;
-    document.getElementById('compras-title2').textContent = productosConfig.producto2.nombre;
-    document.getElementById('compras-title3').textContent = productosConfig.producto3.nombre;
-    document.getElementById('compras-title4').textContent = productosConfig.producto4.nombre;
+function saveDB(db) {
+  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
 }
 
-// Actualizar disponibilidad de productos
-function actualizarDisponibilidadProductos() {
-    // Producto 1
-    const producto1Card = document.getElementById('producto1-card');
-    if (productosConfig.producto1.disponible) {
-        producto1Card.classList.remove('unavailable');
-        if (producto1Card.querySelector('.unavailable-tag')) {
-            producto1Card.querySelector('.unavailable-tag').remove();
-        }
-    } else {
-        producto1Card.classList.add('unavailable');
-        if (!producto1Card.querySelector('.unavailable-tag')) {
-            const tag = document.createElement('div');
-            tag.className = 'unavailable-tag';
-            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
-            producto1Card.prepend(tag);
-        }
-    }
-    
-    // Producto 2
-    const producto2Card = document.getElementById('producto2-card');
-    if (productosConfig.producto2.disponible) {
-        producto2Card.classList.remove('unavailable');
-        if (producto2Card.querySelector('.unavailable-tag')) {
-            producto2Card.querySelector('.unavailable-tag').remove();
-        }
-    } else {
-        producto2Card.classList.add('unavailable');
-        if (!producto2Card.querySelector('.unavailable-tag')) {
-            const tag = document.createElement('div');
-            tag.className = 'unavailable-tag';
-            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
-            producto2Card.prepend(tag);
-        }
+// API simulada según endpoints del enunciado.
+const api = {
+  getBins() {
+    return getDB().bins;
+  },
+  getBin(id) {
+    return getDB().bins.find((b) => b.id === id);
+  },
+  createOrder(binId, payload) {
+    const db = getDB();
+    const bin = db.bins.find((b) => b.id === binId);
+    if (!bin) throw new Error('Bin no encontrado.');
+
+    if (bin.status !== 'OPEN') throw new Error('El bin no está abierto para compra.');
+
+    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
+    if (payload.kg <= 0 || payload.kg > available) {
+      throw new Error(`Stock insuficiente. Solo quedan ${available} kg.`);
     }
-    
-    // Producto 3
-    const producto3Card = document.getElementById('producto3-card');
-    if (productosConfig.producto3.disponible) {
-        producto3Card.classList.remove('unavailable');
-        if (producto3Card.querySelector('.unavailable-tag')) {
-            producto3Card.querySelector('.unavailable-tag').remove();
-        }
-    } else {
-        producto3Card.classList.add('unavailable');
-        if (!producto3Card.querySelector('.unavailable-tag')) {
-            const tag = document.createElement('div');
-            tag.className = 'unavailable-tag';
-            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
-            producto3Card.prepend(tag);
-        }
+
+    const customer = {
+      id: uid(),
+      name: payload.name,
+      email: payload.email,
+      phone: payload.phone,
+      role: 'CUSTOMER',
+      created_at: new Date().toISOString()
+    };
+
+    db.users.push(customer);
+
+    const order = {
+      id: uid(),
+      bin_id: bin.id,
+      customer_id: customer.id,
+      kg: Number(payload.kg),
+      unit_price: bin.price_per_kg,
+      total_price: Number(payload.kg) * bin.price_per_kg,
+      status: 'PENDING',
+      created_at: new Date().toISOString()
+    };
+
+    bin.sold_kg += Number(payload.kg);
+    if (bin.sold_kg >= bin.capacity_kg) {
+      bin.sold_kg = bin.capacity_kg;
+      bin.status = 'SOLD_OUT';
     }
-    
-    // Producto 4
-    const producto4Card = document.getElementById('producto4-card');
-    if (productosConfig.producto4.disponible) {
-        producto4Card.classList.remove('unavailable');
-        if (producto4Card.querySelector('.unavailable-tag')) {
-            producto4Card.querySelector('.unavailable-tag').remove();
-        }
-    } else {
-        producto4Card.classList.add('unavailable');
-        if (!producto4Card.querySelector('.unavailable-tag')) {
-            const tag = document.createElement('div');
-            tag.className = 'unavailable-tag';
-            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
-            producto4Card.prepend(tag);
-        }
+
+    db.orders.push(order);
+    saveDB(db);
+    return order;
+  },
+  login(email, password) {
+    const admin = getDB().users.find((u) => u.role === 'ADMIN' && u.email === email && u.password === password);
+    if (!admin) throw new Error('Credenciales inválidas.');
+    localStorage.setItem(ADMIN_SESSION_KEY, admin.id);
+    return admin;
+  },
+  logout() {
+    localStorage.removeItem(ADMIN_SESSION_KEY);
+  },
+  isAdmin() {
+    return Boolean(localStorage.getItem(ADMIN_SESSION_KEY));
+  },
+  createBin(payload) {
+    const db = getDB();
+    const bin = {
+      id: uid(),
+      product_name: payload.product_name,
+      price_per_kg: Number(payload.price_per_kg),
+      capacity_kg: Number(payload.capacity_kg || 500),
+      sold_kg: 0,
+      status: payload.status || 'OPEN',
+      image_url: payload.image_url,
+      created_at: new Date().toISOString()
+    };
+    db.bins.unshift(bin);
+    saveDB(db);
+    return bin;
+  },
+  updateBin(binId, payload) {
+    const db = getDB();
+    const bin = db.bins.find((b) => b.id === binId);
+    if (!bin) throw new Error('Bin no encontrado.');
+
+    Object.assign(bin, {
+      product_name: payload.product_name,
+      price_per_kg: Number(payload.price_per_kg),
+      capacity_kg: Number(payload.capacity_kg),
+      image_url: payload.image_url,
+      status: payload.status
+    });
+
+    if (bin.sold_kg >= bin.capacity_kg) {
+      bin.sold_kg = bin.capacity_kg;
+      bin.status = 'SOLD_OUT';
     }
-}
 
-// Mostrar notificación
-function showNotification(message, isError = false) {
-    notificationText.textContent = message;
-    notification.className = 'notification';
-    notification.classList.add(isError ? 'error' : 'success');
-    notification.classList.add('show');
-    
-    setTimeout(() => {
-        notification.classList.remove('show');
-    }, 3000);
-}
+    saveDB(db);
+    return bin;
+  },
+  getAdminBins() {
+    return getDB().bins;
+  },
+  getOrdersByBin(binId) {
+    const db = getDB();
+    return db.orders
+      .filter((o) => o.bin_id === binId)
+      .map((order) => {
+        const user = db.users.find((u) => u.id === order.customer_id);
+        return { ...order, customer: user };
+      });
+  }
+};
 
-// Calcular total del pedido
-function calcularTotalPedido(producto1, producto2, producto3, producto4) {
-    let total = 0;
-    total += producto1 * productosConfig.producto1.precio;
-    total += producto2 * productosConfig.producto2.precio;
-    total += producto3 * productosConfig.producto3.precio;
-    total += producto4 * productosConfig.producto4.precio;
-    return total;
+function money(value) {
+  return `$${CLP.format(value)}`;
 }
 
-// Actualizar panel de administrador
-function actualizarPanelAdmin() {
-    // Filtrar pedidos por estado
-    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
-    const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado');
-    const pedidosCompletados = pedidos.filter(p => p.estado === 'completado');
-    const totalPedidos = pedidos.length;
-    
-    totalPedidosElement.textContent = totalPedidos;
-    pedidosPendientesElement.textContent = pedidosPendientes.length;
-    pedidosEntregadosElement.textContent = pedidosEntregados.length;
-    pedidosCompletadosElement.textContent = pedidosCompletados.length;
-    
-    // Actualizar tabla de pedidos
-    ordersBody.innerHTML = '';
-    
-    if (pedidos.length === 0) {
-        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay pedidos registrados</td></tr>';
-        return;
-    }
-    
-    // Ordenar pedidos: primero pendientes, luego entregados, luego completados
-    const pedidosOrdenados = [...pedidos].sort((a, b) => {
-        const estados = {'pendiente': 1, 'entregado': 2, 'completado': 3};
-        return estados[a.estado] - estados[b.estado];
-    });
-    
-    pedidosOrdenados.forEach(pedido => {
-        const row = document.createElement('tr');
-        
-        // Resaltar fila según estado
-        if (pedido.estado === 'completado') {
-            row.style.backgroundColor = 'rgba(123, 31, 162, 0.05)';
-        } else if (pedido.estado === 'entregado') {
-            row.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
-        } else if (pedido.estado === 'pendiente') {
-            row.style.backgroundColor = 'rgba(245, 124, 0, 0.05)';
-        }
-        
-        // Formatear productos
-        const productos = [];
-        if (pedido.producto1 > 0) productos.push(`${productosConfig.producto1.nombre}: ${pedido.producto1} kg`);
-        if (pedido.producto2 > 0) productos.push(`${productosConfig.producto2.nombre}: ${pedido.producto2} kg`);
-        if (pedido.producto3 > 0) productos.push(`${productosConfig.producto3.nombre}: ${pedido.producto3} kg`);
-        if (pedido.producto4 > 0) productos.push(`${productosConfig.producto4.nombre}: ${pedido.producto4}`);
-        
-        row.innerHTML = `
-            <td>${pedido.nombre}</td>
-            <td>${pedido.telefono}</td>
-            <td>${productos.join('<br>')}</td>
-            <td>
-                <span class="status-badge status-${pedido.estado}">
-                    ${pedido.estado === 'pendiente' ? 'Pendiente' : 
-                     pedido.estado === 'entregado' ? 'Entregado' : 
-                     'Completado'}
-                </span>
-            </td>
-            <td>
-                <div class="action-buttons">
-                    ${pedido.estado === 'pendiente' ? 
-                        `<button class="action-btn btn-complete" data-id="${pedido.id}" data-action="entregado">
-                            <i class="fas fa-truck"></i> Entregar
-                        </button>` : ''}
-                    ${pedido.estado === 'entregado' ? 
-                        `<button class="action-btn btn-complete" data-id="${pedido.id}" data-action="completado">
-                            <i class="fas fa-check-double"></i> Completar
-                        </button>` : ''}
-                    <button class="action-btn btn-delete" data-id="${pedido.id}">
-                        <i class="fas fa-trash"></i>
-                    </button>
-                </div>
-            </td>
-        `;
-        ordersBody.appendChild(row);
-    });
+function toast(message, isError = false) {
+  el.toast.textContent = message;
+  el.toast.className = `toast show ${isError ? 'error' : 'success'}`;
+  setTimeout(() => (el.toast.className = 'toast'), 2800);
 }
 
-// Calcular estadísticas para la pestaña de finanzas
-function actualizarFinanzas() {
-    // Calcular ingresos totales (solo pedidos completados)
-    let ingresosTotales = 0;
-    let costosTotales = 0;
-    
-    pedidos.forEach(pedido => {
-        if (pedido.estado === 'completado') {
-            ingresosTotales += pedido.total;
-            
-            // Calcular costos
-            costosTotales += (pedido.producto1 * costosProductos.producto1);
-            costosTotales += (pedido.producto2 * costosProductos.producto2);
-            costosTotales += (pedido.producto3 * costosProductos.producto3);
-            costosTotales += (pedido.producto4 * costosProductos.producto4);
-        }
-    });
-    
-    // Actualizar UI
-    totalIngresosElement.textContent = ingresosTotales.toLocaleString();
-    totalCostosElement.textContent = costosTotales.toLocaleString();
-    
-    // Calcular margen de ganancia
-    let margenGanancia = 0;
-    if (ingresosTotales > 0) {
-        margenGanancia = ((ingresosTotales - costosTotales) / ingresosTotales) * 100;
-    }
-    
-    margenGanancia = Math.round(margenGanancia);
-    margenGananciaElement.textContent = margenGanancia;
-    margenBar.style.width = `${margenGanancia}%`;
-    margenBar.textContent = `${margenGanancia}%`;
-    
-    // Actualizar resumen financiero
-    resumenIngresos.textContent = ingresosTotales.toLocaleString();
-    resumenCostos.textContent = costosTotales.toLocaleString();
-    resumenGanancias.textContent = (ingresosTotales - costosTotales).toLocaleString();
-    resumenMargen.textContent = margenGanancia;
-    
-    // Actualizar progreso de meta
-    actualizarProgresoMeta();
+function statusTag(status) {
+  return `<span class="bin-status ${status}">${status}</span>`;
 }
 
-// Actualizar progreso hacia la meta de ventas
-function actualizarProgresoMeta() {
-    const ingresosTotales = parseFloat(totalIngresosElement.textContent.replace(/,/g, '')) || 0;
-    let progreso = 0;
-    
-    if (metaVentas > 0) {
-        progreso = Math.min(100, Math.round((ingresosTotales / metaVentas) * 100));
-    }
-    
-    metaBar.style.width = `${progreso}%`;
-    metaBar.textContent = `${progreso}%`;
-    metaProgresoElement.textContent = progreso;
+function renderBins() {
+  const bins = api.getBins();
+  el.binsList.innerHTML = bins.map((bin) => {
+    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
+    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
+    const buyDisabled = bin.status !== 'OPEN' || available <= 0;
+
+    return `
+      <article class="bin-card">
+        <img class="bin-image" src="${bin.image_url}" alt="${bin.product_name}" />
+        <div class="bin-body">
+          <h3>${bin.product_name}</h3>
+          ${statusTag(bin.status)}
+          <p class="bin-meta">Precio por kilo: <strong>${money(bin.price_per_kg)}</strong></p>
+          <p class="bin-meta">Capacidad total: ${bin.capacity_kg} kg</p>
+
+          <div class="progress-wrap">
+            <div class="progress-mem" style="--sold:${pct}%">
+              <div class="progress-sold"></div>
+              <div class="progress-available"></div>
+            </div>
+            <div class="progress-text">
+              <span>${bin.sold_kg} kg vendidos</span>
+              <span>${available} kg disponibles</span>
+              <strong>${pct}% completado</strong>
+            </div>
+          </div>
+
+          <button class="btn buy-btn" data-id="${bin.id}" ${buyDisabled ? 'disabled' : ''}>Comprar kilos</button>
+        </div>
+      </article>
+    `;
+  }).join('');
+
+  el.binsList.querySelectorAll('.buy-btn').forEach((btn) => {
+    btn.addEventListener('click', () => openOrderModal(btn.dataset.id));
+  });
 }
 
-// Calcular resumen de compras
-function calcularResumenCompras() {
-    let totalProducto1 = 0;
-    let totalProducto2 = 0;
-    let totalProducto3 = 0;
-    let totalProducto4 = 0;
-    
-    // Sumar solo pedidos pendientes
-    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
-    
-    pedidosPendientes.forEach(pedido => {
-        totalProducto1 += pedido.producto1 || 0;
-        totalProducto2 += pedido.producto2 || 0;
-        totalProducto3 += pedido.producto3 || 0;
-        totalProducto4 += pedido.producto4 || 0;
-    });
-    
-    // Actualizar valores en el modal
-    comprasProducto1.textContent = totalProducto1 + ' kg';
-    comprasPapas.textContent = totalProducto2 + ' kg';
-    comprasProducto3.textContent = totalProducto3 + ' kg';
-    comprasProducto4.textContent = totalProducto4 + ' unidades';
-    
-    // Actualizar tabla de resumen
-    comprasBody.innerHTML = '';
-    
-    const productos = [
-        { nombre: productosConfig.producto1.nombre, cantidad: totalProducto1, unidad: 'kg' },
-        { nombre: productosConfig.producto2.nombre, cantidad: totalProducto2, unidad: 'kg' },
-        { nombre: productosConfig.producto3.nombre, cantidad: totalProducto3, unidad: 'kg' },
-        { nombre: productosConfig.producto4.nombre, cantidad: totalProducto4, unidad: 'unidades' }
-    ];
-    
-    productos.forEach(producto => {
-        if (producto.cantidad > 0) {
-            const row = document.createElement('tr');
-            row.innerHTML = `
-                <td>${producto.nombre}</td>
-                <td>${producto.cantidad}</td>
-                <td>${producto.unidad}</td>
-            `;
-            comprasBody.appendChild(row);
-        }
-    });
-    
-    if (comprasBody.children.length === 0) {
-        comprasBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 15px; color: #666;">No hay productos para comprar</td></tr>';
-    }
+function updateSummary(bin, kg = 0) {
+  const total = kg * (bin?.price_per_kg || 0);
+  el.summaryProduct.textContent = bin ? bin.product_name : '—';
+  el.summaryKg.textContent = `${kg || 0} kg`;
+  el.summaryUnit.textContent = bin ? money(bin.price_per_kg) : '$0';
+  el.summaryTotal.textContent = money(total);
 }
 
-// Guardar configuración de productos
-savePricesBtn.addEventListener('click', () => {
-    // Guardar nombres
-    productosConfig.producto1.nombre = document.getElementById('producto1-name-input').value;
-    productosConfig.producto2.nombre = document.getElementById('producto2-name-input').value;
-    productosConfig.producto3.nombre = document.getElementById('producto3-name-input').value;
-    productosConfig.producto4.nombre = document.getElementById('producto4-name-input').value;
-    
-    // Guardar precios
-    productosConfig.producto1.precio = parseInt(document.getElementById('producto1-price-input').value) || 3500;
-    productosConfig.producto1.disponible = document.getElementById('producto1-available').checked;
-    
-    productosConfig.producto2.precio = parseInt(document.getElementById('producto2-price-input').value) || 1500;
-    productosConfig.producto2.disponible = document.getElementById('producto2-available').checked;
-    
-    productosConfig.producto3.precio = parseInt(document.getElementById('producto3-price-input').value) || 1800;
-    productosConfig.producto3.disponible = document.getElementById('producto3-available').checked;
-    
-    productosConfig.producto4.precio = parseInt(document.getElementById('producto4-price-input').value) || 800;
-    productosConfig.producto4.disponible = document.getElementById('producto4-available').checked;
-    
-    // Guardar costos
-    costosProductos.producto1 = parseInt(producto1CostInput.value) || 2500;
-    costosProductos.producto2 = parseInt(producto2CostInput.value) || 800;
-    costosProductos.producto3 = parseInt(producto3CostInput.value) || 1000;
-    costosProductos.producto4 = parseInt(producto4CostInput.value) || 400;
-    
-    // Guardar en localStorage
-    localStorage.setItem('productosConfig', JSON.stringify(productosConfig));
-    localStorage.setItem('costosProductos', JSON.stringify(costosProductos));
-    
-    // Actualizar UI
-    actualizarProductosUI();
-    
-    showNotification('Configuración guardada con éxito!');
-});
+function openOrderModal(binId) {
+  const bin = api.getBin(binId);
+  if (!bin) return;
 
-// Cambiar entre tabs de admin
-adminTabs.forEach(tab => {
-    tab.addEventListener('click', () => {
-        // Remover clase active de todas las tabs
-        adminTabs.forEach(t => t.classList.remove('active'));
-        adminTabContents.forEach(c => c.classList.remove('active'));
-        
-        // Añadir clase active a la tab seleccionada
-        tab.classList.add('active');
-        document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
-        
-        // Si es la pestaña de finanzas, actualizar datos
-        if (tab.dataset.tab === 'finanzas') {
-            actualizarFinanzas();
-        }
-    });
-});
+  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
+  el.orderForm.reset();
+  el.orderBinId.value = bin.id;
+  el.orderKg.max = String(available);
+  el.orderStockHelp.textContent = `${available} kg disponibles para ${bin.product_name}.`;
+  updateSummary(bin, 0);
+  el.orderTotal.textContent = `Total: ${money(0)}`;
+  el.orderModal.showModal();
+}
 
-// Enviar pedido (solicitante)
-enviarPedidoBtn.addEventListener('click', () => {
-    const nombre = document.getElementById('nombre').value;
-    const telefono = document.getElementById('telefono').value;
-    const producto1 = parseInt(document.getElementById('producto1').value) || 0;
-    const producto2 = parseInt(document.getElementById('producto2').value) || 0;
-    const producto3 = parseInt(document.getElementById('producto3').value) || 0;
-    const producto4 = parseInt(document.getElementById('producto4').value) || 0;
-    const comentarios = document.getElementById('comentarios').value;
-    
-    if (!nombre || !telefono) {
-        showNotification('Por favor completa tu nombre y teléfono', true);
-        return;
-    }
-    
-    if (producto1 === 0 && producto2 === 0 && producto3 === 0 && producto4 === 0) {
-        showNotification('Por favor selecciona al menos un producto', true);
-        return;
-    }
-    
-    // Verificar disponibilidad
-    if (producto1 > 0 && !productosConfig.producto1.disponible) {
-        showNotification(`${productosConfig.producto1.nombre} no están disponibles`, true);
-        return;
-    }
-    
-    if (producto2 > 0 && !productosConfig.producto2.disponible) {
-        showNotification(`${productosConfig.producto2.nombre} no están disponibles`, true);
-        return;
-    }
-    
-    if (producto3 > 0 && !productosConfig.producto3.disponible) {
-        showNotification(`${productosConfig.producto3.nombre} no están disponibles`, true);
-        return;
-    }
-    
-    if (producto4 > 0 && !productosConfig.producto4.disponible) {
-        showNotification(`${productosConfig.producto4.nombre} no están disponibles`, true);
-        return;
-    }
-    
-    // Crear nuevo pedido
-    const nuevoPedido = {
-        id: Date.now().toString(),
-        nombre, 
-        telefono,
-        producto1, 
-        producto2, 
-        producto3, 
-        producto4,
-        comentarios,
-        fecha: new Date().toLocaleString(),
-        estado: 'pendiente',
-        total: calcularTotalPedido(producto1, producto2, producto3, producto4)
-    };
-    
-    pedidos.push(nuevoPedido);
-    
-    // Mostrar notificación
-    showNotification('Pedido registrado con éxito!');
-    
-    // Resetear formulario
-    document.getElementById('nombre').value = '';
-    document.getElementById('telefono').value = '';
-    document.getElementById('producto1').value = '0';
-    document.getElementById('producto2').value = '0';
-    document.getElementById('producto3').value = '0';
-    document.getElementById('producto4').value = '0';
-    document.getElementById('comentarios').value = '';
-    
-    // Actualizar panel de administrador si está visible
-    if (adminContainer.style.display === 'block') {
-        actualizarPanelAdmin();
-    }
-});
+function fillAdminForm(bin) {
+  el.binId.value = bin.id;
+  el.binProduct.value = bin.product_name;
+  el.binPrice.value = bin.price_per_kg;
+  el.binCapacity.value = bin.capacity_kg;
+  el.binImage.value = bin.image_url;
+  el.binStatus.value = bin.status;
+}
 
-// Login de administrador
-loginBtn.addEventListener('click', () => {
-    const email = document.getElementById('admin-email').value;
-    const password = document.getElementById('admin-password').value;
-    
-    // Credenciales de prueba
-    if (email === 'admin@valledor.com' && password === 'admin123') {
-        isAdmin = true;
-        adminEmail = email;
-        
-        // Mostrar panel de administrador
-        adminContainer.style.display = 'block';
-        solicitanteForm.style.display = 'none';
-        
-        // Ocultar modal
-        loginModal.style.display = 'none';
-        
-        // Actualizar panel
-        actualizarPanelAdmin();
-        actualizarFinanzas();
-        
-        showNotification('Sesión de administrador iniciada');
-    } else {
-        loginError.style.display = 'block';
-        setTimeout(() => {
-            loginError.style.display = 'none';
-        }, 3000);
-    }
-});
+function clearAdminForm() {
+  el.binForm.reset();
+  el.binId.value = '';
+  el.binCapacity.value = '500';
+  el.binStatus.value = 'OPEN';
+}
 
-// Logout de administrador
-logoutBtn.addEventListener('click', () => {
-    isAdmin = false;
-    adminEmail = '';
-    adminContainer.style.display = 'none';
-    solicitanteForm.style.display = 'block';
-    showNotification('Sesión de administrador cerrada');
-});
+function renderAdminBins() {
+  const bins = api.getAdminBins();
+  el.adminBins.innerHTML = bins.map((bin) => {
+    const orders = api.getOrdersByBin(bin.id);
+    const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
+    const pct = Math.round((bin.sold_kg / bin.capacity_kg) * 100);
 
-// Abrir modal de login
-adminLoginLink.addEventListener('click', (e) => {
-    e.preventDefault();
-    loginModal.style.display = 'flex';
-});
+    return `
+      <article class="admin-bin">
+        <div class="admin-row">
+          <div>
+            <h4>${bin.product_name}</h4>
+            <p class="bin-meta">${money(bin.price_per_kg)} / kg · ${bin.sold_kg}/${bin.capacity_kg} kg · ${pct}%</p>
+            ${statusTag(bin.status)}
+          </div>
+          <div>
+            <button class="btn secondary edit-bin" data-id="${bin.id}">Editar</button>
+          </div>
+        </div>
+        <p class="bin-meta">Disponibles: ${available} kg</p>
+        <div class="order-list">
+          <strong>Pedidos (${orders.length}):</strong>
+          ${orders.length === 0 ? '<p>Sin pedidos.</p>' : `<ul>${orders.map((o) => `<li>${o.customer?.name || 'Cliente'} · ${o.kg} kg · ${money(o.total_price)} · ${o.status}</li>`).join('')}</ul>`}
+        </div>
+      </article>
+    `;
+  }).join('');
 
-// Cerrar modal de login
-closeLogin.addEventListener('click', () => {
-    loginModal.style.display = 'none';
-});
+  el.adminBins.querySelectorAll('.edit-bin').forEach((btn) => {
+    btn.addEventListener('click', () => {
+      const bin = api.getBin(btn.dataset.id);
+      if (bin) fillAdminForm(bin);
+    });
+  });
+}
 
-// Abrir modal para agregar pedido
-addOrderBtn.addEventListener('click', () => {
-    addOrderModal.style.display = 'flex';
-});
+function syncAdminView() {
+  const isAdmin = api.isAdmin();
+  el.adminLoginSection.classList.toggle('hidden', isAdmin);
+  el.adminPanelSection.classList.toggle('hidden', !isAdmin);
+  if (isAdmin) renderAdminBins();
+}
 
-// Cerrar modal para agregar pedido
-closeAddOrderModal.addEventListener('click', () => {
-    addOrderModal.style.display = 'none';
+el.orderKg.addEventListener('input', () => {
+  const bin = api.getBin(el.orderBinId.value);
+  if (!bin) return;
+  const available = Math.max(0, bin.capacity_kg - bin.sold_kg);
+  const kg = Number(el.orderKg.value || 0);
+  const safeKg = Math.min(Math.max(kg, 0), available);
+  if (kg !== safeKg) el.orderKg.value = String(safeKg);
+  el.orderTotal.textContent = `Total: ${money(safeKg * bin.price_per_kg)}`;
+  updateSummary(bin, safeKg);
 });
 
-// Enviar pedido desde admin
-adminEnviarPedidoBtn.addEventListener('click', () => {
-    const nombre = document.getElementById('admin-nombre').value;
-    const telefono = document.getElementById('admin-telefono').value;
-    const producto1 = parseInt(document.getElementById('admin-producto1').value) || 0;
-    const producto2 = parseInt(document.getElementById('admin-producto2').value) || 0;
-    const producto3 = parseInt(document.getElementById('admin-producto3').value) || 0;
-    const producto4 = parseInt(document.getElementById('admin-producto4').value) || 0;
-    const comentarios = document.getElementById('admin-comentarios').value;
-    
-    if (!nombre || !telefono) {
-        showNotification('Por favor completa nombre y teléfono', true);
-        return;
-    }
-    
-    // Crear nuevo pedido
-    const nuevoPedido = {
-        id: Date.now().toString(),
-        nombre, 
-        telefono,
-        producto1, 
-        producto2, 
-        producto3, 
-        producto4,
-        comentarios,
-        fecha: new Date().toLocaleString(),
-        estado: 'pendiente',
-        total: calcularTotalPedido(producto1, producto2, producto3, producto4)
-    };
-    
-    pedidos.push(nuevoPedido);
-    
-    // Mostrar notificación
-    showNotification('Pedido agregado con éxito!');
-    
-    // Cerrar modal
-    addOrderModal.style.display = 'none';
-    
-    // Resetear formulario
-    document.getElementById('admin-nombre').value = '';
-    document.getElementById('admin-telefono').value = '';
-    document.getElementById('admin-producto1').value = '0';
-    document.getElementById('admin-producto2').value = '0';
-    document.getElementById('admin-producto3').value = '0';
-    document.getElementById('admin-producto4').value = '0';
-    document.getElementById('admin-comentarios').value = '';
-    
-    // Actualizar panel
-    actualizarPanelAdmin();
+el.orderForm.addEventListener('submit', (event) => {
+  event.preventDefault();
+  try {
+    const order = api.createOrder(el.orderBinId.value, {
+      name: el.customerName.value.trim(),
+      email: el.customerEmail.value.trim(),
+      phone: el.customerPhone.value.trim(),
+      kg: Number(el.orderKg.value)
+    });
+    el.orderModal.close();
+    renderBins();
+    syncAdminView();
+    toast(`Pedido creado: ${order.kg} kg (${order.status}).`);
+  } catch (error) {
+    toast(error.message, true);
+  }
 });
 
-// Abrir modal de resumen de compras
-comprasBtn.addEventListener('click', () => {
-    calcularResumenCompras();
-    comprasModal.style.display = 'flex';
+el.openAdmin.addEventListener('click', () => {
+  syncAdminView();
+  el.adminModal.showModal();
 });
 
-// Cerrar modal de resumen de compras
-closeComprasModal.addEventListener('click', () => {
-    comprasModal.style.display = 'none';
-});
+el.closeOrder.addEventListener('click', () => el.orderModal.close());
+el.closeAdmin.addEventListener('click', () => el.adminModal.close());
 
-// Botón para imprimir resumen
-printComprasBtn.addEventListener('click', () => {
-    window.print();
+el.adminLoginForm.addEventListener('submit', (event) => {
+  event.preventDefault();
+  try {
+    api.login(el.adminEmail.value.trim(), el.adminPassword.value.trim());
+    syncAdminView();
+    toast('Login de administrador exitoso.');
+  } catch (error) {
+    toast(error.message, true);
+  }
 });
 
-// Botón de exportar
-exportBtn.addEventListener('click', () => {
-    // Simular exportación de datos
-    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pedidos));
-    const downloadAnchorNode = document.createElement('a');
-    downloadAnchorNode.setAttribute("href", dataStr);
-    downloadAnchorNode.setAttribute("download", "pedidos_valledor.json");
-    document.body.appendChild(downloadAnchorNode);
-    downloadAnchorNode.click();
-    downloadAnchorNode.remove();
-    
-    showNotification('Datos exportados con éxito!');
+el.adminLogout.addEventListener('click', () => {
+  api.logout();
+  syncAdminView();
+  toast('Sesión cerrada.');
 });
 
-// Botón de actualizar
-refreshBtn.addEventListener('click', () => {
-    actualizarPanelAdmin();
-    actualizarFinanzas();
-    showNotification('Datos actualizados');
-});
+el.binForm.addEventListener('submit', (event) => {
+  event.preventDefault();
+  try {
+    const payload = {
+      product_name: el.binProduct.value.trim(),
+      price_per_kg: Number(el.binPrice.value),
+      capacity_kg: Number(el.binCapacity.value || 500),
+      image_url: el.binImage.value.trim(),
+      status: el.binStatus.value
+    };
 
-// Delegación de eventos para los botones de acción
-ordersBody.addEventListener('click', function(event) {
-    const target = event.target.closest('.action-btn');
-    if (!target) return;
-    
-    const id = target.dataset.id;
-    const action = target.dataset.action;
-    const pedidoIndex = pedidos.findIndex(p => p.id === id);
-    
-    if (pedidoIndex === -1) return;
-    
-    if (target.classList.contains('btn-delete')) {
-        // Eliminar pedido
-        const nombre = pedidos[pedidoIndex].nombre;
-        pedidos.splice(pedidoIndex, 1);
-        showNotification(`Pedido de ${nombre} eliminado`);
-        actualizarPanelAdmin();
-        actualizarFinanzas();
-    } else if (action) {
-        // Cambiar estado del pedido
-        pedidos[pedidoIndex].estado = action;
-        showNotification(`Pedido de ${pedidos[pedidoIndex].nombre} marcado como ${action}`);
-        actualizarPanelAdmin();
-        actualizarFinanzas();
+    if (el.binId.value) {
+      api.updateBin(el.binId.value, payload);
+      toast('Bin actualizado correctamente.');
+    } else {
+      api.createBin(payload);
+      toast('Bin creado correctamente.');
     }
+
+    clearAdminForm();
+    renderBins();
+    renderAdminBins();
+  } catch (error) {
+    toast(error.message, true);
+  }
 });
 
-// Inicializar con datos de muestra
-document.addEventListener('DOMContentLoaded', () => {
-    // Cargar configuración desde localStorage si existe
-    const savedConfig = localStorage.getItem('productosConfig');
-    if (savedConfig) {
-        productosConfig = JSON.parse(savedConfig);
-    }
-    
-    // Cargar costos desde localStorage
-    const savedCostos = localStorage.getItem('costosProductos');
-    if (savedCostos) {
-        costosProductos = JSON.parse(savedCostos);
-    }
-    
-    // Configurar inputs de productos
-    document.getElementById('producto1-name-input').value = productosConfig.producto1.nombre;
-    document.getElementById('producto2-name-input').value = productosConfig.producto2.nombre;
-    document.getElementById('producto3-name-input').value = productosConfig.producto3.nombre;
-    document.getElementById('producto4-name-input').value = productosConfig.producto4.nombre;
-    
-    document.getElementById('producto1-price-input').value = productosConfig.producto1.precio;
-    document.getElementById('producto2-price-input').value = productosConfig.producto2.precio;
-    document.getElementById('producto3-price-input').value = productosConfig.producto3.precio;
-    document.getElementById('producto4-price-input').value = productosConfig.producto4.precio;
-    
-    document.getElementById('producto1-available').checked = productosConfig.producto1.disponible;
-    document.getElementById('producto2-available').checked = productosConfig.producto2.disponible;
-    document.getElementById('producto3-available').checked = productosConfig.producto3.disponible;
-    document.getElementById('producto4-available').checked = productosConfig.producto4.disponible;
-    
-    // Configurar inputs de costos
-    producto1CostInput.value = costosProductos.producto1;
-    producto2CostInput.value = costosProductos.producto2;
-    producto3CostInput.value = costosProductos.producto3;
-    producto4CostInput.value = costosProductos.producto4;
-    
-    // Cargar meta de ventas desde localStorage
-    const savedMeta = localStorage.getItem('metaVentas');
-    if (savedMeta) {
-        metaVentas = parseInt(savedMeta);
-        metaInput.value = metaVentas;
-        metaVentasElement.textContent = metaVentas.toLocaleString();
-        actualizarProgresoMeta();
-    }
-    
-    // Crear algunos pedidos de muestra
-    pedidos.push({
-        id: '1',
-        nombre: 'María González',
-        telefono: '+56987654321',
-        producto1: 3,
-        producto2: 2,
-        producto3: 1,
-        producto4: 3,
-        comentarios: 'Por favor, que las paltas estén maduras',
-        fecha: '2023-10-25 10:30',
-        estado: 'completado',
-        total: 15700
-    });
-    
-    pedidos.push({
-        id: '2',
-        nombre: 'Carlos Rodríguez',
-        telefono: '+56912348765',
-        producto1: 2,
-        producto2: 7,
-        producto3: 2,
-        producto4: 2,
-        comentarios: 'Limones grandes por favor',
-        fecha: '2023-10-24 15:45',
-        estado: 'entregado',
-        total: 11000
-    });
-    
-    pedidos.push({
-        id: '3',
-        nombre: 'Ana Martínez',
-        telefono: '+56955443322',
-        producto1: 4,
-        producto2: 0,
-        producto3: 2,
-        producto4: 4,
-        comentarios: 'Entregar después de las 17:00 hrs',
-        fecha: '2023-10-23 09:15',
-        estado: 'pendiente',
-        total: 18400
-    });
-    
-    // Actualizar UI
-    actualizarProductosUI();
-    
-    // Evento para la meta de ventas
-    metaInput.addEventListener('change', () => {
-        metaVentas = parseInt(metaInput.value) || 0;
-        localStorage.setItem('metaVentas', metaVentas);
-        metaVentasElement.textContent = metaVentas.toLocaleString();
-        actualizarProgresoMeta();
-    });
-    
-    // Actualizar finanzas
-    actualizarFinanzas();
-});
\ No newline at end of file
+el.clearBinForm.addEventListener('click', clearAdminForm);
+
+renderBins();
+syncAdminView();
