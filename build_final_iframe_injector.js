const fs = require('fs');

const iframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Danki Coffee</title>
  <style>
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0C0705 !important; margin: 0; padding: 0; position: fixed; }
    iframe#danki-frame { position: absolute; top: 0; left: 0; width: 100vw; height: 100dvh; border: none; display: block; z-index: 9999; background: #0C0705; }
  </style>
</head>
<body>
  <iframe id="danki-frame" src="https://danki-coffee.onrender.com/" allow="fullscreen"></iframe>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

const mainTsx = `console.log("React disabled. Danki Coffee is now permanently mirrored from Render.");`;

const injectorScript = `
(async () => {
    // Auto-detect SITE_ID from URL
    const match = window.location.href.match(/\\/site\\/([a-f0-9\\-]+)/);
    if (!match) {
        alert("⚠️ You must be on the SiteJourney editor page (with /site/ID in the URL) to run this!");
        return;
    }
    const SITE_ID = match[1];
    
    let API_KEY = null;
    let AUTH_TOKEN = null;
    
    try {
        const keys = Object.keys(localStorage);
        for (const k of keys) {
            try {
                const val = localStorage.getItem(k);
                if (val && val.includes('sb_publishable_')) {
                    const apikeyMatch = val.match(/(sb_publishable_[A-Za-z0-9_-]+)/);
                    if (apikeyMatch) API_KEY = apikeyMatch[1];
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
        { path: 'index.html', content: ${JSON.stringify(iframeHtml)} },
        { path: 'src/main.tsx', content: ${JSON.stringify(mainTsx)} }
    ];

    console.log("☕ Forcing SiteJourney (" + SITE_ID + ") to be an iframe mirror of Render...");
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
        alert("✅ DANKI IS NOW LIKE ARIA!\\n\\nYour site is permanently mirrored. Click 'Publish Website' in SiteJourney!");
    } else {
        alert("❌ Error uploading files. Check the console.");
    }
})();
`;

fs.writeFileSync('danki_vanilla_sitejourney_override.js', injectorScript);
console.log('Built auto-detecting iframe injector script.');
