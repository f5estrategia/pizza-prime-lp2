import { motion } from "framer-motion";
import { ClipboardCheck, Star, Split } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

// "3 motivos para investir", do material de expansão da rede (out/2026).
const motivos = [
  { icon: ClipboardCheck, title: "Modelo validado", text: "+100 unidades pelo Brasil e no Paraguai." },
  { icon: Star, title: "Força de marca", text: "Reconhecimento e alta demanda em todas as regiões." },
  { icon: Split, title: "Vantagem operacional", text: "Acesso a territórios exclusivos em cidades-chave." },
];

const ReasonsSection = () => {
  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="py-20 lg:py-28 bg-[#861B15] text-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold text-center mb-14"
        >
          3 motivos para <span className="text-secondary">investir</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/20 max-w-5xl mx-auto">
          {motivos.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:px-8"
            >
              <span className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center shadow-lg">
                <Icon className="w-9 h-9 text-[#861B15]" />
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold mt-5">{title}</h3>
              <p className="text-white/85 text-lg mt-2 leading-snug">{text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero conversar com a expansão</WhatsAppButton>
        </div>
      </div>
    </section>
  );
};

export default ReasonsSection;
