import { createTheme } from '@mui/material/styles';
import type { Palette } from './palettes';

export function createThemeFromPalette(palette: Palette) {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    palette: {
      mode: palette.isDark ? 'dark' : 'light',
      primary: {
        main: palette.accent,
        light: palette.accentLight,
        contrastText: '#ffffff',
      },
      background: {
        default: palette.bg,
        paper: palette.surface,
      },
      text: {
        primary: palette.bodyText,
        secondary: palette.muted,
      },
      divider: palette.border,
    },
    typography: {
      fontFamily: 'var(--font-nunito), sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-accent-light)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-accent)',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'var(--color-muted)',
            '&.Mui-focused': {
              color: 'var(--color-accent)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            textTransform: 'none' as const,
            fontWeight: 700,
          },
        },
      },
    },
  });
}
