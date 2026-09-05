import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)"/>

  <!-- Document Stack Glow / Base -->
  <rect x="136" y="96" width="220" height="290" rx="16" fill="#334155" opacity="0.6" transform="rotate(-6 246 241)"/>
  <rect x="156" y="106" width="220" height="290" rx="16" fill="#475569" opacity="0.8" transform="rotate(3 266 251)"/>
  
  <!-- Main Document Card -->
  <rect x="146" y="112" width="220" height="290" rx="16" fill="#ffffff"/>
  
  <!-- Doc Header Accent -->
  <rect x="174" y="148" width="100" height="14" rx="7" fill="url(#accentGrad)"/>
  <rect x="290" y="148" width="48" height="14" rx="7" fill="#cbd5e1"/>
  
  <!-- Doc Content Lines -->
  <rect x="174" y="180" width="164" height="8" rx="4" fill="#e2e8f0"/>
  <rect x="174" y="202" width="140" height="8" rx="4" fill="#e2e8f0"/>
  <rect x="174" y="224" width="164" height="8" rx="4" fill="#e2e8f0"/>
  <rect x="174" y="246" width="110" height="8" rx="4" fill="#e2e8f0"/>

  <!-- PDF / HTML Badges -->
  <rect x="174" y="278" width="46" height="20" rx="4" fill="#ef4444"/>
  <text x="183" y="293" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">PDF</text>

  <rect x="228" y="278" width="52" height="20" rx="4" fill="#3b82f6"/>
  <text x="236" y="293" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">HTML</text>

  <!-- Magnifying Glass (Search Accent) -->
  <g transform="translate(230, 230)">
    <circle cx="90" cy="90" r="54" fill="none" stroke="url(#amberGrad)" stroke-width="18" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"/>
    <line x1="130" y1="130" x2="180" y2="180" stroke="url(#amberGrad)" stroke-width="20" stroke-linecap="round"/>
    <circle cx="76" cy="76" r="14" fill="#ffffff" opacity="0.5"/>
  </g>
</svg>`;

// Safe zone maskable version: 80% content area with safe padding
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0f172a"/>
  <g transform="translate(51.2, 51.2) scale(0.8)">
    ${svgContent.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

  // Generate standard 192x192
  await sharp(Buffer.from(svgContent))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate standard 512x512
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Generate maskable 512x512 with safe zone
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple touch icon (180x180)
  await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon (32x32 -> favicon.ico)
  await sharp(Buffer.from(svgContent))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons!');
}

run().catch(console.error);
