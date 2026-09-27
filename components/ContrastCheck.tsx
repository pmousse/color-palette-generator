"use client";

import { useState, useMemo, useEffect } from "react";
import { getContrastRatio, getBestTextColor } from "@/lib/color";

interface ContrastCheckProps {
  colors: string[];
}

export default function ContrastCheck({ colors }: ContrastCheckProps) {
  const [foregroundIndex, setForegroundIndex] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(3);

  // Reset indices when colors array changes size
  useEffect(() => {
    if (foregroundIndex >= colors.length) {
      setForegroundIndex(Math.max(0, colors.length - 2));
    }
    if (backgroundIndex >= colors.length || backgroundIndex === foregroundIndex) {
      setBackgroundIndex(Math.min(3, colors.length - 1));
    }
  }, [colors.length, foregroundIndex, backgroundIndex]);

  const handleForegroundChange = (index: number) => {
    setForegroundIndex(index);
  };

  const handleBackgroundChange = (index: number) => {
    setBackgroundIndex(index);
  };

  const contrastInfo = useMemo(() => {
    const foreground = colors[foregroundIndex];
    const background = colors[backgroundIndex];
    const ratio = getContrastRatio(foreground, background);
    const bestText = getBestTextColor(foreground);

    // WCAG compliance levels
    const normalTextPass = ratio >= 4.5;
    const largeTextPass = ratio >= 3;
    const uiComponentsPass = ratio >= 3;

    // Summary message
    let summaryMessage: string;
    if (ratio >= 7) {
      summaryMessage = "Great for body text";
    } else if (ratio >= 4.5) {
      summaryMessage = "Good for body text";
    } else if (ratio >= 3) {
      summaryMessage = "Good for large text and headings";
    } else {
      summaryMessage = "Best for decorative elements only";
    }

    return {
      ratio: ratio.toFixed(2),
      ratioNumber: ratio,
      bestText,
      normalTextPass,
      largeTextPass,
      uiComponentsPass,
      summaryMessage,
    };
  }, [colors, foregroundIndex, backgroundIndex]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Color selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Foreground - exclude selected background */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
          <div className="flex flex-wrap gap-2">
            {colors
              .map((color, index) => ({ color, index }))
              .filter(({ index }) => index !== backgroundIndex)
              .map(({ color, index: originalIndex }, filteredIndex) => (
                <button
                  key={filteredIndex}
                  onClick={() => handleForegroundChange(originalIndex)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                    foregroundIndex === originalIndex
                      ? "border-gray-900 ring-2 ring-gray-400 ring-offset-2"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${originalIndex + 1} ${color}`}
                  title={`Color ${originalIndex + 1} ${color}`}
                >
                  {foregroundIndex === originalIndex && (
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Background - exclude selected foreground */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
          <div className="flex flex-wrap gap-2">
            {colors
              .map((color, index) => ({ color, index }))
              .filter(({ index }) => index !== foregroundIndex)
              .map(({ color, index: originalIndex }, filteredIndex) => (
                <button
                  key={filteredIndex}
                  onClick={() => handleBackgroundChange(originalIndex)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                    backgroundIndex === originalIndex
                      ? "border-gray-900 ring-2 ring-gray-400 ring-offset-2"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${originalIndex + 1} ${color}`}
                  title={`Color ${originalIndex + 1} ${color}`}
                >
                  {backgroundIndex === originalIndex && (
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Preview and contrast ratio */}
      <div
        className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[160px]"
        style={{ backgroundColor: colors[backgroundIndex] }}
      >
        <div
          className="text-lg font-medium mb-4"
          style={{ color: colors[foregroundIndex] }}
        >
          Readable sample text
        </div>
        <div
          className="text-5xl font-bold"
          style={{ color: colors[foregroundIndex] }}
        >
          {contrastInfo.ratio}:1
        </div>
      </div>

      {/* WCAG levels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Normal text */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">Normal text</div>
          <div className="text-xs text-gray-500 mb-3">AA 4.5:1</div>
          <div
            className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${
              contrastInfo.normalTextPass
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {contrastInfo.normalTextPass ? "Pass" : "Fail"}
          </div>
        </div>

        {/* Large text */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">Large text</div>
          <div className="text-xs text-gray-500 mb-3">AA 3:1</div>
          <div
            className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${
              contrastInfo.largeTextPass
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {contrastInfo.largeTextPass ? "Pass" : "Fail"}
          </div>
        </div>

        {/* UI components */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">UI components</div>
          <div className="text-xs text-gray-500 mb-3">3:1</div>
          <div
            className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${
              contrastInfo.uiComponentsPass
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {contrastInfo.uiComponentsPass ? "Pass" : "Fail"}
          </div>
        </div>
      </div>

      {/* Summary message */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-medium">{contrastInfo.summaryMessage}</p>
      </div>
    </div>
  );
}
