import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle, Clock, ShieldCheck } from "lucide-react";
import img81 from "@/assets/pizza-prime-81.jpg";
import img86 from "@/assets/pizza-prime-fotos-86.jpg";
import pizzaTableBg from "@/assets/pizza-table-overhead.jpg";
import WhatsAppButton from "./WhatsAppButton";

const highlights = [
  { icon: CheckCircle, title: "+80 unidades", text: "Sistema testado e validado em operação real" },
  { icon: Clock, title: "15 anos de mercado", text: "Duas décadas de experiência e evolução contínua" },
  { icon: ShieldCheck, title: "30 unidades próprias", text: "Processos qualificados continuamente pela rede própria" },
];

const SolutionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50%", "50%"]);

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 relative overflow-hidden">
      <motion.div
        className="absolute inset-[-30%] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pizzaTableBg})`, y: bgY }}
      />
      <div className="absolute inset-0 bg-white/75" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0E0E0E] mb-4 leading-tight">
            E se você pudesse empreender com um modelo que{" "}
            <span className="text-[#861B15]">já funciona?</span>
          </h2>
          <p className="text-lg text-[#0E0E0E]/60 max-w-2xl mx-auto">
            Mais que uma promessa, somos um sistema testado em +80 unidades
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4">
            <img
              src={img86}
              alt="Pizzaiolo Pizza Prime preparando massa"
              className="rounded-xl shadow-2xl w-full h-72 object-cover" />
            <img
              src={img81}
              alt="Cliente Pizza Prime com caixas de pizza"
              className="rounded-xl shadow-2xl w-full h-72 object-cover mt-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6">
            <h3 className="text-2xl font-extrabold text-[#0E0E0E]">
              Negócio Validado
            </h3>
            <p className="text-[#0E0E0E]/70 leading-relaxed text-lg">
              Mais que uma promessa, somos um sistema testado
            </p>

            <div className="space-y-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#861B15]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-[#861B15]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0E0E0E]">{item.title}</p>
                    <p className="text-sm text-[#0E0E0E]/60">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>

        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>
            Quero uma Franquia
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
