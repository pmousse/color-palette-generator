"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface PaletteContextType {
  currentPalette: string[];
  setCurrentPalette: (palette: string[]) => void;
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPaletteState] = useState<string[]>([]);

  const setCurrentPalette = useCallback((palette: string[]) => {
    setCurrentPaletteState(palette);
  }, []);

  return (
    <PaletteContext.Provider value={{ currentPalette, setCurrentPalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}
