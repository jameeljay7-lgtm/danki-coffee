// Build trigger: 1786404602.186622
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Process Resilience Handlers
process.on('uncaughtException', (err) => {
  console.error('⚠️ [Process Resilience] Uncaught Exception (prevented crash):', err?.stack || err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Process Resilience] Unhandled Rejection (prevented crash):', reason?.stack || reason);
});

const app = express();
const PORT = process.env.PORT || 10000;

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

app.get('/dashboard', (req, res) => {
    const dashPath = path.join(__dirname, 'public', 'dashboard.html');
    res.sendFile(dashPath);
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', app: 'Danki Coffee Web Server', timestamp: new Date().toISOString() });
});

app.get('/api/deploy-logs', (req, res) => {
    res.json([
        { date: 'Aug 11', time: '03:56:40 PM', message: 'found 0 vulnerabilities', type: 'info' },
        { date: 'Aug 11', time: '03:56:41 PM', message: '==> Uploading build...', type: 'build' },
        { date: 'Aug 11', time: '03:56:44 PM', message: '==> Uploaded in 2.4s. Compression took 0.6s', type: 'build' },
        { date: 'Aug 11', time: '03:56:44 PM', message: '==> Build successful 🚀', type: 'success' }
    ]);
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
        { id:'medium-dark-ground-250g', name:'Dark Roast Coffee', category:'Medium to Dark Roast', format:'Ground', weight:'250g', price:11000, desc:'Pre-ground Grade AA Arabica beans (250g), rich and full-bodied.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural', img:'images/bag_med_dark_ground_250g.jpg' },
        { id:'medium-dark-beans-250g', name:'Dark Roast Coffee', category:'Medium to Dark Roast', format:'Beans', weight:'250g', price:10000, desc:'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural', img:'images/bag_med_dark_beans_250g.jpg' },
        
        // 250g Dark Roast
        { id:'dark-ground-250g', name:'Dark Roast Coffee', category:'Dark Roast', format:'Ground', weight:'250g', price:11000, desc:'Pre-ground Grade AA Arabica beans (250g), rich and full-bodied.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural', img:'images/bag_dark_ground_250g.jpg' },
        { id:'dark-beans-250g', name:'Dark Roast Coffee', category:'Dark Roast', format:'Beans', weight:'250g', price:10000, desc:'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.', acidity:3, body:4, sweetness:4, aroma:4, altitude:'1,600m', process:'Pulped Natural', img:'images/bag_dark_beans_250g.jpg' },

        // BREWING EQUIPMENT
        { id:'french-press-350ml', name:'French Press', category:'Equipment', format:'Equipment', weight:'350ml', price:35000, desc:'Classic 350ml borosilicate glass French Press. Produces a rich, full-bodied brew in 4 minutes. Perfect for 1–2 cups.', img:null },
        { id:'french-press-600ml', name:'French Press', category:'Equipment', format:'Equipment', weight:'600ml', price:45000, desc:'600ml French Press for sharing. Double-wall stainless steel frame with heat-resistant borosilicate glass.', img:null },
        { id:'french-press-1000ml', name:'French Press', category:'Equipment', format:'Equipment', weight:'1000ml', price:55000, desc:'Large 1000ml French Press ideal for offices or families. Premium borosilicate glass with stainless steel plunger.', img:null }
    ];
    res.json(products);
});


app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Uptime / Keep-Alive Bot (Prevents Render Free Tier Sleep)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://danki-coffee-2bmn.onrender.com';
const PING_INTERVAL_MS = 14 * 60 * 1000; // Ping every 14 minutes

function startUptimeBot() {
    console.log(`[Uptime Bot] Initialized. Target URL: ${RENDER_URL}/health (Ping Interval: 14 mins)`);
    setInterval(async () => {
        try {
            const response = await fetch(`${RENDER_URL}/health`);
            console.log(`[Uptime Bot] Ping successful: status ${response.status} at ${new Date().toISOString()}`);
        } catch (err) {
            console.warn(`[Uptime Bot] Ping notice: ${err.message}`);
        }
    }, PING_INTERVAL_MS);
}

app.listen(PORT, () => {
    console.log(`[DANKI COFFEE] Web App running on port ${PORT}`);
    startUptimeBot();
});

