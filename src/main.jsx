import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./store.jsx";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { setupKeyboard } from "./lib/keyboard.js";
import { startMessaging } from "./lib/firebase.js";
import { setupPWA } from "./lib/pwa.js";

setupKeyboard();
startMessaging();
setupPWA();

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <StoreProvider>
      <App />
    </StoreProvider>
  </ErrorBoundary>
);
