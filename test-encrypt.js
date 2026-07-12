const crypto = require('crypto');
require('dotenv').config();

const publicKeyStr = process.env.MPESA_PUBLIC_KEY;
const apiKey = process.env.MPESA_API_KEY;

console.log("Original Key Length:", publicKeyStr.length);

try {
    const formattedKey = '-----BEGIN CERTIFICATE-----\n' + 
        publicKeyStr.match(/.{1,64}/g).join('\n') + 
        '\n-----END CERTIFICATE-----';
        
    const buffer = Buffer.from(apiKey);
    const encrypted = crypto.publicEncrypt({
        key: formattedKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    
    console.log("Encrypted length:", encrypted.length);
    console.log("Encrypted base64:", encrypted.toString('base64'));
} catch (err) {
    console.error("CERTIFICATE error:", err.message);
    
    try {
        const formattedKey = '-----BEGIN PUBLIC KEY-----\n' + 
            publicKeyStr.match(/.{1,64}/g).join('\n') + 
            '\n-----END PUBLIC KEY-----';
            
        const buffer = Buffer.from(apiKey);
        const encrypted = crypto.publicEncrypt({
            key: formattedKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, buffer);
        console.log("PUBLIC KEY format worked");
    } catch (e) {
        console.error("PUBLIC KEY error:", e.message);
    }
}
