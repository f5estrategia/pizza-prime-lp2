import { motion } from "framer-motion";
import { ClipboardList, MapPin, GraduationCap, Rocket } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const steps = [
{ icon: ClipboardList, title: "Cadastro e análise de perfil", text: "Preencha o formulário e conheça os modelos. A equipe de expansão analisa o seu perfil e entra em contato." },
{ icon: MapPin, title: "Avaliação do ponto comercial", text: "Estudo de geomarketing e análise de concorrência para identificar a melhor região e validar a viabilidade." },
{ icon: GraduationCap, title: "Treinamento e implantação", text: "Você e sua equipe passam pelo centro de treinamento. Obras, equipamentos, fachada e marketing de inauguração são coordenados pela franqueadora com rede de fornecedores e arquitetos homologados." },
{ icon: Rocket, title: "Inauguração com acompanhamento", text: "A equipe da franqueadora está com você na abertura. Consultoria de campo in loco segue acompanhando os primeiros meses de operação." }];


const StepsSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-brand-dark">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Como funciona?<br />Do interesse à inauguração: um caminho claro.</h2>
          <p className="text-white/60">Cada etapa é acompanhada pela franqueadora. Você nunca estará sozinho no processo.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {steps.map((step, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="font-extrabold text-secondary text-lg mb-1">Passo {String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-extrabold text-xl mb-2 text-white">{step.title}</h3>
              <p className="text-sm text-white/60">{step.text}</p>
              {i < steps.length - 1 && <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-white/20" />}
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <WhatsAppButton onClick={scrollToForm}>Quero ser dono</WhatsAppButton>
        </div>
      </div>
    </section>);

};

export default StepsSection;