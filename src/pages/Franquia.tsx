import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Award, TrendingUp, ChefHat, Headset, GraduationCap, Workflow, Megaphone, MonitorSmartphone,
  Rocket, ChartNoAxesCombined, ClipboardCheck, Check, CircleCheck,
} from "lucide-react";
import Footer from "@/components/Footer";
import LeadFormNegocio from "@/components/LeadFormNegocio";
import VideoDepoimento, { embedDrive, type Video } from "@/components/negocio/VideoDepoimento";
import { LinkWhatsApp, WhatsAppFlutuante } from "@/components/negocio/whatsapp";

import logo from "@/assets/logo-pizza-prime.webp";
import fatia1000 from "@/assets/negocio/hero-franquia-1000.webp";
import fatia500 from "@/assets/negocio/hero-franquia-500.webp";
import parceiros from "@/assets/negocio/parceiros-folheto.webp";
import inauguracao from "@/assets/negocio/inauguracao-pouso-alegre.webp";
import convencao from "@/assets/negocio/convencao-rede.webp";
import capaJoao from "@/assets/negocio/video-joao.webp";
import capaMariane from "@/assets/negocio/video-mariane.webp";
import capaViniciusVanessa from "@/assets/negocio/video-vinicius-vanessa.webp";
import seloAbf from "@/assets/selo-abf-2024-2026.webp";
import seloPegn2025 from "@/assets/selo-pegn.webp";
import seloPegn2026 from "@/assets/selo-pegn-2026.webp";
import seloExame from "@/assets/selo-exame.webp";
import seloGptw from "@/assets/negocio/selo-gptw-2026.webp";
import seloTop25 from "@/assets/selo-top25.webp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

// Terceira versão da LP da matéria (/franquia), pedida pelo Diego em 14/10/2026: segue
// o folheto da Feira de Curitiba, para quem quer comprar uma franquia sem ser dono de
// restaurante (primeiro negócio, diversificação, negócio conduzido por processo).
// A /oportunidade (folheto Pizza Masters, donos de restaurante) e a /negocio ficam
// guardadas como estão. Decisões do Augusto: R$ 249 mil + R$ 50 mil no topo (o
// folheto destaca o Smart de R$ 199 mil) e 11 estados (o folheto diz 10).

const LP = "franquia";
const VERMELHO = "#9b1b16";
const LARANJA = "#f4a21b";
const PAPEL = "#fbf3e3";

const irParaFormulario = () =>
  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });

const BotaoPrincipal = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <button
    type="button"
    onClick={irParaFormulario}
    className={`h-14 px-7 rounded-lg bg-secondary text-[#0E0E0E] font-extrabold uppercase tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition ${className}`}
  >
    {children}
  </button>
);

/** Filete duplo vermelho, como o cabeçalho do jornal do folheto. */
const Filete = ({ className = "" }: { className?: string }) => (
  <div aria-hidden="true" className={`border-t-2 border-b border-[#9b1b16] h-1 ${className}`} />
);

// ------------------------------------------------------------------ dados

const MERCADO = [
  { titulo: "+10%", texto: "é quanto o setor cresce por ano", fonte: "Apubra" },
  { titulo: "2º", texto: "o Brasil é o segundo maior consumidor de pizza do mundo", fonte: "Senac" },
  { titulo: "R$ 495 bi", texto: "movimentados pelo food service em 2025", fonte: "Abrasel" },
  { titulo: "195", texto: "pizzas pedidas por minuto só no iFood", fonte: "Forbes" },
];

const SEM_MEDO = [
  { medo: "Não entendo de pizza", resposta: "Operação padronizada e insumos porcionados." },
  { medo: "Não tenho experiência em gestão", resposta: "Metodologia de ensino e modelo de negócio comprovado." },
  { medo: "Tenho medo de empreender sozinho", resposta: "Acompanhamento em cada etapa: da escolha do ponto à operação do dia a dia." },
];

