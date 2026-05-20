import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SocialProofBar from "@/components/SocialProofBar";
import PainSection from "@/components/PainSection";
import SolutionSection from "@/components/SolutionSection";
import FranchiseModels from "@/components/FranchiseModels";
import MarketNumbers from "@/components/MarketNumbers";
import DifferentialsSection from "@/components/DifferentialsSection";
import PartnersMediaSection from "@/components/PartnersMediaSection";
import FounderSection from "@/components/FounderSection";
import SocialProofSection from "@/components/SocialProofSection";
import FAQSection from "@/components/FAQSection";
import StepsSection from "@/components/StepsSection";
import CTAFormSection from "@/components/CTAFormSection";
import Footer from "@/components/Footer";

const Index = () => (
  <main>
    {/* Dobra 1 - Hero */}
    <HeroSection />
    {/* Dobra 2 - Case de Sucesso */}
    <TestimonialsSection />
    {/* Dobra - CTA Formulário */}
    <CTAFormSection />
    {/* Barra de Prova Social */}
    <SocialProofBar />
    {/* Dobra 3 - Dor */}
    <PainSection />
    {/* Dobra 4 - Solução */}
    <SolutionSection />
    {/* Dobra 5 - Modelos */}
    <FranchiseModels />
    {/* Dobra 6 - Números */}
    <MarketNumbers />
    {/* Dobra 7 - Diferenciais */}
    <DifferentialsSection />
    {/* Dobra 8 - Parceiros + Mídia */}
    <PartnersMediaSection />
    {/* Dobra 9 - Fundador */}
    <FounderSection />
    {/* Dobra 10 - Prova Social */}
    <SocialProofSection />
    {/* Dobra 11 - Objeções */}
    <FAQSection />
    {/* Dobra 12 - Passo a Passo */}
    <StepsSection />
    <Footer />
  </main>
);

export default Index;
