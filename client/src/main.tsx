import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import "~/styles/index.css";
import App from "./App";
import "./i18n.ts";
import AppContextProvider from "./components/context/AppContextProvider.tsx";
import { SocketContextProvider } from "./components/context/SocketContextProvider.tsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AppContextProvider>
          <SocketContextProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </SocketContextProvider>
        </AppContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
