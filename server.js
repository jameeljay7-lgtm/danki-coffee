const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function encryptApiKey(apiKey, publicKeyStr) {
  const formattedKey = '-----BEGIN PUBLIC KEY-----\n' + publicKeyStr.match(/.{1,64}/g).join('\n') + '\n-----END PUBLIC KEY-----';
  return crypto.publicEncrypt({key: formattedKey,padding: crypto.constants.RSA_PKCS1_PADDING},Buffer.from(apiKey)).toString('base64');
}

app.post('/api/checkout', async (req,res) => {
  try {
    const {phone,amount}=req.body;
    if(!phone||!amount) return res.status(400).json({success:false,error:'Phone and amount are required'});
    const encryptedKey=encryptApiKey(process.env.MPESA_API_KEY,process.env.MPESA_PUBLIC_KEY);
    const sessionResponse=await axios.get('https://openapi.m-pesa.com/sandbox/ipg/v2/vodacomTZN/getSession/',{headers:{'Content-Type':'application/json',Authorization:`Bearer ${encryptedKey}`,Origin:'*'}});
    res.json({success:true,message:'Payment session created',sessionKey:sessionResponse.data.output_SessionID});
  } catch(error) {
    console.error('M-Pesa API Error:',error.response?.data||error.message);
    res.status(error.response?.status||500).json({success:false,error:error.response?.data||'Internal Server Error'});
  }
});

app.get('/sitemap.xml',(req,res)=>{
  const protocol=req.headers['x-forwarded-proto']||req.protocol;
  const baseUrl=`${protocol}://${req.get('host')}`;
  const today=new Date().toISOString().split('T')[0];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url></urlset>`);
});

app.use((req,res)=>res.sendFile(path.join(__dirname,'index.html')));
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Danki Coffee running on port ${PORT}`));
