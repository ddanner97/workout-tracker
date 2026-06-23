export interface Palette {
  id: string;
  name: string;
  isDark: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  accentLight: string;
  accent: string;
  badgeBg: string;
  heading: string;
  bodyText: string;
  muted: string;
  placeholder: string;
  inputBg: string;
}

export const PALETTES: Record<string, Palette> = {
  purple: {
    id: 'purple',
    name: 'Purple',
    isDark: false,
    bg: '#F7F4EF',
    surface: '#FFFFFF',
    surfaceAlt: '#FDFBF8',
    border: '#EDE8E0',
    accentLight: '#A78BFA',
    accent: '#7C3AED',
    badgeBg: '#EDE8FF',
    heading: '#1C1917',
    bodyText: '#2E2A24',
    muted: '#B8AFA3',
    placeholder: '#C9C3BB',
    inputBg: '#F7F4EF',
  },
  green: {
    id: 'green',
    name: 'Forest Green',
    isDark: false,
    bg: '#F2F7F4',
    surface: '#FFFFFF',
    surfaceAlt: '#F7FBF8',
    border: '#D1E8DC',
    accentLight: '#34D399',
    accent: '#059669',
    badgeBg: '#D1FAE5',
    heading: '#1A2E22',
    bodyText: '#2E2A24',
    muted: '#9DBDAB',
    placeholder: '#9DBDAB',
    inputBg: '#F2F7F4',
  },
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    isDark: false,
    bg: '#F0F5FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F7FAFD',
    border: '#C8DCF0',
    accentLight: '#60A5FA',
    accent: '#2563EB',
    badgeBg: '#DBEAFE',
    heading: '#1A2540',
    bodyText: '#2E2A24',
    muted: '#94ADC8',
    placeholder: '#94ADC8',
    inputBg: '#F0F5FB',
  },
  'purple-dark': {
    id: 'purple-dark',
    name: 'Purple Dark',
    isDark: true,
    bg: '#18151F',
    surface: '#1E1A2A',
    surfaceAlt: '#1A1625',
    border: '#2C2640',
    accentLight: '#C4B5FD',
    accent: '#7C3AED',
    badgeBg: '#2A2040',
    heading: '#F3F0FA',
    bodyText: '#EDE9F4',
    muted: '#5A5068',
    placeholder: '#3D3550',
    inputBg: '#221E2E',
  },
  pink: {
    id: 'pink',
    name: 'Rose Pink',
    isDark: false,
    bg: '#FFF5F7',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF9FA',
    border: '#FFD6E0',
    accentLight: '#FFC5D3',
    accent: '#DB2777',
    badgeBg: '#FFE4EC',
    heading: '#1C1917',
    bodyText: '#2E2A24',
    muted: '#C4A0AA',
    placeholder: '#D4B8C0',
    inputBg: '#FFF5F7',
  },
};

export const DEFAULT_PALETTE_ID = 'purple';

export function getPalette(id: string): Palette {
  return PALETTES[id] ?? PALETTES[DEFAULT_PALETTE_ID];
}

export const PALETTE_CSS_VARS = [
  'bg',
  'surface',
  'surfaceAlt',
  'border',
  'accentLight',
  'accent',
  'badgeBg',
  'heading',
  'bodyText',
  'muted',
  'placeholder',
  'inputBg',
] as const;

const CSS_VAR_MAP: Record<(typeof PALETTE_CSS_VARS)[number], string> = {
  bg: '--color-bg',
  surface: '--color-surface',
  surfaceAlt: '--color-surface-alt',
  border: '--color-border',
  accentLight: '--color-accent-light',
  accent: '--color-accent',
  badgeBg: '--color-badge-bg',
  heading: '--color-heading',
  bodyText: '--color-body',
  muted: '--color-muted',
  placeholder: '--color-placeholder',
  inputBg: '--color-input-bg',
};

export function applyPaletteToDocument(palette: Palette) {
  const root = document.documentElement;

  for (const key of PALETTE_CSS_VARS) {
    root.style.setProperty(CSS_VAR_MAP[key], palette[key]);
  }

  root.setAttribute('data-theme', palette.id);
  root.classList.toggle('dark', palette.isDark);
}
