import { useEffect } from "react";
import { motion } from "framer-motion";
import logoPizzaPrime from "@/assets/logo-pizza-prime.png";
import WhatsAppButton from "@/components/WhatsAppButton";

const Obrigado = () => {
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'conversion_obrigado',
      page: '/obrigado'
    });
  }, []);

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/5511973291171?text=Olá! Acabei de preencher o formulário e gostaria de falar com um consultor.",
      "_blank",
    );
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
          Caso prefira falar conosco agora, clique no botão abaixo
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
