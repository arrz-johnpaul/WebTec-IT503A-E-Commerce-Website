// AmpKicks - Checkout Page JavaScript

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

// Load cart and order summary
function loadOrderSummary() {
    cart = JSON.parse(localStorage.getItem('ampkicksCart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }
    
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.setAttribute('data-testid', `order-item-${item.id}`);
        
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image" data-testid="img-order-${item.id}">
            <div class="order-item-details">
                <h6 data-testid="text-order-name-${item.id}">${item.name}</h6>
                <p data-testid="text-order-size-${item.id}">Size: ${item.size}</p>
                <p data-testid="text-order-qty-${item.id}">Qty: ${item.quantity}</p>
            </div>
            <div class="order-item-price" data-testid="text-order-price-${item.id}">
                ₱${(item.price * item.quantity).toLocaleString()}
            </div>
        `;
        
        orderItems.appendChild(orderItem);
    });
    
    updateOrderTotals();
    updateCartCount();
}

// Update order totals
function updateOrderTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('orderSubtotal').textContent = `₱${subtotal.toLocaleString()}`;
    document.getElementById('orderTotal').textContent = `₱${subtotal.toLocaleString()}`;
}

// Form validation and submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        city: form.city.value,
        province: form.province.value,
        zipCode: form.zipCode.value,
        paymentMethod: form.paymentMethod.value
    };
    
    // Validate all fields
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.province || !formData.zipCode) {
        showToast('Please fill in all required fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    // Phone validation (basic)
    if (formData.phone.length < 10) {
        showToast('Please enter a valid phone number');
        return;
    }
    
    // Process order
    processOrder(formData);
}

// Process order
function processOrder(formData) {
    const order = {
        orderNumber: 'AK' + Date.now(),
        date: new Date().toISOString(),
        customer: formData,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: 0,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    // Save order to localStorage (in a real app, this would go to a server)
    let orders = JSON.parse(localStorage.getItem('ampkicksOrders')) || [];
    orders.push(order);
    localStorage.setItem('ampkicksOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('ampkicksCart');
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Reset form
    document.getElementById('checkoutForm').reset();
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
    loadOrderSummary();
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
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
