#!/usr/bin/env node
/**
 * Post-processes the `expo export --platform web` output for GitHub Pages +
 * iOS "Add to Home Screen".
 *
 * Expo's web export emits a bare index.html with no PWA metadata, so this adds:
 *   - the iOS standalone meta tags (launches without Safari chrome)
 *   - an apple-touch-icon and a web manifest
 *   - viewport-fit=cover so the layout reaches under the notch
 *   - .nojekyll, without which GitHub Pages silently drops the _expo/ directory
 *
 * The base path is read from app.json (expo.experiments.baseUrl) so it stays in
 * sync with whatever the export was built against.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(ROOT, 'assets');

const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const web = appJson.expo.web || {};
const base = (appJson.expo.experiments && appJson.expo.experiments.baseUrl) || '';
const url = (file) => `${base}/${file}`.replace(/\/+/g, '/');

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run `expo export --platform web` first.');
  process.exit(1);
}

// 1. Copy the icons the manifest and iOS reference.
for (const icon of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) {
  const from = path.join(ASSETS, icon);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(DIST, icon));
  else console.warn(`warning: ${icon} missing from assets/`);
}

// 2. Web manifest. start_url/scope must carry the base path or an installed
//    PWA opens at the domain root and 404s.
const manifest = {
  name: web.name || appJson.expo.name,
  short_name: web.shortName || web.name || appJson.expo.name,
  description: web.description || '',
  start_url: `${base}/`,
  scope: `${base}/`,
  display: web.display || 'standalone',
  orientation: appJson.expo.orientation || 'portrait',
  background_color: web.backgroundColor || '#ffffff',
  theme_color: web.themeColor || '#ffffff',
  icons: [
    { src: url('icon-192.png'), sizes: '192x192', type: 'image/png' },
    { src: url('icon-512.png'), sizes: '512x512', type: 'image/png' },
  ],
};
fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));

// 3. Inject the head tags Expo doesn't emit.
const indexPath = path.join(DIST, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// viewport-fit=cover lets the app paint into the notch/home-indicator area.
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />'
);

const tags = [
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
  `<meta name="apple-mobile-web-app-title" content="${manifest.short_name}">`,
  `<link rel="apple-touch-icon" href="${url('apple-touch-icon.png')}">`,
  `<link rel="manifest" href="${url('manifest.json')}">`,
].join('\n');

if (!html.includes('apple-mobile-web-app-capable')) {
  html = html.replace('</head>', `${tags}\n</head>`);
}

// Safari applies a rubber-band overscroll to the document that reads as the
// whole app sliding around; the export's reset doesn't cover it.
html = html.replace(
  '</style>',
  `  body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
    </style>`
);

fs.writeFileSync(indexPath, html);

// 4. GitHub Pages runs Jekyll by default, which excludes _-prefixed paths —
//    that would drop the entire JS bundle under _expo/.
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log(`post-processed dist/ for base path "${base || '/'}"`);
