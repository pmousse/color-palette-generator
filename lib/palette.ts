/**
 * Palette generation logic with various harmony modes.
 */

import { hexToHsl, hslToHex, hslToRgb, isValidHex, normalizeHex } from "./color";

export type HarmonyMode =
  | "random"
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "pastel"
  | "vibrant"
  | "dark";

export interface PaletteOptions {
  seedColor?: string;
  harmonyMode: HarmonyMode;
  paletteSize?: number;
}

// Generate a random hue
function randomHue(): number {
  return Math.floor(Math.random() * 360);
}

// Generate a random saturation with clamping
function randomSaturation(min = 30, max = 90): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random lightness with clamping
function randomLightness(min = 20, max = 80): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random color
function randomColor(): string {
  const h = randomHue();
  const s = randomSaturation();
  const l = randomLightness();
  return hslToHex(h, s, l);
}

// Ensure colors are sufficiently different from each other
function ensureVariation(colors: string[], minDiff = 15, size: number = 5): string[] {
  if (colors.length <= 1) return colors;

  const result = [colors[0]];

  for (let i = 1; i < size; i++) {
    let color = colors[i];
    let attempts = 0;

    while (attempts < 10) {
      let isTooSimilar = false;
      const newHsl = hexToHsl(color);
      if (!newHsl) break;

      for (const existing of result) {
        const existingHsl = hexToHsl(existing);
        if (!existingHsl) continue;

        // Compare hue difference
        const hueDiff = Math.abs(newHsl.h - existingHsl.h);
        const normalizedDiff = Math.min(hueDiff, 360 - hueDiff);

        // If hues are too close AND lightness/saturation are similar, regenerate
        if (
          normalizedDiff < minDiff &&
          Math.abs(newHsl.s - existingHsl.s) < 20 &&
          Math.abs(newHsl.l - existingHsl.l) < 20
        ) {
          isTooSimilar = true;
          break;
        }
      }

      if (!isTooSimilar) break;

      // Regenerate with more variation
      const currentHsl = hexToHsl(color)!;
      color = hslToHex(
        (currentHsl.h + 30 + Math.random() * 60) % 360,
        currentHsl.s,
        currentHsl.l
      );
      attempts++;
    }

    result.push(color);
  }

  return result;
}

// Generate monochromatic palette
function generateMonochromatic(seed: string, size: number = 5): string[] {
  const hsl = hexToHsl(seed);
  if (!hsl) return Array(size).fill(null).map(() => randomColor());

  const colors: string[] = [];
  const lightnessSteps = Array.from({ length: size }, (_, i) => 20 + (i * 60) / (size - 1 || 1));

  for (const l of lightnessSteps) {
    const s = Math.max(30, Math.min(90, hsl.s + Math.floor((Math.random() - 0.5) * 20)));
    const lightness = Math.round(l + Math.floor((Math.random() - 0.5) * 10));
    colors.push(hslToHex(hsl.h, s, Math.max(10, Math.min(90, lightness))));
  }

  return colors;
}

// Generate analogous palette
function generateAnalogous(seed: string, size: number = 5): string[] {
  const hsl = hexToHsl(seed);
  if (!hsl) return Array(size).fill(null).map(() => randomColor());

  const colors: string[] = [];
  const range = size > 1 ? 30 * (size - 1) / 2 : 0;
  const offsets = Array.from({ length: size }, (_, i) => -range + (i * 60) / (size - 1 || 1));

  for (const offset of offsets) {
    const h = (hsl.h + offset + 360) % 360;
    const s = hsl.s;
    const l = randomLightness(35, 70);
    colors.push(hslToHex(h, s, l));
  }

  return colors;
}

// Generate complementary palette
function generateComplementary(seed: string, size: number = 5): string[] {
  const hsl = hexToHsl(seed);
  if (!hsl) return Array(size).fill(null).map(() => randomColor());

  const complementary = (hsl.h + 180) % 360;
  const colors: string[] = [];

  for (let i = 0; i < size; i++) {
    if (i < 2) {
      const lightness = 45 + i * 15 + Math.floor(Math.random() * 10 - 5);
      colors.push(hslToHex(hsl.h, Math.max(20, hsl.s - i * 10), lightness));
    } else if (i < size - 1) {
      const lightness = 45 + (i - 2) * 15 + Math.floor(Math.random() * 10 - 5);
      colors.push(hslToHex(complementary, Math.max(20, hsl.s - (i - 2) * 10), lightness));
    } else {
      // Last color: complementary hue with some variation
      const compLightness = 50 + Math.floor(Math.random() * 15 - 5);
      colors.push(hslToHex(complementary, Math.max(20, hsl.s - 10), compLightness));
    }
  }

  return colors;
}

