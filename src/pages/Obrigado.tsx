import { useEffect } from "react";
import { motion } from "framer-motion";
import logoPizzaPrime from "@/assets/logo-pizza-prime.png";
import WhatsAppButton from "@/components/WhatsAppButton";

const WHATSAPP_REDIRECT_URL =
  "https://api.whatsapp.com/send/?phone=5511973291171&text=Ol%C3%A1%21+Acabei+de+preencher+o+formul%C3%A1rio+e+gostaria+de+falar+com+um+consultor.&type=phone_number&app_absent=0";

const Obrigado = () => {
  useEffect(() => {
    // 1. Dispara o evento de conversão (Google Ads / GA4 / Meta Pixel via GTM)
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'conversion_obrigado',
      page: '/obrigado'
    });

    // 2. Redireciona automaticamente para o WhatsApp após 3s
    //    (tempo suficiente para os tags de conversão completarem o request)
    const redirectTimer = setTimeout(() => {
      window.location.href = WHATSAPP_REDIRECT_URL;
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, []);

  const handleWhatsApp = () => {
    window.location.href = WHATSAPP_REDIRECT_URL;
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

        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-foreground mb-4">Parabéns!</h1>

        <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8">Em breve nosso time entrará em contato</p>

        <p className="text-primary-foreground/80 text-base sm:text-lg mb-8">
          Você será direcionado para o WhatsApp em instantes — ou clique no botão abaixo para ir agora.
        </p>

        <WhatsAppButton onClick={handleWhatsApp} className="text-lg sm:text-xl px-8 py-5">
          Chamar no WhatsApp
        </WhatsAppButton>

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
