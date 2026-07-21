const productsList = document.getElementById('products-list');
const productsStatus = document.getElementById('products-status');

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'bin-card';

  if (product.image_url) {
    const image = document.createElement('img');
    image.className = 'bin-image';
    image.src = product.image_url;
    image.alt = product.name ? `Imagen de ${product.name}` : 'Imagen del producto';
    image.loading = 'lazy';
    card.append(image);
  }

  const body = document.createElement('div');
  body.className = 'bin-body';
  body.append(createTextElement('h3', '', product.name || 'Producto sin nombre'));

  if (product.description) {
    body.append(createTextElement('p', 'bin-notes', product.description));
  }

  body.append(createTextElement(
    'p',
    'product-price',
    product.detail_price == null
      ? 'Precio no disponible'
      : clpFormatter.format(Number(product.detail_price))
  ));
  body.append(createTextElement('p', 'bin-meta', `Unidad de venta: ${product.sale_unit || 'No informada'}`));

  if (product.season_status === 'out_of_season') {
    body.append(createTextElement('span', 'season-status out-of-season', 'Fuera de temporada'));
  }

  card.append(body);
  return card;
}

function renderProducts(products) {
  productsList.replaceChildren(...products.map(createProductCard));

  if (products.length === 0) {
    productsStatus.textContent = 'No hay productos disponibles en este momento.';
    return;
  }

  productsStatus.textContent = '';
  productsStatus.hidden = true;
}

async function loadProducts() {
  productsStatus.hidden = false;
  productsStatus.classList.remove('products-status-error');
  productsStatus.textContent = 'Cargando productos…';

  const { data, error } = await window.lazoSupabase
    .schema('public')
    .from('products')
    .select('id, name, description, sale_unit, detail_price, season_status, image_url');

  if (error) {
    console.error('Error técnico al consultar public.products:', error);
    productsList.replaceChildren();
    productsStatus.classList.add('products-status-error');
    productsStatus.textContent = 'No pudimos cargar los productos. Intenta nuevamente más tarde.';
    return;
  }

  renderProducts(data || []);
}

loadProducts().catch((error) => {
  console.error('Error inesperado al cargar los productos:', error);
  productsList.replaceChildren();
  productsStatus.hidden = false;
  productsStatus.classList.add('products-status-error');
  productsStatus.textContent = 'No pudimos cargar los productos. Intenta nuevamente más tarde.';
});
