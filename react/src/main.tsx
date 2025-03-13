import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import StoreProvider from "./store/StoreProvider.tsx";
import { CssBaseline } from "@mui/material";
import theme from "./theme.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StoreProvider>
  </StrictMode>
);
