import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./components/Button/styles.css";
import "./components/Input/styles.css";
import "./components/Textarea/styles.css";

import App from "./components/App/";
import { FontContextProvider } from "./components/Store/context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FontContextProvider>
      <App />
    </FontContextProvider>
  </React.StrictMode>
);
