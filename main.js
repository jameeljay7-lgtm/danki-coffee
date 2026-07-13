// =========================================
// DANKI COFFEE — Main Application Logic
// =========================================

// Cart State (persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('danki_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {

    // 0. Page Transition Fade Out
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
        }, 50);
    }

    // Intercept clicks on same-origin nav links for smooth fade out
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('javascript:') && link.target !== '_blank') {
            link.addEventListener('click', (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                
                if (overlay) {
                    e.preventDefault();
                    overlay.classList.remove('fade-out');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400); // Match transition length
                }
            });
        }
    });

    // 1. Update cart UI (safe — checks if elements exist)
    updateCartUI();

    // 2. Navigation scroll effect
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 30);
        });
        if (window.scrollY > 30) nav.classList.add('scrolled');
    }

    // 3. Active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // 4. Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        const icon = mobileMenuBtn.querySelector('i');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // 5. Scroll-triggered animations (Intersection Observer reveal)
    const animatedElements = document.querySelectorAll('.animate-on-load');
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => el.classList.add('active'));
    }

    // 6. Inner pages — force scrolled nav on load
    const isInnerPage = !document.querySelector('.hero-section');
    if (isInnerPage && nav) {
        nav.classList.add('scrolled');
    }

    // 7. FAQ Accordion Click Handlers
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    // 8. Testimonials slide auto-advance
    if (document.querySelector('.testimonial-slide')) {
        startTestimonialTimer();
    }
});

// =========================================
// CART FUNCTIONS
// =========================================

function addToCart(productName, variantName, price, imgUrl) {
    const existingIndex = cart.findIndex(
        item => item.product === productName && item.variant === variantName
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            product: productName,
            variant: variantName,
            price: price,
            img: imgUrl,
            quantity: 1,
            grind: 'Whole Beans'
        });
    }

    saveCart();
    updateCartUI();

    // Auto-open cart sidebar
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('active')) {
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

    // Bail safely if cart elements don't exist on this page
    if (!badge || !itemsContainer) return;

    let totalItems = 0;
    let totalPrice = 0;

    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        badge.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            // Ensure grind profile is initialized
            if (!item.grind) item.grind = 'Whole Beans';

            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-img" style="background-image: url('${item.img}')"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.product}</div>
                        <div class="cart-item-variant">${item.variant}</div>
                        <div class="cart-item-grind">
                            <label for="grind-${index}">Grind:</label>
                            <select id="grind-${index}" onchange="updateGrind(${index}, this.value)">
                                <option value="Whole Beans" ${item.grind === 'Whole Beans' ? 'selected' : ''}>Whole Beans</option>
                                <option value="Fine (Espresso)" ${item.grind === 'Fine (Espresso)' ? 'selected' : ''}>Fine (Espresso)</option>
                                <option value="Medium (Filter)" ${item.grind === 'Medium (Filter)' ? 'selected' : ''}>Medium (Filter)</option>
                                <option value="Coarse (French Press)" ${item.grind === 'Coarse (French Press)' ? 'selected' : ''}>Coarse (French Press)</option>
                            </select>
                        </div>
                        <div class="cart-item-controls">
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateQuantity(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                                <span style="color: white; font-size: 0.85rem;">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} TZS</div>
                        </div>
                    </div>
                </div>
            `;
        });

        badge.innerText = totalItems;
        badge.style.display = 'flex';
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    const formatted = totalPrice.toLocaleString() + ' TZS';
    if (totalPriceElem) totalPriceElem.innerText = formatted;
    if (lipaAmountElem) lipaAmountElem.innerText = formatted;
}

function updateQuantity(index, change) {
    if (index < 0 || index >= cart.length) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function openLipaModal() {
    if (cart.length === 0) return;
    toggleCart();
    const modal = document.getElementById('lipa-overlay');
    if (modal) {
        modal.classList.add('active');
        ussdStep = 0;
        updateUssdScreen();
    }
}

function closeLipaModal() {
    const modal = document.getElementById('lipa-overlay');
    if (modal) modal.classList.remove('active');
}

async function submitOrder() {
    const phoneInput = document.getElementById('receipt-code');
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    if (!phone) {
        alert('Please enter your M-Pesa phone number.');
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const btn = event.target.closest('.btn-full') || event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';
    btn.disabled = true;

    // Helper to trigger success modal with WhatsApp details
    const showSuccess = () => {
        const successModal = document.getElementById('success-overlay');
        if (successModal) {
            const waBtn = document.getElementById('whatsapp-confirm-btn');
            if (waBtn) {
                 let orderDetails = "Hello Danki Coffee! I have just placed an order:\n\n";
                cart.forEach(item => {
                    orderDetails += `☕ ${item.product} (${item.variant}) [${item.grind || 'Whole Beans'}] x ${item.quantity}\n`;
                });
                orderDetails += `\n💰 Total: ${total.toLocaleString()} TZS\n`;
                orderDetails += `📱 Paid from Phone: ${phone}\n\n`;
                orderDetails += "Please verify my payment!";
                waBtn.href = `https://wa.me/255744600042?text=${encodeURIComponent(orderDetails)}`;
            }
            closeLipaModal();
            successModal.classList.add('active');
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartUI();
            phoneInput.value = '';
        }
    };

    try {
        // Try requesting the sandbox checkout (optional fallback if sandbox is down)
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, amount: total })
        });

        const data = await response.json();
        
        // Always proceed to success modal (the manual LIPA steps + WhatsApp is the gold standard)
        showSuccess();
    } catch (err) {
        console.warn('Backend checkout not available, falling back to manual M-Pesa + WhatsApp flow:', err);
        showSuccess();
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-overlay');
    if (modal) modal.classList.remove('active');
}

