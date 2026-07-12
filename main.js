// Global Cart State
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const icon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });
});

// Cart Functions
function addToCart(productName, variantName, price, imgUrl) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.product === productName && item.variant === variantName);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: Date.now().toString(),
            product: productName,
            variant: variantName,
            price: price,
            quantity: 1,
            img: imgUrl
        });
    }

    updateCartUI();
    
    // Optional: open cart when added
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('cart-total-price');
    const lipaAmountElem = document.getElementById('lipa-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    let totalItems = 0;
    let totalPrice = 0;
    
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        badge.style.display = 'none';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += (item.price * item.quantity);

            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-img" style="background-image: url('${item.img}')"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.product}</div>
                        <div class="cart-item-variant">${item.variant}</div>
                        <div class="cart-item-controls">
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                                <span style="color: white; font-size: 0.9rem;">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} TZS</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        badge.innerText = totalItems;
        badge.style.display = 'flex';
        checkoutBtn.disabled = false;
    }

    const formattedTotal = totalPrice.toLocaleString() + ' TZS';
    totalPriceElem.innerText = formattedTotal;
    lipaAmountElem.innerText = formattedTotal;
}

function updateQty(id, change) {
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function openLipaModal() {
    if (cart.length === 0) return;
    toggleCart(); // close sidebar
    const modal = document.getElementById('lipa-overlay');
    modal.classList.add('active');
}

function closeLipaModal() {
    const modal = document.getElementById('lipa-overlay');
    modal.classList.remove('active');
}

function submitOrder() {
    const receiptCode = document.getElementById('receipt-code').value.trim();
    if (!receiptCode) {
        alert("Please paste your full M-Pesa confirmation message first!");
        return;
    }

    let orderText = "Hello! New Order:\n\n";
    let total = 0;

    cart.forEach(item => {
        orderText += `${item.quantity}x ${item.product} (${item.variant}) - ${(item.price * item.quantity).toLocaleString()} TZS\n`;
        total += (item.price * item.quantity);
    });

    orderText += `\nTotal: ${total.toLocaleString()} TZS\n`;
    orderText += `\n--- M-Pesa Confirmation Message ---\n${receiptCode}`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/255773421941?text=${encodedText}`;
    
    // Close modal and clear cart
    closeLipaModal();
    cart = [];
    updateCartUI();
    document.getElementById('receipt-code').value = '';
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
}
