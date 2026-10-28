import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Award, TrendingUp, ChefHat, Headset, GraduationCap, Workflow, Megaphone, MonitorSmartphone,
  Rocket, ChartNoAxesCombined, ClipboardCheck, Check, CircleCheck, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import Footer from "@/components/Footer";
import LeadFormNegocio from "@/components/LeadFormNegocio";
import VideoDepoimento, { embedDrive, type Video } from "@/components/negocio/VideoDepoimento";
import { LinkWhatsApp, WhatsAppFlutuante } from "@/components/negocio/whatsapp";

import logo from "@/assets/logo-pizza-prime.webp";
import fatia1000 from "@/assets/negocio/hero-franquia-1000.webp";
import inauguracao from "@/assets/negocio/inauguracao-pouso-alegre.webp";
import convencao from "@/assets/negocio/convencao-rede.webp";
import capaJoao from "@/assets/negocio/video-joao.webp";
import capaMariane from "@/assets/negocio/video-mariane.webp";
import capaViniciusVanessa from "@/assets/negocio/video-vinicius-vanessa.webp";
import pGuarana from "@/assets/negocio/parceiros/parceiro-guarana.webp";
import pAzul from "@/assets/negocio/parceiros/parceiro-azul.webp";
import pSadia from "@/assets/negocio/parceiros/parceiro-sadia.webp";
import pPerdigao from "@/assets/negocio/parceiros/parceiro-perdigao.webp";
import pTirolez from "@/assets/negocio/parceiros/parceiro-tirolez.webp";
import pIfood from "@/assets/negocio/parceiros/parceiro-ifood.webp";
import p99food from "@/assets/negocio/parceiros/parceiro-99food.webp";
import pSaipos from "@/assets/negocio/parceiros/parceiro-saipos.webp";
import pDcx from "@/assets/negocio/parceiros/parceiro-dcx.webp";
import pLeprino from "@/assets/negocio/parceiros/parceiro-leprino.webp";
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
// Em 20/10 (Runrun 232469) ganhou o visual do material novo da rede (papel claro e bordô).
// Em 28/10 (reunião de 27/10, Runrun 229210): headline direta, números de resultado na
// primeira dobra, ecossistema maior, perfis e perguntas frequentes no lugar do bloco de
// medos, logos de parceiros soltos e todas as dobras centralizadas no mesmo container.

const LP = "franquia";
const BORDO = "#7a1622";
const BORDO_ESCURO = "#4e0d16";
const AMARELO = "#fcc90d"; // hsl(var(--secondary)) em hex, para o SVG

// Papel claro, só em CSS (sem imagem): grão fino, fibras e manchas leves sobre base creme.
// Cada camada usa o ruído como máscara com limiar (alfa = k * ruído - c), para a textura
// aparecer sem virar um véu cinza por igual. Em 20/10 o Augusto pediu textura fraca de papel
// e fundo que contraste com o bordô do texto.
const camada = (tipo: string, tam: number, freq: string, oitavas: number, cor: number, alfa: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${tam}' height='${tam}'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='${tipo}' baseFrequency='${freq}' numOctaves='${oitavas}' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 ${cor} 0 0 0 0 ${cor} 0 0 0 0 ${cor} ${alfa}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;
const GRAO = camada("fractalNoise", 200, ".85", 3, 0.3, "1 0 0 0 -0.42");
const FIBRAS = camada("turbulence", 400, ".006 .09", 3, 0.4, "-0.9 0 0 0 0.16");
const MANCHAS = camada("fractalNoise", 900, ".005", 3, 0.45, "0.8 0 0 0 -0.36");
const TEXTURA = [GRAO, FIBRAS, MANCHAS].join(", ");
const CIMENTO: CSSProperties = { backgroundColor: "#efeae2", backgroundImage: TEXTURA };
const CIMENTO_CLARO: CSSProperties = { backgroundColor: "#f4f0e9", backgroundImage: TEXTURA };

// Os botões ao longo da página abrem o mesmo formulário do topo em pop-up (pedido de 28/10),
// para a pessoa não precisar rolar de volta.
const irParaFormulario = () => window.dispatchEvent(new Event("pp-abrir-formulario"));

const BotaoPrincipal = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <button
    type="button"
    onClick={irParaFormulario}
    className={`h-14 px-7 rounded-lg bg-secondary text-[#0E0E0E] font-extrabold uppercase tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition ${className}`}
  >
    {children}
  </button>
);