function updateGrind(index, value) {
    if (index < 0 || index >= cart.length) return;
    cart[index].grind = value;
    saveCart();
}

function submitWholesaleInquiry(e) {
    e.preventDefault();
    const company = document.getElementById('ws-company').value.trim();
    const contact = document.getElementById('ws-contact').value.trim();
    const phone = document.getElementById('ws-phone').value.trim();
    const volume = document.getElementById('ws-volume').value;
    const notes = document.getElementById('ws-notes').value.trim();

    let message = `Hello Danki Coffee! I am interested in a wholesale partnership:\n\n`;
    message += `🏢 Company: ${company}\n`;
    message += `👤 Contact Person: ${contact}\n`;
    message += `📱 Phone Number: ${phone}\n`;
    message += `📦 Estimated Volume: ${volume} / month\n`;
    message += `📝 Details: ${notes}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/255744600042?text=${encoded}`, '_blank');
}

// =========================================
// M-PESA USSD DIALER SIMULATOR
// =========================================
let ussdStep = 0;

function updateUssdScreen() {
    const display = document.getElementById('ussd-display');
    const inputVal = document.getElementById('ussd-input-val');
    const backBtn = document.getElementById('ussd-back-btn');
    const nextBtn = document.getElementById('ussd-next-btn');
    
    if (!display || !inputVal) return;
    
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    const steps = [
        {
            menu: "Dialing...\n\nPress NEXT to connect to Vodacom M-Pesa",
            input: "*150*00#"
        },
        {
            menu: "M-Pesa\n1: Tuma Pesa\n2: Toa Pesa\n3: Nunua Kifurushi\n4: Lipa Bili (Pay Bills)\n5: Huduma za Kifedha",
            input: "4"
        },
        {
            menu: "Lipa Bili\n1: LIPA Kwa M-Pesa\n2: Nunua Luku\n3: Nunua King'amuzi",
            input: "1"
        },
        {
            menu: "Enter LIPA Number:",
            input: "58223806"
        },
        {
            menu: `Enter Amount (TZS):\n\n(Your Cart Total is ${total.toLocaleString()} TZS)`,
            input: `${total.toLocaleString()}`
        },
        {
            menu: `Enter PIN to confirm payment of ${total.toLocaleString()} TZS to DANKI INVESTMENTS:`,
            input: "••••"
        },
        {
            menu: "Payment request sent!\n\nWait for the confirmation SMS from M-Pesa, then enter your phone number on the right and click Pay.",
            input: "OK"
        }
    ];
    
    const current = steps[ussdStep];
    display.innerText = current.menu;
    inputVal.innerText = current.input;
    
    if (backBtn) backBtn.disabled = (ussdStep === 0);
    if (nextBtn) {
        if (ussdStep === steps.length - 1) {
            nextBtn.innerText = "Restart";
        } else {
            nextBtn.innerText = "Next";
        }
    }
}

