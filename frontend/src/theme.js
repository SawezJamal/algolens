import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#38bdf8",
    },

    secondary: {
      main: "#818cf8",
    },

    background: {
      default: "#0b1120",
      paper: "#111827",
    },

    text: {
      primary: "#e5e7eb",
      secondary: "#94a3b8",
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;