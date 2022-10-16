import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./components/Button/styles.css";
import "./components/Input/styles.css";
import "./components/Textarea/styles.css";

import App from "./components/App/";
import reportWebVitals from "./reportWebVitals";
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
