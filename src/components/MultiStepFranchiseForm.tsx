import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";

const MultiStepFranchiseForm = () => {
  const [step, setStep] = useState(1);
  const { formData, handleInputChange, isSubmitting, enviado, erroEnvio, enviar: executeSubmission } =
    useLeadSubmission({ identificador: "formulario-lp-franquia" });

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

  // Sem envio nativo de <form>: a medição automática de formulários do Google Tag
  // gera um "form_submit" a cada submit nativo (mesmo nome do nosso evento) e
  // disparava o CompleteRegistration da Meta antes do lead ser salvo e sem
  // e-mail/telefone na correspondência avançada.
  const handleSubmitStep2 = () => {
    if (!formData.cidade || !formData.capital || !formData.prazo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    executeSubmission();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl text-black border border-gray-100 font-sans">
      <div>
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
              type="button"
              onClick={handleSubmitStep2}
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
      </div>
    </div>
  );
};

export default MultiStepFranchiseForm;
