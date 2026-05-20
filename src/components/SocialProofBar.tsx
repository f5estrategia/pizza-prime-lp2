import { motion } from "framer-motion";
import seloAbf from "@/assets/selo-abf.png";
import seloExame from "@/assets/selo-exame.png";
import seloTop25 from "@/assets/selo-top25.png";
import seloPegn from "@/assets/selo-pegn.png";

const badges = [
{ image: seloAbf, text: "Selo ABF Excelência em Franchising 2024 e 2025" },
{ image: seloTop25, text: "Top 3 faturamento no iFood categoria pizzarias" },
{ image: seloExame, text: "Prêmio negócios em expansão - Categoria de 2 a 5 milhões de reais" },
{ image: seloPegn, text: "95% dos franqueados satisfeitos" }];


const SocialProofBar = () =>
  <section className="bg-brand-yellow py-10 border-y border-[#0E0E0E]/10">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#0E0E0E] mb-10">CONQUISTAS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
        {badges.map((badge, i) =>
      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-1">
            <img src={badge.image} alt={badge.text} className={`object-contain ${i === 0 ? 'w-40 h-40' : 'w-28 h-28'}`} />
            <span className="font-bold text-[#0E0E0E] text-center text-xl">{badge.text}</span>
          </motion.div>
      )}
      </div>
    </div>
  </section>;


export default SocialProofBar;