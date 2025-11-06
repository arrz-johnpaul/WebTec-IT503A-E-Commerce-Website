// AmpKicks - Products Page JavaScript

let allProducts = [];
let filteredProducts = [];

// Update cart count on page load
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Load all products
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        allProducts = data.products;
        filteredProducts = [...allProducts];
        
        // Check URL parameters for initial filters
        const urlParams = new URLSearchParams(window.location.search);
        const gender = urlParams.get('gender');
        const category = urlParams.get('category');
        
        if (gender) {
            document.getElementById(`gender${gender}`).checked = true;
        }
        if (category) {
            const categoryCheckbox = document.querySelector(`.category-filter[value="${category}"]`);
            if (categoryCheckbox) categoryCheckbox.checked = true;
        }
        
        applyFilters();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const selectedGenders = Array.from(document.querySelectorAll('.gender-filter:checked')).map(cb => cb.value);
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm) ||
                            product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
        const matchesPrice = product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesGender && matchesPrice;
    });
    
    displayProducts();
}

// Display products
function displayProducts() {
    const container = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const productCount = document.getElementById('productCount');
    
    container.innerHTML = '';
    productCount.textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    
    filteredProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-xl-3';
        
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        
        col.innerHTML = `
            <div class="product-card" data-testid="card-product-${product.id}">
                <div class="product-image-container" onclick="window.location.href='product-details.html?id=${product.id}'" data-testid="img-container-product-${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image" data-testid="img-product-${product.id}">
                </div>
                <div class="product-info">
                    <h5 class="product-name" data-testid="text-name-${product.id}">${product.name}</h5>
                    <p class="product-price" data-testid="text-price-${product.id}">₱${product.price.toLocaleString()}</p>
                    <div class="product-rating" data-testid="text-rating-${product.id}">
                        <span>${stars}</span> <span class="text-muted">(${product.rating})</span>
                    </div>
                    <div class="product-buttons">
                        <button class="btn btn-dark" onclick="addToCart(${product.id})" data-testid="button-add-cart-${product.id}">
                            <i class="bi bi-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-dark" onclick="buyNow(${product.id})" data-testid="button-buy-${product.id}">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Add to cart
async function addToCart(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.sizes[0] || 'N/A',
            quantity: 1
        });
    }
    
    localStorage.setItem('ampkicksCart', JSON.stringify(cart));
    updateCartCount();
    showToast('Product added to cart!');
}

// Buy now
async function buyNow(productId) {
    await addToCart(productId);
    window.location.href = 'cart.html';
}

// Show toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #111;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadProducts();
    
    // Search
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Category filters
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Gender filters
    document.querySelectorAll('.gender-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price range
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    priceRange.addEventListener('input', () => {
        priceValue.textContent = `₱${parseInt(priceRange.value).toLocaleString()}`;
        applyFilters();
    });
    
    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.category-filter, .gender-filter').forEach(cb => cb.checked = false);
        document.getElementById('priceRange').value = 9000;
        document.getElementById('priceValue').textContent = '₱9,000';
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        applyFilters();
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
