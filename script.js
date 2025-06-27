// Datos iniciales
let pedidos = [];
let isAdmin = false;
let adminEmail = "";
let metaVentas = 0;
let costosProductos = {
    producto1: 2500,  // Costo por kilo de paltas
    producto2: 800,   // Costo por kilo de papas
    producto3: 1000,  // Costo por kilo de limones
    producto4: 400    // Costo por unidad de lechugas
};

// Configuración de productos
let productosConfig = {
    producto1: {
        nombre: "Paltas",
        precio: 3500,
        disponible: true,
        unidad: "kg",
        tipo: "por peso"
    },
    producto2: {
        nombre: "Papas",
        precio: 1500,
        disponible: true,
        unidad: "kg",
        tipo: "por peso"
    },
    producto3: {
        nombre: "Limones",
        precio: 1800,
        disponible: true,
        unidad: "kg",
        tipo: "por peso"
    },
    producto4: {
        nombre: "Lechugas",
        precio: 800,
        disponible: true,
        unidad: "unidad",
        tipo: "por unidad"
    }
};

// Elementos DOM
const solicitanteForm = document.getElementById('solicitante-form');
const adminContainer = document.getElementById('admin-container');
const adminLoginLink = document.getElementById('admin-login-link');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const enviarPedidoBtn = document.getElementById('enviar-pedido');
const ordersBody = document.getElementById('orders-body');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const exportBtn = document.getElementById('export-btn');
const refreshBtn = document.getElementById('refresh-btn');
const totalPedidosElement = document.getElementById('total-pedidos');
const pedidosPendientesElement = document.getElementById('pedidos-pendientes');
const pedidosEntregadosElement = document.getElementById('pedidos-entregados');
const pedidosCompletadosElement = document.getElementById('pedidos-completados');
const addOrderBtn = document.getElementById('add-order-btn');
const addOrderModal = document.getElementById('add-order-modal');
const closeAddOrderModal = document.getElementById('close-add-order');
const adminEnviarPedidoBtn = document.getElementById('admin-enviar-pedido');
const comprasBtn = document.getElementById('compras-btn');
const comprasModal = document.getElementById('compras-modal');
const closeComprasModal = document.getElementById('close-compras');
const comprasProducto1 = document.getElementById('compras-producto1');
const comprasPapas = document.getElementById('compras-papas');
const comprasProducto3 = document.getElementById('compras-limones');
const comprasProducto4 = document.getElementById('compras-lechugas');
const comprasBody = document.getElementById('compras-body');
const printComprasBtn = document.getElementById('print-compras');
const savePricesBtn = document.getElementById('save-prices');
const totalIngresosElement = document.getElementById('total-ingresos');
const totalCostosElement = document.getElementById('total-costos');
const margenGananciaElement = document.getElementById('margen-ganancia');
const margenBar = document.getElementById('margen-bar');
const metaVentasElement = document.getElementById('meta-ventas');
const metaInput = document.getElementById('meta-input');
const metaBar = document.getElementById('meta-bar');
const metaProgresoElement = document.getElementById('meta-progreso');
const resumenIngresos = document.getElementById('resumen-ingresos');
const resumenCostos = document.getElementById('resumen-costos');
const resumenGanancias = document.getElementById('resumen-ganancias');
const resumenMargen = document.getElementById('resumen-margen');

// Inputs de costos
const producto1CostInput = document.getElementById('producto1-cost-input');
const producto2CostInput = document.getElementById('producto2-cost-input');
const producto3CostInput = document.getElementById('producto3-cost-input');
const producto4CostInput = document.getElementById('producto4-cost-input');

// Tabs de administrador
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

// Función para manejar botones de cantidad
function handleQuantityBtnClick() {
    const target = this.dataset.target;
    const action = this.dataset.action;
    const input = document.getElementById(target);
    let value = parseInt(input.value) || 0;
    
    if (action === 'increase') {
        value += 1;
    } else if (action === 'decrease' && value > 0) {
        value -= 1;
    }
    
    input.value = value;
}

// Delegación de eventos para botones de cantidad
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('quantity-btn')) {
        handleQuantityBtnClick.call(event.target);
    }
});

