// Global Cart State
let cart = JSON.parse(localStorage.getItem('danki_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI Update
    updateCartUI();

    // 2. Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
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
            product: productName,
            variant: variantName,
            price: price,
            img: imgUrl,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    
    // Optional: open cart when added
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

function saveCart() {
    localStorage.setItem('danki_cart', JSON.stringify(cart));
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
        cart.forEach((item, index) => {
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
                                <button class="qty-btn" onclick="updateQuantity('${index}', -1)"><i class="fa-solid fa-minus"></i></button>
                                <span style="color: white; font-size: 0.9rem;">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity('${index}', 1)"><i class="fa-solid fa-plus"></i></button>
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

function updateQuantity(index, change) {
    const itemIndex = parseInt(index);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
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

async function submitOrder() {
    const phone = document.getElementById('receipt-code').value.trim();
    if (!phone) {
        alert("Please enter your M-Pesa phone number!");
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += (item.price * item.quantity);
    });

    const btn = document.querySelector('.btn-full');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: phone, amount: total })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert("Payment initiated! Check your phone for the M-Pesa PIN prompt.");
            closeLipaModal();
            cart = [];
            saveCart();
            updateCartUI();
            document.getElementById('receipt-code').value = '';
        } else {
            alert("Payment failed: " + JSON.stringify(data.error));
        }
    } catch (err) {
        alert("An error occurred: " + err.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
