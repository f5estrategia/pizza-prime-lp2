import { motion } from "framer-motion";
import { MapPin, GraduationCap, BarChart3, Megaphone, Utensils, HeadphonesIcon, ShieldCheck, Briefcase, Leaf, Building2, ShoppingCart, Lightbulb, Package, Bike } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import saltoPhoto from "@/assets/salto.jpg";

const supportSteps = [
{ icon: MapPin, title: "Avaliação e aprovação estratégica do ponto", text: "Estudos avançados de geomarketing e inteligência de mercado para identificar regiões com maior potencial de demanda, fluxo e rentabilidade." },
{ icon: BarChart3, title: "Estudo de concorrência e mercado local", text: "Mapeamos o cenário competitivo da sua região para orientar o posicionamento da unidade e maximizar a vantagem competitiva." },
{ icon: Building2, title: "Cozinha central e marcas homologadas", text: "Cozinha central fornece todos os insumos porcionados trazendo leveza operacional, padronização, processo e qualidade para a rede de lojas." },
{ icon: GraduationCap, title: "Treinamento completo e estruturado", text: "Programa de capacitação inicial e contínua com metodologia própria e centro de treinamento dedicado." },
{ icon: HeadphonesIcon, title: "Consultoria de campo in loco", text: "Acompanhamento técnico e de gestão presencial, com foco em indicadores, eficiência operacional e crescimento sustentável." }];


const advantages = [
{ icon: ShieldCheck, title: "Condições comerciais pela força da rede", text: "Poder de negociação de uma marca consolidada para acessar melhores condições junto a fornecedores estratégicos." },
{ icon: Briefcase, title: "Suporte contínuo em gestão e planejamento", text: "Acompanhamento estruturado com foco em performance, indicadores-chave e planos de ação personalizados." },
{ icon: Megaphone, title: "Agência de marketing in house", text: "Equipe dedicada responsável por campanhas nacionais, apoio ao marketing local e estratégias para geração recorrente de demanda." },
{ icon: Building2, title: "Parcerias bancárias facilitadas", text: "Relacionamento com BB Franquias e Bradesco Franquias, ampliando acesso a linhas de crédito e condições diferenciadas." },
{ icon: Leaf, title: "Assessoria nutricional e inovação de cardápio", text: "Equipe especializada na padronização técnica, atualização do portfólio e inovações alinhadas às tendências do mercado." }];


const pillars = [
{ icon: ShoppingCart, title: "Atendimento", text: "Loja física, app próprio, Marketplaces (iFood, 99Food), WhatsApp" },
{ icon: Lightbulb, title: "Inovação", text: "DNA em tecnologia, com as mais modernas soluções do mercado" },
{ icon: Package, title: "Produção", text: "Operação simplificada, insumos porcionados, padrões rigorosos de qualidade" },
{ icon: Bike, title: "Entrega", text: "Pioneiros no delivery, com mais de 15 anos de experiência no segmento" }];


const DifferentialsSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F0F0F0]">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Franquia 360°</p>
          <h2 className="md:text-5xl font-extrabold text-primary mt-4 mb-4 text-2xl">
            Operação simplificada.<br />Performance consistente.
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Esqueça o improviso. Entregamos um sistema completo, da produção ao marketing, desenhado para sustentar o crescimento da sua unidade com segurança e previsibilidade.
          </p>
        </motion.div>

        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-extrabold text-center mb-2 md:mb-8 text-primary text-base md:text-xl">
          Veja como apoiamos você em cada etapa
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-20 max-w-5xl mx-auto text-base">
          {supportSteps.map((f, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-lg border border-border hover:border-primary/30 transition-colors group w-full sm:w-[calc(33.333%-1rem)]">
              <f.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-extrabold text-lg mb-2 text-foreground">{f.title}</h4>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          )}
        </div>

        <img src={saltoPhoto} alt="Unidade Pizza Prime Salto" className="mx-auto mb-8 rounded-xl max-w-3xl w-full object-cover" />

        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:text-3xl font-extrabold text-center mb-8 text-foreground text-xl">
          Vantagens reais que impactam diretamente o resultado da sua unidade.
        </motion.h3>

        <div className="flex flex-col gap-4 mb-16 max-w-3xl mx-auto">
          {advantages.map((a, i) =>
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-5 bg-white p-5 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow group">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <a.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg mb-1 text-foreground">{a.title}</h4>
                <p className="text-sm text-muted-foreground">{a.text}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {pillars.map((p, i) =>
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center bg-brand-yellow p-6 rounded-lg">
              <p.icon className="w-8 h-8 text-[#0E0E0E] mx-auto mb-2" />
              <h4 className="font-extrabold text-xl text-[#0E0E0E] mb-2">{p.title}</h4>
              <p className="text-xs text-[#0E0E0E]/70">{p.text}</p>
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero minha unidade</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default DifferentialsSection;