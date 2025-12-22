// Script to prepare exported HTML file with correct asset paths
// This script should be run after building and exporting

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const exportHtmlPath = path.join(distDir, 'love-in-mexico-export.html');
const indexExportPath = path.join(distDir, 'index-export.html');

if (!fs.existsSync(exportHtmlPath)) {
  console.log('❌ Exported HTML file not found. Please export first.');
  process.exit(1);
}

if (!fs.existsSync(indexExportPath)) {
  console.log('❌ index-export.html not found. Please run "npm run build" first.');
  process.exit(1);
}

// Read both files
const exportedHtml = fs.readFileSync(exportHtmlPath, 'utf-8');
const indexExportHtml = fs.readFileSync(indexExportPath, 'utf-8');

// Extract photo data from exported HTML
const photoDataMatch = exportedHtml.match(/window\.EMBEDDED_PHOTOS = (\[.*?\]);/s);
if (!photoDataMatch) {
  console.log('❌ Could not find photo data in exported HTML.');
  process.exit(1);
}

const photoData = photoDataMatch[1];

// Extract asset references from index-export.html
const assetScriptMatch = indexExportHtml.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
const assetPreloadMatches = indexExportHtml.matchAll(/<link[^>]*href="([^"]+)"[^>]*>/g);

if (!assetScriptMatch) {
  console.log('❌ Could not find asset script in index-export.html.');
  process.exit(1);
}

// Build the final HTML with correct asset paths and photo data
let finalHtml = indexExportHtml.replace(
  /window\.EMBEDDED_PHOTOS = \[\];/,
  `window.EMBEDDED_PHOTOS = ${photoData};`
);

// Write final HTML as index.html (backup original first)
const originalIndexPath = path.join(distDir, 'index.html');
if (fs.existsSync(originalIndexPath)) {
  const backupPath = path.join(distDir, 'index.html.backup');
  fs.copyFileSync(originalIndexPath, backupPath);
  console.log('✅ Backed up original index.html to index.html.backup');
}

fs.writeFileSync(originalIndexPath, finalHtml);
console.log('✅ Exported HTML has been prepared and saved as dist/index.html');
console.log('✅ You can now use: npm run preview');





