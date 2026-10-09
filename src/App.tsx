import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from "react";
import { carregarGeo } from "@/lib/tracking";

// Cada LP em um bundle próprio: a /negocio não baixa os componentes da LP
// principal. O postbuild põe modulepreload do bundle de cada página no HTML,
// para tudo baixar em paralelo.
const Index = lazy(() => import("./pages/Index"));
const Negocio = lazy(() => import("./pages/Negocio"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Obrigado = lazy(() => import("./pages/Obrigado"));

// A /negocio chega pré-renderizada (postbuild + src/ssr/negocio.tsx). O
// main.tsx carrega o módulo antes do primeiro render e hidrata: o React
// reaproveita o HTML que já está na tela em vez de recriar os elementos (recriar
// fazia o navegador medir o LCP de novo, depois do JavaScript e do GTM).
let NegocioPronto: ComponentType | null = null;
export const definirNegocio = (componente: ComponentType) => {
  NegocioPronto = componente;
};
export const precarregarNegocio = () => import("./pages/Negocio").then((m) => definirNegocio(m.default));

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
      <Route path="/negocio" element={NegocioPronto ? <NegocioPronto /> : <Negocio />} />
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