// Actualizar nombres y precios en la interfaz
function actualizarProductosUI() {
    // Actualizar nombres en formulario solicitante
    document.getElementById('producto1-name').textContent = productosConfig.producto1.nombre;
    document.getElementById('producto2-name').textContent = productosConfig.producto2.nombre;
    document.getElementById('producto3-name').textContent = productosConfig.producto3.nombre;
    document.getElementById('producto4-name').textContent = productosConfig.producto4.nombre;
    
    // Actualizar precios en formulario solicitante
    document.getElementById('producto1-price').textContent = '$' + productosConfig.producto1.precio.toLocaleString();
    document.getElementById('producto2-price').textContent = '$' + productosConfig.producto2.precio.toLocaleString();
    document.getElementById('producto3-price').textContent = '$' + productosConfig.producto3.precio.toLocaleString();
    document.getElementById('producto4-price').textContent = '$' + productosConfig.producto4.precio.toLocaleString();
    
    // Actualizar en modal de admin
    document.getElementById('admin-producto1-name').textContent = productosConfig.producto1.nombre;
    document.getElementById('admin-producto2-name').textContent = productosConfig.producto2.nombre;
    document.getElementById('admin-producto3-name').textContent = productosConfig.producto3.nombre;
    document.getElementById('admin-producto4-name').textContent = productosConfig.producto4.nombre;
    
    document.getElementById('admin-producto1-price').textContent = productosConfig.producto1.precio.toLocaleString();
    document.getElementById('admin-producto2-price').textContent = productosConfig.producto2.precio.toLocaleString();
    document.getElementById('admin-producto3-price').textContent = productosConfig.producto3.precio.toLocaleString();
    document.getElementById('admin-producto4-price').textContent = productosConfig.producto4.precio.toLocaleString();
    
    // Actualizar disponibilidad
    actualizarDisponibilidadProductos();
    
    // Actualizar títulos en resumen de compras
    document.getElementById('compras-title1').textContent = productosConfig.producto1.nombre;
    document.getElementById('compras-title2').textContent = productosConfig.producto2.nombre;
    document.getElementById('compras-title3').textContent = productosConfig.producto3.nombre;
    document.getElementById('compras-title4').textContent = productosConfig.producto4.nombre;
}

// Actualizar disponibilidad de productos
function actualizarDisponibilidadProductos() {
    // Producto 1
    const producto1Card = document.getElementById('producto1-card');
    if (productosConfig.producto1.disponible) {
        producto1Card.classList.remove('unavailable');
        if (producto1Card.querySelector('.unavailable-tag')) {
            producto1Card.querySelector('.unavailable-tag').remove();
        }
    } else {
        producto1Card.classList.add('unavailable');
        if (!producto1Card.querySelector('.unavailable-tag')) {
            const tag = document.createElement('div');
            tag.className = 'unavailable-tag';
            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
            producto1Card.prepend(tag);
        }
    }
    
    // Producto 2
    const producto2Card = document.getElementById('producto2-card');
    if (productosConfig.producto2.disponible) {
        producto2Card.classList.remove('unavailable');
        if (producto2Card.querySelector('.unavailable-tag')) {
            producto2Card.querySelector('.unavailable-tag').remove();
        }
    } else {
        producto2Card.classList.add('unavailable');
        if (!producto2Card.querySelector('.unavailable-tag')) {
            const tag = document.createElement('div');
            tag.className = 'unavailable-tag';
            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
            producto2Card.prepend(tag);
        }
    }
    
    // Producto 3
    const producto3Card = document.getElementById('producto3-card');
    if (productosConfig.producto3.disponible) {
        producto3Card.classList.remove('unavailable');
        if (producto3Card.querySelector('.unavailable-tag')) {
            producto3Card.querySelector('.unavailable-tag').remove();
        }
    } else {
        producto3Card.classList.add('unavailable');
        if (!producto3Card.querySelector('.unavailable-tag')) {
            const tag = document.createElement('div');
            tag.className = 'unavailable-tag';
            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
            producto3Card.prepend(tag);
        }
    }
    
    // Producto 4
    const producto4Card = document.getElementById('producto4-card');
    if (productosConfig.producto4.disponible) {
        producto4Card.classList.remove('unavailable');
        if (producto4Card.querySelector('.unavailable-tag')) {
            producto4Card.querySelector('.unavailable-tag').remove();
        }
    } else {
        producto4Card.classList.add('unavailable');
        if (!producto4Card.querySelector('.unavailable-tag')) {
            const tag = document.createElement('div');
            tag.className = 'unavailable-tag';
            tag.innerHTML = '<i class="fas fa-ban"></i> No disponible';
            producto4Card.prepend(tag);
        }
    }
}

