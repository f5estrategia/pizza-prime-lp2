import { createRoot, hydrateRoot } from "react-dom/client";
import App, { precarregarNegocio } from "./App.tsx";
import "./index.css";

const raiz = document.getElementById("root")!;

// A /negocio chega pré-renderizada: carrega o módulo dela e hidrata, para o
// React reaproveitar o HTML da tela. As outras páginas montam do zero.
if (/\/negocio\/?$/.test(window.location.pathname) && raiz.hasChildNodes()) {
  precarregarNegocio().then(
    () => hydrateRoot(raiz, <App />),
    () => createRoot(raiz).render(<App />),
  );
} else {
  createRoot(raiz).render(<App />);
}
