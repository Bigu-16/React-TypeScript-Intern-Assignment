import React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import UserPage from "./presentation/pages/UserPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" }, // marine blue
    secondary: { main: "#00bcd4" }, // accent blue
    background: {
      default: "#e3f2fd",
      paper: "#f5faff",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "#f0f7fa",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserPage />
    </ThemeProvider>
  );
}

export default App;
