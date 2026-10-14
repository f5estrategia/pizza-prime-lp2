import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Award, TrendingUp, MessagesSquare, Megaphone, ChefHat, GraduationCap, MonitorSmartphone,
  Store, RefreshCw, Sparkles, CalendarCheck, Check,
} from "lucide-react";
import Footer from "@/components/Footer";
import LeadFormNegocio from "@/components/LeadFormNegocio";
import VideoDepoimento, { embedDrive, type Video } from "@/components/negocio/VideoDepoimento";
import { LinkWhatsApp, WhatsAppFlutuante } from "@/components/negocio/whatsapp";

import logo from "@/assets/logo-pizza-prime.webp";
import parceiros from "@/assets/negocio/parceiros-folheto.webp";
import inauguracao from "@/assets/negocio/inauguracao-pouso-alegre.webp";
import convencao from "@/assets/negocio/convencao-rede.webp";
import caixas1600 from "@/assets/negocio/hero-caixas-1600.webp";
import caixas800 from "@/assets/negocio/hero-caixas-800.webp";
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

// Segunda versão da LP da matéria (/oportunidade), pedida pelo Diego em 13/10/2026:
// segue a narrativa do folheto da Feira de Curitiba (cupom fiscal, pizza vende todo
// dia, comparativo de custos, ecossistema, números da rede, para quem é). A /negocio
// continua no ar como estava. Sem "+30 mil por mês" em destaque (decisão do Augusto):
// o comparativo aparece como economia estimada, com aviso.

const LP = "oportunidade";
const VERMELHO = "#9b1b16";
const CREME = "#fef5e6";

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

