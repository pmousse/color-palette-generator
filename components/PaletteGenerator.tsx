"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generatePalette, applyLocks, areAllLocked, type HarmonyMode } from "@/lib/palette";
import { savePalette, isSavingAvailable } from "@/lib/storage";
import { paletteToCssVariables, paletteToTailwindConfig, paletteToJson, paletteToSvg } from "@/lib/export";
import ColorCard from "./ColorCard";
import ContrastCheck from "./ContrastCheck";

interface PaletteGeneratorProps {
  initialPalette?: string[];
}

export default function PaletteGenerator({ initialPalette }: PaletteGeneratorProps) {
  // Restore palette from sessionStorage if available
  const initialPaletteState = (() => {
    if (typeof window === "undefined") return initialPalette || [];
    if (initialPalette) return initialPalette;
    
    const saved = sessionStorage.getItem("current-palette");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  })();

  const [palette, setPalette] = useState<string[]>(initialPaletteState);
  const [seedColor, setSeedColor] = useState("");
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("random");
  const [paletteSize, setPaletteSize] = useState(5);
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [savingAvailable, setSavingAvailable] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [showContrast, setShowContrast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generationCounter, setGenerationCounter] = useState(0);
  const prevPaletteSizeRef = useRef(5);
  const generateNewPaletteRef = useRef<(() => void) | undefined>(undefined);
  const hasInitialized = useRef(false);
  const seedColorRef = useRef("");

  // Keep seedColor ref in sync
  useEffect(() => {
    seedColorRef.current = seedColor;
  }, [seedColor]);

  // Save palette to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && palette.length > 0) {
      sessionStorage.setItem("current-palette", JSON.stringify(palette));
    }
  }, [palette]);

  // Initialize palette on mount or when initialPalette changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If palette was restored from sessionStorage, skip generation
    if (palette.length > 0 && !initialPalette) {
      // Set a random seed color when palette is restored from sessionStorage
      if (!seedColor) {
        const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        setSeedColor(randomHex.replace("#", ""));
      }
      setIsLoading(false);
      return;
    }

    if (initialPalette && initialPalette.length >= 3) {
      setPalette(initialPalette);
      setPaletteSize(initialPalette.length);
      setLockedColors([false, false, false, false, false]);
      setIsLoading(false);
    } else if (palette.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      // Generate initial palette without seed, then set a random seed color
      generateNewPalette();
      const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
      setSeedColor(randomHex.replace("#", ""));
      setIsLoading(false);
    }

    setSavingAvailable(isSavingAvailable());
  }, [initialPalette]);

  // Update lockedColors array when palette changes
  useEffect(() => {
    setLockedColors((prev) => {
      if (prev.length !== palette.length) {
        const newLocks = Array(palette.length).fill(false);
        // Preserve existing locks
        for (let i = 0; i < Math.min(prev.length, palette.length); i++) {
          newLocks[i] = prev[i];
        }
        return newLocks;
      }
      return prev;
    });
  }, [palette.length]);

  // Keep lockedColors ref in sync with lockedColors state
  const lockedColorsRef = useRef<boolean[]>(lockedColors);
  useEffect(() => {
    lockedColorsRef.current = lockedColors;
  }, [lockedColors]);

  const generateNewPalette = useCallback(() => {
    const seed = seedColorRef.current && seedColorRef.current.length >= 3 ? seedColorRef.current : undefined;
    const newPalette = generatePalette({ seedColor: seed, harmonyMode, paletteSize });

    if (lockedColorsRef.current.some((l) => l)) {
      const existing = palette.length === paletteSize ? palette : newPalette;
      const merged = applyLocks(existing, newPalette, lockedColorsRef.current);
      setPalette(merged);
    } else {
      setPalette(newPalette);
    }
  }, [harmonyMode, paletteSize, palette, generationCounter]);

  // Keep ref in sync with generateNewPalette
  useEffect(() => {
    generateNewPaletteRef.current = generateNewPalette;
  }, [generateNewPalette]);

  // Regenerate palette when paletteSize changes (user-initiated only)
  useEffect(() => {
    if (prevPaletteSizeRef.current !== paletteSize && palette.length > 0 && !isLoading) {
      prevPaletteSizeRef.current = paletteSize;
      generateNewPaletteRef.current?.();
    }
  }, [paletteSize, isLoading]);

  // Regenerate palette when harmony mode changes
  useEffect(() => {
    if (palette.length > 0 && !isLoading) {
      generateNewPaletteRef.current?.();
    }
  }, [harmonyMode, isLoading]);

  // Trigger palette generation when generationCounter changes
  useEffect(() => {
    if (generationCounter > 0 && palette.length > 0 && !isLoading) {
      generateNewPaletteRef.current?.();
    }
  }, [generationCounter, isLoading]);

  const handleGenerate = () => {
    if (areAllLocked(lockedColors)) {
      setCopiedMessage("Unlock a color to generate new options.");
      setTimeout(() => setCopiedMessage(""), 3000);
      return;
    }
    setGenerationCounter((prev) => prev + 1);
  };

  const handleRandomize = () => {
    setSeedColor("");
    setHarmonyMode("random");
    setLockedColors(Array(paletteSize).fill(false));
    // Use ref to ensure latest seedColor value is used
    setTimeout(() => {
      generateNewPaletteRef.current?.();
    }, 0);
  };

  const handleToggleLock = (index: number) => {
    setLockedColors((prev) => prev.map((lock, i) => (i === index ? !lock : lock)));
  };

  const handleCopy = useCallback((text: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedMessage(`Copied: ${text}`);
          setTimeout(() => setCopiedMessage(""), 2000);
        })
        .catch((err) => {
          console.error('Clipboard write failed, trying fallback:', err);
          fallbackCopyText(text);
          setCopiedMessage(`Copied: ${text}`);
          setTimeout(() => setCopiedMessage(""), 2000);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyText(text);
      setCopiedMessage(`Copied: ${text}`);
      setTimeout(() => setCopiedMessage(""), 2000);
    }
  }, []);

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  const handleSave = () => {
    if (!savingAvailable) {
      setSaveMessage("Saving is unavailable in this browser mode.");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    const result = savePalette(palette);
    setSaveMessage(result.message);
    
    // Trigger refresh of saved palettes list
    if (result.saved) {
      window.dispatchEvent(new Event("savePalette"));
    }
    
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeedColor(e.target.value.replace(/^#/, ""));
  };

  // Debounced palette generation on seed color change only
  useEffect(() => {
    if (seedColor.length < 3) return;
    
    const timer = setTimeout(() => {
      generateNewPaletteRef.current?.();
    }, 500);

    return () => clearTimeout(timer);
  }, [seedColor]);

  const handleSeedKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      generateNewPalette();
    }
  };

  const harmonyModes: { value: HarmonyMode; label: string }[] = [
    { value: "random", label: "Random" },
    { value: "monochromatic", label: "Monochromatic" },
    { value: "analogous", label: "Analogous" },
    { value: "complementary", label: "Complementary" },
    { value: "triadic", label: "Triadic" },
    { value: "tetradic", label: "Tetradic" },
    { value: "pastel", label: "Pastel" },
    { value: "vibrant", label: "Vibrant" },
    { value: "dark", label: "Dark" },
  ];

  return (
    <div className="space-y-6">
      {/* Skeleton loading state */}
      {isLoading ? (
        <div className="space-y-6">
          {/* Skeleton controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-palette-1 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-28"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24"></div>
            </div>
          </div>

          {/* Skeleton color cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
                <div className={`h-24 rounded-lg animate-pulse`} style={{ backgroundColor: `var(--color-palette-${i + 1})` }}></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-4" style={{ borderLeftColor: "#1bc0b5" }}>
          {/* Seed color and harmony mode */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Seed color */}
          <div className="flex-1">
            <label htmlFor="seed-color" className="block text-sm font-medium text-gray-700 mb-1">
              Seed Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={seedColor ? `#${seedColor}` : "#1bc0b5"}
                onChange={(e) => setSeedColor(e.target.value.replace(/^#/, ""))}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                aria-label="Pick a seed color"
              />
              <input
                id="seed-color"
                type="text"
                value={seedColor}
                onChange={handleSeedChange}
                onKeyDown={handleSeedKeyPress}
                placeholder="HEX (e.g., 1bc0b5)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-palette-1 focus:border-palette-1 text-sm"
              />
            </div>
          </div>

          {/* Harmony mode */}
          <div className="flex-1">
            <label htmlFor="harmony-mode" className="block text-sm font-medium text-gray-700 mb-1">
              Harmony Mode
            </label>
            <select
              id="harmony-mode"
              value={harmonyMode}
              onChange={(e) => setHarmonyMode(e.target.value as HarmonyMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-palette-1 focus:border-palette-1 text-sm"
            >
              {harmonyModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Palette size */}
          <div className="flex-1">
            <label htmlFor="palette-size" className="block text-sm font-medium text-gray-700 mb-1">
              Colors
            </label>
            <select
              id="palette-size"
              value={paletteSize}
              onChange={(e) => setPaletteSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-palette-1 focus:border-palette-1 text-sm"
            >
              <option value={3}>3 colors</option>
              <option value={5}>5 colors</option>
              <option value={7}>7 colors</option>
            </select>
          </div>
        </div>

        {/* Primary action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-palette-1 text-white rounded-lg font-medium hover:bg-palette-2 focus:ring-2 focus:ring-palette-1 focus:ring-offset-2 transition-colors"
          >
            Generate palette
          </button>
          <button
            onClick={handleRandomize}
            className="px-6 py-2.5 bg-palette-2 text-white rounded-lg font-medium hover:bg-palette-3 focus:ring-2 focus:ring-palette-2 focus:ring-offset-2 transition-colors"
          >
            Randomize
          </button>
        </div>

        {/* Messages */}
        {(copiedMessage || saveMessage) && (
          <div
            className="text-sm p-3 rounded-lg"
            role="status"
            aria-live="polite"
            style={{
              backgroundColor: saveMessage?.includes("saved") ? "#DCFCE7" : "#FEF3C7",
              color: saveMessage?.includes("saved") ? "#166534" : "#92400E",
            }}
          >
            {copiedMessage || saveMessage}
          </div>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: "#29bfe0" }}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Runs in your browser
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            No signup required
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Saved palettes stay on this device
          </span>
        </div>
      </div>

      {/* Palette cards */}
      <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg border-l-4" style={{ borderLeftColor: "#1868a5" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {palette.map((color, index) => (
            <ColorCard
              key={`${color}-${index}`}
              color={color}
              index={index}
              isLocked={lockedColors[index]}
              onToggleLock={() => handleToggleLock(index)}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Accessibility disclaimer */}
        <p className="text-xs text-gray-400 text-center">
          Contrast guidance is a helpful starting point, not a full accessibility audit.
        </p>

        {/* Secondary action buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => setShowContrast(true)}
            className="px-6 py-2.5 bg-palette-3 text-white rounded-lg font-medium hover:bg-palette-4 focus:ring-2 focus:ring-palette-3 focus:ring-offset-2 transition-colors"
          >
            Check contrast
          </button>
          <button
            onClick={handleSave}
            disabled={!savingAvailable}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors text-sm"
          >
            Save palette
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2.5 bg-palette-4 text-white rounded-lg font-medium hover:bg-palette-5 focus:ring-2 focus:ring-palette-4 focus:ring-offset-2 transition-colors text-sm"
          >
            Export
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExport(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-3/4 h-3/4 max-h-[90vh] overflow-hidden flex flex-col border-l-4" style={{ borderLeftColor: "#3b70e3" }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">Export your palette</h3>
              <button
                onClick={() => setShowExport(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <ExportPanel colors={palette} />
            </div>
          </div>
        </div>
      )}

      {/* Contrast Check Modal */}
      {showContrast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowContrast(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-3/4 h-3/4 max-h-[90vh] overflow-hidden flex flex-col border-l-4" style={{ borderLeftColor: "#2d39e1" }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">Contrast check</h3>
              <button
                onClick={() => setShowContrast(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <ContrastCheck colors={palette} />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// ExportPanel component using centralized export functions
function ExportPanel({ colors }: { colors: string[] }) {
  const [activeTab, setActiveTab] = useState<"css" | "tailwind" | "json" | "svg">("css");
  const [copiedTab, setCopiedTab] = useState(false);

  const getExportContent = () => {
    switch (activeTab) {
      case "css":
        return paletteToCssVariables(colors);
      case "tailwind":
        return paletteToTailwindConfig(colors);
      case "json":
        return paletteToJson(colors);
      case "svg":
        return paletteToSvg(colors);
    }
  };

  const handleCopy = () => {
    const content = getExportContent();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
    setCopiedTab(true);
    setTimeout(() => setCopiedTab(false), 2000);
  };

  const handleDownload = () => {
    if (activeTab !== "svg") return;
    const blob = new Blob([getExportContent()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "palette.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "css" as const, label: "CSS Variables" },
    { id: "tailwind" as const, label: "Tailwind Config" },
    { id: "json" as const, label: "JSON" },
    { id: "svg" as const, label: "SVG" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Export your palette</h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-64">
        <code>{getExportContent()}</code>
      </pre>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {copiedTab ? "✓ Copied!" : "Copy"}
        </button>
        {activeTab === "svg" && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Download SVG
          </button>
        )}
      </div>
    </div>
  );
}
