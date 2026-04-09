'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type Palette,
  DEFAULT_PALETTE_ID,
  getPalette,
  applyPaletteToDocument,
} from '../../theme/palettes';

interface PaletteContextType {
  palette: Palette;
  setPaletteById: (id: string) => void;
}

const PaletteContext = createContext<PaletteContextType | null>(null);

const STORAGE_KEY = 'selectedPalette';

function readStoredPaletteId(): string {
  if (typeof window === 'undefined') return DEFAULT_PALETTE_ID;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PALETTE_ID;
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<Palette>(() =>
    getPalette(readStoredPaletteId())
  );

  useEffect(() => {
    applyPaletteToDocument(palette);
  }, [palette]);

  const setPaletteById = useCallback((id: string) => {
    const next = getPalette(id);
    localStorage.setItem(STORAGE_KEY, next.id);
    setPalette(next);
  }, []);

  return (
    <PaletteContext.Provider value={{ palette, setPaletteById }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return ctx;
}
