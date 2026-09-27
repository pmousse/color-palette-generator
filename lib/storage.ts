/**
 * localStorage functions for saving and managing palettes.
 */

const STORAGE_KEY = "color-palette-saved-palettes";
const VERSION_KEY = "color-palette-version";
const CURRENT_VERSION = 1;
const MAX_PALETTES = 24;

export interface SavedPalette {
  id: string;
  colors: string[];
  createdAt: string;
}

// Generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Public check for saving availability
export function isSavingAvailable(): boolean {
  return isLocalStorageAvailable();
}

// Migrate data from previous versions (placeholder for future migrations)
function migrateIfNeeded(): void {
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || "0", 10);
  if (storedVersion < CURRENT_VERSION) {
    // Future migrations can be added here
    // For now, just update the version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
  }
}

// Get all saved palettes
export function getSavedPalettes(): SavedPalette[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    migrateIfNeeded();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save a new palette
export function savePalette(colors: string[]): { saved: boolean; message: string } {
  if (!isLocalStorageAvailable()) {
    return { saved: false, message: "Saving is unavailable in this browser mode." };
  }

  try {
    const palettes = getSavedPalettes();

    // Check for duplicate
    const colorsKey = [...colors].sort().join(",");
    const isDuplicate = palettes.some((p) => [...p.colors].sort().join(",") === colorsKey);

    if (isDuplicate) {
      return { saved: false, message: "Already saved." };
    }

    const newPalette: SavedPalette = {
      id: generateId(),
      colors,
      createdAt: new Date().toISOString(),
    };

    // Add to beginning and limit to MAX_PALETTES
    const updated = [newPalette, ...palettes].slice(0, MAX_PALETTES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return { saved: true, message: "Palette saved!" };
  } catch {
    return { saved: false, message: "Failed to save palette." };
  }
}

// Delete a saved palette
export function deleteSavedPalette(id: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const palettes = getSavedPalettes();
    const updated = palettes.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

// Clear all saved palettes
export function clearSavedPalettes(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}