const Titulo = ({ sobre, children, cor = "escuro" }: { sobre: string; children: ReactNode; cor?: "escuro" | "claro" }) => (
  <div className="mb-8 md:mb-10">
    <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 ${cor === "claro" ? "text-secondary" : "text-[#9b1b16]"}`}>{sobre}</p>
    <h2 className={`font-display uppercase text-4xl md:text-6xl leading-[1.05] ${cor === "claro" ? "text-white" : "text-[#9b1b16]"}`}>{children}</h2>
  </div>
);

// ------------------------------------------------------------------ dados

const CUPOM = ["Taxa iFood", "Taxa 99Food", "CMV (custo dos insumos)", "Bebidas"];

const MERCADO = [
  { titulo: "195", texto: "pizzas pedidas por minuto só no iFood", fonte: "Abupa" },
  { titulo: "R$ 24,4 bi", texto: "é o faturamento anual do setor de pizza no Brasil", fonte: "Forbes" },
  { titulo: "+10%", texto: "é o crescimento do setor por ano", fonte: "Sebrae-SP" },
];

const COMPARATIVO = [
  { item: "iFood", nota: "cerca de 60% das vendas", mercado: "15,0%", prime: "10,0%" },
  { item: "99Food", nota: "cerca de 15% das vendas", mercado: "10,9%", prime: "0%*" },
  { item: "CMV", nota: "custo dos insumos", mercado: "35%", prime: "30%" },
  { item: "Bebidas", nota: "embalagem de 2 litros", mercado: "R$ 8,50", prime: "R$ 4,05" },
];

const CUSTOS_FIXOS = [
  { item: "Contabilidade", valor: "R$ 840/mês" },
  { item: "Agência de marketing digital", valor: "R$ 2.000/mês" },
  { item: "Ferramentas de gestão", valor: "R$ 500/mês" },
];

const ECOSSISTEMA = [
  { icone: Award, titulo: "Marca forte", texto: "Força e reconhecimento de rede nacional." },
  { icone: TrendingUp, titulo: "Poder de escala", texto: "Negociações em escala com grandes marcas." },
  { icone: MessagesSquare, titulo: "Multicanais de venda", texto: "App próprio, WhatsApp, marketplaces e telefone." },
  { icone: Megaphone, titulo: "Marketing", texto: "Estrutura especializada para gerar vendas." },
  { icone: ChefHat, titulo: "Cozinha central", texto: "Insumos porcionados: mais agilidade, zero desperdício e economia de mão de obra." },
  { icone: GraduationCap, titulo: "Treinamento e consultoria", texto: "Capacitação com a metodologia Pizza Prime e alinhamento estratégico contínuo." },
  { icone: MonitorSmartphone, titulo: "Tecnologia", texto: "Ferramenta de gestão e investimento constante em novas soluções." },
];

const NUMEROS = [
  { valor: "+100", texto: "unidades em 11 estados e no Paraguai" },
  { valor: "3", texto: "unidades em média por franqueado" },
  { valor: "R$ 3 mi", texto: "faturamento médio por loja ao ano", estimativa: true },
  { valor: "12-16%", texto: "lucratividade média", estimativa: true },
  { valor: "18-24", texto: "meses de payback estimado no Delivery", estimativa: true },
];

const PARA_QUEM = [
  { icone: Store, titulo: "Store in store", texto: "Para quem quer ampliar os negócios com um modelo testado e validado, compartilhando a mesma operação." },
  { icone: RefreshCw, titulo: "Virada de bandeira", texto: "Para quem já tem pizzaria e quer entrar em uma marca nacional, com operação eficiente e estratégia comprovada." },
  { icone: Sparkles, titulo: "Nova unidade", texto: "Para quem quer abrir o próprio negócio, mesmo sem experiência no setor, com o suporte de uma marca consolidada." },
];

const PERFIS = ["Médico cardiologista", "Banker e esposa", "Empresários de estética", "Pai e filho", "Administrador de grupo empresarial", "Veteranos do food service"];

const DEPOIMENTOS = [
  { nome: "Matheus Borguetti", local: "Bertioga (SP)", perfil: "Dono de restaurante e franqueado", texto: "O suporte foi tão bom que me deu segurança pra pensar em outra loja. Mesmo sem experiência no ramo, dá pra operar uma Pizza Prime com segurança." },
  { nome: "Eduardo de Araujo", local: "Pirituba (SP)", perfil: "Dono de restaurante e franqueado", texto: "Já tenho mais de 10 anos no mundo da pizza, mas só o treinamento me deu muitos insights como empresário e como pessoa também. Já estou pensando em abrir a segunda unidade." },
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

// ------------------------------------------------------------------ cupom fiscal

// Papel térmico: levemente amarelado, com granulação, luz quente vindo da
// esquerda e a marca da dobra. Tinta um pouco falhada, como impressora de caixa.
const PAPEL = "#f3eee3";
const TINTA = "#3b3631";
const GRAO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .3 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

const BordaCupom = ({ lado }: { lado: "cima" | "baixo" }) => (
  <div
    aria-hidden="true"
    className={`h-2.5 w-full ${lado === "cima" ? "-mb-px" : "-mt-px rotate-180"}`}
    style={{
      background: `linear-gradient(-45deg, ${PAPEL} 5px, transparent 0) 0 0 / 10px 10px repeat-x, linear-gradient(45deg, ${PAPEL} 5px, transparent 0) 0 0 / 10px 10px repeat-x`,
    }}
  />
);

/** Cupom "deitado" na mesa: perspectiva, sombra de contato e sombra longa no sentido da luz. */
const Cupom = ({ className = "", deitado = true }: { className?: string; deitado?: boolean }) => (
  <div
    className={`relative max-w-[340px] w-full mx-auto lg:mx-0 ${className}`}
    style={{
      transform: deitado ? "perspective(1100px) rotateX(28deg) rotateZ(-9deg) skewX(2deg)" : "rotate(-4deg)",
      transformOrigin: "50% 80%",
      filter:
        "drop-shadow(0 1px 1px rgba(0,0,0,.55)) drop-shadow(14px 22px 14px rgba(10,4,2,.55)) drop-shadow(30px 50px 40px rgba(10,4,2,.45))",
    }}
  >
    <BordaCupom lado="cima" />
    <div
      className="relative px-6 pt-4 pb-5 font-mono text-[13px] overflow-hidden"
      style={{ backgroundColor: PAPEL, color: TINTA, textShadow: `0 0 .6px ${TINTA}` }}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAO }} />
      <p className="text-center font-bold tracking-widest text-xs opacity-90">PIZZARIA · CUPOM DO MÊS</p>
      <p className="text-center text-[10px] tracking-wider opacity-60 mt-0.5">CAIXA 01 · FECHAMENTO MENSAL</p>
      <div className="border-t border-dashed border-current opacity-40 my-3" />
      {CUPOM.map((c, i) => (
        <p key={c} className="flex justify-between py-0.5" style={{ opacity: i % 2 ? 0.82 : 0.92 }}>
          <span>{c}</span>
          <span>R$ ??</span>
        </p>
      ))}
      <div className="border-t border-dashed border-current opacity-40 my-3" />
      <p className="flex justify-between font-bold text-sm">
        <span>SUA MARGEM</span>
        <span>R$ ??</span>
      </p>
      <div className="mt-4 flex gap-[3px] h-8 items-end opacity-85" aria-hidden="true">
        {Array.from({ length: 34 }).map((_, i) => (
          <span key={i} className="h-full" style={{ backgroundColor: TINTA, width: i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2 }} />
        ))}
      </div>
      {/* luz quente da esquerda, sombra à direita, dobra do papel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,214,150,.35) 0%, rgba(255,255,255,0) 35%, rgba(120,80,50,.10) 70%, rgba(70,40,20,.32) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 41%, rgba(60,40,20,.13) 42.5%, rgba(255,255,255,.55) 43.2%, transparent 46%)",
        }}
      />
    </div>
    <BordaCupom lado="baixo" />
  </div>
);

// ------------------------------------------------------------------ página

const Oportunidade = () => {
  const formRef = useRef<HTMLElement>(null);
  const [barraVisivel, setBarraVisivel] = useState(false);

  useEffect(() => {
    document.title = "Franquia Pizza Prime | A força de uma rede na conta da sua pizzaria";
    const html = document.documentElement;
    html.style.colorScheme = "light";
    html.style.backgroundColor = CREME;
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
    <main className="bg-[#fef5e6] text-[#2b2b2b] pb-20 md:pb-0">
      {/* ---------------- Topo: cupom fiscal + formulário ---------------- */}
      <section
        className="relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse 70% 90% at 58% 60%, #a3170f 0%, #7a0f0a 45%, #4a0806 100%)" }}
      >
        {/* Foto da própria Pizza Prime (Drive, AMBIENTADA): caixas de delivery fechadas na mesa, logo em neon ao fundo.
            O cupom fica em cima da caixa da frente, como pedido pronto. No desktop a foto acompanha a largura do
            conteúdo (não a da tela), para o cupom cair sobre a caixa em qualquer monitor. */}
        <div aria-hidden="true" className="absolute inset-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[1400px]">
          <img
            src={caixas1600}
            srcSet={`${caixas800} 533w, ${caixas1600} 1067w`}
            sizes="(min-width: 768px) 600px, 100vw"
            alt=""
            aria-hidden="true"
            width={1067}
            height={1600}
            className="absolute inset-x-0 top-0 w-full h-[600px] object-cover object-[50%_35%] md:inset-x-auto md:left-[38%] md:-top-[2%] md:h-[106%] md:w-auto md:max-w-none md:brightness-[.9] md:saturate-[1.1] md:[mask-image:radial-gradient(ellipse_50%_52%_at_50%_50%,#000_50%,transparent_100%)] md:[-webkit-mask-image:radial-gradient(ellipse_50%_52%_at_50%_50%,#000_50%,transparent_100%)]"
            {...{ fetchpriority: "high" }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(60,8,6,.55) 0%, rgba(60,8,6,.35) 30%, rgba(60,8,6,0) 45%, rgba(60,8,6,0) 70%, rgba(60,8,6,.3) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[601px] md:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(90,10,7,.62) 0%, rgba(90,10,7,.8) 40%, #5a0a07 100%)" }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="relative container mx-auto px-5 pt-5 pb-12 md:pt-8 md:pb-16">
          <img src={logo} alt="Pizza Prime" width={64} height={64} className="w-14 md:w-16" />
          {/* No celular o cupom aparece pequeno, saindo do canto, ao lado do logo. */}
          <div
            aria-hidden="true"
            className="md:hidden absolute right-4 top-0 w-44 h-24 overflow-hidden pointer-events-none"
            style={{ maskImage: "linear-gradient(to bottom, #000 55%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)" }}
          >
            <div className="absolute -top-6 right-0 w-[340px] scale-50 origin-top-right rotate-[6deg]">
              <Cupom deitado={false} />
            </div>
          </div>

          <div className="relative grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-center mt-6 md:mt-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="font-display uppercase text-white text-xl sm:text-2xl md:text-3xl tracking-wide">
                  A maior rede brasileira de pizzarias
                </p>
                <h1 className="font-display uppercase text-secondary text-[2.6rem] sm:text-6xl lg:text-[4.2rem] leading-[1.15] sm:leading-[1.15] lg:leading-[1.15] mt-3">
                  Quanto uma pizzaria deixa na mesa todo mês?
                </h1>
                <p className="mt-4 text-white/85 text-base md:text-lg max-w-lg leading-relaxed">
                  Taxas de aplicativo, insumos e bebidas pesam no caixa de toda pizzaria. <strong className="text-white">Na Pizza Prime</strong>, a força de
                  compra muda essa conta.
                </p>
                <div className="mt-6">
                  <p className="font-display uppercase tracking-[0.2em] text-secondary text-sm md:text-base">Investimento no modelo Delivery</p>
                  <p className="font-display text-white text-5xl md:text-7xl leading-none mt-1">R$ 249 MIL</p>
                  <p className="text-white/85 text-sm md:text-base font-bold mt-2">+ R$ 50 mil de capital de giro e estoque</p>
                </div>
                <div className="mt-8 lg:hidden">
                  <BotaoPrincipal className="w-full">Quero conversar com a expansão</BotaoPrincipal>
                </div>
              </div>
              <div className="hidden md:block md:translate-y-12">
                <Cupom />
              </div>
            </div>

            <section id="formulario" ref={formRef} aria-label="Formulário" className="scroll-mt-4">
              <LeadFormNegocio identificador="formulario-lp-oportunidade" lp={LP} />
              <LinkWhatsApp
                local="formulario"
                lp={LP}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-white/85 hover:text-white"
              >
                <img src={whatsappIcon} alt="" width={20} height={20} loading="lazy" />
                Prefere conversar agora? Fale no WhatsApp
              </LinkWhatsApp>
            </section>
          </div>
        </div>
      </section>

      {/* ---------------- Pizza vende todo dia ---------------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-5 max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <Titulo sobre="Mercado">Pizza vende todos os dias</Titulo>
            <div className="-mt-4 space-y-3 text-base md:text-lg leading-relaxed text-[#3a3a3a]">
              <p>
                Pizza não tem estação: é consumida o ano inteiro, em todos os dias da semana, no almoço, no jantar e no
                delivery.
              </p>
              <p className="flex items-start gap-2">
                <CalendarCheck className="w-6 h-6 text-[#9b1b16] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Venda constante significa <strong>previsibilidade</strong>: um negócio que você consegue planejar mês a mês.
                </span>
              </p>
            </div>
          </div>
          <dl className="grid sm:grid-cols-3 gap-3 md:gap-4">
            {MERCADO.map((m) => (
              <div key={m.titulo} className="rounded-2xl bg-white p-5 shadow-sm border border-[#9b1b16]/10">
                <dd className="font-display text-[2.4rem] md:text-[1.9rem] lg:text-[1.6rem] xl:text-[2.2rem] text-[#9b1b16] leading-none whitespace-nowrap">{m.titulo}</dd>
                <dt className="text-sm text-[#444] mt-2 leading-snug">{m.texto}</dt>
                <p className="text-[11px] text-[#888] mt-2">Fonte: {m.fonte}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Comparativo de custos ---------------- */}
      <section className="py-12 md:py-20" style={{ backgroundColor: VERMELHO }}>
        <div className="container mx-auto px-5 max-w-5xl">
          <Titulo sobre="A conta da rede" cor="claro">Quanto fica no caixa</Titulo>
          <p className="text-white/80 -mt-4 mb-8 max-w-2xl">
            Comparação entre a média de mercado e as condições da rede Pizza Prime, considerando o faturamento médio das
            unidades, de R$ 250 mil por mês.
          </p>

          <div className="rounded-2xl bg-white text-[#2b2b2b] overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] px-4 md:px-6 py-3 bg-[#fef5e6] text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#666]">
              <span />
              <span className="text-center">Média de mercado</span>
              <span className="text-center text-[#9b1b16]">Pizza Prime</span>
            </div>
            {COMPARATIVO.map((c) => (
              <div key={c.item} className="grid grid-cols-[1.4fr_1fr_1fr] items-center px-4 md:px-6 py-4 border-t border-gray-100">
                <div>
                  <p className="font-display uppercase text-xl md:text-2xl leading-none">{c.item}</p>
                  <p className="text-[11px] md:text-xs text-[#888] mt-1">{c.nota}</p>
                </div>
                <p className="text-center font-display text-2xl md:text-3xl text-[#888]">{c.mercado}</p>
                <p className="text-center font-display text-2xl md:text-3xl text-[#9b1b16]">{c.prime}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-black/20 p-5 md:p-6">
            <p className="font-display uppercase text-white text-2xl md:text-3xl">E a economia não para por aí</p>
            <ul className="mt-3 divide-y divide-white/10">
              {CUSTOS_FIXOS.map((c) => (
                <li key={c.item} className="flex justify-between py-2.5 text-white/85">
                  <span>{c.item}</span>
                  <span className="font-bold text-secondary">- {c.valor}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-white font-bold">Economia estimada em custo fixo: cerca de R$ 3 mil por mês.</p>
          </div>

          <p className="mt-4 text-xs text-white/65 leading-relaxed">
            *Condição atual para franqueados da rede. Comparação estimada com base no faturamento médio das unidades e em
            médias de mercado; as condições negociadas pela rede podem mudar. {AVISO}
          </p>
          <div className="mt-8 text-center">
            <BotaoPrincipal>Quero conversar com a expansão</BotaoPrincipal>
          </div>
        </div>
      </section>

      {/* ---------------- Ecossistema ---------------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-5 max-w-6xl">
          <Titulo sobre="Como a Pizza Prime consegue isso">A resposta está na força da marca</Titulo>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {ECOSSISTEMA.map(({ icone: Icone, titulo, texto }, i) => (
              <li
                key={titulo}
                className={`rounded-2xl bg-white border border-[#9b1b16]/15 p-5 flex gap-4 lg:block ${i === ECOSSISTEMA.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <span className="w-12 h-12 rounded-full bg-[#9b1b16]/10 flex items-center justify-center shrink-0 lg:mb-3">
                  <Icone className="w-6 h-6 text-[#9b1b16]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display uppercase text-xl text-[#9b1b16] leading-tight">{titulo}</h3>
                  <p className="text-sm text-[#555] mt-1 leading-relaxed">{texto}</p>
                </div>
              </li>
            ))}
            <li className="rounded-2xl p-5 flex flex-col justify-center text-white" style={{ backgroundColor: VERMELHO }}>
              <p className="font-display uppercase text-2xl leading-tight">Você cuida da gestão.</p>
              <p className="text-white/85 text-sm mt-1">O ecossistema da rede cuida do resto.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------------- Números da rede + modelos ---------------- */}
      <section className="py-12 md:py-20 bg-[#f6a623]">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="mb-8 md:mb-10">
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-[#5a0f0a]">Números da rede</p>
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[1.05] text-white">
              Você entra em uma rede com modelo testado e validado
            </h2>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {NUMEROS.map((n, i) => (
              <div key={n.texto} className={`rounded-2xl bg-white/95 p-5 ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
                <dd className="font-display text-4xl md:text-5xl text-[#9b1b16] leading-none">
                  {n.valor}
                  {n.estimativa && <sup className="text-base">¹</sup>}
                </dd>
                <dt className="text-sm text-[#444] mt-2 leading-snug">{n.texto}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid md:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl p-5 text-white md:col-span-1" style={{ backgroundColor: VERMELHO }}>
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

      {/* ---------------- Para quem é ---------------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-5 max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="rounded-3xl p-6 md:p-10 text-white" style={{ backgroundColor: VERMELHO }}>
            <h2 className="font-display uppercase text-4xl md:text-5xl leading-[1.05] mb-6">Para quem é a Pizza Prime?</h2>
            <ul className="space-y-6">
              {PARA_QUEM.map(({ icone: Icone, titulo, texto }) => (
                <li key={titulo} className="flex gap-4">
                  <span className="w-12 h-12 rounded-xl border-2 border-secondary flex items-center justify-center shrink-0">
                    <Icone className="w-6 h-6 text-secondary" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display uppercase text-xl text-secondary leading-tight">{titulo}</h3>
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

      {/* ---------------- Depoimentos ---------------- */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-5 max-w-6xl">
          <Titulo sobre="Franqueados">O que falam nossos franqueados</Titulo>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {DEPOIMENTOS.map((d) => (
              <blockquote key={d.nome} className="m-0 border-l-4 border-secondary pl-5">
                <p className="text-lg md:text-xl text-[#2b2b2b] leading-relaxed">"{d.texto}"</p>
                <footer className="mt-3">
                  <span className="block font-bold text-[#9b1b16]">
                    {d.nome} · {d.local}
                  </span>
                  <span className="block text-sm text-[#777]">{d.perfil}</span>
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
            <p className="font-display uppercase text-white text-xl md:text-2xl">Store in store, virada de bandeira ou nova unidade</p>
            <p className="font-display uppercase text-secondary text-4xl md:text-6xl leading-[1.05] mt-2">Agora tenha a força de uma rede</p>
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

export default Oportunidade;