// Generate triadic palette
function generateTriadic(seed: string, size: number = 5): string[] {
  const hsl = hexToHsl(seed);
  if (!hsl) return Array(size).fill(null).map(() => randomColor());

  const colors: string[] = [];
  const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];

  for (let i = 0; i < size; i++) {
    const hue = hues[i % 3];
    const s = i < 3 ? hsl.s : Math.max(20, hsl.s - 30);
    const l = i < 3 ? randomLightness(40, 60) : 65 + Math.floor(Math.random() * 10 - 5);
    colors.push(hslToHex(hue, s, l));
  }

  return colors;
}

// Generate tetradic palette
function generateTetradic(seed: string, size: number = 5): string[] {
  const hsl = hexToHsl(seed);
  if (!hsl) return Array(size).fill(null).map(() => randomColor());

  const colors: string[] = [];
  const hues = [hsl.h, (hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360];

  for (let i = 0; i < size; i++) {
    const hue = hues[i % 4];
    const s = i < 4 ? hsl.s : Math.max(20, hsl.s - 20);
    const l = i < 4 ? randomLightness(40, 60) : 70 + Math.floor(Math.random() * 10 - 5);
    colors.push(hslToHex(hue, s, l));
  }

  return colors;
}

// Generate pastel palette
function generatePastel(seed?: string, size: number = 5): string[] {
  const colors: string[] = [];

  for (let i = 0; i < size; i++) {
    const h = seed ? (hexToHsl(seed)!.h + i * (360 / size)) % 360 : randomHue();
    const s = randomSaturation(40, 70);
    const l = randomLightness(75, 90);
    colors.push(hslToHex(h, s, l));
  }

  return colors;
}

// Generate vibrant palette
function generateVibrant(seed?: string, size: number = 5): string[] {
  const colors: string[] = [];

  for (let i = 0; i < size; i++) {
    const h = seed ? (hexToHsl(seed)!.h + i * (360 / size)) % 360 : randomHue();
    const s = randomSaturation(75, 95);
    const l = randomLightness(45, 60);
    colors.push(hslToHex(h, s, l));
  }

  return colors;
}

// Generate dark palette
function generateDark(seed?: string, size: number = 5): string[] {
  const colors: string[] = [];

  for (let i = 0; i < size; i++) {
    const h = seed ? (hexToHsl(seed)!.h + i * (360 / size)) % 360 : randomHue();
    const s = randomSaturation(30, 70);
    const l = randomLightness(15, 35);
    colors.push(hslToHex(h, s, l));
  }

  return colors;
}

// Generate random palette
function generateRandomPalette(size: number = 5): string[] {
  const colors: string[] = [];

  // Ensure good hue distribution
  const baseHue = randomHue();
  for (let i = 0; i < size; i++) {
    const h = (baseHue + i * (Math.random() * 120 - 60) + 360) % 360;
    const s = randomSaturation(30, 85);
    const l = randomLightness(35, 70);
    colors.push(hslToHex(h, s, l));
  }

  return ensureVariation(colors, 15, size);
}

// Generate palette based on options
export function generatePalette(options: PaletteOptions): string[] {
  const { seedColor, harmonyMode, paletteSize = 5 } = options;

  let seed = seedColor && isValidHex(seedColor) ? normalizeHex(seedColor)! : randomColor();

  let newColors: string[] = [];

  switch (harmonyMode) {
    case "monochromatic":
      newColors = generateMonochromatic(seed, paletteSize);
      break;
    case "analogous":
      newColors = generateAnalogous(seed, paletteSize);
      break;
    case "complementary":
      newColors = generateComplementary(seed, paletteSize);
      break;
    case "triadic":
      newColors = generateTriadic(seed, paletteSize);
      break;
    case "tetradic":
      newColors = generateTetradic(seed, paletteSize);
      break;
    case "pastel":
      newColors = generatePastel(seed, paletteSize);
      break;
    case "vibrant":
      newColors = generateVibrant(seed, paletteSize);
      break;
    case "dark":
      newColors = generateDark(seed, paletteSize);
      break;
    case "random":
    default:
      newColors = generateRandomPalette(paletteSize);
      break;
  }

  // Apply locks if we have existing colors
  return newColors.map(c => `#${c}`);
}

// Apply locks to merge existing and new palette
export function applyLocks(
  existingPalette: string[],
  newPalette: string[],
  lockedMap: boolean[]
): string[] {
  return newPalette.map((color, index) => (lockedMap[index] ? existingPalette[index] : color));
}

// Check if all colors are locked
export function areAllLocked(lockedMap: boolean[]): boolean {
  return lockedMap.every((locked) => locked);
}
