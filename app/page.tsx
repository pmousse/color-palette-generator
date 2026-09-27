"use client";

import { useState, useEffect } from "react";
import PaletteGenerator from "@/components/PaletteGenerator";
import SavedPalettes from "@/components/SavedPalettes";
import SeoContent from "@/components/SeoContent";

export default function Home() {
  const [paletteFromUrl, setPaletteFromUrl] = useState<string[] | undefined>();

  // Load palette from URL query string
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get("palette");

    if (paletteParam) {
      const colors = paletteParam
        .split(",")
        .map((c) => {
          // Normalize hex
          let hex = c.trim().replace(/^#/, "");
          if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
            hex = hex
              .split("")
              .map((ch) => ch + ch)
              .join("");
          }
          if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
            return `#${hex.toUpperCase()}`;
          }
          return null;
        })
        .filter((c): c is string => c !== null);

      if (colors.length === 5) {
        setPaletteFromUrl(colors);
      }
    }
  }, []);

  // Handle loading a saved palette
  useEffect(() => {
    const handleLoadPalette = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      setPaletteFromUrl(customEvent.detail);
    };

    window.addEventListener("loadPalette", handleLoadPalette);

    return () => {
      window.removeEventListener("loadPalette", handleLoadPalette);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Color Palette Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create beautiful, accessible color palettes for websites, brands, apps, and creative
            projects in seconds.
          </p>
        </section>

        {/* Generator */}
        <PaletteGenerator initialPalette={paletteFromUrl} />

        {/* Saved Palettes */}
        <SavedPalettes />

        {/* SEO Content */}
        <SeoContent />
      </main>
    </div>
  );
}