const ECOSSISTEMA = [
  { icone: Award, titulo: "Marca forte", texto: "Força e reconhecimento de rede nacional." },
  { icone: TrendingUp, titulo: "Poder de escala", texto: "A força da rede nas negociações. Melhores condições para operar." },
  { icone: ChefHat, titulo: "Cozinha central", texto: "Insumos porcionados. Mais agilidade e menos desperdício." },
  { icone: Headset, titulo: "Suporte completo", texto: "Você nunca está sozinho. Suporte da implantação ao crescimento." },
  { icone: GraduationCap, titulo: "Treinamento total", texto: "Capacitação com a metodologia Pizza Prime." },
  { icone: Workflow, titulo: "Operação eficiente", texto: "Processos padronizados que agilizam o dia a dia, do pedido ao balcão." },
  { icone: Megaphone, titulo: "Marketing de ponta a ponta", texto: "Estratégias e campanhas para gerar demanda." },
  { icone: MonitorSmartphone, titulo: "Multicanais", texto: "App próprio, e-commerce e marketplaces. Mais possibilidades de venda." },
];

const PARA_QUEM = [
  { icone: Rocket, rotulo: "Primeiro negócio", titulo: "Para quem sempre quis empreender", texto: "e busca segurança para dar o primeiro passo, com suporte completo do primeiro passo em diante, sem precisar de experiência no setor de alimentação." },
  { icone: ChartNoAxesCombined, rotulo: "Diversificação de investimentos", titulo: "Para quem já empreende em outra área e quer diversificar", texto: "com um negócio físico, previsível, com operação padronizada e uma rede que já provou que funciona." },
  { icone: ClipboardCheck, rotulo: "Negócio gerenciável", titulo: "Para quem quer um negócio conduzido por processos", texto: "e indicadores, sem depender do know-how pessoal de cozinha." },
];

const PERFIS = ["Médico cardiologista", "Banker e esposa", "Empresários de estética", "Pai e filho", "Administrador de grupo empresarial"];

const NUMEROS = [
  { valor: "+100", texto: "unidades em 11 estados e agora no Paraguai" },
  { valor: "3", texto: "unidades em média por franqueado" },
  { valor: "22%", texto: "de crescimento da rede em 2025, acima da média do mercado" },
  { valor: "R$ 3 mi", texto: "de faturamento médio por loja ao ano", estimativa: true },
  { valor: "12-16%", texto: "de lucratividade média", estimativa: true },
  { valor: "18-24", texto: "meses de retorno estimado no modelo Smart Delivery", estimativa: true },
];

const DEPOIMENTOS = [
  { nome: "Matheus Borguetti", local: "Bertioga (SP)", texto: "O suporte foi tão bom que me deu segurança pra pensar em outra loja. Mesmo sem experiência no ramo, dá pra operar uma Pizza Prime com segurança." },
  { nome: "Eduardo de Araujo", local: "Pirituba (SP)", texto: "Já tenho mais de 10 anos no mundo da pizza, mas só o treinamento me deu muitos insights como empresário e como pessoa também. Já estou pensando em abrir a segunda unidade." },
];

const VIDEOS: Video[] = [
  { titulo: "Franqueados contam como é a rede", legenda: "Depoimentos de franqueados Pizza Prime", capa: convencao, embed: embedDrive("1_trcBt5wC3Oe-nPTYg9R4Do1O4i3ASzR"), proporcao: "vertical" },
  { titulo: "Vinicius e Vanessa", legenda: "Empresários, franqueados em Ribeirão Preto (SP)", capa: capaViniciusVanessa, embed: embedDrive("1559aZpQXCpmPDSmHrImabFYD7xsz-dJc"), proporcao: "vertical" },
  { titulo: "João", legenda: "Franqueado Pizza Prime", capa: capaJoao, embed: embedDrive("1ST2G3IfaJgGYEkyyGhm2lgFKPtj8hvrF"), proporcao: "vertical" },
  { titulo: "Mariane", legenda: "Franqueada Pizza Prime", capa: capaMariane, embed: embedDrive("1B-5Yx3gfxbFKv-xvDo1fSeC1HOlUw7NR"), proporcao: "vertical" },
];

