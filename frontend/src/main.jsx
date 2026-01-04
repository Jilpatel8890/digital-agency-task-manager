import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ClerkProviderWrapper from "../src/providers/ClerkProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProviderWrapper>
      <App />
    </ClerkProviderWrapper>
  </React.StrictMode>
);