// Mostrar notificación
function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.className = 'notification';
    notification.classList.add(isError ? 'error' : 'success');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Calcular total del pedido
function calcularTotalPedido(producto1, producto2, producto3, producto4) {
    let total = 0;
    total += producto1 * productosConfig.producto1.precio;
    total += producto2 * productosConfig.producto2.precio;
    total += producto3 * productosConfig.producto3.precio;
    total += producto4 * productosConfig.producto4.precio;
    return total;
}

// Actualizar panel de administrador
function actualizarPanelAdmin() {
    // Filtrar pedidos por estado
    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
    const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado');
    const pedidosCompletados = pedidos.filter(p => p.estado === 'completado');
    const totalPedidos = pedidos.length;
    
    totalPedidosElement.textContent = totalPedidos;
    pedidosPendientesElement.textContent = pedidosPendientes.length;
    pedidosEntregadosElement.textContent = pedidosEntregados.length;
    pedidosCompletadosElement.textContent = pedidosCompletados.length;
    
    // Actualizar tabla de pedidos
    ordersBody.innerHTML = '';
    
    if (pedidos.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No hay pedidos registrados</td></tr>';
        return;
    }
    
    // Ordenar pedidos: primero pendientes, luego entregados, luego completados
    const pedidosOrdenados = [...pedidos].sort((a, b) => {
        const estados = {'pendiente': 1, 'entregado': 2, 'completado': 3};
        return estados[a.estado] - estados[b.estado];
    });
    
    pedidosOrdenados.forEach(pedido => {
        const row = document.createElement('tr');
        
        // Resaltar fila según estado
        if (pedido.estado === 'completado') {
            row.style.backgroundColor = 'rgba(123, 31, 162, 0.05)';
        } else if (pedido.estado === 'entregado') {
            row.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
        } else if (pedido.estado === 'pendiente') {
            row.style.backgroundColor = 'rgba(245, 124, 0, 0.05)';
        }
        
        // Formatear productos
        const productos = [];
        if (pedido.producto1 > 0) productos.push(`${productosConfig.producto1.nombre}: ${pedido.producto1} kg`);
        if (pedido.producto2 > 0) productos.push(`${productosConfig.producto2.nombre}: ${pedido.producto2} kg`);
        if (pedido.producto3 > 0) productos.push(`${productosConfig.producto3.nombre}: ${pedido.producto3} kg`);
        if (pedido.producto4 > 0) productos.push(`${productosConfig.producto4.nombre}: ${pedido.producto4}`);
        
        row.innerHTML = `
            <td>${pedido.nombre}</td>
            <td>${pedido.telefono}</td>
            <td>${productos.join('<br>')}</td>
            <td>
                <span class="status-badge status-${pedido.estado}">
                    ${pedido.estado === 'pendiente' ? 'Pendiente' : 
                     pedido.estado === 'entregado' ? 'Entregado' : 
                     'Completado'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    ${pedido.estado === 'pendiente' ? 
                        `<button class="action-btn btn-complete" data-id="${pedido.id}" data-action="entregado">
                            <i class="fas fa-truck"></i> Entregar
                        </button>` : ''}
                    ${pedido.estado === 'entregado' ? 
                        `<button class="action-btn btn-complete" data-id="${pedido.id}" data-action="completado">
                            <i class="fas fa-check-double"></i> Completar
                        </button>` : ''}
                    <button class="action-btn btn-delete" data-id="${pedido.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        ordersBody.appendChild(row);
    });
}

// Calcular estadísticas para la pestaña de finanzas
function actualizarFinanzas() {
    // Calcular ingresos totales (solo pedidos completados)
    let ingresosTotales = 0;
    let costosTotales = 0;
    
    pedidos.forEach(pedido => {
        if (pedido.estado === 'completado') {
            ingresosTotales += pedido.total;
            
            // Calcular costos
            costosTotales += (pedido.producto1 * costosProductos.producto1);
            costosTotales += (pedido.producto2 * costosProductos.producto2);
            costosTotales += (pedido.producto3 * costosProductos.producto3);
            costosTotales += (pedido.producto4 * costosProductos.producto4);
        }
    });
    
    // Actualizar UI
    totalIngresosElement.textContent = ingresosTotales.toLocaleString();
    totalCostosElement.textContent = costosTotales.toLocaleString();
    
    // Calcular margen de ganancia
    let margenGanancia = 0;
    if (ingresosTotales > 0) {
        margenGanancia = ((ingresosTotales - costosTotales) / ingresosTotales) * 100;
    }
    
    margenGanancia = Math.round(margenGanancia);
    margenGananciaElement.textContent = margenGanancia;
    margenBar.style.width = `${margenGanancia}%`;
    margenBar.textContent = `${margenGanancia}%`;
    
    // Actualizar resumen financiero
    resumenIngresos.textContent = ingresosTotales.toLocaleString();
    resumenCostos.textContent = costosTotales.toLocaleString();
    resumenGanancias.textContent = (ingresosTotales - costosTotales).toLocaleString();
    resumenMargen.textContent = margenGanancia;
    
    // Actualizar progreso de meta
    actualizarProgresoMeta();
}

// Actualizar progreso hacia la meta de ventas
function actualizarProgresoMeta() {
    const ingresosTotales = parseFloat(totalIngresosElement.textContent.replace(/,/g, '')) || 0;
    let progreso = 0;
    
    if (metaVentas > 0) {
        progreso = Math.min(100, Math.round((ingresosTotales / metaVentas) * 100));
    }
    
    metaBar.style.width = `${progreso}%`;
    metaBar.textContent = `${progreso}%`;
    metaProgresoElement.textContent = progreso;
}

// Calcular resumen de compras
function calcularResumenCompras() {
    let totalProducto1 = 0;
    let totalProducto2 = 0;
    let totalProducto3 = 0;
    let totalProducto4 = 0;
    
    // Sumar solo pedidos pendientes
    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
    
    pedidosPendientes.forEach(pedido => {
        totalProducto1 += pedido.producto1 || 0;
        totalProducto2 += pedido.producto2 || 0;
        totalProducto3 += pedido.producto3 || 0;
        totalProducto4 += pedido.producto4 || 0;
    });
    
    // Actualizar valores en el modal
    comprasProducto1.textContent = totalProducto1 + ' kg';
    comprasPapas.textContent = totalProducto2 + ' kg';
    comprasProducto3.textContent = totalProducto3 + ' kg';
    comprasProducto4.textContent = totalProducto4 + ' unidades';
    
    // Actualizar tabla de resumen
    comprasBody.innerHTML = '';
    
    const productos = [
        { nombre: productosConfig.producto1.nombre, cantidad: totalProducto1, unidad: 'kg' },
        { nombre: productosConfig.producto2.nombre, cantidad: totalProducto2, unidad: 'kg' },
        { nombre: productosConfig.producto3.nombre, cantidad: totalProducto3, unidad: 'kg' },
        { nombre: productosConfig.producto4.nombre, cantidad: totalProducto4, unidad: 'unidades' }
    ];
    
    productos.forEach(producto => {
        if (producto.cantidad > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.unidad}</td>
            `;
            comprasBody.appendChild(row);
        }
    });
    
    if (comprasBody.children.length === 0) {
        comprasBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 15px; color: #666;">No hay productos para comprar</td></tr>';
    }
}