/** Todas as dobras usam o mesmo respiro vertical, a mesma largura e o texto centralizado. */
const Dobra = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <section className={`py-14 md:py-20 ${className}`} style={style}>
    <div className="container mx-auto px-5 max-w-6xl text-center">{children}</div>
  </section>
);

/** Cabeçalho padrão das dobras: traço, chamada opcional, título e linha de apoio opcional. */
const Cabecalho = ({ chamada, titulo, apoio, claro = false }: { chamada?: ReactNode; titulo: ReactNode; apoio?: ReactNode; claro?: boolean }) => (
  <div className="max-w-4xl mx-auto mb-10 md:mb-12">
    <div aria-hidden="true" className={`w-24 h-1.5 rounded-full mb-5 mx-auto ${claro ? "bg-secondary" : "bg-[#7a1622]"}`} />
    {chamada && <div className={`mb-3 ${claro ? "text-secondary" : "text-[#555]"}`}>{chamada}</div>}
    <h2 className={`font-display uppercase text-3xl md:text-5xl leading-[1.1] ${claro ? "text-white" : "text-[#7a1622]"}`}>{titulo}</h2>
    {apoio && <p className={`mt-4 text-lg md:text-xl leading-relaxed ${claro ? "text-white/85" : "text-[#444]"}`}>{apoio}</p>}
  </div>
);

const BotaoDobra = () => (
  <div className="mt-10 md:mt-12">
    <BotaoPrincipal className="w-full sm:w-auto">Quero conversar com a expansão</BotaoPrincipal>
  </div>
);

// ------------------------------------------------------------------ dados

const RESULTADOS = [
  { valor: "R$ 3 mi", texto: "de faturamento médio por loja ao ano" },
  { valor: "12-16%", texto: "de lucratividade média da rede" },
  { valor: "18-24", texto: "meses de payback estimado" },
];

const MERCADO = [
  { titulo: "+10%", texto: "é quanto o setor cresce por ano", fonte: "Apubra" },
  { titulo: "Brasil", texto: "é o 2º maior consumidor de pizza do mundo", fonte: "Senac" },
  { titulo: "R$ 495 bi", texto: "movimentados pelo food service em 2025", fonte: "Abrasel" },
  { titulo: "195", texto: "pizzas pedidas por minuto só no iFood", fonte: "Forbes" },
];

const REDE = [
  { valor: "+100", texto: "unidades em 11 estados e no Paraguai" },
  { valor: "3", texto: "unidades em média por franqueado" },
  { valor: "22%", texto: "foi quanto a Pizza Prime cresceu em 2025" },
];

// Na ordem da roda do material, a partir do topo, em sentido horário.
const ECOSSISTEMA = [
  { icone: GraduationCap, titulo: "Treinamento total" },
  { icone: Workflow, titulo: "Operação eficiente" },
  { icone: Award, titulo: "Rede forte, marca forte" },
  { icone: ChefHat, titulo: "Insumos porcionados" },
  { icone: MonitorSmartphone, titulo: "Venda por vários canais" },
  { icone: TrendingUp, titulo: "Poder de escala" },
  { icone: Megaphone, titulo: "Marketing de ponta a ponta" },
  { icone: Headset, titulo: "Suporte completo" },
];

const PARA_QUEM = [
  { icone: Rocket, rotulo: "Primeiro negócio", titulo: "Para quem sempre quis empreender" },
  { icone: ChartNoAxesCombined, rotulo: "Diversificação", titulo: "Para quem já empreende e quer diversificar" },
  { icone: ClipboardCheck, rotulo: "Negócio gerenciável", titulo: "Para quem quer um negócio conduzido por processos" },
];

// Lista do Diego na reunião de 27/10.
const PERFIS = [
  "Médicos", "Advogados", "Dentistas", "Casais empreendendo juntos", "Pessoas em transição de carreira",
  "Executivos do mercado", "Empresários de estética", "Empresários de alimentação", "Empresários de serviços",
  "Administradores de grupo empresarial",
];

