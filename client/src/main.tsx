import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import "~/styles/index.css";
import App from "./App";
import "./i18n.ts";
import AppContextProvider from "./components/context/AppContext";
import { SocketContextProvider } from "./components/context/SocketContext.tsx";

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
