import React, { useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import UserPage from "./presentation/pages/UserPage";

const PRIMARY_COLOR = "#023562";

function getTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: PRIMARY_COLOR },
      secondary: { main: "#00bcd4" },
      background: {
        default: mode === "light" ? "#e3f2fd" : "#101624",
        paper: mode === "light" ? "#f5faff" : "#18213a",
      },
      text: {
        primary: mode === "light" ? "#1a2636" : "#fff",
        secondary: mode === "light" ? "#333" : "#e0e0e0",
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
            background: mode === "light" ? "#f0f7fa" : "#1a2636",
            color: mode === "light" ? undefined : "#fff",
          },
        },
      },
    },
  });
}

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserPage mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
}

export default App;
