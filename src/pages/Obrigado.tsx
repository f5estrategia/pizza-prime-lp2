import { useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import logoPizzaPrime from "@/assets/logo-pizza-prime.png";

const INSTAGRAM_REDIRECT_URL =
  "https://www.instagram.com/pizza.prime.franquia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const Obrigado = () => {
  useEffect(() => {
    // 1. Dispara o evento de conversão (Google Ads / GA4 / Meta Pixel via GTM)
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'conversion_obrigado',
      page: '/obrigado'
    });

    // 2. Redireciona automaticamente para o Instagram após 5s
    //    (tempo suficiente para os tags de conversão completarem o request)
    const redirectTimer = setTimeout(() => {
      window.location.href = INSTAGRAM_REDIRECT_URL;
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, []);

  const handleInstagram = () => {
    window.location.href = INSTAGRAM_REDIRECT_URL;
  };

  return (
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

        <p className="text-primary-foreground/80 text-base sm:text-lg mb-8">
          Você será redirecionado para o nosso Instagram em instantes — ou clique no botão abaixo para ir agora.
        </p>

        <button
          onClick={handleInstagram}
          className="inline-flex items-center justify-center gap-3 font-bold text-lg sm:text-xl px-8 py-5 rounded-lg text-white bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90 transition-all active:scale-95 shadow-md"
        >
          <Instagram className="w-6 h-6" />
          Seguir no Instagram
        </button>

        <a
          href="https://lp.pizzaprime.com.br"
          className="block mt-6 text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-4 transition-colors text-base sm:text-lg"
        >
          Voltar para o site
        </a>
      </motion.div>
    </div>
  );
};

export default Obrigado;
