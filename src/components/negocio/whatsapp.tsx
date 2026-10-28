import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

// Número da expansão (confirmado pelo Augusto em 09/10/2026). Cada LP tem mensagem própria
// e um código de origem no fim, para o comercial saber de qual página o contato veio e já
// começar a conversa no tom certo (pedido do Diego na reunião de 27/10).
const NUMERO = "5511988093216";
const MENSAGENS: Record<string, string> = {
  franquia: "Olá! Vi a matéria com Fernando Miranda e quero conhecer a franquia Pizza Prime. (origem: /franquia)",
  negocio: "Olá! Sou do mercado de alimentação e quero saber mais sobre a Pizza Prime. (origem: /negocio)",
  oportunidade: "Olá! Vi os números da Pizza Prime e quero saber mais sobre a franquia. (origem: /oportunidade)",
};
export const whatsappUrl = (lp = "negocio") =>
  `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAGENS[lp] ?? MENSAGENS.negocio)}`;

/** Evento do GTM para medir clique no WhatsApp (GA4 + Meta Contact, sem conversão do Google Ads). */
export const registrarCliqueWhatsApp = (local: string, lp = "negocio") => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "whatsapp_click", lp, local });
};

export const LinkWhatsApp = ({
  local,
  className,
  children,
  lp = "negocio",
}: {
  local: string;
  className?: string;
  children: ReactNode;
  lp?: string;
}) => (
  <a
    href={whatsappUrl(lp)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => registrarCliqueWhatsApp(local, lp)}
    className={className}
  >
    {children}
  </a>
);

/** Botão flutuante com popup curto antes de abrir o WhatsApp (desktop; no celular a barra fixa cumpre esse papel). */
export const WhatsAppFlutuante = ({ lp = "negocio" }: { lp?: string } = {}) => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-50">
      {aberto && (
        <div role="dialog" aria-label="Falar com o time de expansão" className="absolute bottom-20 right-0 w-72 rounded-2xl bg-white text-[#0E0E0E] shadow-2xl p-5">
          <button type="button" aria-label="Fechar" onClick={() => setAberto(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
          <p className="font-extrabold text-lg leading-tight mb-1">Fale com o time de expansão</p>
          <p className="text-sm text-gray-600 mb-4">Tire suas dúvidas sobre o modelo e o investimento direto no WhatsApp.</p>
          <LinkWhatsApp local="popup" lp={lp} className="flex items-center justify-center gap-2 h-12 rounded-lg bg-whatsapp text-white font-bold hover:bg-whatsapp-hover transition-colors">
            <img src={whatsappIcon} alt="" width={22} height={22} />
            Abrir WhatsApp
          </LinkWhatsApp>
        </div>
      )}
      <button
        type="button"
        aria-label={aberto ? "Fechar contato pelo WhatsApp" : "Falar pelo WhatsApp"}
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="w-16 h-16 rounded-full bg-whatsapp shadow-xl flex items-center justify-center hover:bg-whatsapp-hover transition-colors"
      >
        {aberto ? <X className="w-7 h-7 text-white" /> : <img src={whatsappIcon} alt="" width={34} height={34} />}
      </button>
    </div>
  );
};
