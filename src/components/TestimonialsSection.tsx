import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const testimonials = [
{
  name: "Gustavo Biazotto",
  location: "Macapá I, II e Belém (AP/PA)",
  text: "Estou há 6 anos como franqueado da Pizza Prime, e esse período foi marcado por um grande desenvolvimento pessoal e profissional. Estou na terceira unidade, e já visamos novas localidades para expansão no norte do Brasil."
},
{
  name: "Patricia Barati",
  location: "Poços de Caldas e Pouso Alegre (MG)",
  text: "A Pizza Prime proporcionou novos aprendizados e destacou nossas habilidades. Estamos prontos para enfrentar desafios e criar estratégias inovadoras. O sonho de ter o próprio negócio se tornou realidade graças à Pizza Prime, tornando-o nossa maior conquista profissional."
}];

const videos = [
{ id: "Y6h_Bxy9x2o", name: "Depoimento Franqueado 1" },
{ id: "Ca0rBt5Bc28", name: "Depoimento Franqueado 2" }];


const TestimonialsSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const prev = () => setCurrentVideo((c) => c === 0 ? videos.length - 1 : c - 1);
  const next = () => setCurrentVideo((c) => c === videos.length - 1 ? 0 : c + 1);

  return (
    <section className="py-20 lg:py-28 bg-brand-white">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Case de Sucesso</p>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-foreground">Nossos franqueados <br />confiam na nossa marca</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto mb-12">
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {videos.map((v, i) =>
            <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy" />
              
              </div>
            )}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideo}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}>
                
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${videos[currentVideo].id}`}
                    title={videos[currentVideo].name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy" />
                  
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={prev} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {videos.map((_, i) =>
                <button key={i} onClick={() => setCurrentVideo(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentVideo ? 'bg-primary' : 'bg-primary/30'}`} />
                )}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        























        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero uma Franquia</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;