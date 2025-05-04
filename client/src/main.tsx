import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WireTypesProvider } from "@/context/WireTypesContext";

createRoot(document.getElementById("root")!).render(
  <WireTypesProvider>
    <App />
  </WireTypesProvider>
);
