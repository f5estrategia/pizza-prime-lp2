import React, { useState, useEffect } from "react";

// Tipagem para garantir que o TypeScript não acuse erro nos scripts de rastreio
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    RdIntegration: any;
  }
}

const MultiStepFranchiseForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ENVIO FINAL (WEBHOOK + RASTREIO)
  const executeSubmission = async () => {
    if (isSubmitting) return; // Evita os 3 disparos do Lovable
    setIsSubmitting(true);

    const WEBHOOK_URL = "https://hook.us1.make.com/6lfyc0mr01e2xj05k16lby94zkajuvja";

    try {
      // 1. Envio para o Make.com (Webhook)
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch((err) => console.error("Erro Webhook:", err));

      // 2. Envio RD Station
      if (typeof window !== "undefined" && window.RdIntegration) {
        window.RdIntegration.post(formData);
      }

      // 3. Meta Pixel (Evento de Lead)
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "Franquia Pizza Prime",
          status: formData.objetivo,
        });
      }

      // 4. Google Tag Manager
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({ event: "form_submit", ...formData });
      }
    } catch (err) {
      console.warn("Erro no tracking, seguindo com o redirecionamento.", err);
    }

    // Feedback visual
    setShowPopup(true);

    // Redirecionamento para WhatsApp após 3 segundos
    setTimeout(() => {
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=5511973291171&text=Ol%C3%A1%21+Acabei+de+preencher+o+formul%C3%A1rio+e+gostaria+de+falar+com+um+consultor.&type=phone_number&app_absent=0`;
      window.location.href = whatsappUrl;
    }, 3000);
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

      {/* POPUP DE SUCESSO */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[9999] px-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg text-center shadow-2xl max-w-sm w-full animate-in zoom-in duration-300 border-t-8 border-[#FF8C00]">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Obrigado pelo cadastro!</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Você será redirecionado para falar com um consultor no WhatsApp agora.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#FF8C00] border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepFranchiseForm;
