const sharp = require("sharp");
const fs = require("fs");

// Generate PWA icons at required sizes
const sizes = [192, 512];

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE"];

async function generateIcon(size) {
  // Create SVG as buffer
  const padding = size * 0.15;
  const colorSize = (size - padding * 2) / 5;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4F46E5"/>
          <stop offset="100%" style="stop-color:#7C3AED"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#bg)"/>
      ${colors.map((color, i) => `
        <rect 
          x="${padding + i * colorSize}" 
          y="${padding}" 
          width="${colorSize * 0.8}" 
          height="${size - padding * 2}" 
          fill="${color}"
        />
      `).join("")}
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`public/icon-${size}x${size}.png`);

  console.log(`Generated icon-${size}x${size}.png`);
}

(async () => {
  for (const size of sizes) {
    await generateIcon(size);
  }
  console.log("All icons generated!");
})();
