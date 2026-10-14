import { createRoot, hydrateRoot } from "react-dom/client";
import App, { precarregarPagina, rotaPreRenderizada } from "./App.tsx";
import "./index.css";

const raiz = document.getElementById("root")!;

// /negocio e /oportunidade chegam pré-renderizadas: carrega o módulo da página
// e hidrata, para o React reaproveitar o HTML da tela. As outras montam do zero.
const rota = rotaPreRenderizada(window.location.pathname);
if (rota && raiz.hasChildNodes()) {
  precarregarPagina(rota).then(
    () => hydrateRoot(raiz, <App />),
    () => createRoot(raiz).render(<App />),
  );
} else {
  createRoot(raiz).render(<App />);
}
