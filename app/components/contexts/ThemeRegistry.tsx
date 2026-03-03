"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../../theme/themes";

type ColorMode = "light" | "dark";

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: "light",
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    // localStorage is only available in the browser; guard against SSR
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("colorMode") as ColorMode | null)
        : null;
    return (
      stored ??
      (typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      colorMode === "dark",
    );
  }, [colorMode]);

  const toggleColorMode = useCallback(() => {
    setColorMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={colorMode === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
