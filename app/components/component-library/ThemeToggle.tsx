"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "../ThemeRegistry";

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tooltip
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconButton
        onClick={toggleColorMode}
        size="small"
        aria-label={
          isDark ? "Switch to light mode" : "Switch to dark mode"
        }
        color="inherit"
      >
        {isDark ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
