import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@seclab-dev/tokens/index.css";
import "@seclab-dev/react/style.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
