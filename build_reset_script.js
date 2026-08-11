const fs = require('fs');
const SITE_ID = 'e0224b98-7ff7-4dea-b0db-0bcd37b564aa';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Danki Coffee</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', background: '#0C0705', height: '100vh' }}>
      <h2>Danki Coffee - Render Redirecting...</h2>
      <p>If you see this, the iframe redirect is missing from Custom Scripts.</p>
    </div>
  </React.StrictMode>
);`;

const injectorScript = `
(async () => {
    const SITE_ID = "${SITE_ID}";
    let API_KEY = null;
    let AUTH_TOKEN = null;
    
    try {
        const keys = Object.keys(localStorage);
        for (const k of keys) {
            try {
                const val = localStorage.getItem(k);
                if (val && val.includes('sb_publishable_')) {
                    const match = val.match(/(sb_publishable_[A-Za-z0-9_-]+)/);
                    if (match) API_KEY = match[1];
                }
            } catch(e) {}
            try {
                const val = localStorage.getItem(k);
                if (!val) continue;
                const parsed = JSON.parse(val);
                if (parsed && parsed.access_token) AUTH_TOKEN = 'Bearer ' + parsed.access_token;
                else if (val.startsWith('eyJ') && val.split('.').length === 3) AUTH_TOKEN = 'Bearer ' + val;
            } catch(e) {}
        }
    } catch(e) {}
    
    if (!API_KEY) API_KEY = 'sb_publishable_-EuT4GFyd3NFT9Gy47EZyw_hi3xOmCV';
    
    if (!AUTH_TOKEN) {
        alert("⚠️ Could not find auth token. Make sure you are logged into SiteJourney AI!");
        return;
    }

    const filesToUpload = [
        { path: 'index.html', content: ${JSON.stringify(indexHtml)} },
        { path: 'src/main.tsx', content: ${JSON.stringify(mainTsx)} }
    ];

    console.log("☕ Restoring SiteJourney base files to allow Custom Scripts iframe to work...");
    const url = 'https://api.sitejourney.ai/rest/v1/site_files?on_conflict=site_id,file_path';
    let successCount = 0;

    for (const file of filesToUpload) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': API_KEY,
                    'Authorization': AUTH_TOKEN,
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({ site_id: SITE_ID, file_path: file.path, content: file.content })
            });
            if (response.ok) { console.log(\`✅ Uploaded \${file.path}\`); successCount++; }
            else { console.error(\`❌ Failed \${file.path}: \${response.status}\`); }
        } catch (e) { console.error(\`❌ Error uploading \${file.path}:\`, e); }
    }
    
    if (successCount === filesToUpload.length) {
        alert("✅ SITEJOURNEY FILES FIXED!\\n\\nNow your Custom Scripts iframe will work perfectly!\\nClick 'Publish Website' in SiteJourney!");
    }
})();
`;

fs.writeFileSync('danki_vanilla_sitejourney_override.js', injectorScript);
console.log('Built reset script.');
