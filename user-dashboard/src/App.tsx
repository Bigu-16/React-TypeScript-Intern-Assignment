import React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import UserPage from "./presentation/pages/UserPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ color: "red" }}>Hello World</div>
      <UserPage />
    </ThemeProvider>
  );
};

export default App;
