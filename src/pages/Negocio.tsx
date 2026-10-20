import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Users, Smartphone, Megaphone, LifeBuoy, Handshake, ChevronDown, Store, Award, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import LeadFormNegocio from "@/components/LeadFormNegocio";
import VideoDepoimento, { embedDrive, type Video } from "@/components/negocio/VideoDepoimento";
import { LinkWhatsApp, WhatsAppFlutuante } from "@/components/negocio/whatsapp";

import logo from "@/assets/logo-pizza-prime.webp";
import heroDesktop from "@/assets/negocio/hero-pizza-1600.webp";
import heroMobile from "@/assets/negocio/hero-pizza-800.webp";
import convencao from "@/assets/negocio/convencao-rede.webp";
import inauguracao from "@/assets/negocio/inauguracao-pouso-alegre.webp";
import capaCozinha from "@/assets/negocio/cozinha-central.webp";
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
import logoIfood from "@/assets/logo-ifood.webp";
import logo99 from "@/assets/logo-99food.webp";
import logoAmbev from "@/assets/logo-ambev.webp";
import logoBrf from "@/assets/logo-brf.webp";
import logoLeprino from "@/assets/logo-leprino.svg";
import logoAzul from "@/assets/logo-azul.webp";
import logoStone from "@/assets/logo-stone.webp";

// LP curta e racional para quem chega pela matéria (público empresário, ICP
// "Empresário Diversificador" e "Profissional de Alta Renda"). Briefing em
// Obsidian: "LP Matéria Fernando Miranda - Briefing". Regras: sem "historinha",
// número com aviso colado, nada de promessa de renda, e o nome do Fernando
// Miranda NÃO aparece na página (só na mensagem do WhatsApp).

// "Maior rede brasileira" só vai com fonte (o Google reprovou superlativo sem
// fonte em 10/2026). Enquanto a Pizza Prime não confirmar a fonte, fica vazio e
// a página usa "uma das maiores redes".
const FONTE_MAIOR_REDE = "";

const AVISO_NUMEROS =
  "Médias da rede Pizza Prime. O resultado de cada unidade varia conforme a cidade, o ponto, a gestão e o mercado, e não há garantia de retorno. Todas as condições estão na Circular de Oferta de Franquia (COF), que você recebe antes de assinar qualquer contrato.";

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

