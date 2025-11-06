// AmpKicks - Main Landing Page JavaScript

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

// Load featured products
async function loadFeaturedProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const products = data.products;
        
        // Get first 8 products for featured section
        const featuredProducts = products.slice(0, 8);
        
        const container = document.getElementById('featuredProducts');
        container.innerHTML = '';
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Create product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    
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
    
    return col;
}

// Add to cart function
async function addToCart(productId) {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const product = data.products.find(p => p.id == productId);
        
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
        
        // Show success feedback
        showToast('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Buy now function
async function buyNow(productId) {
    await addToCart(productId);
    window.location.href = 'cart.html';
}

// Show toast notification
function showToast(message) {
    // Create toast element
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

// Newsletter form handler
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadFeaturedProducts();
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            showToast('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
