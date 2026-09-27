"use client";

import { useState, useEffect } from "react";
import { getSavedPalettes, deleteSavedPalette, type SavedPalette } from "@/lib/storage";

// Custom event types for palette communication
interface SavePaletteEvent extends Event {
  type: "savePalette";
}

interface LoadPaletteEvent extends Event {
  type: "loadPalette";
  detail: string[];
}

export default function SavedPalettes() {
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);

  const refreshPalettes = () => {
    setPalettes(getSavedPalettes());
  };

  useEffect(() => {
    refreshPalettes();

    // Listen for save events from PaletteGenerator
    const handleSavePalette = () => {
      refreshPalettes();
    };

    window.addEventListener("savePalette", handleSavePalette);

    return () => {
      window.removeEventListener("savePalette", handleSavePalette);
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedPalette(id);
    setPalettes(getSavedPalettes());
  };

  const handleLoad = (palette: SavedPalette) => {
    // Dispatch a custom event for the parent to handle
    window.dispatchEvent(new CustomEvent("loadPalette", { detail: palette.colors }));
  };

  if (palettes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-300 mb-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <p className="text-gray-500">No saved palettes yet. Save your favorite combinations here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Saved palettes ({palettes.length})</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Color swatches */}
            <div className="flex h-16">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 border-r last:border-r-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="p-3 flex items-center justify-between">
              <button
                onClick={() => handleLoad(palette)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(palette.id)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Delete
              </button>
            </div>

            {/* Date */}
            <div className="px-3 pb-3">
              <p className="text-xs text-gray-400">
                {new Date(palette.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
