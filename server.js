// Build trigger: 1786404602.186622
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) return res.status(500).send('Unable to load Danki Coffee storefront.');

        const enhancement = `
<style>
#product-grid .danki-add-to-cart {
    width: 100% !important; min-height: 46px; display: inline-flex !important;
    align-items: center; justify-content: center; gap: 8px; border-radius: 999px !important;
    border: 1px solid rgba(255,255,255,.14) !important;
    background: linear-gradient(135deg, #ffc68b, #d9822b) !important;
    color: #492900 !important; font-family: Manrope, sans-serif !important;
    font-size: 13px !important; font-weight: 800 !important;
    box-shadow: 0 8px 24px rgba(255,191,105,.18), inset 0 1px 0 rgba(255,255,255,.25) !important;
    cursor: pointer; transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
}
#product-grid .danki-add-to-cart:hover { transform: translateY(-1px); filter: brightness(1.06); }
#product-grid .danki-add-to-cart:active { transform: translateY(0) scale(.985); }
.danki-roast-section { margin-bottom: 34px; }
.danki-roast-heading { display:flex; align-items:center; gap:12px; margin: 0 0 14px; }
.danki-roast-heading h3 { margin:0; font-family:Sora,sans-serif; font-size:20px; font-weight:700; color:#f0e0d2; }
.danki-roast-heading span { font:600 10px Manrope,sans-serif; letter-spacing:.14em; text-transform:uppercase; color:#ffc68b; }
.danki-roast-heading:after { content:''; height:1px; flex:1; background:linear-gradient(90deg,rgba(255,198,139,.25),transparent); }
.danki-roast-products { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
@media(min-width:768px){ .danki-roast-products{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;} .danki-roast-heading h3{font-size:24px;} }
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
            }
        });
    }

    function roastName(card) {
        const text = (card.textContent || '').toLowerCase();
        if (text.includes('medium to dark')) return 'Medium to Dark Roast';
        if (text.includes('dark roast')) return 'Dark Roast';
        if (text.includes('medium roast')) return 'Medium Roast';
        return 'Other';
    }

    let regrouping = false;
    function groupRoasts() {
        const grid = document.getElementById('product-grid');
        if (!grid || regrouping) return;
        const cards = Array.from(grid.children).filter(function(el){ return !el.classList.contains('danki-roast-section'); });
        if (!cards.length) return;
        if (cards.every(function(c){ return c.parentElement && c.parentElement.classList.contains('danki-roast-products'); })) return;
        regrouping = true;
        const groups = [
            ['Dark Roast', 'dark'],
            ['Medium Roast', 'medium'],
            ['Medium to Dark Roast', 'medium-dark']
        ];
        const buckets = {};
        cards.forEach(function(card){ const key = roastName(card); (buckets[key] ||= []).push(card); });
        grid.className = 'space-y-2';
        grid.innerHTML = '';
        groups.forEach(function(pair){
            const title = pair[0], key = pair[1], items = buckets[title] || [];
            if (!items.length) return;
            const section = document.createElement('section');
            section.className = 'danki-roast-section';
            section.dataset.roast = key;
            section.innerHTML = '<div class="danki-roast-heading"><div><span>Danki Collection</span><h3>'+title+'</h3></div></div>';
            const productGrid = document.createElement('div');
            productGrid.className = 'danki-roast-products';
            items.forEach(function(card){ productGrid.appendChild(card); });
            section.appendChild(productGrid);
            grid.appendChild(section);
        });
        if (buckets.Other) {
            const productGrid = document.createElement('div');
            productGrid.className = 'danki-roast-products';
            buckets.Other.forEach(function(card){ productGrid.appendChild(card); });
            grid.appendChild(productGrid);
        }
        regrouping = false;
        upgradeProductButtons();
    }

    function refreshSections() {
        document.querySelectorAll('.danki-roast-section').forEach(function(section){
            const cards = section.querySelectorAll('.danki-roast-products > *');
            const visible = Array.from(cards).some(function(card){ return !card.hidden && getComputedStyle(card).display !== 'none'; });
            section.style.display = visible ? '' : 'none';
        });
    }

    function run() {
        upgradeProductButtons();
        if (document.querySelectorAll('#product-grid > *').length) groupRoasts();
        refreshSections();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    const observer = new MutationObserver(function(){ setTimeout(run, 0); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

        const marker = '</body>';
        const output = html.includes(marker) ? html.replace(marker, enhancement + marker) : html + enhancement;
        res.type('html').send(output);
    });
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', app: 'Danki Coffee Web Server', timestamp: new Date().toISOString() });
});

// Official Danki Coffee catalogue — grouped by roast section in the storefront.
app.get('/api/products', (req, res) => {
    const products = [
        // DARK ROAST
        { id:'dark-beans-1kg', name:'Dark Roast Coffee Beans', category:'Dark Roast', format:'Beans', weight:'1kg', price:30000, desc:'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.', acidity:2, body:5, sweetness:3, aroma:5, altitude:'1,500m', process:'Full Natural' },
        { id:'dark-ground-1kg', name:'Dark Roast Ground Coffee', category:'Dark Roast', format:'Ground', weight:'1kg', price:32000, desc:'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.', acidity:2, body:5, sweetness:3, aroma:5, altitude:'1,500m', process:'Full Natural' },
        { id:'dark-beans-500g', name:'Dark Roast Coffee Beans', category:'Dark Roast', format:'Beans', weight:'500g', price:15500, desc:'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.', acidity:2, body:5, sweetness:3, aroma:5, altitude:'1,500m', process:'Full Natural' },

        // MEDIUM ROAST
        { id:'medium-beans-1kg', name:'Medium Roast Coffee Beans', category:'Medium Roast', format:'Beans', weight:'1kg', price:30000, desc:'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.', acidity:4, body:3, sweetness:4, aroma:5, altitude:'1,550m', process:'Fully Washed' },
        { id:'medium-ground-1kg', name:'Medium Roast Ground Coffee', category:'Medium Roast', format:'Ground', weight:'1kg', price:32000, desc:'Smooth, sweet, and beautifully balanced. Ground fresh to your exact preference.', acidity:4, body:3, sweetness:4, aroma:5, altitude:'1,550m', process:'Fully Washed' },
        { id:'medium-beans-500g', name:'Medium Roast Coffee Beans', category:'Medium Roast', format:'Beans', weight:'500g', price:15500, desc:'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.', acidity:4, body:3, sweetness:4, aroma:5, altitude:'1,550m', process:'Fully Washed' },

        // MEDIUM TO DARK ROAST
        { id:'medium-dark-beans-1kg', name:'Medium to Dark Roast Coffee Beans', category:'Medium to Dark Roast', format:'Beans', weight:'1kg', price:30000, desc:'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' },
        { id:'medium-dark-ground-1kg', name:'Medium to Dark Roast Ground Coffee', category:'Medium to Dark Roast', format:'Ground', weight:'1kg', price:32000, desc:'Ground Grade AA Arabica beans. Rich, bold, and full-bodied.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' },
        { id:'medium-dark-ground-500g', name:'Medium to Dark Roast Ground Coffee', category:'Medium to Dark Roast', format:'Ground', weight:'500g', price:17000, desc:'Rich, full-bodied ground coffee with sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' },
        { id:'medium-dark-beans-500g', name:'Medium to Dark Roast Coffee Beans', category:'Medium to Dark Roast', format:'Beans', weight:'500g', price:15500, desc:'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' },
        { id:'medium-dark-ground-250g', name:'Medium to Dark Roast Ground Coffee', category:'Medium to Dark Roast', format:'Ground', weight:'250g', price:11000, desc:'Pre-ground Grade AA Arabica beans (250g), rich and full-bodied.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' },
        { id:'medium-dark-beans-250g', name:'Medium to Dark Roast Coffee Beans', category:'Medium to Dark Roast', format:'Beans', weight:'250g', price:10000, desc:'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural' }
    ];
    res.json(products);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`[DANKI COFFEE] Web App running on port ${PORT}`));