// Guardar configuración de productos
savePricesBtn.addEventListener('click', () => {
    // Guardar nombres
    productosConfig.producto1.nombre = document.getElementById('producto1-name-input').value;
    productosConfig.producto2.nombre = document.getElementById('producto2-name-input').value;
    productosConfig.producto3.nombre = document.getElementById('producto3-name-input').value;
    productosConfig.producto4.nombre = document.getElementById('producto4-name-input').value;
    
    // Guardar precios
    productosConfig.producto1.precio = parseInt(document.getElementById('producto1-price-input').value) || 3500;
    productosConfig.producto1.disponible = document.getElementById('producto1-available').checked;
    
    productosConfig.producto2.precio = parseInt(document.getElementById('producto2-price-input').value) || 1500;
    productosConfig.producto2.disponible = document.getElementById('producto2-available').checked;
    
    productosConfig.producto3.precio = parseInt(document.getElementById('producto3-price-input').value) || 1800;
    productosConfig.producto3.disponible = document.getElementById('producto3-available').checked;
    
    productosConfig.producto4.precio = parseInt(document.getElementById('producto4-price-input').value) || 800;
    productosConfig.producto4.disponible = document.getElementById('producto4-available').checked;
    
    // Guardar costos
    costosProductos.producto1 = parseInt(producto1CostInput.value) || 2500;
    costosProductos.producto2 = parseInt(producto2CostInput.value) || 800;
    costosProductos.producto3 = parseInt(producto3CostInput.value) || 1000;
    costosProductos.producto4 = parseInt(producto4CostInput.value) || 400;
    
    // Guardar en localStorage
    localStorage.setItem('productosConfig', JSON.stringify(productosConfig));
    localStorage.setItem('costosProductos', JSON.stringify(costosProductos));
    
    // Actualizar UI
    actualizarProductosUI();
    
    showNotification('Configuración guardada con éxito!');
});

