let products = [];
let currentPage = 1;
const itemsPerPage = 16;

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Không thể tải file products.json');
        }
        products = await response.json();
        // Đảo ngược mảng để hiển thị sản phẩm mới nhất (cuối mảng) ở đầu
        products = products.reverse();
        renderProducts();
        renderPagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    const filteredProducts = filterProducts();

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h5 class="productName">${product.name}</h5>
            <a href="${product.link}" target="_blank" rel="noopener noreferrer">Đến Shopee</a>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products based on search query and category
function filterProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    return products.filter(product =>
        product.name.toLowerCase().includes(searchValue) &&
        (categoryValue === '' || product.category === categoryValue)
    );
}

// Render pagination buttons
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    const filteredProducts = filterProducts();
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.textContent = '«';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    const maxVisibleButtons = 3;

    const firstButton = document.createElement('button');
    firstButton.textContent = '1';
    firstButton.addEventListener('click', () => {
        currentPage = 1;
        renderProducts();
        renderPagination();
    });
    if (currentPage === 1) {
        firstButton.classList.add('active');
    }
    paginationContainer.appendChild(firstButton);

    if (currentPage > maxVisibleButtons + 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
            renderPagination();
        });
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages - maxVisibleButtons) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    if (totalPages > 1) {
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            renderProducts();
            renderPagination();
        });
        if (currentPage === totalPages) {
            lastButton.classList.add('active');
        }
        paginationContainer.appendChild(lastButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = '»';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Event listener for search button click
document.getElementById('search-btn').addEventListener('click', () => {
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for pressing Enter key in search input
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        currentPage = 1;
        renderProducts();
        renderPagination();
    }
});

// Event listener for category filter change
document.getElementById('category-filter').addEventListener('change', () => {
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for clicking on the title to reset to all products
document.getElementById('shop-title').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for refresh button
document.getElementById('refresh-btn')?.addEventListener('click', () => {
    currentPage = 1;
    fetchProducts();
});

// Initial fetch and render
fetchProducts();