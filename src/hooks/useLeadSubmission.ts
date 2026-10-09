import React, { useEffect, useState } from "react";
import { API_BASE, dadosDoLead, buildUserData, getFbc, getFbp, getExternalId } from "@/lib/tracking";

// Tipagem para garantir que o TypeScript não acuse erro nos scripts de rastreio.
// O Meta Pixel é disparado exclusivamente pelo GTM (GTM-PCL98LNF), não direto aqui.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const LEAD_VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  objetivo: "",
  cidade: "",
  capital: "",
  prazo: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  // Id da campanha ({{campaign.id}} no Meta, {campaignid} no Google): chave
  // estavel do cruzamento, nao muda quando a campanha e renomeada.
  utm_id: "",
  data_conversao: "",
  identificador: "",
  // Identificadores de atribuição: permitem reconciliar o lead da planilha
  // com o clique no Meta/Google (upload de conversão offline e CAPI).
  fbclid: "",
  gclid: "",
  fbc: "",
  fbp: "",
  external_id: "",
};

export type Lead = typeof LEAD_VAZIO;

/**
 * Origem para quem chega sem utm_source (link na bio, legenda, Linktree,
 * acesso direto). Sem isso o lead entra no RD como "Desconhecido".
 */
export const origemPeloReferrer = (referrer: string): string => {
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direto";
  }
  if (/instagram\.com$/.test(host)) return "instagram";
  if (/(facebook\.com|fb\.com|fb\.me)$/.test(host)) return "facebook";
  if (/linktr\.ee$/.test(host)) return "linktree";
  if (/linkedin\.com$|lnkd\.in$/.test(host)) return "linkedin";
  if (/(^|\.)google\./.test(host)) return "google";
  if (/youtube\.com$|youtu\.be$/.test(host)) return "youtube";
  if (/whatsapp\.com$|wa\.me$/.test(host)) return "whatsapp";
  if (host && host !== window.location.hostname) return host;
  return "direto";
};

interface Opcoes {
  identificador: string;
  /** Vai junto nos eventos do GTM para separar as LPs no GA4/Meta. */
  lp?: string;
  /** Preenche utm_source/utm_medium pelo referrer quando a URL vem sem UTM. */
  deduzirOrigem?: boolean;
}

/** Captura de UTM/cookies, envio para /api/lead e eventos do GTM, compartilhados pelos formulários. */
export const useLeadSubmission = ({ identificador, lp, deduzirOrigem = false }: Opcoes) => {
  const [formData, setFormData] = useState<Lead>({ ...LEAD_VAZIO, identificador });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  // Captura UTMs da URL e define a Data da Conversão
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    let utm_source = params.get("utm_source") || "";
    let utm_medium = params.get("utm_medium") || "";
    if (deduzirOrigem && !utm_source) {
      utm_source = origemPeloReferrer(document.referrer);
      utm_medium = utm_medium || (lp ? `lp-${lp}` : "lp");
    }

    setFormData((prev) => ({
      ...prev,
      data_conversao: dataAtual,
      utm_source,
      utm_medium,
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      utm_id: params.get("utm_id") || "",
      fbclid: params.get("fbclid") || "",
      gclid: params.get("gclid") || "",
      fbc: getFbc(),
      fbp: getFbp(),
      external_id: getExternalId(),
    }));
  }, [deduzirOrigem, lp]);

  const setCampo = (nome: keyof Lead, valor: string) =>
    setFormData((prev) => ({ ...prev, [nome]: valor }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCampo(e.target.name as keyof Lead, e.target.value);

  // ENVIO FINAL (PLANILHA + RASTREIO)
  const enviar = async () => {
    if (isSubmitting) return; // Evita os 3 disparos do Lovable
    setIsSubmitting(true);
    setErroEnvio(false);

    // 1. Grava o lead na planilha pela função /api/lead do próprio domínio,
    //    que repassa ao Apps Script (ver api/lead.ts). Dado pessoal não sai
    //    mais do navegador direto para script.google.com.
    let ok = false;
    try {
      const r = await fetch(API_BASE + "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      ok = r.ok;
    } catch (err) {
      console.error("Erro ao enviar o lead:", err);
    }

    if (!ok) {
      setIsSubmitting(false);
      setErroEnvio(true);
      return;
    }

    // 2. Google Tag Manager — fonte única do rastreio. Os dois eventos saem no
    //    envio, sem trocar de página (a pessoa continua na LP):
    //    - "form_submit": tags do Meta Pixel (Complete Registration) e afins;
    //    - "conversion_obrigado": o mesmo evento que a antiga página /obrigado
    //      disparava (Google Ads, GA4, Lead do Pixel). Nome mantido para os
    //      acionadores do GTM continuarem valendo.
    //    O user_data (Correspondência Avançada) vai só em memória, no evento.
    try {
      const user_data = buildUserData(
        dadosDoLead({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cidade: formData.cidade,
        }),
      );
      const extra = lp ? { lp } : {};
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", ...formData, ...extra, user_data });
      window.dataLayer.push({ event: "conversion_obrigado", page: "/obrigado", ...extra, user_data });
    } catch (err) {
      console.warn("Erro no tracking.", err);
    }

    setEnviado(true);
  };

  return { formData, setCampo, handleInputChange, isSubmitting, enviado, erroEnvio, enviar };
};
