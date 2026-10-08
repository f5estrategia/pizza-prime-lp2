import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logoPizzaPrime from "@/assets/logo-pizza-prime.webp";

const INSTAGRAM_URL = "https://www.instagram.com/pizza.prime.franquia";

// O formulário não navega mais para cá: a confirmação aparece no próprio form
// e a conversão sai no envio (ver MultiStepFranchiseForm). A rota fica só para
// links antigos, sem evento (dispararia conversão falsa) e sem redirecionamento
// automático (o Google Ads reprova destino que redireciona sozinho).
const Obrigado = () => (
  <div className="min-h-screen bg-brand-red flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-xl mx-auto"
    >
      <img src={logoPizzaPrime} alt="Pizza Prime" className="h-20 sm:h-28 mx-auto mb-10" />

      <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-foreground mb-4">Obrigado pelo contato!</h1>

      <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8">
        Recebemos seus dados e em breve nosso time entrará em contato.
      </p>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 font-bold text-lg sm:text-xl px-8 py-5 rounded-lg text-white bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90 transition-all active:scale-95 shadow-md"
      >
        <Instagram className="w-6 h-6" />
        Seguir no Instagram
      </a>

      {/* Rota interna: o basename do Router segue o base do build (/ na Vercel,
          /pizza-prime-lp2/ no GitHub Pages), entao o link acompanha o dominio. */}
      <Link
        to="/"
        className="block mt-6 text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-4 transition-colors text-base sm:text-lg"
      >
        Voltar para o site
      </Link>
    </motion.div>
  </div>
);

export default Obrigado;
