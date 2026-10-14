import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createElement, lazy, Suspense, useEffect, type ComponentType, type ReactNode } from "react";
import { carregarGeo } from "@/lib/tracking";

// Cada LP em um bundle próprio: a /negocio não baixa os componentes da LP
// principal. O postbuild põe modulepreload do bundle de cada página no HTML,
// para tudo baixar em paralelo.
const Index = lazy(() => import("./pages/Index"));
const Negocio = lazy(() => import("./pages/Negocio"));
const Oportunidade = lazy(() => import("./pages/Oportunidade"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Obrigado = lazy(() => import("./pages/Obrigado"));

// A /negocio chega pré-renderizada (postbuild + src/ssr/negocio.tsx). O
// main.tsx carrega o módulo antes do primeiro render e hidrata: o React
// reaproveita o HTML que já está na tela em vez de recriar os elementos (recriar
// fazia o navegador medir o LCP de novo, depois do JavaScript e do GTM).
const prontas: Record<string, ComponentType> = {};
export const definirPagina = (rota: string, componente: ComponentType) => {
  prontas[rota] = componente;
};
const carregadores: Record<string, () => Promise<{ default: ComponentType }>> = {
  "/negocio": () => import("./pages/Negocio"),
  "/oportunidade": () => import("./pages/Oportunidade"),
};
/** Rota pré-renderizada correspondente ao caminho atual, ou null. */
export const rotaPreRenderizada = (caminho: string) =>
  Object.keys(carregadores).find((r) => new RegExp(r + "\/?$").test(caminho)) || null;
export const precarregarPagina = (rota: string) => carregadores[rota]().then((m) => definirPagina(rota, m.default));

const queryClient = new QueryClient();

/** Provedores e avisos, iguais no navegador e na pré-renderização. */
export const Provedores = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {children}
    </TooltipProvider>
  </QueryClientProvider>
);

export const Rotas = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#0E0E0E]" />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/obrigado" element={<Obrigado />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/negocio" element={prontas["/negocio"] ? createElement(prontas["/negocio"]) : <Negocio />} />
      <Route path="/oportunidade" element={prontas["/oportunidade"] ? createElement(prontas["/oportunidade"]) : <Oportunidade />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => {
  // Geo (headers da Vercel via /api/geo) em cache: alimenta cidade/estado/pais dos proximos eventos.
  // O bootstrap no index.html le esse cache antes do GTM subir.
  useEffect(() => {
    carregarGeo();
  }, []);

  return (
    <Provedores>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Rotas />
      </BrowserRouter>
    </Provedores>
  );
};

export default App;