// Cambiar entre tabs de admin
adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover clase active de todas las tabs
        adminTabs.forEach(t => t.classList.remove('active'));
        adminTabContents.forEach(c => c.classList.remove('active'));
        
        // Añadir clase active a la tab seleccionada
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
        
        // Si es la pestaña de finanzas, actualizar datos
        if (tab.dataset.tab === 'finanzas') {
            actualizarFinanzas();
        }
    });
});

// Enviar pedido (solicitante)
enviarPedidoBtn.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const producto1 = parseInt(document.getElementById('producto1').value) || 0;
    const producto2 = parseInt(document.getElementById('producto2').value) || 0;
    const producto3 = parseInt(document.getElementById('producto3').value) || 0;
    const producto4 = parseInt(document.getElementById('producto4').value) || 0;
    const comentarios = document.getElementById('comentarios').value;
    
    if (!nombre || !telefono) {
        showNotification('Por favor completa tu nombre y teléfono', true);
        return;
    }
    
    if (producto1 === 0 && producto2 === 0 && producto3 === 0 && producto4 === 0) {
        showNotification('Por favor selecciona al menos un producto', true);
        return;
    }
    
    // Verificar disponibilidad
    if (producto1 > 0 && !productosConfig.producto1.disponible) {
        showNotification(`${productosConfig.producto1.nombre} no están disponibles`, true);
        return;
    }
    
    if (producto2 > 0 && !productosConfig.producto2.disponible) {
        showNotification(`${productosConfig.producto2.nombre} no están disponibles`, true);
        return;
    }
    
    if (producto3 > 0 && !productosConfig.producto3.disponible) {
        showNotification(`${productosConfig.producto3.nombre} no están disponibles`, true);
        return;
    }
    
    if (producto4 > 0 && !productosConfig.producto4.disponible) {
        showNotification(`${productosConfig.producto4.nombre} no están disponibles`, true);
        return;
    }
    
    // Crear nuevo pedido
    const nuevoPedido = {
        id: Date.now().toString(),
        nombre, 
        telefono,
        producto1, 
        producto2, 
        producto3, 
        producto4,
        comentarios,
        fecha: new Date().toLocaleString(),
        estado: 'pendiente',
        total: calcularTotalPedido(producto1, producto2, producto3, producto4)
    };
    
    pedidos.push(nuevoPedido);
    
    // Mostrar notificación
    showNotification('Pedido registrado con éxito!');
    
    // Resetear formulario
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('producto1').value = '0';
    document.getElementById('producto2').value = '0';
    document.getElementById('producto3').value = '0';
    document.getElementById('producto4').value = '0';
    document.getElementById('comentarios').value = '';
    
    // Actualizar panel de administrador si está visible
    if (adminContainer.style.display === 'block') {
        actualizarPanelAdmin();
    }
});

