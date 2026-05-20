import { motion } from "framer-motion";
import logo from "@/assets/logo-pizza-prime.png";
import heroBg from "@/assets/pizza-prime-300.png";
import WhatsAppButton from "./WhatsAppButton";

const stats = [
{ value: "80+", label: "Unidades em operação" },
{ value: "10", label: "Estados brasileiros" },
{ value: "R$ 3MM", label: "Faturamento médio anual/loja" },
{ value: "Desde 2020", label: "No mercado" }];


const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Pizza Prime" className="w-full h-full object-cover object-[70%_center] md:object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/80 via-[#0E0E0E]/60 to-[#0E0E0E]/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32 pb-72 lg:pb-48">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <img src={logo} alt="Pizza Prime" className="w-32 lg:w-40 mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-white lg:text-6xl">

            Invista na{" "}
            <span className="text-gradient-gold bg-secondary">maior rede brasileira</span>{" "}
            de pizzarias e tenha um negócio pronto para o sucesso.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 mb-6 max-w-3xl leading-relaxed font-extralight md:text-lg">

            Modelo testado em +80 unidades, suporte completo e
marca reconhecida nacionalmente.   

          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-secondary font-bold text-2xl mb-6">
            Investimento a partir de R$ 199 mil.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <WhatsAppButton onClick={scrollToForm}>Quero ser dono de uma franquia</WhatsAppButton>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="absolute bottom-0 left-0 right-0 bg-brand-yellow">

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) =>
            <div key={i}>
                <div className="text-3xl md:text-5xl font-extrabold text-[#0E0E0E]">{stat.value}</div>
                <div className="text-sm md:text-base text-[#0E0E0E]/80 mt-1 font-medium">{stat.label}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>);

};

export default HeroSection;