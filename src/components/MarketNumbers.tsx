import { motion } from "framer-motion";
import { Pizza, TrendingUp, Globe, Truck } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const numbers = [
{ icon: Globe, value: "2º", label: "Maior consumidor de pizza do mundo" },
{ icon: Pizza, value: "160 mil+", label: "Pizzarias no Brasil" },
{ icon: TrendingUp, value: "204 mi", label: "Pizzas vendidas por mês" },
{ icon: Truck, value: "US$ 21 bi", label: "Receita delivery em 2025" }];


const MarketNumbers = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-brand-yellow">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#0E0E0E]">Os números de mercado</h2>
          <p className="text-[#0E0E0E]/70 max-w-3xl mx-auto mb-4">
            <span className="font-bold text-primary">O Brasil é o 2º maior consumidor de pizza do mundo.</span> São mais de 160 mil pizzarias e mais de 204 milhões de pizzas vendidas por mês no país. Só no primeiro semestre de 2025, foram 54 milhões de pedidos de pizza via delivery no iFood.
          </p>
          <p className="text-[#0E0E0E]/70 max-w-3xl mx-auto">
            O setor de delivery deve ultrapassar US$ 21 bilhões em receita em 2025, com projeção de crescimento de 7% ao ano. A Pizza Prime ocupa uma posição única nesse cenário: é a maior rede brasileira de pizzarias, com capital 100% nacional, presente em 11 estados, com mais de 100 unidades no Brasil e na América Latina.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10">
          {numbers.map((n, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center bg-[#0E0E0E] p-4 md:p-8 rounded-xl">
              <n.icon className="w-7 h-7 md:w-10 md:h-10 text-secondary mx-auto mb-2 md:mb-4" />
              <div className="text-xl md:text-4xl font-extrabold text-white">{n.value}</div>
              <p className="text-xs md:text-sm text-white/70 mt-1 md:mt-2">{n.label}</p>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-[#0E0E0E]/50 mb-8">Fontes: Abrasel, iFood, InfoMoney</p>

        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero uma Franquia</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default MarketNumbers;