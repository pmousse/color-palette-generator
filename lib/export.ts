/**
 * Export functions for palettes in various formats.
 */

import { PaletteOptions } from "./palette";

// Export palette as CSS variables
export function paletteToCssVariables(colors: string[]): string {
  const lines = [":root {"];
  colors.forEach((color, index) => {
    lines.push(`  --color-${index + 1}: ${color};`);
  });
  lines.push("}");
  return lines.join("\n");
}

// Export palette as Tailwind config snippet
export function paletteToTailwindConfig(colors: string[]): string {
  const lines = [
    "theme: {",
    "  extend: {",
    "    colors: {",
    "      palette: {",
  ];

  colors.forEach((color, index) => {
    lines.push(`        ${index + 1}: '${color}',`);
  });

  lines.push("      }");
  lines.push("    }");
  lines.push("  }");
  lines.push("}");
  return lines.join("\n");
}

// Export palette as JSON
export function paletteToJson(colors: string[]): string {
  const data = {
    colors: colors,
    generatedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

// Export palette as SVG swatch strip
export function paletteToSvg(colors: string[]): string {
  const swatchWidth = 120;
  const swatchHeight = 120;
  const gap = 10;
  const width = colors.length * swatchWidth + (colors.length - 1) * gap;
  const swatches = colors
    .map((color, index) => {
      const x = index * (swatchWidth + gap);
      return `    <rect x="${x}" y="10" width="${swatchWidth}" height="${swatchHeight}" fill="${color}" rx="8"/>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${swatchHeight + 50}">
  <rect width="${width}" height="${swatchHeight + 50}" fill="#f8fafc" rx="12"/>
${swatches}
</svg>`;
}

// Download SVG function
export function downloadSvg(svgContent: string, filename: string = "palette.svg"): void {
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
