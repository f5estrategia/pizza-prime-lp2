import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { API_BASE, dadosDoLead, buildUserData, getFbc, getFbp, getExternalId } from "@/lib/tracking";

// Tipagem para garantir que o TypeScript não acuse erro nos scripts de rastreio.
// O Meta Pixel é disparado exclusivamente pelo GTM (GTM-PCL98LNF), não direto aqui.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const MultiStepFranchiseForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    objetivo: "",
    cidade: "",
    capital: "",
    prazo: "",
    // Campos Hidden
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    // Id da campanha ({{campaign.id}} no Meta, {campaignid} no Google): chave
    // estavel do cruzamento, nao muda quando a campanha e renomeada.
    utm_id: "",
    data_conversao: "",
    identificador: "formulario-lp-franquia",
    // Identificadores de atribuição: permitem reconciliar o lead da planilha
    // com o clique no Meta/Google (upload de conversão offline e CAPI).
    fbclid: "",
    gclid: "",
    fbc: "",
    fbp: "",
    external_id: "",
  });

  // Captura UTMs da URL e define a Data da Conversão
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    setFormData((prev) => ({
      ...prev,
      data_conversao: dataAtual,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ENVIO FINAL (PLANILHA + RASTREIO)
  const executeSubmission = async () => {
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
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", ...formData, user_data });
      window.dataLayer.push({ event: "conversion_obrigado", page: "/obrigado", user_data });
    } catch (err) {
      console.warn("Erro no tracking.", err);
    }

    setEnviado(true);
  };

  if (enviado) {
    return (
      <div
        role="status"
        className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl text-black border border-gray-100 font-sans text-center"
      >
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold mb-2">Cadastro enviado!</h2>
        <p className="text-gray-700">
          Recebemos seus dados. Em breve o time de expansão da Pizza Prime entrará em contato.
        </p>
      </div>
    );
  }

  const handleNextStep = () => {
    if (!formData.nome || !formData.email || !formData.telefone || !formData.objetivo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Se o objetivo for "Mercado" ou "Outros", envia direto do Step 1
    if (formData.objetivo === "mercado" || formData.objetivo === "outros") {
      executeSubmission();
    } else {
      setStep(2); // Se quiser abrir/investir, vai para o Step 2
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl text-black border border-gray-100 font-sans">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeSubmission();
        }}
      >
        {/* Campos Hidden que o Make e o RD capturam */}
        <input type="hidden" name="utm_source" value={formData.utm_source} />
        <input type="hidden" name="utm_medium" value={formData.utm_medium} />
        <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
        <input type="hidden" name="data_conversao" value={formData.data_conversao} />

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>

            <input
              type="text"
              name="nome"
              placeholder="Nome"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none focus:ring-1 focus:ring-orange-400"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none focus:ring-1 focus:ring-orange-400"
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="telefone"
              placeholder="Telefone"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none focus:ring-1 focus:ring-orange-400"
              onChange={handleInputChange}
            />

            <label className="block font-semibold mt-4 text-sm">Objetivo principal ao entrar em contato:</label>
            <select
              name="objetivo"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none"
              onChange={handleInputChange}
            >
              <option value="">Selecione...</option>
              <option value="operar">Quero abrir uma franquia e operar o negócio</option>
              <option value="investir">Quero investir e contratar gestão e funcionários</option>
              <option value="mercado">Buscar informações sobre o mercado de food service</option>
              <option value="outros">Outros</option>
            </select>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-4 mt-4 bg-[#FF8C00] text-black font-extrabold rounded uppercase hover:bg-orange-600 transition-all active:scale-95 shadow-md"
            >
              {formData.objetivo === "mercado" || formData.objetivo === "outros"
                ? "Seja um franqueado"
                : "Próximo Passo"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
            <h2 className="text-xl font-bold mb-4">Detalhes da Unidade</h2>

            <label className="block font-semibold text-sm text-gray-700">Qual cidade deseja abrir sua unidade:</label>
            <input
              type="text"
              name="cidade"
              placeholder="Ex: São José - SC"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none focus:ring-1 focus:ring-orange-400"
              onChange={handleInputChange}
            />

            <label className="block font-semibold text-sm text-gray-700">Capital disponível para investimento:</label>
            <select
              name="capital"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none"
              onChange={handleInputChange}
            >
              <option value="">Selecione...</option>
              <option value="Menos de R$ 100 mil">Menos de R$ 100 mil</option>
              <option value="R$ 100 mil a R$ 200 mil">De R$ 100 mil a R$ 200 mil</option>
              <option value="R$ 200 mil a R$ 300 mil">De R$ 200 mil a R$ 300 mil</option>
              <option value="R$ 300 mil a R$ 400 mil">De R$ 300 mil a R$ 400 mil</option>
              <option value="R$ 400 mil a R$ 500 mil">De R$ 400 mil a R$ 500 mil</option>
              <option value="Acima de R$ 500 mil">Acima de R$ 500 mil</option>
            </select>

            <label className="block font-semibold text-sm text-gray-700">Prazo estimado para abrir a franquia:</label>
            <select
              name="prazo"
              required
              className="w-full p-3 bg-gray-100 border-none rounded text-black outline-none"
              onChange={handleInputChange}
            >
              <option value="">Selecione...</option>
              <option value="Imediato">Imediato</option>
              <option value="3-6 meses">3-6 meses</option>
              <option value="6-12 meses">6-12 meses</option>
              <option value="Ainda não decidi">Ainda não decidi</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-[#FF8C00] text-black font-extrabold rounded uppercase hover:bg-orange-600 transition-all active:scale-95 shadow-md disabled:bg-gray-400"
            >
              {isSubmitting ? "Enviando Dados..." : "Seja um franqueado"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-400 underline mt-2"
            >
              Voltar e corrigir dados
            </button>
          </div>
        )}

        {erroEnvio && (
          <p role="alert" className="mt-4 text-sm text-red-700 text-center">
            Não foi possível enviar agora. Tente de novo em instantes ou escreva para{" "}
            <a href="mailto:expansao@pizzaprime.com.br" className="underline">expansao@pizzaprime.com.br</a>.
          </p>
        )}

        <p className="mt-4 text-[11px] leading-snug text-gray-500 text-center">
          Ao enviar, você concorda que a Pizza Prime Franchising use seus dados para entrar em contato
          sobre a franquia, conforme a{" "}
          <Link to="/privacidade" className="underline hover:text-gray-700">Política de Privacidade</Link>.
        </p>
      </form>
    </div>
  );
};

export default MultiStepFranchiseForm;
