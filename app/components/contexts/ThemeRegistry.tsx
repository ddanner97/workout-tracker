'use client';

import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createThemeFromPalette } from '../../theme/themes';
import { usePalette } from './PaletteContext';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { palette } = usePalette();

  const theme = useMemo(
    () => createThemeFromPalette(palette),
    [palette]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