const SELOS = [
  { src: seloAbf, alt: "Selo ABF Excelência em Franchising 2024, 2025 e 2026", w: 160, h: 80 },
  { src: seloPegn2025, alt: "PEGN Melhores Franquias do Brasil 2025, 5 estrelas", w: 48, h: 80 },
  { src: seloPegn2026, alt: "PEGN Melhores Franquias do Brasil 2026, 5 estrelas", w: 48, h: 80 },
  { src: seloExame, alt: "Exame Negócios em Expansão 2025", w: 80, h: 80 },
  { src: seloGptw, alt: "Great Place to Work 2026", w: 57, h: 80 },
  { src: seloTop25, alt: "Top 25 do Franchising Brasileiro", w: 80, h: 80 },
];

const AVISO =
  "Médias e estimativas da rede Pizza Prime. O resultado de cada unidade varia conforme a cidade, o ponto, a gestão e o mercado, e não há garantia de retorno. Todas as condições estão na Circular de Oferta de Franquia (COF), que você recebe antes de assinar qualquer contrato.";

// ------------------------------------------------------------------ página

const Franquia = () => {
  const formRef = useRef<HTMLElement>(null);
  const [barraVisivel, setBarraVisivel] = useState(false);

  useEffect(() => {
    document.title = "Franquia Pizza Prime | Seu próximo grande negócio começa aqui";
    const html = document.documentElement;
    html.style.colorScheme = "light";
    html.style.backgroundColor = PAPEL;
    return () => {
      html.style.colorScheme = "";
      html.style.backgroundColor = "";
    };
  }, []);

  // Barra fixa do celular: aparece depois do topo e some enquanto o formulário está na tela.
  useEffect(() => {
    const form = formRef.current;
    if (!form || !("IntersectionObserver" in window)) return;
    let formNaTela = false;
    const atualizar = () => setBarraVisivel(window.scrollY > 520 && !formNaTela);
    const obs = new IntersectionObserver(([e]) => {
      formNaTela = e.isIntersecting;
      atualizar();
    });
    obs.observe(form);
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", atualizar);
    };
  }, []);

  return (
    <main className="bg-[#fbf3e3] text-[#2b2b2b] pb-20 md:pb-0">
      {/* ---------------- Topo: capa de jornal, como o folheto ---------------- */}
      <section className="relative">
        <div className="container mx-auto px-5 pt-4 md:pt-6 pb-12 md:pb-16">
          {/* Cabeçalho do jornal */}
          <div className="flex items-center justify-between font-serif uppercase text-[10px] md:text-xs tracking-wider text-[#9b1b16]">
            <span>Edição especial</span>
            <span className="hidden sm:inline">A maior rede brasileira de pizzarias</span>
            <span>Exemplar gratuito</span>
          </div>
          <Filete className="mt-2" />
          <div className="flex items-center justify-between gap-4 py-3 md:py-4">
            <img src={logo} alt="Pizza Prime" width={112} height={112} className="w-20 md:w-28 shrink-0" />
            <p className="font-serif italic font-bold text-[#9b1b16] text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight">Prime Times</p>
          </div>
          <Filete />
          <p className="sm:hidden mt-2 font-serif uppercase text-[10px] tracking-wider text-[#9b1b16] text-center">
            A maior rede brasileira de pizzarias
          </p>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start mt-8 md:mt-10">
            <div className="grid md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-8 items-start">
              <div>
                <h1 className="font-display uppercase text-[#9b1b16] text-[2.7rem] sm:text-6xl lg:text-[4.4rem] leading-[1.05] sm:leading-[1.05] lg:leading-[1.05]">
                  Seu próximo grande negócio começa aqui
                </h1>
                <p className="mt-6 max-w-xl border-l-4 border-secondary pl-4 font-serif italic font-bold text-[#9b1b16] text-2xl md:text-[2rem] leading-snug">
                  Enquanto você lê isso, uma pizza está sendo vendida em algum lugar do Brasil.
                </p>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-[#3a3a3a] max-w-xl">
                  Entre em um mercado que não para, com o suporte de uma rede que já provou que funciona.
                </p>
                <ul className="mt-5 space-y-2">
                  {["Sem sazonalidade", "Com segurança", "E previsibilidade"].map((t) => (
                    <li key={t} className="flex items-center gap-2 font-bold text-[#9b1b16] text-lg">
                      <CircleCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 inline-block rounded-2xl border-[3px] border-secondary px-6 py-4 text-white" style={{ backgroundColor: VERMELHO }}>
                  <p className="font-display uppercase tracking-[0.18em] text-secondary text-sm md:text-base">Investimento no modelo Delivery</p>
                  <p className="font-display text-5xl md:text-7xl leading-none mt-1">R$ 249 MIL</p>
                  <p className="text-white/85 text-sm md:text-base font-bold mt-2">+ R$ 50 mil de capital de giro e estoque</p>
                </div>

                <div className="mt-8 lg:hidden">
                  <BotaoPrincipal className="w-full">Quero conversar com a expansão</BotaoPrincipal>
                </div>
              </div>

              {/* Painel laranja com a foto, como a capa do folheto */}
              <div className="relative rounded-3xl overflow-hidden" style={{ backgroundColor: LARANJA }}>
                <img
                  src={fatia1000}
                  srcSet={`${fatia500} 500w, ${fatia1000} 1000w`}
                  sizes="(min-width: 768px) 320px, 100vw"
                  alt="Fatia de pizza de pepperoni da Pizza Prime e copo de guaraná"
                  width={1000}
                  height={1250}
                  className="w-full h-[22rem] sm:h-96 md:h-auto object-cover object-[50%_20%] md:object-[50%_30%]"
                  {...{ fetchpriority: "high" }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 pt-10 md:pt-16 bg-gradient-to-t from-[#f4a21b] via-[#f4a21b]/80 to-transparent">
                  <p className="font-display uppercase text-[#9b1b16] leading-[0.9]">
                    <span className="block text-6xl md:text-8xl">365</span>
                    <span className="block text-2xl md:text-4xl">dias por ano</span>
                  </p>
                </div>
              </div>
            </div>

            <section id="formulario" ref={formRef} aria-label="Formulário" className="scroll-mt-4">
              <LeadFormNegocio identificador="formulario-lp-franquia" lp={LP} />
              <LinkWhatsApp
                local="formulario"
                lp={LP}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#9b1b16] hover:underline"
              >
                <img src={whatsappIcon} alt="" width={20} height={20} loading="lazy" />
                Prefere conversar agora? Fale no WhatsApp
              </LinkWhatsApp>
            </section>
          </div>
        </div>
      </section>

      {/* ---------------- Mercado & oportunidade ---------------- */}
      <section className="py-12 md:py-20 text-white" style={{ backgroundColor: VERMELHO }}>
        <div className="container mx-auto px-5 max-w-6xl grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div>
            <p className="font-serif text-secondary text-2xl md:text-3xl">Mercado &amp; oportunidade para você</p>
            <h2 className="font-display italic uppercase text-secondary text-5xl md:text-7xl leading-[1] mt-3">Pizza vende todos os dias.</h2>
            <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
              Um mercado grande, recorrente e sem sazonalidade: ideal para quem quer segurança e previsibilidade.
            </p>
            <div className="mt-6 border-y border-secondary/60 py-4 text-lg md:text-xl leading-relaxed">
              O mercado já está comprovado. Com o suporte da Pizza Prime, entrar é a parte fácil.
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 md:gap-4">
            {MERCADO.map((m) => (
              <div key={m.titulo} className="rounded-2xl bg-black/20 p-5">
                <dd className="font-display text-4xl md:text-5xl text-white leading-none whitespace-nowrap">{m.titulo}</dd>
                <dt className="text-sm text-white/85 mt-2 leading-snug">{m.texto}</dt>
                <p className="text-[11px] text-white/55 mt-2">Fonte: {m.fonte}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Para quem é ---------------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-5 max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="rounded-3xl p-6 md:p-10 text-white" style={{ backgroundColor: VERMELHO }}>
            <h2 className="font-display uppercase text-4xl md:text-5xl leading-[1.05] mb-7">Para quem é a Pizza Prime?</h2>
            <ul className="space-y-7">
              {PARA_QUEM.map(({ icone: Icone, rotulo, titulo, texto }) => (
                <li key={titulo} className="flex gap-4">
                  <div className="w-24 shrink-0 text-center">
                    <Icone className="w-10 h-10 text-secondary mx-auto" aria-hidden="true" />
                    <p className="mt-1 text-[9px] font-extrabold uppercase italic text-white/80 leading-tight">{rotulo}</p>
                  </div>
                  <div>
                    <h3 className="font-display uppercase text-xl md:text-2xl text-white leading-tight">...{titulo}</h3>
                    <p className="text-white/85 text-sm md:text-base mt-1 leading-relaxed">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display uppercase text-3xl md:text-4xl text-[#9b1b16] leading-tight">Quem abriu uma Pizza Prime em 2026</h3>
            <p className="mt-3 text-[#3a3a3a] leading-relaxed">
              12 das 13 unidades abertas em 2026 têm um sócio que é ou já foi empresário. Muitos mantêm a carreira e abrem a
              Pizza Prime como segunda operação, com um sócio cuidando do dia a dia.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PERFIS.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-white border border-[#9b1b16]/20">
                  <Check className="w-4 h-4 text-[#9b1b16]" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <img
              src={inauguracao}
              alt="Inauguração de unidade Pizza Prime em Pouso Alegre (MG)"
              width={900}
              height={600}
              loading="lazy"
              decoding="async"
              className="mt-6 rounded-2xl w-full object-cover hidden md:block"
            />
          </div>
        </div>
      </section>

      {/* ---------------- Operação descomplicada ---------------- */}
      <section className="pb-12 md:pb-20">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="rounded-3xl bg-white border border-[#9b1b16]/15 p-6 md:p-10">
            <h2 className="font-display uppercase text-[#9b1b16] text-4xl md:text-5xl leading-[1.05]">Operação descomplicada</h2>
            <p className="font-serif italic text-2xl md:text-3xl text-[#9b1b16] mt-1">Empreenda sem medo.</p>
            <dl className="mt-6 divide-y divide-[#9b1b16]/15">
              {SEM_MEDO.map((s) => (
                <div key={s.medo} className="grid sm:grid-cols-[1fr_1.4fr] gap-1 sm:gap-6 py-4">
                  <dt className="font-serif italic font-bold text-lg md:text-xl text-[#9b1b16]">"{s.medo}"</dt>
                  <dd className="text-[#3a3a3a] md:text-lg leading-relaxed">{s.resposta}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- Ecossistema Prime ---------------- */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="mb-8 md:mb-10 text-center">
            <h2 className="font-display uppercase text-[#9b1b16] text-5xl md:text-7xl leading-[1]">Ecossistema Prime</h2>
            <p className="mt-3 text-lg md:text-xl text-[#555]">
              Tudo o que a sua loja precisa para crescer e vender mais. <em className="font-bold text-[#3a3a3a]">Você começa na frente.</em>
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {ECOSSISTEMA.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="rounded-2xl bg-[#fbf3e3] border border-[#9b1b16]/15 p-5 flex gap-4 lg:block">
                <span className="w-12 h-12 rounded-full bg-[#9b1b16]/10 flex items-center justify-center shrink-0 lg:mb-3">
                  <Icone className="w-6 h-6 text-[#9b1b16]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display uppercase text-xl text-[#9b1b16] leading-tight">{titulo}</h3>
                  <p className="text-sm text-[#555] mt-1 leading-relaxed">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Números da rede ---------------- */}
      <section className="py-12 md:py-20" style={{ backgroundColor: LARANJA }}>
        <div className="container mx-auto px-5 max-w-6xl">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-[1.05] text-[#9b1b16] mb-8 md:mb-10 max-w-4xl">
            Você entra em uma rede com modelo testado e validado
          </h2>
          <dl className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {NUMEROS.map((n) => (
              <div key={n.texto} className="rounded-2xl bg-white/95 p-5 md:p-6">
                <dd className="font-display text-4xl md:text-6xl text-[#9b1b16] leading-none">
                  {n.valor}
                  {n.estimativa && <sup className="text-base">¹</sup>}
                </dd>
                <dt className="text-sm md:text-base text-[#444] mt-2 leading-snug">{n.texto}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid md:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: VERMELHO }}>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Delivery · foco da expansão</p>
              <p className="font-display text-4xl mt-1">R$ 249 mil</p>
              <p className="text-sm text-white/85">+ R$ 50 mil de capital de giro e estoque. Até 60 m², delivery e retirada.</p>
            </div>
            <div className="rounded-2xl bg-white/95 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9b1b16]">Smart Delivery</p>
              <p className="font-display text-4xl mt-1 text-[#2b2b2b]">R$ 199 mil*</p>
              <p className="text-sm text-[#555]">*Para cidades até 50 mil habitantes.</p>
            </div>
            <div className="rounded-2xl bg-white/95 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9b1b16]">Express Delivery</p>
              <p className="font-display text-4xl mt-1 text-[#2b2b2b]">R$ 369 mil</p>
              <p className="text-sm text-[#555]">Delivery, retirada, salão para até 29 lugares e rodízio.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#5a0f0a] leading-relaxed">¹ {AVISO}</p>
        </div>
      </section>

      {/* ---------------- Depoimentos ---------------- */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-5 max-w-6xl">
          <h2 className="font-display uppercase text-[#9b1b16] text-4xl md:text-6xl leading-[1.05] mb-8 md:mb-10">O que falam nossos franqueados</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {DEPOIMENTOS.map((d) => (
              <blockquote key={d.nome} className="m-0 border-l-4 border-secondary pl-5">
                <p className="text-lg md:text-xl text-[#2b2b2b] leading-relaxed">"{d.texto}"</p>
                <footer className="mt-3">
                  <span className="block font-bold text-[#9b1b16]">
                    {d.nome} · {d.local}
                  </span>
                  <span className="block text-sm text-[#777]">Franqueado</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0 pb-2 [&_figcaption_span:first-child]:!text-[#2b2b2b] [&_figcaption_span:last-child]:!text-[#777]">
            {VIDEOS.map((v) => (
              <div key={v.titulo} className="w-[62%] sm:w-[45%] md:w-auto shrink-0 snap-start">
                <VideoDepoimento video={v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Parceiros e selos ---------------- */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-5 max-w-5xl text-center">
          <p className="font-display uppercase text-2xl md:text-3xl text-[#777] mb-6">Parceiros oficiais</p>
          <img src={parceiros} alt="Parceiros oficiais: Guaraná Antarctica, Azul, Sadia, Perdigão, Tirolez, iFood, 99Food, Saipos, DCX Embalagens e Leprino" width={1100} height={466} loading="lazy" decoding="async" className="mx-auto w-full max-w-3xl" />
          <p className="font-display uppercase text-2xl md:text-3xl text-[#777] mt-12 mb-6">Excelência em franquia</p>
          <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-4" aria-label="Prêmios e certificações">
            {SELOS.map((s) => (
              <li key={s.alt}>
                <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" className="h-16 md:h-20 w-auto object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- CTA final ---------------- */}
      <section className="pb-14 md:pb-20">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="rounded-3xl p-8 md:p-12 text-center text-white" style={{ backgroundColor: VERMELHO }}>
            <p className="font-serif italic text-white/85 text-lg md:text-xl">Comece na frente em um mercado que não para.</p>
            <p className="font-display uppercase text-secondary text-4xl md:text-6xl leading-[1.05] mt-2">Seu próximo grande negócio começa aqui</p>
            <p className="text-white/80 mt-4 mb-6">Fale com o time de expansão e veja o modelo ideal para a sua cidade.</p>
            <BotaoPrincipal className="w-full sm:w-auto">Quero conversar com a expansão</BotaoPrincipal>
          </div>
        </div>
      </section>

      <Footer />

      {/* ---------------- Celular: barra fixa ---------------- */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 p-3 bg-[#9b1b16]/95 backdrop-blur border-t border-white/10 flex gap-2 transition-transform duration-300 ${
          barraVisivel ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!barraVisivel}
      >
        <button
          type="button"
          onClick={irParaFormulario}
          tabIndex={barraVisivel ? 0 : -1}
          className="flex-1 h-12 rounded-lg bg-secondary text-[#0E0E0E] font-extrabold uppercase text-sm tracking-wide"
        >
          Falar com a expansão
        </button>
        <LinkWhatsApp local="barra-fixa" lp={LP} className="w-12 h-12 rounded-lg bg-whatsapp flex items-center justify-center shrink-0">
          <img src={whatsappIcon} alt="Falar pelo WhatsApp" width={26} height={26} />
        </LinkWhatsApp>
      </div>

      <WhatsAppFlutuante lp={LP} />
    </main>
  );
};

export default Franquia;
