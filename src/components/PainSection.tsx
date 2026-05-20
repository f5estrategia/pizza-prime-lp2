import { motion } from "framer-motion";
import { AlertTriangle, Users, Clock, TrendingDown, ChevronDown } from "lucide-react";

const allCards = [
{ icon: AlertTriangle, subtitle: '"Tenho medo de investir errado."', text: "Empreender sem método costuma custar mais caro do que investir em um modelo validado. O risco real não é agir, é agir sem estrutura." },
{ icon: TrendingDown, title: "Risco sem modelo", text: "Negócios independentes têm taxa de mortalidade muito superior a franquias estruturadas." },
{ icon: Clock, title: "Tempo perdido", text: "Sem processo, cada erro vira meses de atraso. Com método, você encurta o caminho." },
{ icon: Users, title: "Concorrência", text: "Em geral, as pizzarias tradicionais da cidade (sem ser franquia) competem por preços e promoções, o que não sustenta o negócio e favorece o insucesso. A Pizza Prime oferece aos seus franqueados diferenciais de uma marca forte e estratégias de recorrência." },
{ icon: AlertTriangle, title: "Sem previsibilidade", text: "Sem o método certo e sem números reais, qualquer investimento parece arriscado e isso gera insegurança." }];



const PainSection = () =>
<section className="py-20 lg:py-28 bg-[#861B15]">
    <div className="container mx-auto px-4">
      <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto mb-6">

        <h2 className="text-4xl md:text-6xl font-extrabold text-[#FDC80C] uppercase tracking-widest mb-3">POR QUE ESCOLHER A PIZZA PRIME?</h2>
        


        <p className="text-lg text-white/80 mb-4 text-center font-extralight">Não é falta de vontade. É falta de um caminho claro. E quando o 
caminho não existe, o medo ocupa o espaço da decisão.


      </p>
        <p className="text-[#FDC80C] font-bold text-lg mt-10">Você se reconhece em alguma dessas situações?</p>
        <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-2">
          <ChevronDown className="w-8 h-8 text-[#FDC80C] mx-auto" />
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6">
        {allCards.map((card, i) =>
      <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
      className="bg-white/10 p-8 rounded-lg border border-white/20 hover:border-[#FDC80C]/50 transition-colors flex flex-col min-h-[220px] w-full md:w-[calc(33.333%-1rem)]">
            <card.icon className="w-10 h-10 text-[#FDC80C] mb-4" />
            {card.title && <h3 className="text-xl font-extrabold mb-1 text-white">{card.title}</h3>}
            {card.subtitle && <p className="font-bold mb-3 text-primary-foreground text-lg">{card.subtitle}</p>}
            <p className="text-white/70 text-sm">{card.text}</p>
          </motion.div>
      )}
      </div>
    </div>
  </section>;


export default PainSection;