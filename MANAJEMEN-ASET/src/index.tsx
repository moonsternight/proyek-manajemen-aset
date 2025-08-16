import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.scss";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element with ID "root" not found in the DOM.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
