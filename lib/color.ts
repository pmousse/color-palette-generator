/**
 * Color utility functions for parsing, converting, and analyzing colors.
 */

// Normalize hex input to uppercase 6-character hex without #
export function normalizeHex(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  // Remove # if present
  let hex = input.replace(/^#/, "");

  // Handle 3-character hex
  if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Validate 6-character hex
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return hex.toUpperCase();
  }

  return null;
}

// Check if input is a valid hex color
export function isValidHex(input: string): boolean {
  return normalizeHex(input) !== null;
}

// Convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  return { r, g, b };
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    // Hue
    if (max === rNorm) {
      h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / diff + 2) / 6;
    } else {
      h = ((rNorm - gNorm) / diff + 4) / 6;
    }

    // Saturation
    s = diff / (1 - Math.abs(2 * l - 1));
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // Normalize values
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert hex to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// Convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Get relative luminance from RGB
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Get contrast ratio between two colors (hex strings)
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get best text color (black or white) for a background color
export function getBestTextColor(hex: string): "black" | "white" {
  const rgb = hexToRgb(hex);
  if (!rgb) return "black";

  const luminance = getRelativeLuminance(rgb);
  const contrastWithWhite = getContrastRatio(hex, "FFFFFF");
  const contrastWithBlack = getContrastRatio(hex, "000000");

  return contrastWithWhite >= contrastWithBlack ? "white" : "black";
}

// Get WCAG-style label for contrast
export function getContrastLabel(hex: string): string {
  const contrastWithWhite = getContrastRatio(hex, "FFFFFF");
  const contrastWithBlack = getContrastRatio(hex, "000000");
  const bestContrast = Math.max(contrastWithWhite, contrastWithBlack);

  if (bestContrast >= 4.5) {
    return "Good for text";
  } else if (bestContrast >= 3) {
    return "Use carefully";
  }
  return "Decorative only";
}

// Format RGB to string
export function formatRgb(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Format HSL to string
export function formatHsl(hsl: { h: number; s: number; l: number }): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// Get full color info for a hex color
export function getColorInfo(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const rgb = hexToRgb(normalized)!;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const bestText = getBestTextColor(normalized);
  const contrastLabel = getContrastLabel(normalized);
  const contrastWithWhite = getContrastRatio(normalized, "FFFFFF");
  const contrastWithBlack = getContrastRatio(normalized, "000000");

  return {
    hex: `#${normalized}`,
    rgb,
    hsl,
    bestText,
    contrastLabel,
    contrastWithWhite: contrastWithWhite.toFixed(2),
    contrastWithBlack: contrastWithBlack.toFixed(2),
  };
}
