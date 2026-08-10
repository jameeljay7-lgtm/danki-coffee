const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health Check Endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', app: 'Danki Coffee Web Server', timestamp: new Date().toISOString() });
});

// Products API Endpoint
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 'med-500g',
            name: 'Medium Roast',
            category: 'Medium Roast',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/coffee_bag_medium.png',
            desc: 'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-1kg',
            name: 'Medium Roast',
            category: 'Medium Roast',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/coffee_bag_medium.png',
            desc: 'Smooth, sweet, and beautifully balanced with bright citrus acidity and notes of creamy caramel.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-ground-1kg',
            name: 'Medium Roast',
            category: 'Medium Roast',
            format: 'Ground',
            weight: '1kg',
            price: 32000,
            image: '/images/coffee_bag_medium.png',
            desc: 'Smooth, sweet, and beautifully balanced. Ground fresh to your exact preference.',
            acidity: 4, body: 3, sweetness: 4, aroma: 5, altitude: '1,550m', process: 'Fully Washed'
        },
        {
            id: 'med-dark-250g',
            name: 'Medium to Dark',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '250g',
            price: 10000,
            image: '/images/coffee_bag_meddark.png',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-500g',
            name: 'Medium to Dark',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/coffee_bag_meddark.png',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-1kg',
            name: 'Medium to Dark',
            category: 'Medium to Dark',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/coffee_bag_meddark.png',
            desc: 'A rich, full-bodied cup bridging sweet caramel tones and bold dark chocolate notes.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'med-dark-ground-1kg',
            name: 'Medium to Dark',
            category: 'Medium to Dark',
            format: 'Ground',
            weight: '1kg Grade AA',
            price: 30000,
            image: '/images/coffee_bag_meddark.png',
            desc: 'Ground Grade AA Arabica beans. Rich, bold, and full-bodied.',
            acidity: 3, body: 4, sweetness: 4, aroma: 4, altitude: '1,600m', process: 'Pulped Natural'
        },
        {
            id: 'dark-500g',
            name: 'Dark Roast',
            category: 'Dark Roast',
            format: 'Beans',
            weight: '500g',
            price: 15500,
            image: '/images/coffee_bag_dark.png',
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.',
            acidity: 1, body: 5, sweetness: 3, aroma: 4, altitude: '1,450m', process: 'Natural Process'
        },
        {
            id: 'dark-1kg',
            name: 'Dark Roast',
            category: 'Dark Roast',
            format: 'Beans',
            weight: '1kg',
            price: 30000,
            image: '/images/coffee_bag_dark.png',
            desc: 'Deep, intense, and smoky with a heavy mouthfeel and lingering dark cocoa finish.',
            acidity: 1, body: 5, sweetness: 3, aroma: 4, altitude: '1,450m', process: 'Natural Process'
        }
    ];
    res.json(products);
});

// Order Submission Endpoint (Creates M-Pesa + WhatsApp flow)
app.post('/api/orders', (req, res) => {
    const { items, phone, total } = req.body;
    const orderId = 'DNK-' + Math.floor(100000 + Math.random() * 900000);
    
    // Format WhatsApp confirmation text
    const waText = `Hello Danki Coffee! I placed Order #${orderId}.\nPhone: ${phone}\nTotal: ${total} TZS\nItems:\n` +
        items.map(i => `- ${i.name} (${i.variant}) x${i.qty} = ${i.price * i.qty} TZS`).join('\n') +
        `\nPayment method: M-Pesa LIPA 58223806. Please confirm delivery!`;

    const waLink = `https://wa.me/255744600042?text=${encodeURIComponent(waText)}`;

    res.json({
        success: true,
        orderId,
        lipaNumber: '58223806',
        whatsappLink: waLink
    });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`☕ Danki Coffee server running on port ${PORT}`);
});
