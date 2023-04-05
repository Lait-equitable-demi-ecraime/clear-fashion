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
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const reasonablePrice = document.querySelector('#filters > span:nth-of-type(1)');
const sortProduct = document.querySelector('#sort-select');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanNbBrands = document.querySelector('#nbBrands');

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
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async (page = 1, size = 12, brand='ALL') => {
    try {
        const response = await fetch(
            `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
        );
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return { currentProducts, currentPagination };
        }

        return body.data;
    } catch (error) {
        console.error(error);
        return { currentProducts, currentPagination };
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
};

const renderBrands = async () => {
    try {
        const response = await fetch(
            `https://clear-fashion-api.vercel.app/brands`
        );
        const body = await response.json();
        if (body.success !== true) {
            console.error(body);
        }
        const { result: brands } = body.data;
        const options = `<option value="">select brand</option>`+ `<option value = "">All brands</option>` + brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
        selectBrand.innerHTML = options;
        selectBrand.selectedIndex = 0
    } catch (error) {
        console.error(error);
    }
};


/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});


selectPage.addEventListener('change', async (event) => {
    const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);


    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
    const products = await fetchBrands(currentPagination.currentPage, currentPagination.pageSize, event.target.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

reasonablePrice.addEventListener('click', async () => {
    const filteredResult = Object.values(currentProducts).filter(currentProducts => currentProducts.price <= 50);
    const filteredProducts = { result: filteredResult, meta: currentPagination };


    setCurrentProducts(filteredProducts);
    render(currentProducts, currentPagination);
});

recentlyReleased.addEventListener('click', async () => {
    const filteredResult = Object.values(currentProducts).filter(currentProducts => new Date(currentProducts.released) >= fortnight_before);
    const filteredProducts = { result: filteredResult, meta: currentPagination };
    setCurrentProducts(filteredProducts);
    render(currentProducts, currentPagination);
});



sortProduct.addEventListener('change', async (event) => {
    if (event.target.value == "price-asc") {
        const sortedResult = Object.values(currentProducts).sort((p1, p2) => { return p1.price - p2.price })
        const sortedProducts = { result: sortedResult, meta: currentPagination };

        setCurrentProducts(sortedProducts);
        render(currentProducts, currentPagination);
    }
    if (event.target.value == "price-desc") {
        const sortedResult = Object.values(currentProducts).sort((p1, p2) => { return p2.price - p1.price })
        const sortedProducts = { result: sortedResult, meta: currentPagination };

        setCurrentProducts(sortedProducts);
        render(currentProducts, currentPagination);
    }
    if (event.target.value == "date-asc") {
        const sortedResult = Object.values(currentProducts).sort((p1, p2) => { 
            var date1 = new Date(p1.released)
            var date2 = new Date(p2.released)
            return date1 - date2
        })
        const sortedProducts = { result: sortedResult, meta: currentPagination };

        setCurrentProducts(sortedProducts);
        render(currentProducts, currentPagination);
    }
    if (event.target.value == "date-desc") {
        const sortedResult = Object.values(currentProducts).sort((p1, p2) => {
            var date1 = new Date(p1.released)
            var date2 = new Date(p2.released)
            return date2 - date1
        })
        const sortedProducts = { result: sortedResult, meta: currentPagination };

        setCurrentProducts(sortedProducts);
        render(currentProducts, currentPagination);
    }
});


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const { count } = pagination;

    if(count != 0){

    //Number of recently released products
    const new_count = (Object.values(currentProducts).filter(currentProducts => new Date(currentProducts.released) >= fortnight_before)).length;//This functionality works (it is tested). However, it displays '0' because no product was released 2 weeks ago from now.

    //P90 value
    const prices = Object.values(currentProducts).map(x => x.price);
    prices.sort((a, b) => a - b);
    const index_p90 = Math.floor(prices.length * 0.9);
    const value_p90 = prices[index_p90];

    //P95 value
    const index_p95 = Math.floor(prices.length * 0.95);
    const value_p95 = prices[index_p95];

    //P50 value
    const index_p50 = Math.floor(prices.length * 0.5);
    const value_p50 = prices[index_p50];

    //Last released date
    const dates = Object.values(currentProducts).map(x => x.released);
    dates.sort((p1, p2) => {
        var date1 = new Date(p1)
        var date2 = new Date(p2)
        return date2 - date1
    })

    spanNbProducts.innerHTML = count;
    spanNbNewProducts.innerHTML = new_count;
    spanP90.innerHTML = value_p90;
    spanP95.innerHTML = value_p95;
    spanP50.innerHTML = value_p50;
    spanNbBrands.innerHTML = uniqueBrands.size;
    spanLastDate.innerHTML = dates[0];
    }
    else{
        spanNbProducts.innerHTML = count;
        spanNbNewProducts.innerHTML = 0;
        spanP90.innerHTML = 0;
        spanP95.innerHTML = 0;
        spanP50.innerHTML = 0;
        spanNbBrands.innerHTML = 0;
        spanLastDate.innerHTML = 0;
    }
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands();
};
