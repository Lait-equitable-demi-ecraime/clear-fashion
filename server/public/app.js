const productsList = document.getElementById('products-list');

fetch('http://localhost:8092/')
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            const productItem = document.createElement('li');
            productItem.classList.add('product');

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productItem.appendChild(productImage);

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');
            productItem.appendChild(productInfo);

            const productName = document.createElement('h2');
            productName.textContent = product.name;
            productInfo.appendChild(productName);

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;
            productInfo.appendChild(productDescription);

            const productPrice = document.createElement('p');
            productPrice.innerHTML = `Price: <span>${product.price}</span>`;
            productInfo.appendChild(productPrice);

            productsList.appendChild(productItem);
        });
    })
    .catch(error => console.error('Failed to retrieve products:', error));