// Login de administrador
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    // Credenciales de prueba
    if (email === 'admin@valledor.com' && password === 'admin123') {
        isAdmin = true;
        adminEmail = email;
        
        // Mostrar panel de administrador
        adminContainer.style.display = 'block';
        solicitanteForm.style.display = 'none';
        
        // Ocultar modal
        loginModal.style.display = 'none';
        
        // Actualizar panel
        actualizarPanelAdmin();
        actualizarFinanzas();
        
        showNotification('Sesión de administrador iniciada');
    } else {
        loginError.style.display = 'block';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
});

// Logout de administrador
logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    adminEmail = '';
    adminContainer.style.display = 'none';
    solicitanteForm.style.display = 'block';
    showNotification('Sesión de administrador cerrada');
});

// Abrir modal de login
adminLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// Cerrar modal de login
closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Abrir modal para agregar pedido
addOrderBtn.addEventListener('click', () => {
    addOrderModal.style.display = 'flex';
});

// Cerrar modal para agregar pedido
closeAddOrderModal.addEventListener('click', () => {
    addOrderModal.style.display = 'none';
});

// Enviar pedido desde admin
adminEnviarPedidoBtn.addEventListener('click', () => {
    const nombre = document.getElementById('admin-nombre').value;
    const telefono = document.getElementById('admin-telefono').value;
    const producto1 = parseInt(document.getElementById('admin-producto1').value) || 0;
    const producto2 = parseInt(document.getElementById('admin-producto2').value) || 0;
    const producto3 = parseInt(document.getElementById('admin-producto3').value) || 0;
    const producto4 = parseInt(document.getElementById('admin-producto4').value) || 0;
    const comentarios = document.getElementById('admin-comentarios').value;
    
    if (!nombre || !telefono) {
        showNotification('Por favor completa nombre y teléfono', true);
        return;
    }
    
    // Crear nuevo pedido
    const nuevoPedido = {
        id: Date.now().toString(),
        nombre, 
        telefono,
        producto1, 
        producto2, 
        producto3, 
        producto4,
        comentarios,
        fecha: new Date().toLocaleString(),
        estado: 'pendiente',
        total: calcularTotalPedido(producto1, producto2, producto3, producto4)
    };
    
    pedidos.push(nuevoPedido);
    
    // Mostrar notificación
    showNotification('Pedido agregado con éxito!');
    
    // Cerrar modal
    addOrderModal.style.display = 'none';
    
    // Resetear formulario
    document.getElementById('admin-nombre').value = '';
    document.getElementById('admin-telefono').value = '';
    document.getElementById('admin-producto1').value = '0';
    document.getElementById('admin-producto2').value = '0';
    document.getElementById('admin-producto3').value = '0';
    document.getElementById('admin-producto4').value = '0';
    document.getElementById('admin-comentarios').value = '';
    
    // Actualizar panel
    actualizarPanelAdmin();
});

// Abrir modal de resumen de compras
comprasBtn.addEventListener('click', () => {
    calcularResumenCompras();
    comprasModal.style.display = 'flex';
});

// Cerrar modal de resumen de compras
closeComprasModal.addEventListener('click', () => {
    comprasModal.style.display = 'none';
});

// Botón para imprimir resumen
printComprasBtn.addEventListener('click', () => {
    window.print();
});

// Botón de exportar
exportBtn.addEventListener('click', () => {
    // Simular exportación de datos
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pedidos));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pedidos_valledor.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showNotification('Datos exportados con éxito!');
});

// Botón de actualizar
refreshBtn.addEventListener('click', () => {
    actualizarPanelAdmin();
    actualizarFinanzas();
    showNotification('Datos actualizados');
});

