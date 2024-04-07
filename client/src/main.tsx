import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import "./i18n.ts";
import AppContextProvider from "./context/AppContext.tsx";
import { persistor, store } from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SocketContextProvider } from "./context/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <AppContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </AppContextProvider>
    </PersistGate>
  </Provider>,
);
