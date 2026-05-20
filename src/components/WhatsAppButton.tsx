import whatsappIcon from "@/assets/whatsapp-icon.png";

interface WhatsAppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

const WhatsAppButton = ({ children, onClick, className = "", type = "button" }: WhatsAppButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className={`bg-whatsapp text-whatsapp-foreground font-bold px-6 py-4 rounded-lg hover:bg-whatsapp-hover transition-all text-base sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 overflow-hidden animate-wiggle ${className}`}
  >
    <img src={whatsappIcon} alt="" className="w-6 h-6" />
    {children}
  </button>
);

export default WhatsAppButton;
