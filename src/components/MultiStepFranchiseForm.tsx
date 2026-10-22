import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";

// Formulário da LP principal. Todo contato passa pelas 2 etapas: cidade, investimento e
// prazo são obrigatórios para qualquer objetivo (antes, "mercado" e "outros" enviavam
// direto da etapa 1 e o lead chegava sem cidade nem capital). Faixas de investimento
// iguais às das LPs /negocio, /oportunidade e /franquia, ancoradas no Delivery de R$ 249 mil.
const OBJETIVOS = [
  { valor: "operar", texto: "Quero abrir e operar a minha unidade" },
  { valor: "investir", texto: "Quero investir e ter gestão contratada" },
  { valor: "pesquisando", texto: "Ainda estou pesquisando o modelo" },
];
const CAPITAIS = ["Até R$ 199 mil", "R$ 200 a 250 mil", "R$ 250 a 350 mil", "Acima de R$ 350 mil", "Ainda não tenho o capital"];
const PRAZOS = ["Imediato", "Até 3 meses", "3 a 6 meses", "6 a 12 meses", "Ainda não decidi"];

const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const telefoneValido = (v: string) => v.replace(/\D/g, "").length >= 10;

const campo =
  "w-full p-3 bg-gray-100 border-none rounded text-black outline-none focus:ring-1 focus:ring-orange-400";

const MultiStepFranchiseForm = () => {
  const [step, setStep] = useState(1);
  const [erro, setErro] = useState("");
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
    if (!formData.nome.trim()) return setErro("Informe seu nome.");
    if (!emailValido(formData.email)) return setErro("Informe um e-mail válido.");
    if (!telefoneValido(formData.telefone)) return setErro("Informe o telefone com DDD.");
    if (!formData.objetivo) return setErro("Escolha o seu objetivo.");
    setErro("");
    setStep(2);
  };

  // Sem envio nativo de <form>: a medição automática de formulários do Google Tag
  // gera um "form_submit" a cada submit nativo (mesmo nome do nosso evento) e
  // disparava o CompleteRegistration da Meta antes do lead ser salvo e sem
  // e-mail/telefone na correspondência avançada.
  const handleSubmitStep2 = () => {
    if (!formData.cidade.trim()) return setErro("Informe a cidade onde quer abrir a unidade.");
    if (!formData.capital) return setErro("Escolha o investimento disponível.");
    if (!formData.prazo) return setErro("Escolha o prazo para abrir.");
    setErro("");
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

        <p className="text-xs text-gray-500 mb-3">
          Etapa {step} de 2 · <span className="text-gray-400">* campos obrigatórios</span>
        </p>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>

            <input type="text" name="nome" autoComplete="name" placeholder="Nome *" value={formData.nome} className={campo} onChange={handleInputChange} />
            <input type="email" name="email" inputMode="email" autoComplete="email" placeholder="E-mail *" value={formData.email} className={campo} onChange={handleInputChange} />
            <input type="tel" name="telefone" inputMode="tel" autoComplete="tel" placeholder="Telefone com DDD *" value={formData.telefone} className={campo} onChange={handleInputChange} />

            <label className="block font-semibold mt-4 text-sm">Objetivo principal ao entrar em contato: *</label>
            <select name="objetivo" value={formData.objetivo} className={campo} onChange={handleInputChange}>
              <option value="">Selecione...</option>
              {OBJETIVOS.map((o) => (
                <option key={o.valor} value={o.valor}>{o.texto}</option>
              ))}
            </select>

            {erro && <p role="alert" className="text-sm font-semibold text-red-700">{erro}</p>}

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-4 mt-4 bg-[#FF8C00] text-black font-extrabold rounded uppercase hover:bg-orange-600 transition-all active:scale-95 shadow-md"
            >
              Próximo Passo
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
            <h2 className="text-xl font-bold mb-4">Detalhes da Unidade</h2>

            <label className="block font-semibold text-sm text-gray-700">Qual cidade deseja abrir sua unidade: *</label>
            <input type="text" name="cidade" autoComplete="address-level2" placeholder="Ex: São José - SC" value={formData.cidade} className={campo} onChange={handleInputChange} />

            <label className="block font-semibold text-sm text-gray-700">Investimento disponível: *</label>
            <select name="capital" value={formData.capital} className={campo} onChange={handleInputChange}>
              <option value="">Selecione...</option>
              {CAPITAIS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 -mt-2">O modelo Delivery parte de R$ 249 mil + R$ 50 mil de capital de giro.</p>

            <label className="block font-semibold text-sm text-gray-700">Prazo estimado para abrir a franquia: *</label>
            <select name="prazo" value={formData.prazo} className={campo} onChange={handleInputChange}>
              <option value="">Selecione...</option>
              {PRAZOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {erro && <p role="alert" className="text-sm font-semibold text-red-700">{erro}</p>}

            <button
              type="button"
              onClick={handleSubmitStep2}
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-[#FF8C00] text-black font-extrabold rounded uppercase hover:bg-orange-600 transition-all active:scale-95 shadow-md disabled:bg-gray-400"
            >
              {isSubmitting ? "Enviando Dados..." : "Falar com a expansão"}
            </button>

            <button
              type="button"
              onClick={() => {
                setErro("");
                setStep(1);
              }}
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
