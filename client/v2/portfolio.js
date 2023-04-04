// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterRecentButton = document.querySelector('#filter-recent');
const selectTime = document.querySelector('#time-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {String}  [brand] - brand name to filter by
 * @param  {String}  [time] - time of release to filter by
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand, time) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}` + (brand ? `&brand=${brand}` : '') + (time ? `&time=${time}` : '')
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    setCurrentProducts(body.data);
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;

  selectPage.addEventListener('change', async (event) => {
    const brand = selectBrand.value.trim();
    const products = await fetchProducts(parseInt(event.target.value), selectShow.value, brand);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  });
};


/**
 * Select the brand to display
 */
selectBrand.addEventListener('change', async (event) => {
  const brand = event.target.value.trim();
  const products = await fetchProducts(1, currentPagination.size, brand);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/**
 * Filter products to show only recent ones (less than 2 weeks)
 */
const filterRecent = async () => {
  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);
  
  const filteredProducts = currentProducts.filter(product => {
    const productDate = new Date(product.date);
    return productDate > twoWeeksAgo;
  });
  
  render(filteredProducts, currentPagination);
};

filterRecentButton.addEventListener('click', filterRecent);

/**
 * Select the time of release to display
 */
selectTime.addEventListener('change', async (event) => {
  let time;
  switch (event.target.value) {
    case '1w':
      time = '1w';
      break;
    case '2w':
      time = '2w';
      break;
    case '1m':
      time = '1m';
      break;
    default:
      time = null;
      break;
  }

  const brand = selectBrand.value.trim();
  const products = await fetchProducts(1, currentPagination.size, brand, time);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  // Filtrer les produits selon la marque sélectionnée
  const brand = selectBrand.value.trim();
  const filteredProducts = brand ? products.filter(product => product.brand === brand) : products;

  renderProducts(filteredProducts);
  renderPagination(pagination);
  renderIndicators(pagination);
};



/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
