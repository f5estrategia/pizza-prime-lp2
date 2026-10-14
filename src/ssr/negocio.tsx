import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Negocio from "@/pages/Negocio";
import Oportunidade from "@/pages/Oportunidade";
import { definirPagina, Provedores, Rotas } from "@/App";

// Pré-renderização das LPs curtas (rodada no postbuild): o HTML já chega com o
// topo e o formulário prontos. A árvore é a mesma do App no navegador
// (Provedores > roteador > Rotas), para o main.tsx hidratar sem recriar nada.
definirPagina("/negocio", Negocio);
definirPagina("/oportunidade", Oportunidade);

export const render = (rota: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return renderToString(
    <Provedores>
      <StaticRouter basename={base || "/"} location={`${base}${rota}`}>
        <Rotas />
      </StaticRouter>
    </Provedores>,
  );
};
