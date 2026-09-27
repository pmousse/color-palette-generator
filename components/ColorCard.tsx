"use client";

import { useState, useCallback } from "react";
import { getColorInfo, formatRgb, formatHsl } from "@/lib/color";

interface ColorCardProps {
  color: string;
  index: number;
  isLocked: boolean;
  onToggleLock: () => void;
  onCopy: (text: string) => void;
}

export default function ColorCard({
  color,
  index,
  isLocked,
  onToggleLock,
  onCopy,
}: ColorCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const info = getColorInfo(color);

  const handleCopy = useCallback(
    (text: string, field: string) => {
      setCopiedField(field);
      onCopy(text);
      setTimeout(() => setCopiedField(null), 1500);
    },
    [onCopy]
  );

  if (!info) {
    return (
      <div className="relative flex-1 min-w-0 rounded-2xl shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Invalid color</p>
      </div>
    );
  }

  const textColor = info.bestText;
  const textOpacity = textColor === "white" ? "text-white/90" : "text-gray-700";

  return (
    <div
      className="relative flex-1 min-w-0 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group"
      style={{ backgroundColor: color }}
    >
      {/* Lock button - always visible */}
      <button
        onClick={onToggleLock}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 mb-3 ${
          isLocked
            ? "bg-white/25 backdrop-blur-sm"
            : "bg-white/15 backdrop-blur-sm hover:bg-white/25"
        }`}
        aria-label={isLocked ? "Unlock color" : "Lock color"}
        title={isLocked ? "Unlock color" : "Lock color"}
      >
        {isLocked ? (
          <i className={`fa-solid fa-lock text-sm ${textOpacity}`}></i>
        ) : (
          <i className={`fa-solid fa-lock-open text-sm ${textOpacity}`}></i>
        )}
      </button>

      {/* Color info */}
      <div className="p-4 pt-12 flex flex-col justify-end h-full min-h-[200px]">
        <div className={`${textOpacity} space-y-3`}>
          {/* Color number */}
          <div className="text-xs font-medium opacity-70">Color {index + 1}</div>

          {/* HEX */}
          <button
            onClick={() => handleCopy(info.hex, "hex")}
            className="block w-full text-left"
            aria-label={`Copy HEX value ${info.hex}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-bold">{copiedField === "hex" ? "✓ Copied!" : info.hex}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                <i className="fa-regular fa-copy text-sm"></i>
              </span>
            </div>
          </button>

          {/* RGB */}
          <button
            onClick={() => handleCopy(formatRgb(info.rgb), "rgb")}
            className="block w-full text-left"
            aria-label={`Copy RGB value ${formatRgb(info.rgb)}`}
          >
            <div className="flex items-center justify-between text-sm">
              <span>{copiedField === "rgb" ? "✓ Copied!" : formatRgb(info.rgb)}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                <i className="fa-regular fa-copy text-sm"></i>
              </span>
            </div>
          </button>

          {/* HSL */}
          <button
            onClick={() => handleCopy(formatHsl(info.hsl), "hsl")}
            className="block w-full text-left"
            aria-label={`Copy HSL value ${formatHsl(info.hsl)}`}
          >
            <div className="flex items-center justify-between text-sm">
              <span>{copiedField === "hsl" ? "✓ Copied!" : formatHsl(info.hsl)}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                <i className="fa-regular fa-copy text-sm"></i>
              </span>
            </div>
          </button>

          {/* Contrast info */}
          <div className="pt-2 border-t border-white/20">
            <div className="text-xs opacity-70">
              <div>Best text: <span className="font-medium">{textColor === "white" ? "White" : "Black"}</span></div>
              <div className="mt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full ${
                    info.contrastLabel === "Good for text"
                      ? "bg-green-500/30"
                      : info.contrastLabel === "Use carefully"
                      ? "bg-yellow-500/30"
                      : "bg-red-500/30"
                  }`}
                >
                  {info.contrastLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
