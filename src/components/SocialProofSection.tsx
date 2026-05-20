import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import seloAbf from "@/assets/selo-abf.png";
import WhatsAppButton from "./WhatsAppButton";
import pizzaTableBg from "@/assets/pizza-table-overhead.jpg";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";

const testimonials = [
{
  name: "Gustavo Biazotto",
  location: "Macapá ",
  text: "Estou há 6 anos como franqueado da Pizza Prime, e esse período foi marcado por um grande desenvolvimento pessoal e profissional. Estou na terceira unidade, e já visamos novas localidades para expansão no norte do Brasil."
},
{
  name: "Patricia Barati",
  location: "Poços de Caldas e Pouso Alegre (MG)",
  text: "A Pizza Prime proporcionou novos aprendizados e destacou nossas habilidades. Estamos prontos para enfrentar desafios e criar estratégias inovadoras. O sonho de ter o próprio negócio se tornou realidade graças à Pizza Prime, tornando-o nossa maior conquista profissional."
}];


const SocialProofSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 relative" style={{ backgroundImage: `url(${pizzaTableBg})`, backgroundAttachment: 'fixed', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0" style={{ backgroundColor: 'hsla(47, 98%, 52%, 0.9)' }} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#0E0E0E]">Quem já é franqueado, comprova.

          </h2>
        </motion.div>

        




        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-12">
          {[{ value: "95%", label: "dos franqueados satisfeitos com a franqueadora" }, { value: "94%", label: "indicariam a Pizza Prime para outros investidores" },
          { value: "70%+", label: "dos franqueados tem mais de uma unidade" }].
          map((stat, i) =>
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0E0E0E] rounded-lg p-6">
              <div className="text-4xl font-extrabold text-secondary">{stat.value}</div>
              <p className="text-sm text-white/80">{stat.label}</p>
            </motion.div>
          )}
        </div>

        <div className="max-w-2xl mx-auto mb-10 px-12">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((t, i) =>
              <CarouselItem key={i}>
                    <div className="bg-primary p-8 rounded-lg shadow-md">
                    <div>
                      <Quote className="w-6 h-6 text-brand-yellow/50 mb-3" />
                      <p className="text-sm text-white/90 mb-4 italic">"{t.text}"</p>
                      <p className="font-bold text-sm text-white">{t.name}</p>
                      <p className="text-xs text-white/70">{t.location}</p>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero uma Franquia</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default SocialProofSection;