/** Número que conta ao aparecer na tela (só abaixo da dobra, para não pesar no carregamento). */
const Contador = ({ ate, sufixo = "" }: { ate: number; sufixo?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(ate);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Mostra o valor final até entrar na tela; só então conta do zero.
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      setValor(0);
      const inicio = performance.now();
      const passo = (t: number) => {
        const p = Math.min(1, (t - inicio) / 900);
        setValor(Math.round(ate * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ate]);
  return (
    <span ref={ref}>
      {valor}
      {sufixo}
    </span>
  );
};

const Titulo = ({ sobre, children, claro = false }: { sobre: string; children: ReactNode; claro?: boolean }) => (
  <div className="mb-8 md:mb-10">
    <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3 ${claro ? "text-primary" : "text-secondary"}`}>{sobre}</p>
    <h2 className={`text-3xl md:text-5xl font-extrabold uppercase leading-[1.05] ${claro ? "text-[#0E0E0E]" : "text-white"}`}>{children}</h2>
  </div>
);

// ------------------------------------------------------------------ dados

const TOPICOS_TOPO = [
  { icone: Store, texto: "+100 unidades" },
  { icone: Award, texto: "25 anos de pizza" },
  { icone: MapPin, texto: "11 estados + Paraguai" },
];

const NUMEROS_REDE = [
  { valor: "+100", rotulo: "unidades no Brasil e no Paraguai" },
  { valor: "11", rotulo: "estados brasileiros" },
  { valor: "25 anos", rotulo: "de pizza, desde 2001" },
  { valor: "70%", rotulo: "dos franqueados têm mais de uma loja" },
];

const SELOS = [
  { src: seloAbf, alt: "Selo ABF Excelência em Franchising 2024, 2025 e 2026", w: 160, h: 80 },
  { src: seloPegn2025, alt: "PEGN Melhores Franquias do Brasil 2025, 5 estrelas", w: 48, h: 80 },
  { src: seloPegn2026, alt: "PEGN Melhores Franquias do Brasil 2026, 5 estrelas", w: 48, h: 80 },
  { src: seloExame, alt: "Exame Negócios em Expansão 2025, categoria de 2 a 5 milhões de reais", w: 80, h: 80 },
  { src: seloGptw, alt: "Great Place to Work 2026", w: 57, h: 80 },
  { src: seloTop25, alt: "Top 25 do Franchising Brasileiro", w: 80, h: 80 },
];

const CONTA = [
  { rotulo: "Investimento inicial", valor: "R$ 249 mil" },
  { rotulo: "Capital de giro + estoque", valor: "R$ 50 mil" },
  { rotulo: "Investimento total", valor: "R$ 299 mil", destaque: true },
  { rotulo: "Faturamento médio mensal", valor: "R$ 250 mil", estimativa: true },
  { rotulo: "Lucratividade média", valor: "12% a 16%", estimativa: true },
  { rotulo: "Payback estimado", valor: "18 a 24 meses", estimativa: true },
  { rotulo: "Royalties", valor: "5%" },
  { rotulo: "Fundo de marketing", valor: "1%" },
];

const MODELO = [
  { icone: Users, titulo: "Equipe enxuta", texto: "Processos padronizados e tecnologia para operar com uma equipe pequena e treinada." },
  { icone: Smartphone, titulo: "Vendas em todos os canais", texto: "App próprio, iFood, 99Food e Keeta integrados, com combos, cashback e lançamentos frequentes." },
  { icone: Megaphone, titulo: "Marketing de ponta a ponta", texto: "Campanhas, redes sociais da loja, tráfego pago regional, influenciadores e assessoria de imprensa feitos pela franqueadora." },
  { icone: LifeBuoy, titulo: "Suporte 360°", texto: "Estudo de ponto, implantação, treinamento presencial e consultor de campo antes, durante e depois da abertura." },
  { icone: Handshake, titulo: "Força de compra da rede", texto: "Parcerias com Ambev, BRF e Leprino e condições negociadas para os franqueados." },
];

const PASSOS_COZINHA = [
  { titulo: "A cozinha central produz e porciona", texto: "São 1,4 milhão de porções por mês e mais de 50 insumos, com capacidade para abastecer 300 lojas." },
  { titulo: "Os insumos chegam prontos", texto: "Insumos já porcionados e padronizados, prontos para usar." },
  { titulo: "Sua equipe monta e assa", texto: "Com equipe enxuta e treinada, sem depender de pizzaiolo experiente." },
];

const GANHOS_COZINHA = [
  "O mesmo padrão de pizza em toda a rede",
  "Menos desperdício de insumos",
  "Equipe treinada em menos tempo",
  "Menos dependência de mão de obra especializada",
];

const VIDEO_COZINHA: Video = {
  titulo: "Por dentro da cozinha central",
  legenda: "Como os insumos são produzidos e porcionados",
  capa: capaCozinha,
  embed: embedDrive("177K-3gBZvJTLH3xPZBJ5zK-LkKoXDUm3"),
  proporcao: "vertical",
};

const PARCEIROS = [
  { src: logoIfood, alt: "iFood" },
  { src: logo99, alt: "99Food" },
  { src: logoAmbev, alt: "Ambev" },
  { src: logoBrf, alt: "BRF" },
  { src: logoLeprino, alt: "Leprino" },
  { src: logoAzul, alt: "Azul" },
  { src: logoStone, alt: "Stone" },
];

const VIDEOS: Video[] = [
  { titulo: "Franqueados contam como é a rede", legenda: "Depoimentos de franqueados Pizza Prime", capa: convencao, embed: embedDrive("1_trcBt5wC3Oe-nPTYg9R4Do1O4i3ASzR"), proporcao: "vertical" },
  { titulo: "Vinicius e Vanessa", legenda: "Empresários, franqueados em Ribeirão Preto (SP)", capa: capaViniciusVanessa, embed: embedDrive("1559aZpQXCpmPDSmHrImabFYD7xsz-dJc"), proporcao: "vertical" },
  { titulo: "João", legenda: "Franqueado Pizza Prime", capa: capaJoao, embed: embedDrive("1ST2G3IfaJgGYEkyyGhm2lgFKPtj8hvrF"), proporcao: "vertical" },
  { titulo: "Mariane", legenda: "Franqueada Pizza Prime", capa: capaMariane, embed: embedDrive("1B-5Yx3gfxbFKv-xvDo1fSeC1HOlUw7NR"), proporcao: "vertical" },
];

const PERFIS = ["Empresários de outros setores", "Médicos e profissionais liberais", "Executivos", "Casais e sócios de família", "Quem já é do food service"];

const DEPOIMENTOS = [
  { nome: "Gustavo Biazotto", local: "Macapá I, II e Belém (AP/PA)", texto: "Estou há 6 anos como franqueado da Pizza Prime, e esse período foi marcado por um grande desenvolvimento pessoal e profissional. Estou na terceira unidade, e já visamos novas localidades para expansão no norte do Brasil." },
  { nome: "Patricia Barati", local: "Poços de Caldas e Pouso Alegre (MG)", texto: "A Pizza Prime proporcionou novos aprendizados e destacou nossas habilidades. O sonho de ter o próprio negócio se tornou realidade, e hoje é a nossa maior conquista profissional." },
];

const FAQ = [
  { q: "Preciso estar na loja todos os dias?", a: "No começo, sim: o primeiro ano é para aprender a operação com o time da franqueadora. Depois, com processos padronizados e gestão por indicadores, a loja roda com gerente. Hoje, 70% dos franqueados têm mais de uma unidade." },
  { q: "Nunca tive pizzaria. Isso é um problema?", a: "Não. A maioria dos franqueados nunca tinha trabalhado com alimentação. Os insumos chegam porcionados da cozinha central, e você e sua equipe passam por treinamento presencial antes de abrir." },
  { q: "O que está incluído no investimento?", a: "A implantação da loja (obra, equipamentos, fachada) e a taxa de franquia, que é a única parte que fica com a franqueadora: o restante vira a sua loja. O capital de giro e estoque cobre os primeiros meses. O detalhamento completo está na COF." },
  { q: "Quem escolhe o ponto?", a: "A escolha é feita junto com a franqueadora, com estudo de geomarketing e análise da concorrência. O ponto só é aprovado depois da validação técnica do time de expansão." },
];

// ------------------------------------------------------------------ página

const Negocio = () => {
  const formRef = useRef<HTMLElement>(null);
  const [barraVisivel, setBarraVisivel] = useState(false);

  useEffect(() => {
    document.title = "Franquia Pizza Prime | Modelo, investimento e números da rede";
    // Página escura: barra de rolagem escura (senão o navegador desenha uma faixa clara na lateral).
    const html = document.documentElement;
    html.style.colorScheme = "dark";
    html.style.backgroundColor = "#0E0E0E";
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

  const maiorRede = FONTE_MAIOR_REDE ? "A maior rede brasileira de pizzarias¹" : "Uma das maiores redes de pizzarias do Brasil";

  return (
    <main className="bg-[#0E0E0E] text-white pb-20 md:pb-0">
      {/* ---------------- Topo + formulário ---------------- */}
      {/* Pouco texto e muito contraste (referência: topo da Forneria): frase curta
          em fonte condensada, um número-gancho gigante e uma linha de ícones. O
          texto explicativo, os números e os selos ficam na faixa logo abaixo. */}
      <section className="relative overflow-hidden bg-[#3d0906] md:bg-[#8a1c15]">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroDesktop} />
          <img
            src={heroMobile}
            alt="Pizza Pizza Prime com o queijo puxando, sobre o fundo vermelho da marca"
            width={800}
            height={800}
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="absolute top-0 right-0 w-full h-[58vh] md:h-full object-cover object-[70%_center] md:object-[80%_center]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3d0906]/90 via-[45%] to-[#3d0906] md:bg-gradient-to-r md:from-[#4a0b06]/95 md:via-[#6b130d]/55 md:via-45% md:to-transparent" />

        <div className="relative container mx-auto px-5 pt-5 pb-10 md:pt-8 md:pb-16">
          <img src={logo} alt="Pizza Prime" width={64} height={64} className="w-14 md:w-16" />

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-center mt-[36vh] md:mt-10">
            <div>
              <h1 className="font-display uppercase leading-[0.95]">
                <span className="block text-white text-xl sm:text-2xl md:text-3xl tracking-wide">{maiorRede}</span>
                <span className="block text-secondary text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.12] sm:leading-[1.12] lg:leading-[1.12] mt-3 md:mt-5 max-w-[15ch] lg:max-w-[650px]">
                  Um modelo validado para quem{" "}
                  <span className="text-white underline decoration-secondary decoration-[3px] md:decoration-4 underline-offset-[5px] md:underline-offset-8">já pensa em investir</span>
                </span>
              </h1>

              <div className="mt-6 md:mt-8">
                <p className="font-display uppercase tracking-[0.2em] text-secondary text-sm md:text-lg">Investimento no modelo Delivery</p>
                <p className="font-display text-white text-6xl md:text-8xl leading-none mt-1">R$ 249 MIL</p>
                <p className="text-white/85 text-sm md:text-base font-bold mt-2">+ R$ 50 mil de capital de giro e estoque</p>
                <p className="text-white/60 text-xs mt-0.5">Outros formatos a partir de R$ 199 mil*</p>
              </div>

              <ul className="mt-6 md:mt-8 flex flex-wrap gap-x-6 gap-y-3 font-display uppercase text-white text-lg md:text-2xl tracking-wide">
                {TOPICOS_TOPO.map(({ icone: Icone, texto }) => (
                  <li key={texto} className="flex items-center gap-2">
                    <Icone className="w-5 h-5 md:w-6 md:h-6 text-secondary" aria-hidden="true" />
                    {texto}
                  </li>
                ))}
              </ul>

              <div className="mt-8 lg:hidden">
                <BotaoPrincipal className="w-full">Quero conversar com a expansão</BotaoPrincipal>
              </div>
            </div>

            <section id="formulario" ref={formRef} aria-label="Formulário" className="scroll-mt-4">
              <LeadFormNegocio />
              <LinkWhatsApp
                local="formulario"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-white/85 hover:text-white"
              >
                <img src={whatsappIcon} alt="" width={20} height={20} loading="lazy" />
                Prefere conversar agora? Fale no WhatsApp
              </LinkWhatsApp>
            </section>
          </div>
        </div>
      </section>

      {/* ---------------- Faixa: o modelo em uma linha, números e selos ---------------- */}
      <section className="bg-[#0E0E0E] border-b border-white/10 py-10 md:py-12">
        <div className="container mx-auto px-5 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
              Modelo delivery testado em mais de 100 unidades, com <strong className="text-white">cozinha central</strong>,
              suporte do ponto à inauguração e uma operação que <strong className="text-white">não depende de você no balcão</strong>.
            </p>
            <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
              {NUMEROS_REDE.map((n) => (
                <div key={n.rotulo} className="border-l-2 border-secondary pl-3">
                  <dt className="sr-only">{n.rotulo}</dt>
                  <dd className="font-display text-3xl md:text-4xl text-white leading-none">{n.valor}</dd>
                  <dd className="text-xs md:text-sm text-white/65 mt-1">{n.rotulo}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <ul className="flex flex-wrap lg:flex-nowrap items-center gap-x-2.5 gap-y-3 md:gap-x-3" aria-label="Prêmios e certificações">
              {SELOS.map((s) => (
                <li key={s.alt}>
                  <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" className="h-16 md:h-20 w-auto object-contain" />
                </li>
              ))}
            </ul>
            {FONTE_MAIOR_REDE && <p className="mt-4 text-[11px] text-white/50">¹ {FONTE_MAIOR_REDE}</p>}
          </div>
        </div>
      </section>

      {/* ---------------- A conta, aberta ---------------- */}
      <section className="bg-primary py-12 md:py-24">
        <div className="container mx-auto px-5 max-w-5xl">
          <Titulo sobre="Investimento">Quanto custa abrir uma Pizza Prime Delivery</Titulo>
          <p className="text-white/80 -mt-4 mb-8 max-w-2xl">
            Quanto custa abrir uma loja Delivery, quanto ela fatura em média e em quanto tempo o investimento costuma voltar. Sem letra miúda.
          </p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CONTA.map((c) => (
              <div
                key={c.rotulo}
                className={`rounded-xl border-2 p-4 md:p-5 ${c.destaque ? "border-secondary bg-secondary text-[#0E0E0E]" : "border-secondary/70 bg-black/20"}`}
              >
                <dt className={`text-[11px] md:text-xs font-bold uppercase tracking-wide ${c.destaque ? "text-[#0E0E0E]/70" : "text-white/70"}`}>
                  {c.rotulo}
                </dt>
                <dd className="mt-1 text-xl md:text-2xl font-extrabold leading-tight">
                  {c.valor}
                  {c.estimativa && <sup className="text-secondary text-sm ml-0.5">²</sup>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-white/70 leading-relaxed">² {AVISO_NUMEROS}</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-black/25 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Smart Delivery</p>
              <p className="text-2xl font-extrabold mt-1">R$ 199 mil*</p>
              <p className="text-sm text-white/70 mt-1">Formato compacto, só delivery e retirada.</p>
              <p className="text-xs text-white/55 mt-2">*Para cidades até 50 mil habitantes.</p>
            </div>
            <div className="rounded-xl bg-black/25 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Express Delivery</p>
              <p className="text-2xl font-extrabold mt-1">R$ 369 mil</p>
              <p className="text-sm text-white/70 mt-1">Delivery, retirada, salão para até 29 lugares e rodízio.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <BotaoPrincipal>Quero conversar com a expansão</BotaoPrincipal>
          </div>
        </div>
      </section>

      {/* ---------------- Cozinha central ---------------- */}
      <section className="bg-[#161616] py-12 md:py-24">
        <div className="container mx-auto px-5 max-w-6xl">
          <Titulo sobre="Cozinha central">Como funciona a cozinha central</Titulo>
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 items-start">
            <div>
              <ol className="grid md:grid-cols-3 gap-3 md:gap-4">
                {PASSOS_COZINHA.map((p, i) => (
                  <li key={p.titulo} className="relative rounded-xl bg-white/[0.04] border border-white/10 p-4 md:p-5 flex gap-4 md:block">
                    <span className="font-display text-4xl md:text-5xl text-secondary leading-none shrink-0">{i + 1}</span>
                    <div>
                      <h3 className="font-extrabold text-base md:text-lg md:mt-3 mb-1">{p.titulo}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{p.texto}</p>
                    </div>
                    {i < PASSOS_COZINHA.length - 1 && (
                      <ArrowRight
                        className="hidden md:block absolute top-1/2 -right-[14px] -translate-y-1/2 w-5 h-5 text-secondary z-10"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>

              <h3 className="font-display uppercase text-xl md:text-2xl mt-10 mb-4">O que isso resolve na operação</h3>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {GANHOS_COZINHA.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-white/85">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-w-[300px] mx-auto lg:mx-0 w-full">
              <VideoDepoimento video={VIDEO_COZINHA} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- O modelo ---------------- */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-5 max-w-6xl">
          <Titulo sobre="Suporte">O que a franqueadora entrega</Titulo>
          <div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
              {MODELO.map(({ icone: Icone, titulo, texto }, i) => (
                <li key={titulo} className={`rounded-xl bg-white/[0.04] border border-white/10 p-4 md:p-5 flex gap-3 md:block ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${i === MODELO.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                  <Icone className="w-6 h-6 md:w-7 md:h-7 text-secondary shrink-0 mt-0.5 md:mb-3" aria-hidden="true" />
                  <div>
                  <h3 className="font-extrabold text-base md:text-lg mb-1">{titulo}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 opacity-80" aria-label="Parceiros">
            {PARCEIROS.map((p) => (
              <li key={p.alt}>
                <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="h-7 md:h-8 w-auto object-contain brightness-0 invert" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Prova social ---------------- */}
      <section className="bg-[#161616] py-12 md:py-24">
        <div className="container mx-auto px-5 max-w-6xl">
          <Titulo sobre="Franqueados">Quem já tem uma Pizza Prime</Titulo>

          <dl className="grid grid-cols-3 gap-3 md:gap-6 mb-3">
            {[
              { n: 95, t: "estão satisfeitos com o suporte da franqueadora" },
              { n: 94, t: "indicariam a Pizza Prime para novos investidores" },
              { n: 94, t: "abriram ou querem abrir novas unidades" },
            ].map((s) => (
              <div key={s.t} className="rounded-xl bg-white/[0.04] border border-white/10 p-3 md:p-6 text-center">
                <dd className="text-3xl md:text-5xl font-extrabold text-secondary">
                  <Contador ate={s.n} sufixo="%" />
                </dd>
                <dt className="text-[11px] md:text-sm text-white/70 mt-1 leading-snug">{s.t}</dt>
              </div>
            ))}
          </dl>
          <p className="text-[11px] text-white/45 mb-12">Pesquisa de satisfação feita com os franqueados da rede.</p>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0 pb-2 md:overflow-visible">
            {VIDEOS.map((v) => (
              <div key={v.titulo} className="w-[62%] sm:w-[45%] md:w-auto shrink-0 snap-start">
                <VideoDepoimento video={v} />
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-14 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold uppercase leading-tight mb-4">Quem abre uma Pizza Prime</h3>
              <p className="text-white/75 mb-5">
                Gente que já tem uma carreira ou outro negócio e quer uma segunda fonte de renda, com um sócio ou gerente
                cuidando do dia a dia da loja.
              </p>
              <ul className="flex flex-wrap gap-2">
                {PERFIS.map((p) => (
                  <li key={p} className="text-sm font-semibold px-3 py-1.5 rounded-full border border-secondary/50 text-white/90">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="m-0 hidden lg:block">
              <img src={inauguracao} alt="Inauguração de unidade Pizza Prime em Pouso Alegre (MG)" width={900} height={600} loading="lazy" decoding="async" className="rounded-xl w-full object-cover" />
              <figcaption className="text-xs text-white/50 mt-2">Inauguração em Pouso Alegre (MG).</figcaption>
            </figure>
          </div>

          <div className="mt-10 md:mt-12 flex md:grid md:grid-cols-2 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0 pb-2">
            {DEPOIMENTOS.map((d) => (
              <blockquote key={d.nome} className="m-0 w-[85%] md:w-auto shrink-0 snap-start rounded-xl bg-white/[0.04] border-l-4 border-secondary p-5 md:p-6">
                <p className="text-white/85 leading-relaxed">"{d.texto}"</p>
                <footer className="mt-4">
                  <span className="block font-extrabold">{d.nome}</span>
                  <span className="block text-sm text-white/55">{d.local}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Perguntas + CTA final ---------------- */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-5 max-w-3xl">
          <Titulo sobre="Dúvidas">Perguntas frequentes</Titulo>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl bg-white/[0.04] border border-white/10 open:border-secondary/60">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-bold">
                  {f.q}
                  <ChevronDown className="w-5 h-5 shrink-0 text-secondary transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 -mt-1 text-sm text-white/75 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-primary p-7 md:p-10 text-center">
            <p className="text-2xl md:text-4xl font-extrabold uppercase leading-tight">
              Fale com o time de expansão
            </p>
            <p className="text-white/80 mt-3 mb-6">Tire suas dúvidas sobre investimento, operação e disponibilidade na sua cidade.</p>
            <BotaoPrincipal className="w-full sm:w-auto">Quero conversar com a expansão</BotaoPrincipal>
          </div>
        </div>
      </section>

      <Footer />

      {/* ---------------- Celular: barra fixa ---------------- */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 p-3 bg-[#0E0E0E]/95 backdrop-blur border-t border-white/10 flex gap-2 transition-transform duration-300 ${
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
        <LinkWhatsApp local="barra-fixa" className="w-12 h-12 rounded-lg bg-whatsapp flex items-center justify-center shrink-0">
          <img src={whatsappIcon} alt="Falar pelo WhatsApp" width={26} height={26} />
        </LinkWhatsApp>
      </div>

      <WhatsAppFlutuante />
    </main>
  );
};

export default Negocio;
