import logo from "@/assets/logo-pizza-prime.webp";
import franqueados960 from "@/assets/hero-franqueados-960.webp";
import franqueados560 from "@/assets/hero-franqueados-560.webp";
import MultiStepFranchiseForm from "./MultiStepFranchiseForm";

// Dobra 1 (out/2026): falar com o ICP (empresário que diversifica, profissional de alta
// renda) logo de cara. Headline aprovada na /negocio, investimento completo, prova da
// rede e o formulário já no topo (antes ele ficava depois dos depoimentos). Foto de
// franqueados reais no lugar da pizza: o assunto é o negócio, não o produto.
// Sem superlativo sem fonte e sem número de faturamento: é a página do anúncio do Google.
const provas = [
  { value: "+100", label: "unidades" },
  { value: "11", label: "estados + Paraguai" },
  { value: "3", label: "unidades em média por franqueado" },
  { value: "15 anos", label: "de marca, desde 2011" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#0E0E0E] text-white">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 60% 70% at 15% 0%, rgba(134,27,21,.55), transparent 70%)" }}
    />
    <div className="relative container mx-auto px-4 pt-6 pb-14 lg:pt-8 lg:pb-20">
      <div className="flex items-center justify-between gap-4">
        <img src={logo} alt="Pizza Prime" width={96} height={96} className="w-20 lg:w-24" />
        <p className="text-right text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-white/70">
          Franquia<span className="hidden sm:inline"> · uma das maiores redes brasileiras de pizzarias</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start mt-8 lg:mt-12">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08]">
            Um modelo validado para quem <span className="text-secondary">já pensa em investir</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            Operação padronizada, cozinha central e suporte da escolha do ponto à inauguração. Você conduz o negócio por
            processos e indicadores, sem precisar saber fazer pizza.
          </p>

          <div className="mt-7 inline-block rounded-2xl border-2 border-secondary bg-[#861B15] px-6 py-4">
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-[0.18em] text-secondary">Investimento no modelo Delivery</p>
            <p className="text-5xl md:text-6xl font-extrabold leading-none mt-1">R$ 249 mil</p>
            <p className="text-white/85 text-sm md:text-base font-bold mt-2">+ R$ 50 mil de capital de giro e estoque</p>
          </div>

          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 max-w-2xl">
            {provas.map((p) => (
              <div key={p.label} className="border-l-2 border-secondary pl-3">
                <dd className="text-3xl md:text-4xl font-extrabold leading-none">{p.value}</dd>
                <dt className="text-xs md:text-sm text-white/70 mt-1 leading-snug">{p.label}</dt>
              </div>
            ))}
          </dl>

          <figure className="mt-10 hidden lg:block max-w-2xl">
            <img
              src={franqueados960}
              srcSet={`${franqueados560} 560w, ${franqueados960} 960w`}
              sizes="(min-width: 1024px) 640px, 100vw"
              alt="Franqueados na inauguração da unidade Pizza Prime de Pouso Alegre (MG)"
              width={960}
              height={880}
              className="w-full h-72 object-cover object-[50%_88%] rounded-2xl shadow-2xl"
              {...{ fetchpriority: "high" }}
            />
            <figcaption className="mt-2 text-xs text-white/55">Franqueados na inauguração da unidade de Pouso Alegre (MG).</figcaption>
          </figure>
        </div>

        <div id="formulario" className="scroll-mt-4">
          <p className="text-center text-sm font-bold uppercase tracking-wider text-secondary mb-3">Fale com o time de expansão</p>
          <MultiStepFranchiseForm />
        </div>

        <figure className="lg:hidden">
          <img
            src={franqueados560}
            srcSet={`${franqueados560} 560w, ${franqueados960} 960w`}
            sizes="100vw"
            alt="Franqueados na inauguração da unidade Pizza Prime de Pouso Alegre (MG)"
            width={560}
            height={513}
            loading="lazy"
            className="w-full h-64 object-cover object-[50%_88%] rounded-2xl"
          />
          <figcaption className="mt-2 text-xs text-white/55">Franqueados na inauguração da unidade de Pouso Alegre (MG).</figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default HeroSection;
