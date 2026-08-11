// Build trigger: 1786404602.186622
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Set Cache-Control headers to prevent stale HTML/asset caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Serve the storefront with a small UI enhancement injected at request time.
// This lets us change the product action without rewriting the large Stitch HTML file.
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) return res.status(500).send('Unable to load Danki Coffee storefront.');

        const enhancement = `
<style>
#product-grid .danki-add-to-cart {
    width: 100% !important;
    min-height: 46px;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 999px !important;
    border: 1px solid rgba(255,255,255,.14) !important;
    background: linear-gradient(135deg, #ffc68b, #d9822b) !important;
    color: #492900 !important;
    font-family: Manrope, sans-serif !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    box-shadow: 0 8px 24px rgba(255,191,105,.18), inset 0 1px 0 rgba(255,255,255,.25) !important;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
}
#product-grid .danki-add-to-cart:hover {
    transform: translateY(-1px);
    filter: brightness(1.06);
    box-shadow: 0 10px 30px rgba(255,191,105,.28), inset 0 1px 0 rgba(255,255,255,.3) !important;
}
#product-grid .danki-add-to-cart:active { transform: translateY(0) scale(.985); }
</style>
<script>
(function () {
    function upgradeProductButtons() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        grid.querySelectorAll('button:not(.danki-add-to-cart)').forEach(function (button) {
            const text = (button.textContent || '').trim().replace(/\\s+/g, ' ');
            const isAction = text === '+' || text === 'Add to bag +' || /add to bag/i.test(text);
            if (!isAction) return;

            const originalOnClick = button.getAttribute('onclick');
            button.classList.add('danki-add-to-cart');
            button.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px">shopping_cart</span><span>Add to Cart</span>';
            button.setAttribute('aria-label', 'Add to Cart');

            if (originalOnClick) {
                button.setAttribute('onclick', originalOnClick + '; setTimeout(function(){ if (typeof openCart === \'function\') openCart(); }, 80);');
            } else if (!button.dataset.dankiBound) {
                button.dataset.dankiBound = '1';
                button.addEventListener('click', function () {
                    setTimeout(function () {
                        if (typeof openCart === 'function') openCart();
                    }, 80);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', upgradeProductButtons);
    } else {
        upgradeProductButtons();
    }

    const observer = new MutationObserver(upgradeProductButtons);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

        const marker = '</body>';
        const output = html.includes(marker)
            ? html.replace(marker, enhancement + marker)
            : html + enhancement;

        res.type('html').send(output);
    });
});

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    maxAge: 0
}));

// Health Check Endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', app: 'Danki Coffee Web Server', timestamp: new Date().toISOString() });
});

// Products API Endpoint
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 'med-500g', name: 'Medium Roast Beans', category: 'Medium Roast', format: 'Beans', weight: '500g', price: 15500,
            desc: 'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.', acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-1kg', name: 'Medium Roast Beans', category: 'Medium Roast', format: 'Beans', weight: '1kg', price: 30000,
            desc: 'Smooth, sweet, and beautifully balanced whole beans roasted fresh in Dar es Salaam.', acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-ground-1kg', name: 'Medium Roast Ground', category: 'Medium Roast', format: 'Ground', weight: '1kg', price: 32000,
            desc: 'Smooth, sweet, and beautifully balanced. Ground fresh to your exact preference.', acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-dark-250g', name: 'Medium to Dark Beans', category: 'Medium to Dark', format: 'Beans', weight: '250g', price: 10000,
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-ground-250g', name: 'Medium to Dark Ground', category: 'Medium to Dark', format: 'Ground', weight: '250g', price: 11000,
            desc: 'Pre-ground Grade AA Arabica beans (250g).', acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-500g', name: 'Medium to Dark Beans', category: 'Medium to Dark', format: 'Beans', weight: '500g', price: 15500,
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-1kg', name: 'Medium to Dark Beans', category: 'Medium to Dark', format: 'Beans', weight: '1kg', price: 30000,
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-ground-1kg', name: 'Medium to Dark Ground', category: 'Medium to Dark', format: 'Ground', weight: '1kg Grade AA', price: 30000,
            desc: 'Ground Grade AA Arabica beans. Rich, bold, and full-bodied.', acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'dark-500g', name: 'Dark Roast Beans', category: 'Dark Roast', format: 'Beans', weight: '500g', price: 15500,
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.', acidity: 2, body: 5, sweetness: 3, aroma: 5, altitude: '1,500m', process: 'Full Natural'
        },
        {
            id: 'dark-1kg', name: 'Dark Roast Beans', category: 'Dark Roast', format: 'Beans', weight: '1kg', price: 30000,
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.', acidity: 2, body: 5, sweetness: 3, aroma: 5, altitude: '1,500m', process: 'Full Natural'
        }
    ];
    res.json(products);
});

// Fallback to index.html for single-page routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[DANKI COFFEE] Web App running on port ${PORT}`);
});
