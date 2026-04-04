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
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/history', label: 'History' },
  { href: '/exercises', label: 'Exercises' },
  { href: '/', label: 'New Workout' },
] as const;

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
              className="bg-foreground text-background rounded-md px-3 py-1.5 hover:opacity-90"
              href={href}
            >
              {label}
            </Link>
          ) : (
            <Link key={href} className="hover:underline" href={href}>
              {label}
            </Link>
          )
        )}
        <ThemeToggle />
      </nav>

      {/* Mobile hamburger */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5,
            }}
          >
            <span className="text-sm font-semibold">Menu</span>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {NAV_LINKS.map(({ href, label }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={pathname === href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
