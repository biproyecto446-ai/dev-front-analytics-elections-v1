/**
 * Lee .env y genera config.js con window.__APP_CONFIG__ para el frontend.
 * Ejecutar: node scripts/generate-config.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'config.js');

// Prioriza variable de entorno (ideal para Vercel) y luego .env local
let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^NEXT_PUBLIC_API_URL\s*=\s*(.+)$/);
    if (match) {
      const value = match[1].trim().replace(/^["']|["']$/g, '');
      if (value) apiUrl = value;
    }
  }
}

const output = `// Generado desde .env - no editar a mano
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
window.__APP_CONFIG__.apiBaseUrl = "${apiUrl.replace(/"/g, '\\"')}";
`;
fs.writeFileSync(outPath, output, 'utf8');
