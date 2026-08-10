// Build trigger: 1786404602.186622
const express = require('express');
const cors = require('cors');
const path = require('path');

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
            id: 'med-500g',
            name: 'Medium Roast Beans',
            category: 'Medium Roast',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/bag_500g_medium_beans.png?v=5',
            desc: 'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-1kg',
            name: 'Medium Roast Beans',
            category: 'Medium Roast',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/bag_1kg_medium_beans.png?v=5',
            desc: 'Smooth, sweet, and beautifully balanced whole beans roasted fresh in Dar es Salaam.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-ground-1kg',
            name: 'Medium Roast Ground',
            category: 'Medium Roast',
            format: 'Ground',
            weight: '1kg',
            price: 32000,
            image: '/images/bag_1kg_medium_ground.png?v=5',
            desc: 'Smooth, sweet, and beautifully balanced. Ground fresh to your exact preference.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-dark-250g',
            name: 'Medium to Dark Beans',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '250g',
            price: 10000,
            image: '/images/bag_250g_meddark_beans.png?v=5',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-ground-250g',
            name: 'Medium to Dark Ground',
            category: 'Medium to Dark',
            format: 'Ground',
            weight: '250g',
            price: 11000,
            image: '/images/bag_250g_meddark_ground.png?v=5',
            desc: 'Pre-ground Grade AA Arabica beans (250g).',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-500g',
            name: 'Medium to Dark Beans',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/bag_500g_meddark_beans.png?v=5',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-1kg',
            name: 'Medium to Dark Beans',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/bag_1kg_meddark_beans.png?v=5',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-ground-1kg',
            name: 'Medium to Dark Ground',
            category: 'Medium to Dark',
            format: 'Ground',
            weight: '1kg Grade AA',
            price: 30000,
            image: '/images/bag_1kg_meddark_ground.png?v=5',
            desc: 'Ground Grade AA Arabica beans. Rich, bold, and full-bodied.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'dark-500g',
            name: 'Dark Roast Beans',
            category: 'Dark Roast',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/bag_500g_dark_beans.png?v=5',
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.',
            acidity: 2, body: 5, sweetness: 3, aroma: 5, altitude: '1,500m', process: 'Full Natural'
        },
        {
            id: 'dark-1kg',
            name: 'Dark Roast Beans',
            category: 'Dark Roast',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/bag_1kg_dark_beans.png?v=5',
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.',
            acidity: 2, body: 5, sweetness: 3, aroma: 5, altitude: '1,500m', process: 'Full Natural'
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
