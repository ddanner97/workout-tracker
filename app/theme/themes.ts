import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0",
      light: "#4a90d9",
      dark: "#003c8f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0097a7",
      light: "#4dd0e1",
      dark: "#006064",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#171717",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#c3e5fb",
      dark: "#5b9bd5",
      contrastText: "#0d1117",
    },
    secondary: {
      main: "#4dd0e1",
      light: "#88ffff",
      dark: "#009faf",
      contrastText: "#0d1117",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    text: {
      primary: "#ededed",
      secondary: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
