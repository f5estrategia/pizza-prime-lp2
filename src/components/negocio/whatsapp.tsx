import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

// Número da expansão (confirmado pelo Augusto em 09/10/2026). A mensagem própria
// separa no WhatsApp quem veio desta LP do contato orgânico (pedido do Diego).
const NUMERO = "5511988093216";
const MENSAGEM = "Olá! Vi a matéria com Fernando Miranda e quero conhecer a franquia Pizza Prime.";
export const WHATSAPP_URL = `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAGEM)}`;

/** Evento do GTM para medir clique no WhatsApp (GA4 + Meta Contact, sem conversão do Google Ads). */
export const registrarCliqueWhatsApp = (local: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "whatsapp_click", lp: "negocio", local });
};

export const LinkWhatsApp = ({
  local,
  className,
  children,
}: {
  local: string;
  className?: string;
  children: ReactNode;
}) => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => registrarCliqueWhatsApp(local)}
    className={className}
  >
    {children}
  </a>
);

/** Botão flutuante com popup curto antes de abrir o WhatsApp (desktop; no celular a barra fixa cumpre esse papel). */
export const WhatsAppFlutuante = () => {
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
          <LinkWhatsApp local="popup" className="flex items-center justify-center gap-2 h-12 rounded-lg bg-whatsapp text-white font-bold hover:bg-whatsapp-hover transition-colors">
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
