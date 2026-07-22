import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/globals.css";
import { PrototypeApp } from "@/components/prototype/PrototypeApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode><PrototypeApp /></StrictMode>,
);