// Delegación de eventos para los botones de acción
ordersBody.addEventListener('click', function(event) {
    const target = event.target.closest('.action-btn');
    if (!target) return;
    
    const id = target.dataset.id;
    const action = target.dataset.action;
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex === -1) return;
    
    if (target.classList.contains('btn-delete')) {
        // Eliminar pedido
        const nombre = pedidos[pedidoIndex].nombre;
        pedidos.splice(pedidoIndex, 1);
        showNotification(`Pedido de ${nombre} eliminado`);
        actualizarPanelAdmin();
        actualizarFinanzas();
    } else if (action) {
        // Cambiar estado del pedido
        pedidos[pedidoIndex].estado = action;
        showNotification(`Pedido de ${pedidos[pedidoIndex].nombre} marcado como ${action}`);
        actualizarPanelAdmin();
        actualizarFinanzas();
    }
});

// Inicializar con datos de muestra
document.addEventListener('DOMContentLoaded', () => {
    // Cargar configuración desde localStorage si existe
    const savedConfig = localStorage.getItem('productosConfig');
    if (savedConfig) {
        productosConfig = JSON.parse(savedConfig);
    }
    
    // Cargar costos desde localStorage
    const savedCostos = localStorage.getItem('costosProductos');
    if (savedCostos) {
        costosProductos = JSON.parse(savedCostos);
    }
    
    // Configurar inputs de productos
    document.getElementById('producto1-name-input').value = productosConfig.producto1.nombre;
    document.getElementById('producto2-name-input').value = productosConfig.producto2.nombre;
    document.getElementById('producto3-name-input').value = productosConfig.producto3.nombre;
    document.getElementById('producto4-name-input').value = productosConfig.producto4.nombre;
    
    document.getElementById('producto1-price-input').value = productosConfig.producto1.precio;
    document.getElementById('producto2-price-input').value = productosConfig.producto2.precio;
    document.getElementById('producto3-price-input').value = productosConfig.producto3.precio;
    document.getElementById('producto4-price-input').value = productosConfig.producto4.precio;
    
    document.getElementById('producto1-available').checked = productosConfig.producto1.disponible;
    document.getElementById('producto2-available').checked = productosConfig.producto2.disponible;
    document.getElementById('producto3-available').checked = productosConfig.producto3.disponible;
    document.getElementById('producto4-available').checked = productosConfig.producto4.disponible;
    
    // Configurar inputs de costos
    producto1CostInput.value = costosProductos.producto1;
    producto2CostInput.value = costosProductos.producto2;
    producto3CostInput.value = costosProductos.producto3;
    producto4CostInput.value = costosProductos.producto4;
    
    // Cargar meta de ventas desde localStorage
    const savedMeta = localStorage.getItem('metaVentas');
    if (savedMeta) {
        metaVentas = parseInt(savedMeta);
        metaInput.value = metaVentas;
        metaVentasElement.textContent = metaVentas.toLocaleString();
        actualizarProgresoMeta();
    }
    
    // Crear algunos pedidos de muestra
    pedidos.push({
        id: '1',
        nombre: 'María González',
        telefono: '+56987654321',
        producto1: 3,
        producto2: 2,
        producto3: 1,
        producto4: 3,
        comentarios: 'Por favor, que las paltas estén maduras',
        fecha: '2023-10-25 10:30',
        estado: 'completado',
        total: 15700
    });
    
    pedidos.push({
        id: '2',
        nombre: 'Carlos Rodríguez',
        telefono: '+56912348765',
        producto1: 2,
        producto2: 7,
        producto3: 2,
        producto4: 2,
        comentarios: 'Limones grandes por favor',
        fecha: '2023-10-24 15:45',
        estado: 'entregado',
        total: 11000
    });
    
    pedidos.push({
        id: '3',
        nombre: 'Ana Martínez',
        telefono: '+56955443322',
        producto1: 4,
        producto2: 0,
        producto3: 2,
        producto4: 4,
        comentarios: 'Entregar después de las 17:00 hrs',
        fecha: '2023-10-23 09:15',
        estado: 'pendiente',
        total: 18400
    });
    
    // Actualizar UI
    actualizarProductosUI();
    
    // Evento para la meta de ventas
    metaInput.addEventListener('change', () => {
        metaVentas = parseInt(metaInput.value) || 0;
        localStorage.setItem('metaVentas', metaVentas);
        metaVentasElement.textContent = metaVentas.toLocaleString();
        actualizarProgresoMeta();
    });
    
    // Actualizar finanzas
    actualizarFinanzas();
});