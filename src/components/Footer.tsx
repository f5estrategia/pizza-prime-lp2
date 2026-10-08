import { Link } from "react-router-dom";
import logo from "@/assets/logo-pizza-prime.webp";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-brand-dark py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logo} alt="Pizza Prime" className="w-20" />
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-white/70">
          <a href="tel:+5511988093216" className="flex items-center gap-2 hover:text-secondary transition-colors">
            <Phone className="w-4 h-4" /> (11) 98809-3216
          </a>
          <a
            href="mailto:expansao@pizzaprime.com.br"
            className="flex items-center gap-2 hover:text-secondary transition-colors"
          >
            <Mail className="w-4 h-4" /> expansao@pizzaprime.com.br
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Av. Conceição, 2940 - Cidade Nova II, Indaiatuba - SP, CEP 13334-345
          </span>
        </div>
      </div>
      <div className="text-center text-xs text-white/50 mt-8 space-y-2">
        <p>PIZZA PRIME FRANCHISING LTDA · CNPJ 31.906.844/0001-20</p>
        <p>
          © 2026 Pizza Prime Franchising. Todos os direitos reservados. ·{" "}
          <Link to="/privacidade" className="underline hover:text-white/80">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
