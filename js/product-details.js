// AmpKicks - Product Details Page JavaScript

let currentProduct = null;
let selectedSize = null;
let quantity = 1;

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Load product details
async function loadProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            window.location.href = 'products.html';
            return;
        }
        
        const response = await fetch('data/products.json');
        const data = await response.json();
        currentProduct = data.products.find(p => p.id == productId);
        
        if (!currentProduct) {
            window.location.href = 'products.html';
            return;
        }
        
        displayProduct();
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

// Display product
function displayProduct() {
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = currentProduct.name;
    
    // Main image
    document.getElementById('mainImage').src = currentProduct.image;
    document.getElementById('mainImage').alt = currentProduct.name;
    
    // Thumbnail images
    const thumbnailContainer = document.getElementById('thumbnailImages');
    thumbnailContainer.innerHTML = '';
    currentProduct.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img}" alt="${currentProduct.name}" data-testid="img-thumbnail-${index}">`;
        thumb.onclick = () => selectImage(img, thumb);
        thumbnailContainer.appendChild(thumb);
    });
    
    // Product info
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `₱${currentProduct.price.toLocaleString()}`;
    document.getElementById('stickyPrice').textContent = `₱${currentProduct.price.toLocaleString()}`;
    document.getElementById('productDescription').textContent = currentProduct.description;
    
    // Rating
    const stars = '★'.repeat(Math.floor(currentProduct.rating)) + '☆'.repeat(5 - Math.floor(currentProduct.rating));
    document.getElementById('productRating').innerHTML = `
        <div class="stars">${stars}</div>
        <span class="rating-value">${currentProduct.rating} out of 5</span>
    `;
    
    // Sizes
    const sizeContainer = document.getElementById('sizeOptions');
    sizeContainer.innerHTML = '';
    currentProduct.sizes.forEach((size, index) => {
        const sizeBtn = document.createElement('div');
        sizeBtn.className = `size-option ${index === 0 ? 'active' : ''}`;
        sizeBtn.textContent = size;
        sizeBtn.onclick = () => selectSize(size, sizeBtn);
        sizeBtn.setAttribute('data-testid', `button-size-${size}`);
        sizeContainer.appendChild(sizeBtn);
    });
    selectedSize = currentProduct.sizes[0];
    
    // Product details
    document.getElementById('productCategory').textContent = currentProduct.category;
    document.getElementById('productGender').textContent = currentProduct.gender;
    document.getElementById('productBrandDetail').textContent = currentProduct.brand;
}

// Select image
function selectImage(imgSrc, thumbElement) {
    document.getElementById('mainImage').src = imgSrc;
    document.querySelectorAll('.thumbnail-item').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
}

// Select size
function selectSize(size, element) {
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
    element.classList.add('active');
}

// Quantity controls
function updateQuantity(change) {
    quantity = Math.max(1, Math.min(10, quantity + change));
    document.getElementById('quantity').value = quantity;
}

// Add to cart
function addToCart() {
    if (!selectedSize) {
        showToast('Please select a size');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    const existingItem = cart.find(item => item.id == currentProduct.id && item.size == selectedSize);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            size: selectedSize,
            quantity: quantity
        });
    }
    
    localStorage.setItem('ampkicksCart', JSON.stringify(cart));
    updateCartCount();
    showToast(`Added ${quantity} item(s) to cart!`);
}

// Buy now
function buyNow() {
    addToCart();
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
    loadProductDetails();
    
    document.getElementById('decreaseQty').addEventListener('click', () => updateQuantity(-1));
    document.getElementById('increaseQty').addEventListener('click', () => updateQuantity(1));
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('buyNowBtn').addEventListener('click', buyNow);
    document.getElementById('stickyAddToCart').addEventListener('click', addToCart);
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
