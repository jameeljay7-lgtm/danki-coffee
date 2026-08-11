const fs = require('fs');

const RENDER_BASE = 'https://danki-coffee.onrender.com';
const SITE_ID = 'e0224b98-7ff7-4dea-b0db-0bcd37b564aa';

// Read the full index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// Extract just the <body> content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
const bodyHtml = bodyMatch ? bodyMatch[1] : html;

// Extract <head> content (styles, meta, etc.) between <head> and </head>
const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i);
const headContent = headMatch ? headMatch[1] : '';

// Escape for template literal embedding
const escapeTemplateLiteral = (str) => {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${')
        .replace(/<\/script>/gi, '<\\/script>');
};

// Build the complete vanilla HTML page (like ARIA's router_template)
const vanillaHtml = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Danki Coffee | It's Not Just Coffee, It's Love</title>
    <meta name="description" content="100% single-origin Tanzanian Arabica coffee beans, roasted in small batches in Dar es Salaam."/>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
    
    <!-- Google Fonts & Material Symbols -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Manrope:wght@400;600;700&family=Sora:wght@600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>

    <!-- Tailwind Config -->
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ffc68b",
                        "on-primary": "#492900",
                        "primary-container": "#ff9f1c",
                        "on-primary-container": "#683c00",
                        "amber-glow": "#FFBF69",
                        "espresso-deep": "#0C0705",
                        "roasted-bean": "#1A0F0A",
                        "surface-dim": "#1a120a",
                        "surface-container": "#271e16",
                        "glass-surface": "rgba(30, 20, 15, 0.45)",
                        "glass-border": "rgba(255, 255, 255, 0.12)",
                        "on-surface": "#f0e0d2",
                        "on-surface-variant": "#dac2ae"
                    },
                    fontFamily: {
                        "display": ["Sora", "sans-serif"],
                        "body": ["Manrope", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    <\/script>

    <style>
        body {
            background-color: #0C0705;
            background-image: 
                radial-gradient(circle at 15% 25%, rgba(255, 191, 105, 0.14), transparent 45%),
                radial-gradient(circle at 85% 75%, rgba(228, 191, 176, 0.08), transparent 45%);
            background-attachment: fixed;
            color: #f0e0d2;
            font-family: 'Manrope', sans-serif;
        }
        .glass-panel {
            background: rgba(30, 20, 15, 0.5);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }
        .glass-nav {
            background: rgba(20, 10, 5, 0.85);
            backdrop-filter: blur(32px);
            -webkit-backdrop-filter: blur(32px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        .btn-glow {
            box-shadow: 0 0 20px rgba(255, 198, 139, 0.35);
            transition: all 0.3s ease;
        }
        .btn-glow:hover {
            box-shadow: 0 0 35px rgba(255, 198, 139, 0.6);
            transform: translateY(-2px);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>

    <script>
        // ARIA-style Global Fetch Interceptor: rewrites all relative URLs to Render backend
        var DANKI_API_BASE = '${RENDER_BASE}';
        var originalFetch = window.fetch;
        window.fetch = async function() {
            var args = Array.from(arguments);
            if (typeof args[0] === 'string' && args[0].startsWith('/')) {
                args[0] = DANKI_API_BASE + args[0];
            }
            return originalFetch.apply(this, args);
        };
    <\/script>
</head>
<body class="min-h-screen flex flex-col relative pb-32">
\`+ \`${escapeTemplateLiteral(bodyHtml)}\` + \`
</body>
</html>`;

// Build the console injector script (exactly like ARIA's vanilla_router_override.js)
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

    const vanillaHtml = ${JSON.stringify(vanillaHtml)};

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
console.log(`✅ Built danki_vanilla_sitejourney_override.js (${(injectorScript.length / 1024).toFixed(1)} KB)`);
