import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Negocio from "@/pages/Negocio";
import { definirNegocio, Provedores, Rotas } from "@/App";

// Pré-renderização da LP /negocio (rodada no postbuild): o HTML já chega com o
// topo e o formulário prontos, e o texto aparece antes do JavaScript baixar.
// A árvore é a mesma do App no navegador (Provedores > roteador > Rotas), para
// o main.tsx poder hidratar sem recriar os elementos.
export const render = () => {
  definirNegocio(Negocio);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return renderToString(
    <Provedores>
      <StaticRouter basename={base || "/"} location={`${base}/negocio`}>
        <Rotas />
      </StaticRouter>
    </Provedores>,
  );
};