function nextUssdStep() {
    ussdStep = (ussdStep + 1) % 7;
    updateUssdScreen();
}

function prevUssdStep() {
    if (ussdStep > 0) {
        ussdStep--;
        updateUssdScreen();
    }
}

// =========================================
// TESTIMONIALS SLIDER
// =========================================
let activeSlide = 0;
let slideInterval;

function setTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    if (slides.length === 0) return;
    
    activeSlide = index;
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
    });
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

function startTestimonialTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        const slides = document.querySelectorAll('.testimonial-slide');
        if (slides.length > 0) {
            const next = (activeSlide + 1) % slides.length;
            setTestimonial(next);
        }
    }, 6000);
}

// =========================================
// PRODUCT QUICK VIEW MODAL
// =========================================
function openQuickView(card) {
    const overlay = document.getElementById('quickview-overlay');
    if (!overlay) return;

    const name = card.getAttribute('data-name');
    const variant = card.getAttribute('data-variant');
    const price = parseInt(card.getAttribute('data-price'));
    const img = card.getAttribute('data-img');
    const desc = card.getAttribute('data-desc');
    const acidity = parseInt(card.getAttribute('data-acidity') || '3');
    const body = parseInt(card.getAttribute('data-body') || '3');
    const sweetness = parseInt(card.getAttribute('data-sweetness') || '3');
    const aroma = parseInt(card.getAttribute('data-aroma') || '3');
    const altitude = card.getAttribute('data-altitude');
    const process = card.getAttribute('data-process');

    document.getElementById('qv-title').innerText = name + ' (' + variant + ')';
    document.getElementById('qv-price').innerText = price.toLocaleString() + ' TZS';
    document.getElementById('qv-desc').innerText = desc;
    document.getElementById('qv-image').style.backgroundImage = `url('${img}')`;
    document.getElementById('qv-altitude').innerText = altitude;
    document.getElementById('qv-process').innerText = process;

    const drawDots = (containerId, activeCount) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            container.innerHTML += `<div class="profile-dot ${i <= activeCount ? 'active' : ''}"></div>`;
        }
    };

    drawDots('qv-acidity-dots', acidity);
    drawDots('qv-body-dots', body);
    drawDots('qv-sweetness-dots', sweetness);
    drawDots('qv-aroma-dots', aroma);

    // Setup Add to Cart button
    document.getElementById('qv-add-btn').onclick = () => {
        const grind = document.getElementById('qv-grind-select').value;
        addToCartWithGrind(name, variant, price, img, grind);
        closeQuickView();
    };

    overlay.classList.add('active');
}

function closeQuickView(event) {
    const overlay = document.getElementById('quickview-overlay');
    if (!overlay) return;

    if (event) {
        if (event.target === overlay) {
            overlay.classList.remove('active');
        }
    } else {
        overlay.classList.remove('active');
    }
}

function addToCartWithGrind(productName, variantName, price, imgUrl, grind) {
    const existingIndex = cart.findIndex(
        item => item.product === productName && item.variant === variantName
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].grind = grind;
    } else {
        cart.push({
            product: productName,
            variant: variantName,
            price: price,
            img: imgUrl,
            quantity: 1,
            grind: grind
        });
    }

    saveCart();
    updateCartUI();

    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('active')) {
        toggleCart();
    }
}
