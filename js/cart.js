// AmpKicks - Shopping Cart Page JavaScript

let cart = [];

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Load cart
function loadCart() {
    cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    displayCart();
    updateCartCount();
}

// Display cart
function displayCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        emptyCart.classList.remove('d-none');
        cartContent.classList.add('d-none');
        return;
    }
    
    emptyCart.classList.add('d-none');
    cartContent.classList.remove('d-none');
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-testid', `cart-item-${item.id}`);
        
        cartItem.innerHTML = `
            <div class="row align-items-center g-3">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" data-testid="img-cart-${item.id}">
                </div>
                <div class="col-md-4">
                    <div class="cart-item-details">
                        <h5 data-testid="text-cart-name-${item.id}">${item.name}</h5>
                        <p data-testid="text-cart-size-${item.id}">Size: ${item.size}</p>
                        <p class="cart-item-price" data-testid="text-cart-price-${item.id}">₱${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)" data-testid="button-decrease-${item.id}">-</button>
                        <span data-testid="text-quantity-${item.id}">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" data-testid="button-increase-${item.id}">+</button>
                    </div>
                </div>
                <div class="col-md-3 text-end">
                    <button class="remove-btn" onclick="removeItem(${index})" data-testid="button-remove-${item.id}">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    updateTotals();
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart();
    displayCart();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
    showToast('Item removed from cart');
}

// Update totals
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `₱${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `₱${subtotal.toLocaleString()}`;
}

// Save cart
function saveCart() {
    localStorage.setItem('ampkicksCart', JSON.stringify(cart));
    updateCartCount();
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
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
