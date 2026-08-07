import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarLead, buildUserData, getFbc, getFbp, getExternalId } from "@/lib/tracking";

// Tipagem para garantir que o TypeScript não acuse erro nos scripts de rastreio.
// O Meta Pixel é disparado exclusivamente pelo GTM (GTM-PCL98LNF), não direto aqui.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const MultiStepFranchiseForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Google Apps Script (Web App) — grava direto na planilha de leads.
    const SHEET_ENDPOINT =
      "https://script.google.com/macros/s/AKfycbwW2C1Ue0bp9-ok-kVmN3fGCstoFIZoynt31AKAxjjLKQ8yC9FJRTVBpTpO3pqTydj7/exec";

    try {
      // 1. Grava o lead na planilha (Apps Script).
      //    Content-Type "text/plain" evita o preflight CORS que o Apps Script
      //    não responde; o script lê o corpo via e.postData.contents.
      //    keepalive garante a entrega mesmo durante a navegação seguinte.
      await fetch(SHEET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
        keepalive: true,
      }).catch((err) => console.error("Erro ao gravar na planilha:", err));

      // 2. Persiste o lead normalizado para enriquecer os eventos seguintes
      //    (o Lead em /obrigado e os PageViews das proximas visitas).
      salvarLead({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cidade: formData.cidade,
      });

      // 3. Google Tag Manager — fonte única do rastreio.
      //    O evento "form_submit" aciona no GTM as tags do Meta Pixel
      //    (Complete Registration / Cadastro e Form_submit) e demais conversões.
      //    O Lead do Pixel é disparado pelo GTM na página /obrigado
      //    (evento "conversion_obrigado"), evitando contagem dupla.
      //    O user_data vai junto para a Correspondência Avançada do Pixel.
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          ...formData,
          user_data: buildUserData(),
        });
      }
    } catch (err) {
      console.warn("Erro no tracking, seguindo com o redirecionamento.", err);
    }

    // Redireciona para a página de obrigado (URL única de conversão).
    navigate("/obrigado");
  };

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
      </form>
    </div>
  );
};

export default MultiStepFranchiseForm;