const PERGUNTAS = [
  { pergunta: "Preciso entender de pizza?", resposta: "Não. A operação é padronizada e os insumos chegam porcionados da cozinha central." },
  { pergunta: "Preciso ter experiência em gestão?", resposta: "Não. Você recebe a metodologia de ensino da rede e um modelo de negócio comprovado." },
  { pergunta: "Vou empreender sozinho?", resposta: "Não. A rede acompanha cada etapa, da escolha do ponto à operação do dia a dia." },
  { pergunta: "Funciona na minha cidade?", resposta: "Os modelos atendem cidades a partir de 50 mil habitantes, e há um modelo para cidades menores. O time de expansão avalia a sua." },
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

// Recortados um a um do quadro de parceiros do folheto.
const PARCEIROS = [
  { src: pGuarana, alt: "Guaraná Antarctica" },
  { src: pAzul, alt: "Azul" },
  { src: pSadia, alt: "Sadia" },
  { src: pPerdigao, alt: "Perdigão" },
  { src: pTirolez, alt: "Tirolez" },
  { src: pIfood, alt: "iFood" },
  { src: p99food, alt: "99Food" },
  { src: pSaipos, alt: "Saipos" },
  { src: pDcx, alt: "DCX Embalagens" },
  { src: pLeprino, alt: "Leprino" },
];

const SELOS = [
  { src: seloAbf, alt: "Selo ABF Excelência em Franchising 2024, 2025 e 2026", w: 160, h: 80 },
  { src: seloPegn2025, alt: "PEGN Melhores Franquias do Brasil 2025, 5 estrelas", w: 48, h: 80 },
  { src: seloPegn2026, alt: "PEGN Melhores Franquias do Brasil 2026, 5 estrelas", w: 48, h: 80 },
  { src: seloExame, alt: "Exame Negócios em Expansão 2025", w: 80, h: 80 },
  { src: seloGptw, alt: "Great Place to Work 2026", w: 57, h: 80 },
  { src: seloTop25, alt: "Top 25 do Franchising Brasileiro", w: 80, h: 80 },
];

// ------------------------------------------------------------------ roda do ecossistema

// Diagrama: os 8 itens são nós sobre o anel, ligados ao centro por raios por onde corre um
// fluxo amarelo (a ideia de sistema conectado). Rótulos ficam do lado de fora do anel.
const LARG = 940; // largura da área do diagrama no desktop (px)
const ALT = 700; // altura
const CX = LARG / 2;
const CY = ALT / 2;
const R = 240; // raio do anel onde ficam os nós
const R_CENTRO = 150; // raio do círculo central
const R_NO = 40; // raio de cada nó

/** Desktop: diagrama conectado. Celular e tablet: círculo central + grade de nós. */
const RodaEcossistema = () => (
  <>
    <div className="hidden lg:block relative mx-auto" style={{ width: LARG, height: ALT }}>
      <svg aria-hidden="true" width={LARG} height={ALT} className="absolute inset-0 overflow-visible">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={BORDO} strokeOpacity={0.12} strokeWidth={28} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={AMARELO} strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" className="pp-girar" />
        {ECOSSISTEMA.map((_, i) => {
          const a = ((-90 + i * 45) * Math.PI) / 180;
          const x1 = CX + (R_CENTRO + 6) * Math.cos(a), y1 = CY + (R_CENTRO + 6) * Math.sin(a);
          const x2 = CX + (R - R_NO - 4) * Math.cos(a), y2 = CY + (R - R_NO - 4) * Math.sin(a);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BORDO} strokeOpacity={0.25} strokeWidth={2} />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMARELO} strokeWidth={3} strokeDasharray="6 12" strokeLinecap="round" className="pp-fluxo" style={{ animationDelay: `${i * -0.2}s` }} />
            </g>
          );
        })}
      </svg>

      <div className="absolute rounded-full pp-pulso border-4 border-secondary" aria-hidden="true" style={{ left: CX - R_CENTRO, top: CY - R_CENTRO, width: R_CENTRO * 2, height: R_CENTRO * 2 }} />
      <div
        className="absolute rounded-full flex items-center justify-center text-center text-white shadow-2xl border-4 border-secondary"
        style={{ left: CX - R_CENTRO, top: CY - R_CENTRO, width: R_CENTRO * 2, height: R_CENTRO * 2, backgroundColor: BORDO }}
      >
        <p className="font-display uppercase text-2xl leading-[1.15] px-10">
          Ecossistema que faz sua loja <span className="text-secondary">crescer e vender mais</span>
        </p>
      </div>

      {ECOSSISTEMA.map(({ icone: Icone, titulo }, i) => {
        const a = ((-90 + i * 45) * Math.PI) / 180;
        const cos = Math.cos(a), sin = Math.sin(a);
        // Rótulo para fora do nó: mais longe nas laterais, onde o texto é largo.
        const d = R + R_NO + 14 + Math.abs(cos) * 78 + Math.abs(sin) * 20;
        return (
          <div key={titulo}>
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: CX + R * cos, top: CY + R * sin }}
            >
              <div
                data-revelar
                style={{ transitionDelay: `${150 + i * 90}ms`, width: R_NO * 2, height: R_NO * 2 }}
                className="group rounded-full bg-white border-[3px] border-[#7a1622] shadow-lg flex items-center justify-center hover:bg-[#7a1622] transition-colors"
              >
                <Icone className="w-8 h-8 text-[#7a1622] group-hover:text-secondary transition-colors" aria-hidden="true" />
              </div>
            </div>
            <h3
              data-revelar
              style={{ left: CX + d * cos, top: CY + d * sin, transitionDelay: `${250 + i * 90}ms` }}
              className="absolute w-40 -ml-20 -mt-5 font-display uppercase text-base leading-tight text-center text-[#7a1622]"
            >
              {titulo}
            </h3>
          </div>
        );
      })}
    </div>

    <div className="lg:hidden">
      <div className="relative rounded-2xl p-6 text-white text-center mb-3 border-4 border-secondary overflow-hidden" style={{ backgroundColor: BORDO }}>
        <p className="font-display uppercase text-2xl leading-tight">
          Ecossistema que faz sua loja <span className="text-secondary">crescer e vender mais</span>
        </p>
      </div>
      {/* Celular e tablet: trilha vertical. Os nós ficam numa linha por onde corre o mesmo fluxo amarelo do desktop. */}
      <div className="relative mx-auto max-w-md text-left">
        <div aria-hidden="true" className="absolute left-[30px] -top-3 bottom-8 w-[3px] rounded-full bg-[#7a1622]/20" />
        <div aria-hidden="true" className="absolute left-[30px] -top-3 bottom-8 w-[3px] rounded-full pp-fluxo-v" />
        <ul className="relative space-y-3">
          {ECOSSISTEMA.map(({ icone: Icone, titulo }, i) => (
            <li key={titulo} data-revelar style={{ transitionDelay: `${i * 70}ms` }} className="flex items-center gap-3">
              <span className="w-16 h-16 shrink-0 rounded-full bg-white border-[3px] border-[#7a1622] shadow-md flex items-center justify-center">
                <Icone className="w-7 h-7 text-[#7a1622]" aria-hidden="true" />
              </span>
              <h3 className="flex-1 rounded-xl bg-white border border-[#7a1622]/15 shadow-sm px-4 py-3.5 font-display uppercase text-base sm:text-lg text-[#7a1622] leading-tight">
                {titulo}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
);

/** Número que conta do zero até o valor quando entra na tela (cada grupo de dígitos do texto). */
const Contador = ({ texto }: { texto: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [progresso, setProgresso] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setProgresso(0);
    let quadro = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const passo = (t: number) => {
          const x = Math.min(1, (t - inicio) / 1600);
          setProgresso(1 - Math.pow(1 - x, 3));
          if (x < 1) quadro = requestAnimationFrame(passo);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, []);

  const atual = texto.split(/(\d+)/).map((s) => (/^\d+$/.test(s) ? String(Math.round(Number(s) * progresso)) : s)).join("");
  // A camada invisível com o valor final segura a largura: nada pula enquanto conta.
  return (
    <span ref={ref} className="inline-grid" aria-label={texto}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{texto}</span>
      <span aria-hidden="true" className="col-start-1 row-start-1">{atual}</span>
    </span>
  );
};

/** Vídeos: grade de 4 no desktop; no celular, um vídeo por vez com setas (pedido de 28/10). */
const CarrosselVideos = () => {
  const [atual, setAtual] = useState(0);
  const ir = (i: number) => setAtual(Math.max(0, Math.min(VIDEOS.length - 1, i)));
  const Seta = ({ lado }: { lado: "esq" | "dir" }) => {
    const desabilitada = lado === "esq" ? atual === 0 : atual === VIDEOS.length - 1;
    const Icone = lado === "esq" ? ChevronLeft : ChevronRight;
    return (
      <button
        type="button"
        aria-label={lado === "esq" ? "Vídeo anterior" : "Próximo vídeo"}
        disabled={desabilitada}
        onClick={() => ir(atual + (lado === "esq" ? -1 : 1))}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-30 transition-opacity"
        style={{ backgroundColor: BORDO }}
      >
        <Icone className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  };
  return (
    <>
      <div
        className="flex justify-center md:grid md:grid-cols-4 gap-4 md:gap-5 text-left [&_figcaption_span:first-child]:!text-[#2b2b2b] [&_figcaption_span:last-child]:!text-[#777]"
      >
        {VIDEOS.map((v, i) => (
          <div key={v.titulo} className={`w-full max-w-[18rem] md:max-w-none md:w-auto ${i === atual ? "block" : "hidden md:block"}`}>
            <VideoDepoimento video={v} />
          </div>
        ))}
      </div>
      <div className="md:hidden mt-5 flex items-center justify-center gap-4">
        <Seta lado="esq" />
        <span className="text-sm font-bold text-[#7a1622] tabular-nums w-12">{atual + 1} de {VIDEOS.length}</span>
        <Seta lado="dir" />
      </div>
    </>
  );
};

// ------------------------------------------------------------------ página

const Franquia = () => {
  const formRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [barraVisivel, setBarraVisivel] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);

  // Pop-up do formulário: abre pelos botões, fecha no X, no Esc ou clicando fora; trava a rolagem atrás.
  useEffect(() => {
    const abrir = () => setPopupAberto(true);
    window.addEventListener("pp-abrir-formulario", abrir);
    return () => window.removeEventListener("pp-abrir-formulario", abrir);
  }, []);
  useEffect(() => {
    if (!popupAberto) return;
    const fecharNoEsc = (e: KeyboardEvent) => e.key === "Escape" && setPopupAberto(false);
    document.addEventListener("keydown", fecharNoEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fecharNoEsc);
      document.body.style.overflow = "";
    };
  }, [popupAberto]);

  // Entrada suave dos blocos marcados com data-revelar quando chegam na tela.
  useEffect(() => {
    const main = mainRef.current;
    if (!main || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    main.classList.add("anim");
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    main.querySelectorAll("[data-revelar]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Franquia Pizza Prime | Seu próximo grande negócio começa aqui";
    const html = document.documentElement;
    html.style.colorScheme = "light";
    html.style.backgroundColor = "#efeae2";
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
    <main ref={mainRef} className="lp-franquia text-[#2b2b2b] pb-20 md:pb-0" style={CIMENTO}>
      {/* ---------------- Topo ---------------- */}
      <section>
        <div className="container mx-auto px-5 max-w-6xl pt-6 pb-14 md:pb-20">
          {/* Construção padrão de topo: textos à esquerda, formulário à direita (no celular, empilhado e centralizado). */}
          {/* Logo fora da grade: o formulário fica no meio do bloco de texto (da headline ao investimento), nunca acima da headline. */}
          <img src={logo} alt="Pizza Prime" width={112} height={112} className="w-20 md:w-24 mx-auto lg:mx-0" />
          <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-display uppercase text-[#7a1622] text-[2.15rem] min-[400px]:text-[2.4rem] sm:text-6xl leading-[1.02]">
                Pizza vende{" "}
                <span className="block">
                  {/* Faixa amarela inteira atrás das palavras (o marca-texto pela metade parecia defeito). */}
                  <span className="inline-block mt-2 lg:-ml-3 rounded-lg bg-secondary px-3 pt-1 pb-0.5 whitespace-nowrap">
                    todos os dias!
                  </span>
                </span>
              </h1>
              <p className="mt-4 font-serif italic font-bold text-[#7a1622] text-2xl md:text-3xl leading-snug">
                Entre na maior rede brasileira de pizzarias
              </p>
              <ul className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
                {["Sem sazonalidade", "Com segurança", "Com previsibilidade"].map((t) => (
                  <li key={t} className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-white text-base shadow" style={{ backgroundColor: BORDO }}>
                    <CircleCheck className="w-5 h-5 shrink-0 text-secondary" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
                {RESULTADOS.map((r, i) => (
                  <div key={r.texto} data-revelar style={{ transitionDelay: `${i * 120}ms` }} className="rounded-2xl bg-white border-2 border-[#7a1622]/20 shadow-md px-1 py-5 sm:px-2 md:px-4 md:py-7">
                    <dd className="font-display text-[1.6rem] sm:text-4xl lg:text-[2.4rem] tracking-[-0.03em] text-[#7a1622] leading-none whitespace-nowrap"><Contador texto={r.valor} /></dd>
                    <dt className="text-sm sm:text-base md:text-lg font-bold text-[#2b2b2b] mt-3 leading-snug">{r.texto}</dt>
                  </div>
                ))}
              </dl>

              {/* Em tela larga, valor e capital de giro lado a lado para o card não sobrar vazio à direita. */}
              <div className="mt-3 md:mt-4 rounded-2xl border-[3px] border-secondary px-6 py-5 md:py-6 text-white shadow-xl sm:flex sm:items-center sm:justify-between sm:gap-6 sm:text-left" style={{ backgroundColor: BORDO }}>
                <div>
                  <p className="font-display uppercase tracking-[0.12em] text-secondary text-sm md:text-base">Investimento no modelo Delivery</p>
                  <p className="font-display text-5xl md:text-6xl leading-none mt-2 whitespace-nowrap"><Contador texto="R$ 249 MIL" /></p>
                </div>
                <p className="mt-3 sm:mt-0 sm:border-l-2 sm:border-secondary/70 sm:pl-6 sm:max-w-[13rem] text-white text-base md:text-lg font-bold leading-snug">
                  + R$ 50 mil de capital de giro e estoque
                </p>
              </div>

              <div className="mt-8 lg:hidden">
                <BotaoPrincipal className="w-full sm:w-auto">Quero conversar com a expansão</BotaoPrincipal>
              </div>
            </div>

            <section id="formulario" ref={formRef} aria-label="Formulário" className="scroll-mt-4 lg:pt-11">
              <LeadFormNegocio identificador="formulario-lp-franquia-folheto" lp={LP} soEtapa />
              <LinkWhatsApp
                local="formulario"
                lp={LP}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#7a1622] hover:underline"
              >
                <img src={whatsappIcon} alt="" width={20} height={20} loading="lazy" />
                Prefere conversar agora? Fale no WhatsApp
              </LinkWhatsApp>
            </section>
          </div>
        </div>
      </section>

      {/* ---------------- Mercado & oportunidade ---------------- */}
      <section className="relative overflow-hidden text-white" style={{ backgroundColor: BORDO }}>
        <img
          src={fatia1000}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%] opacity-25"
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BORDO}e6, ${BORDO}cc 40%, ${BORDO})` }} />
        <div className="relative container mx-auto px-5 max-w-6xl text-center py-14 md:py-20">
          <Cabecalho
            claro
            chamada={<p className="font-serif text-2xl md:text-3xl">Mercado &amp; oportunidade para você</p>}
            titulo={<>Enquanto você lê isso, uma pizza está sendo vendida <span className="text-secondary">em algum lugar do Brasil</span></>}
            apoio="Um mercado grande, recorrente e sem sazonalidade: ideal para quem quer segurança e previsibilidade."
          />
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {MERCADO.map((m, i) => (
              <div key={m.titulo} data-revelar style={{ transitionDelay: `${i * 110}ms` }} className="rounded-2xl bg-black/25 backdrop-blur-sm p-5">
                <dd className="font-display text-3xl md:text-4xl text-white leading-none whitespace-nowrap"><Contador texto={m.titulo} /></dd>
                <dt className="text-base md:text-lg font-bold text-white mt-3 leading-snug">{m.texto}</dt>
                <p className="text-[11px] text-white/60 mt-2">Fonte: {m.fonte}</p>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-3xl mx-auto border-y border-secondary/60 py-4 text-lg md:text-2xl leading-relaxed">
            O mercado já está comprovado. Com o suporte da Pizza Prime, entrar é a parte fácil.
          </p>
        </div>
      </section>

      {/* ---------------- Números da rede ---------------- */}
      <Dobra className="text-white" style={{ backgroundColor: BORDO_ESCURO }}>
        <Cabecalho
          claro
          chamada={
            <>
              <p className="font-display uppercase text-xl md:text-3xl leading-tight">A maior rede brasileira de pizzarias</p>
              <p className="font-display text-white/80 text-lg md:text-xl mt-1">#PrimeEmTodoLugar</p>
            </>
          }
          titulo="Você entra em uma rede com modelo testado e validado"
        />
        <dl className="grid md:grid-cols-3 gap-3 md:gap-4">
          {REDE.map((n, i) => (
            <div key={n.texto} data-revelar style={{ transitionDelay: `${i * 120}ms` }} className="rounded-2xl bg-white p-6">
              <dd className="font-display text-5xl text-[#7a1622] leading-none"><Contador texto={n.valor} /></dd>
              <dt className="text-base md:text-lg font-bold text-[#2b2b2b] mt-3 leading-snug">{n.texto}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-4 grid md:grid-cols-3 gap-3 md:gap-4">
          <div className="rounded-2xl p-6 border-2 border-secondary" style={{ backgroundColor: BORDO }}>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Delivery</p>
            <p className="font-display text-3xl mt-1"><Contador texto="R$ 249 mil" /></p>
            <p className="text-base font-semibold text-white mt-1">+ R$ 50 mil de capital de giro e estoque. Até 60 m², delivery e retirada.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Smart Delivery</p>
            <p className="font-display text-3xl mt-1"><Contador texto="R$ 199 mil" /></p>
            <p className="text-base font-semibold text-white/90 mt-1">Para cidades com até 50 mil habitantes.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Express Delivery</p>
            <p className="font-display text-3xl mt-1"><Contador texto="R$ 369 mil" /></p>
            <p className="text-base font-semibold text-white/90 mt-1">Delivery, retirada, salão para até 29 lugares e rodízio.</p>
          </div>
        </div>
        <BotaoDobra />
      </Dobra>

      {/* ---------------- Ecossistema ---------------- */}
      <Dobra style={CIMENTO_CLARO}>
        <Cabecalho
          chamada={<p className="font-display uppercase text-xl md:text-2xl text-[#3a3a3a]">Mais que pizzas,</p>}
          titulo="um ecossistema completo para o seu negócio"
          apoio="Conte com todo esse ecossistema a seu favor. Com a Pizza Prime, você não empreende sozinho."
        />
        <RodaEcossistema />
        <BotaoDobra />
      </Dobra>

      {/* ---------------- Para quem é ---------------- */}
      <Dobra>
        <Cabecalho titulo="Para quem é a Pizza Prime?" apoio="Nosso negócio se conecta com muitos outros." />
        <ul className="grid md:grid-cols-3 gap-3 md:gap-4">
          {PARA_QUEM.map(({ icone: Icone, rotulo, titulo }, i) => (
            <li key={titulo} data-revelar style={{ transitionDelay: `${i * 120}ms`, backgroundColor: BORDO }} className="rounded-2xl p-6 md:p-7 text-white shadow-xl">
              <Icone className="w-11 h-11 text-secondary mx-auto" aria-hidden="true" />
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-secondary">{rotulo}</p>
              <h3 className="mt-2 font-display uppercase text-lg md:text-xl leading-tight">{titulo}</h3>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 font-display uppercase text-2xl md:text-3xl text-[#7a1622] leading-tight">Quem já empreende com a Pizza Prime</h3>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {PERFIS.map((p) => (
            <li key={p} className="flex items-center gap-1.5 text-sm md:text-base font-semibold px-4 py-2 rounded-full bg-white/90 border border-[#7a1622]/20">
              <Check className="w-4 h-4 text-[#7a1622]" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-8 max-w-4xl mx-auto rounded-2xl border-2 border-secondary bg-white/90 px-6 py-6 md:py-7 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          <p className="font-display text-7xl md:text-8xl text-[#7a1622] leading-none"><Contador texto="3" /></p>
          <p className="text-lg md:text-xl text-[#333] leading-snug md:text-left max-w-xl">
            <strong className="text-[#7a1622]">unidades em média por franqueado.</strong> Muitos nunca tinham tido uma pizzaria e
            hoje operam mais de uma.
          </p>
        </div>

        <img
          src={inauguracao}
          alt="Inauguração de unidade Pizza Prime em Pouso Alegre (MG)"
          width={900}
          height={600}
          loading="lazy"
          decoding="async"
          className="mt-8 mx-auto rounded-2xl w-full max-w-4xl object-cover shadow-lg"
        />
      </Dobra>

      {/* ---------------- Perguntas frequentes ---------------- */}
      <Dobra className="pt-0 md:pt-0">
        <Cabecalho chamada={<p className="font-display uppercase tracking-[0.15em] text-sm md:text-base">Perguntas frequentes</p>} titulo="Empreenda sem medo" />
        <dl className="grid md:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
          {PERGUNTAS.map((p, i) => (
            <div key={p.pergunta} data-revelar style={{ transitionDelay: `${(i % 2) * 120}ms` }} className="rounded-2xl bg-white/90 border border-[#7a1622]/15 shadow-md p-6 md:p-7">
              <dt className="font-serif italic font-bold text-xl md:text-2xl text-[#7a1622]">{p.pergunta}</dt>
              <dd className="mt-2 text-[#333] md:text-lg leading-relaxed">{p.resposta}</dd>
            </div>
          ))}
        </dl>
        <BotaoDobra />
      </Dobra>

      {/* ---------------- Depoimentos ---------------- */}
      <Dobra className="bg-white/90">
        <Cabecalho titulo="O que falam nossos franqueados" />
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-10">
          {DEPOIMENTOS.map((d, i) => (
            <blockquote key={d.nome} data-revelar style={{ transitionDelay: `${i * 120}ms` }} className="m-0 rounded-2xl border-t-4 border-secondary bg-[#f4f0e9] p-6 md:p-7">
              <p className="text-lg md:text-xl text-[#2b2b2b] leading-relaxed">"{d.texto}"</p>
              <footer className="mt-4">
                <span className="block font-bold text-[#7a1622]">
                  {d.nome} · {d.local}
                </span>
                <span className="block text-sm text-[#777]">Franqueado</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <CarrosselVideos />
      </Dobra>

      {/* ---------------- Parceiros e selos ---------------- */}
      <Dobra>
        <Cabecalho titulo="Parceiros oficiais" />
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4" aria-label="Parceiros oficiais">
          {PARCEIROS.map((p, i) => (
            <li key={p.alt} data-revelar style={{ transitionDelay: `${(i % 5) * 70}ms` }} className="h-24 md:h-28 rounded-2xl bg-white shadow-sm border border-[#7a1622]/10 flex items-center justify-center p-4">
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
            </li>
          ))}
        </ul>
        <p className="font-display uppercase text-xl md:text-2xl text-[#7a1622] mt-14 mb-6">Excelência em franquia</p>
        {/* Mesma grade e altura dos parceiros, sem o card branco: 3 por linha no desktop. */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 md:max-w-[660px] mx-auto" aria-label="Prêmios e certificações">
          {SELOS.map((s, i) => (
            <li key={s.alt} data-revelar style={{ transitionDelay: `${(i % 3) * 80}ms` }} className="h-24 md:h-28 flex items-center justify-center p-1">
              <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" className="max-h-full max-w-full w-auto object-contain" />
            </li>
          ))}
        </ul>
      </Dobra>

      {/* ---------------- CTA final ---------------- */}
      <Dobra className="pt-0 md:pt-0">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 text-white shadow-2xl border-b-4 border-secondary" style={{ backgroundColor: BORDO }}>
          <p className="font-serif italic text-white/85 text-lg md:text-xl">Comece na frente em um mercado que não para.</p>
          <p className="font-display uppercase text-secondary text-3xl md:text-5xl leading-[1.1] mt-2">Seu próximo grande negócio começa aqui</p>
          <div className="mt-6" />
          <BotaoPrincipal className="w-full sm:w-auto">Quero conversar com a expansão</BotaoPrincipal>
          <p className="mt-6 font-display text-white/90 text-2xl">#TodoMundoÉPrime</p>
        </div>
      </Dobra>

      <Footer />

      {/* ---------------- Celular: barra fixa ---------------- */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 p-3 bg-[#7a1622]/95 backdrop-blur border-t border-white/10 flex gap-2 transition-transform duration-300 ${
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

      {popupAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fale com o time de expansão"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pp-popup"
          onClick={(e) => e.target === e.currentTarget && setPopupAberto(false)}
        >
          <div className="relative w-full max-w-md pt-14">
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setPopupAberto(false)}
              className="absolute top-0 right-0 w-11 h-11 rounded-full bg-white text-[#7a1622] shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[85vh] overflow-y-auto rounded-2xl">
              <LeadFormNegocio identificador="formulario-lp-franquia-folheto" lp={LP} soEtapa />
            </div>
          </div>
        </div>
      )}

      <WhatsAppFlutuante lp={LP} />
    </main>
  );
};

export default Franquia;
