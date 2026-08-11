const fs = require('fs');

const SITE_ID = 'e0224b98-7ff7-4dea-b0db-0bcd37b564aa';

// Read the full index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// Build the console injector script
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

    const vanillaHtml = ${JSON.stringify(html)};

    const filesToUpload = [
        { path: 'index.html', content: vanillaHtml },
        { path: 'src/main.tsx', content: 'console.log("React disabled. Running Vanilla JS Danki Coffee.");' }
    ];

    console.log("☕ Injecting Vanilla Danki Coffee Store into SiteJourney...");
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
        alert("🎉 DANKI COFFEE STOREFRONT INJECTED!\\n\\nNow click 'Publish Website' in SiteJourney AI!");
    }
})();
`;

fs.writeFileSync('danki_vanilla_sitejourney_override.js', injectorScript);
console.log("✅ Built danki_vanilla_sitejourney_override.js (" + (injectorScript.length / 1024).toFixed(1) + " KB)");
