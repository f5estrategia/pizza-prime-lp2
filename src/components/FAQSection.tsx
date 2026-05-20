import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Já tem muita pizzaria na minha cidade. Ainda vale a pena?",
    a: "O Brasil possui mais de 160 mil pizzarias em operação, porém a grande maioria atua de forma independente, sem força de marca, sem padronização e com baixa eficiência operacional.\n\nÉ justamente nesse cenário que redes estruturadas ganham vantagem competitiva. A Pizza Prime não compete apenas por preço.\n\nCompetimos por marca forte, experiência do cliente e eficiência operacional comprovada.\n\nHoje, a rede está entre os 3 maiores faturamentos da categoria pizzarias no iFood, demonstrando, na prática, a força do nosso modelo.\n\nEm um mercado competitivo, quem opera com método, marca e escala larga na frente.",
  },
  {
    q: "Não tenho experiência com alimentação. Vou dar conta?",
    a: "A Pizza Prime foi desenhada exatamente para isso: uma operação simplificada, com insumos porcionados e baixa dependência de mão de obra altamente especializada.\n\nVocê recebe treinamento completo, capacitação para sua equipe, consultoria de campo presencial e a distância e suporte técnico e de gestão contínuo para conduzir a operação com segurança.\n\nHoje, a maioria dos nossos franqueados iniciou sem experiência prévia no setor de alimentação e muitos já operam mais de uma unidade, impulsionados pelo suporte estruturado da marca e pela padronização do modelo.\n\nCom método, suporte e um modelo validado, a experiência prévia deixa de ser barreira e passa a ser construída dentro da própria rede.",
  },
  {
    q: "Como avaliar a segurança e o potencial de retorno deste investimento?",
    a: "O modelo Smart Delivery da Pizza Prime foi desenvolvido com base em processos padronizados, inteligência operacional e aprendizado acumulado em diferentes mercados, permitindo uma operação enxuta, replicável e escalável.\n\nO investimento inicial parte de R$ 199 mil, com payback estimado entre 18 e 24 meses. A operação apresenta lucratividade média entre 12% e 16% sobre o faturamento, com break-even projetado entre 3 e 6 meses, conforme a maturação da unidade.\n\nMais do que projeções, o franqueado conta com:\n\n• Modelo operacional simplificado\n• Gestão orientada por indicadores\n• Estratégia comercial validada em rede\n• Acompanhamento contínuo da franqueadora",
  },
  {
    q: "Não tenho tempo para ficar o dia todo na loja.",
    a: "A operação é padronizada, com processos claros e gestão por indicadores. Há franqueados que já operam 3 unidades simultaneamente, o que só é possível quando o sistema funciona sem depender 100% do dono no balcão.",
  },
  {
    q: "Como funciona o suporte depois que eu abro?",
    a: "Franquia 360°: estudo de geomarketing, análise de concorrência, treinamento inicial e contínuo, consultoria de campo presencial, agência de marketing in house especializada, assessoria nutricional e suporte de tecnologia em tempo real.\n\nO suporte começa na inauguração e continua enquanto a parceria durar.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Tudo o que você precisa saber antes de tomar essa decisão.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-primary border border-primary rounded-lg overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-sm pr-4 text-primary-foreground">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-primary-foreground shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="px-5 pb-5 text-sm text-primary-foreground/80 leading-relaxed whitespace-pre-line">{faq.a}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
