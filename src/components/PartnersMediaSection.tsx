import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import mediaForbes from "@/assets/media-forbes.png";
import mediaPegn from "@/assets/media-pegn.png";
import mediaExame from "@/assets/media-exame.png";
import logoIfood from "@/assets/logo-ifood.png";
import logo99food from "@/assets/logo-99food.png";
import logoAmbev from "@/assets/logo-ambev.png";
import logoBrf from "@/assets/logo-brf.png";
import logoLeprino from "@/assets/logo-leprino.svg";
import logoZedelivery from "@/assets/logo-zedelivery.svg";
import logoStone from "@/assets/logo-stone.png";
import logoAzul from "@/assets/logo-azul.png";

const partners = [
{ name: "iFood", logo: logoIfood, desc: "Presença entre os top 3 maiores faturamentos da categoria pizzarias na plataforma, ampliando visibilidade e demanda recorrente." },
{ name: "99Food", logo: logo99food, desc: "Condições comerciais exclusivas para Franqueados Pizza Prime, alavanca de aquisição de pedidos e diversificação de canais." },
{ name: "Ambev", logo: logoAmbev, desc: "Parceria estratégica com condições comerciais diferenciadas, garantindo competitividade em custos e padronização." },
{ name: "BRF / Sadia", logo: logoBrf, desc: "Fornecimento por um dos maiores players do setor alimentício, assegurando qualidade e escala." },
{ name: "Leprino", logo: logoLeprino, desc: "Parceria com o maior produtor de queijos do mundo, elevando o padrão de qualidade do produto final." },
{ name: "Zé Delivery", logo: logoZedelivery, desc: "Canal adicional de vendas que amplia o alcance e gera novas oportunidades de receita incremental." },
{ name: "Stone", logo: logoStone, desc: "Soluções de pagamento robustas e integradas, trazendo eficiência operacional e segurança nas transações." },
{ name: "Azul", logo: logoAzul, desc: "Conexão com uma das marcas mais respeitadas do Brasil, fortalecendo o branding da Prime." }];


const mediaItems = [
{ source: "Forbes", title: "A história do empresário que transformou uma pizzaria de bairro em uma das maiores redes de franquia de pizza do país", image: mediaForbes },
{ source: "PEGN (Pequenas Empresas & Grandes Negócios)", title: "Ele comprou uma pizzaria do bairro e hoje fatura R$ 48 milhões com franquias", image: mediaPegn },
{ source: "Revista Exame", title: "Com R$ 20 mil emprestados do pai, ele criou um negócio de R$ 180 milhões com pizza", image: mediaExame }];


const MediaCard = ({ item, i }: { item: typeof mediaItems[number]; i: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-xl overflow-hidden shadow-xl border border-border hover:shadow-2xl transition-shadow">
    <img src={item.image} alt={`Matéria ${item.source}`} className="w-full h-[400px] object-contain bg-white p-4" />
    <div className="p-6">
      <p className="text-primary font-bold text-sm uppercase mb-2">{item.source}</p>
    </div>
  </motion.div>
);

const PartnersMediaSection = () => {
  const [currentMedia, setCurrentMedia] = useState(0);

  const prev = () => setCurrentMedia((c) => (c === 0 ? mediaItems.length - 1 : c - 1));
  const next = () => setCurrentMedia((c) => (c === mediaItems.length - 1 ? 0 : c + 1));

  return (
    <>
      <section className="py-20 lg:py-28 bg-brand-red overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-2">Quem caminha com a Pizza Prime</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Parceiros que validam.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {partners.map((p, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:border-secondary/50 transition-colors">
                <img src={p.logo} alt={p.name} className="h-10 object-contain mb-3" />
                
                <p className="text-xs text-white/70 leading-relaxed">{p.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Pizza Prime na mídia</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">Quem fala da gente.</h2>
          </motion.div>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {mediaItems.map((item, i) => <MediaCard key={i} item={item} i={i} />)}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMedia}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <MediaCard item={mediaItems[currentMedia]} i={0} />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prev} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {mediaItems.map((_, i) => (
                  <button key={i} onClick={() => setCurrentMedia(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentMedia ? 'bg-primary' : 'bg-primary/30'}`} />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersMediaSection;