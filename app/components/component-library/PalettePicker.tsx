'use client';

import { Box, Typography } from '@mui/material';
import { PALETTES } from '../../theme/palettes';
import { usePalette } from '../contexts/PaletteContext';

const paletteList = Object.values(PALETTES);

export default function PalettePicker() {
  const { palette: currentPalette, setPaletteById } = usePalette();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: 'var(--color-muted)',
        }}
      >
        Theme
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {paletteList.map((p) => (
          <Box
            key={p.id}
            onClick={() => setPaletteById(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setPaletteById(p.id);
            }}
            aria-label={`Switch to ${p.name} theme`}
            aria-pressed={currentPalette.id === p.id}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: p.isDark ? p.surface : p.accent,
              border: currentPalette.id === p.id
                ? `2px solid ${p.accent}`
                : `2px solid transparent`,
              outline: currentPalette.id === p.id
                ? `2px solid ${p.accentLight}`
                : 'none',
              cursor: 'pointer',
              transition: 'outline 0.15s, border 0.15s',
              '&:hover': {
                outline: `2px solid ${p.accentLight}`,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
