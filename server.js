const express = require('express');
const cors = require('cors');
const axios = require('axios');
const forge = require('node-forge');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

const crypto = require('crypto');

/**
 * Encrypt API Key using the Platform Public Key
 */
function encryptApiKey(apiKey, publicKeyStr) {
    try {
        const formattedKey = '-----BEGIN PUBLIC KEY-----\n' + 
            publicKeyStr.match(/.{1,64}/g).join('\n') + 
            '\n-----END PUBLIC KEY-----';
            
        const buffer = Buffer.from(apiKey);
        const encrypted = crypto.publicEncrypt({
            key: formattedKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, buffer);
        
        return encrypted.toString('base64');
    } catch (err) {
        console.error("Encryption error:", err);
        throw err;
    }
}

/**
 * Endpoint to process M-Pesa Checkout
 */
app.post('/api/checkout', async (req, res) => {
    try {
        const { phone, amount } = req.body;
        
        console.log(`Initiating checkout for phone: ${phone}, amount: ${amount}`);

        // 1. Encrypt API Key
        const encryptedKey = encryptApiKey(process.env.MPESA_API_KEY, process.env.MPESA_PUBLIC_KEY);
        
        // 2. Get Session Key
        const sessionResponse = await axios.get('https://openapi.m-pesa.com/sandbox/ipg/v2/vodacomTZN/getSession/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${encryptedKey}`,
                'Origin': '*'
            }
        });

        const sessionKey = sessionResponse.data.output_SessionID;
        console.log("Successfully retrieved M-Pesa Session Key");

        // TODO: Proceed with C2B Single Payment using the Session Key
        // For now, we return success that we connected to the API
        
        res.json({ success: true, message: "Payment initiated successfully in Sandbox", sessionKey });

    } catch (error) {
        console.error("M-Pesa API Error:");
        if (error.response) {
            console.error(error.response.data);
            res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error(error.message);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
});

// For any other route, send index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Danki Coffee backend running on http://localhost:${PORT}`);
});
