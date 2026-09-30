import { motion } from "framer-motion";
import seloAbf from "@/assets/selo-abf-2024-2026.png";
import seloExame from "@/assets/selo-exame.png";
import seloTop25 from "@/assets/selo-top25.png";
import seloPegn2025 from "@/assets/selo-pegn.png";
import seloPegn2026 from "@/assets/selo-pegn-2026.png";

const badges = [
{ images: [{ src: seloAbf, alt: "Selos ABF de Excelência em Franchising de 2024, 2025 e 2026" }], text: "ABF Excelência em Franchising · 2024, 2025 e 2026" },
{ images: [{ src: seloTop25, alt: "Selo Top 25 do Franchising Brasileiro 2025" }], text: "Top 25 do Franchising Brasileiro · 2025" },
{ images: [{ src: seloExame, alt: "Prêmio Exame Negócios em Expansão" }], text: "Prêmio negócios em expansão - Categoria de 2 a 5 milhões de reais" },
{ images: [
  { src: seloPegn2025, alt: "Selo PEGN Melhores Franquias do Brasil 2025, cinco estrelas" },
  { src: seloPegn2026, alt: "Selo PEGN Melhores Franquias do Brasil 2026, cinco estrelas" }],
  text: "Melhores Franquias do Brasil · PEGN · 2025 e 2026 · 5 estrelas" }];


const SocialProofBar = () =>
  <section className="bg-brand-yellow py-10 border-y border-[#0E0E0E]/10">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#0E0E0E] mb-10">CONQUISTAS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-start justify-items-center">
        {badges.map((badge, i) =>
      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2 h-40 w-full max-w-[220px]">
              {badge.images.map((img) =>
            <img key={img.src} src={img.src} alt={img.alt} loading="lazy" decoding="async" className="max-h-full min-w-0 object-contain" />
            )}
            </div>
            <span className="font-bold text-[#0E0E0E] text-center text-lg md:text-xl leading-snug">{badge.text}</span>
          </motion.div>
      )}
      </div>
    </div>
  </section>;


export default SocialProofBar;
