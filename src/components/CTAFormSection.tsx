import { motion } from "framer-motion";
import logo from "@/assets/logo-pizza-prime.png";
import MultiStepFranchiseForm from "./MultiStepFranchiseForm";

const CTAFormSection = () => {
  return (
    <section id="formulario" className="py-20 lg:py-28 bg-brand-red">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <img src={logo} alt="Pizza Prime" className="w-24 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              O momento certo para começar é quando o modelo certo já existe.
            </h2>
            <p className="text-white/80">Preencha o formulário e receba o material completo sobre a franquia Pizza Prime.</p>
          </motion.div>

          <MultiStepFranchiseForm />
        </div>
      </div>
    </section>
  );
};

export default CTAFormSection;
