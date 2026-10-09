import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLeadSubmission, type Lead } from "@/hooks/useLeadSubmission";

// Formulário da LP /negocio: todos os campos obrigatórios (pedido do Diego, para
// filtrar curioso e nunca perder origem). Duas microetapas: contato primeiro,
// qualificação depois, com prazo e capital em botões de toque em vez de select.

const PRAZOS = ["Imediato", "Até 3 meses", "3 a 6 meses", "6 a 12 meses"];
const CAPITAIS = [
  "Até R$ 199 mil",
  "R$ 200 a 250 mil",
  "R$ 250 a 350 mil",
  "Acima de R$ 350 mil",
  "Ainda não tenho o capital",
];

const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const telefoneValido = (v: string) => v.replace(/\D/g, "").length >= 10;

const campo =
  "w-full h-12 px-4 rounded-lg bg-white text-[#0E0E0E] text-base border-2 border-transparent outline-none focus:border-secondary placeholder:text-gray-400";

const Chips = ({
  nome,
  opcoes,
  valor,
  aoEscolher,
}: {
  nome: string;
  opcoes: string[];
  valor: string;
  aoEscolher: (v: string) => void;
}) => (
  <div role="radiogroup" aria-label={nome} className="flex flex-wrap gap-2">
    {opcoes.map((o) => (
      <button
        key={o}
        type="button"
        role="radio"
        aria-checked={valor === o}
        onClick={() => aoEscolher(o)}
        className={`min-h-11 px-3.5 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
          valor === o
            ? "bg-secondary border-secondary text-[#0E0E0E]"
            : "bg-white/5 border-white/25 text-white hover:border-secondary"
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

// Sem envio nativo de <form>: a medição automática de formulários do Google Tag
// gera um evento "form_submit" a cada submit nativo, com o mesmo nome do nosso
// evento, e isso disparava o CompleteRegistration da Meta no "Continuar" (antes
// do lead existir). Os botões são type="button" e o Enter é tratado à mão.
const LeadFormNegocio = () => {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [erro, setErro] = useState("");
  const { formData, setCampo, isSubmitting, enviado, erroEnvio, enviar } = useLeadSubmission({
    identificador: "formulario-lp-negocio",
    lp: "negocio",
    deduzirOrigem: true,
  });

  const mudar = (nome: keyof Lead) => (e: ChangeEvent<HTMLInputElement>) => setCampo(nome, e.target.value);

  const avancar = () => {
    if (!formData.nome.trim()) return setErro("Informe seu nome.");
    if (!emailValido(formData.email)) return setErro("Informe um e-mail válido.");
    if (!telefoneValido(formData.telefone)) return setErro("Informe o WhatsApp com DDD.");
    setErro("");
    setEtapa(2);
  };

  const concluir = () => {
    if (!formData.cidade.trim()) return setErro("Informe a cidade onde quer abrir a unidade.");
    if (!formData.prazo) return setErro("Escolha o prazo para abrir.");
    if (!formData.capital) return setErro("Escolha o investimento disponível.");
    setErro("");
    enviar();
  };

  if (enviado) {
    return (
      <div role="status" className="rounded-2xl bg-[#111]/95 border-2 border-secondary/70 p-7 text-center">
        <CheckCircle2 className="w-14 h-14 text-secondary mx-auto mb-4" />
        <p className="text-2xl font-extrabold text-white mb-2">Recebemos seus dados.</p>
        <p className="text-white/75">O time de expansão vai falar com você pelo WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#111]/95 border-2 border-secondary/70 p-5 sm:p-7 shadow-2xl">
      <h2 className="font-display uppercase text-white text-2xl sm:text-3xl leading-tight text-center">Fale com o time de expansão</h2>
      <p className="text-center text-sm text-white/65 mt-1 mb-4">
        {etapa === 1 ? "Tire suas dúvidas sobre investimento, operação e disponibilidade na sua cidade." : "Falta pouco: sobre a sua unidade."}
        <span className="text-white/45"> Etapa {etapa} de 2</span>
      </p>
      <div className="h-1 rounded-full bg-white/10 mb-5" aria-hidden="true">
        <div className={`h-1 rounded-full bg-secondary transition-all ${etapa === 1 ? "w-1/2" : "w-full"}`} />
      </div>

      {etapa === 1 ? (
        <div role="form" aria-label="Seus dados" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), avancar())} className="space-y-3">
          <label className="block">
            <span className="sr-only">Nome</span>
            <input className={campo} name="nome" autoComplete="name" placeholder="Nome completo" value={formData.nome} onChange={mudar("nome")} required />
          </label>
          <label className="block">
            <span className="sr-only">E-mail</span>
            <input className={campo} name="email" type="email" inputMode="email" autoComplete="email" placeholder="E-mail" value={formData.email} onChange={mudar("email")} required />
          </label>
          <label className="block">
            <span className="sr-only">WhatsApp com DDD</span>
            <input className={campo} name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="WhatsApp com DDD" value={formData.telefone} onChange={mudar("telefone")} required />
          </label>
          {erro && <p role="alert" className="text-sm text-secondary font-semibold">{erro}</p>}
          <button type="button" onClick={avancar} className="w-full h-14 rounded-lg bg-secondary text-[#0E0E0E] text-base font-extrabold uppercase tracking-wide hover:brightness-105 active:scale-[0.98] transition">
            Continuar
          </button>
        </div>
      ) : (
        <div role="form" aria-label="Sobre a sua unidade" onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT" && (e.preventDefault(), concluir())} className="space-y-5">
          <label className="block">
            <span className="block text-sm font-bold text-white mb-2">Em que cidade quer abrir a unidade?</span>
            <input className={campo} name="cidade" autoComplete="address-level2" placeholder="Ex.: Ribeirão Preto - SP" value={formData.cidade} onChange={mudar("cidade")} required />
          </label>
          <div>
            <span className="block text-sm font-bold text-white mb-2">Prazo para abrir</span>
            <Chips nome="Prazo para abrir" opcoes={PRAZOS} valor={formData.prazo} aoEscolher={(v) => setCampo("prazo", v)} />
          </div>
          <div>
            <span className="block text-sm font-bold text-white mb-2">Investimento disponível</span>
            <Chips nome="Investimento disponível" opcoes={CAPITAIS} valor={formData.capital} aoEscolher={(v) => setCampo("capital", v)} />
          </div>
          {erro && <p role="alert" className="text-sm text-secondary font-semibold">{erro}</p>}
          {erroEnvio && (
            <p role="alert" className="text-sm text-secondary font-semibold">
              Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.
            </p>
          )}
          <button type="button" onClick={concluir} disabled={isSubmitting} className="w-full h-14 rounded-lg bg-secondary text-[#0E0E0E] text-base font-extrabold uppercase tracking-wide hover:brightness-105 active:scale-[0.98] transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? "Enviando" : "Quero conversar com a expansão"}
          </button>
          <button type="button" onClick={() => setEtapa(1)} className="w-full text-xs text-white/50 underline">
            Voltar e corrigir meus dados
          </button>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-snug text-white/45 text-center">
        Ao enviar, você concorda que a Pizza Prime Franchising use seus dados para falar com você sobre a franquia,
        conforme a{" "}
        <Link to="/privacidade" className="underline hover:text-white/70">Política de Privacidade</Link>.
      </p>
    </div>
  );
};

export default LeadFormNegocio;
