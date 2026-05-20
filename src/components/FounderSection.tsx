import { motion } from "framer-motion";
import founderImg from "@/assets/founder-gabriel.jpg";
import WhatsAppButton from "./WhatsAppButton";

const timelineData = [
{ year: "2001", text: "Gabriel Concon, aos 19 anos, compra a pizzaria La Traviata no bairro da Aclimação em São Paulo. Uma operação totalmente manual." },
{ year: "2011", text: "Nasce a Pizza Prime. Com 8 pizzarias de nomes diferentes, Gabriel decide unificar tudo sob uma única marca.", units: "8 lojas" },
{ year: "2012", text: "A rede entra no iFood, se tornando pioneira no delivery estruturado.", units: "12 lojas" },
{ year: "2019", text: "Início da franquia, com 26 lojas já em operação.", units: "26 lojas" },
{ year: "2020", text: "Desafios da pandemia. Inaugurações mantidas. O delivery sustenta o crescimento.", units: "39 lojas" },
{ year: "2021", text: "Crescimento acelerado no delivery.", units: "48 lojas" },
{ year: "2022", text: "Entendendo o novo normal.", units: "53 lojas" },
{ year: "2023", text: "Estabelecimento de parcerias estratégicas.", units: "60 lojas" },
{ year: "2024", text: "Integração e conexão. Selo ABF Excelência em Franchising.", units: "73 lojas" },
{ year: "2026", text: "Expansão nacional com foco no Smart Delivery.", units: "150+ unidades" }];


const FounderSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-brand-dark">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-2">A origem da Pizza Prime</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">De uma pizzaria de bairro para a<br />maior rede brasileira de pizzarias.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-1">
            <img alt="Gabriel Concon, Fundador da Pizza Prime" className="rounded-lg shadow-2xl w-full max-w-sm mx-auto" src="/lovable-uploads/05634cf5-a215-4132-ae72-45995ead2af3.jpg" />
          </motion.div>

          <div className="lg:col-span-2 max-w-2xl relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20" />
            {timelineData.map((item, i) =>
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative flex items-start mb-6 ml-10">
                <div className="absolute -left-10 w-3 h-3 bg-secondary rounded-full mt-2 z-10" style={{ transform: "translateX(5px)" }} />
                <div className="bg-white/10 p-4 rounded-lg border border-white/20 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-extrabold text-xl text-secondary">{item.year}</span>
                    {item.units && <span className="bg-secondary/20 text-secondary text-xs font-bold px-2 py-0.5 rounded">{item.units}</span>}
                  </div>
                  <p className="text-sm text-white/70">{item.text}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center border-l-4 border-secondary pl-6 italic text-white/70">
          "Produto sozinho não sustenta negócio. O que sustenta é método, gestão e a capacidade de replicar qualidade em escala."
          <footer className="mt-2 text-sm font-bold text-white not-italic">— Gabriel Concon, Fundador e CEO da Pizza Prime</footer>
        </motion.blockquote>

        <div className="text-center mt-10">
          <WhatsAppButton onClick={scrollToForm}>Quero conhecer mais</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default FounderSection;