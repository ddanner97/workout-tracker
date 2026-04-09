'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PalettePicker from './PalettePicker';

const NAV_LINKS = [
  { href: '/history', label: 'History' },
  { href: '/exercises', label: 'Exercises' },
  { href: '/', label: 'New Workout' },
] as const;

function HamburgerIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
      <rect y="2" width="22" height="2" rx="1" fill="currentColor" />
      <rect y="9" width="22" height="2" rx="1" fill="currentColor" />
      <rect y="16" width="14" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function NavMenu() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
        {NAV_LINKS.map(({ href, label }) =>
          href === '/' ? (
            <Link
              key={href}
              className="rounded-xl px-3 py-1.5 text-white hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent)' }}
              href={href}
            >
              {label}
            </Link>
          ) : (
            <Link
              key={href}
              className="hover:underline"
              style={{ color: 'var(--color-body)' }}
              href={href}
            >
              {label}
            </Link>
          )
        )}
        <PalettePicker />
      </nav>

      {/* Mobile hamburger */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          sx={{ color: 'var(--color-heading)' }}
        >
          <HamburgerIcon />
        </IconButton>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-body)',
          },
        }}
      >
        <Box sx={{ width: 260 }} role="presentation">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5,
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-heading)' }}
            >
              Menu
            </span>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              size="small"
              sx={{ color: 'var(--color-muted)' }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'var(--color-border)' }} />
          <List>
            {NAV_LINKS.map(({ href, label }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={pathname === href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-badge-bg)',
                    color: 'var(--color-accent)',
                  },
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ borderColor: 'var(--color-border)' }} />
          <Box sx={{ px: 2, py: 2 }}>
            <PalettePicker />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
