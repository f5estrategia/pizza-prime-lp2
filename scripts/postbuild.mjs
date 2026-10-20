import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// As rotas sao carregadas sob demanda (React.lazy), para a /negocio nao baixar
// a LP principal. Sem ajuda, cada pagina so pediria o bundle dela depois do
// principal rodar (uma ida e volta a mais). O modulepreload no HTML faz o
// navegador baixar tudo em paralelo.
const manifest = JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8"));

/** Arquivos JS de uma pagina (o bundle dela e os pedacos que ela importa). */
const arquivosDe = (chave) => {
  const entrada = manifest[chave];
  if (!entrada) throw new Error(`postbuild: ${chave} não está no manifest`);
  const arquivos = new Set([entrada.file]);
  for (const dep of entrada.imports || []) {
    if (manifest[dep] && !manifest[dep].isEntry) arquivos.add(manifest[dep].file);
  }
  return [...arquivos];
};

const htmlOriginal = readFileSync("dist/index.html", "utf8");
const base = (htmlOriginal.match(/src="([^"]*)assets\/index-[^"]+\.js"/) || [])[1];
if (base === undefined) throw new Error("postbuild: não achei o script principal no index.html");

const comPreload = (html, arquivos) =>
  html.replace(
    "</head>",
    `    ${arquivos.map((f) => `<link rel="modulepreload" crossorigin href="${base}${f}">`).join("\n    ")}\n  </head>`,
  );

// Raiz: LP principal.
writeFileSync("dist/index.html", comPreload(htmlOriginal, arquivosDe("src/pages/Index.tsx")));

// SPA fallback: o GitHub Pages serve 404.html quando a rota nao existe como
// arquivo estatico (ex: acesso direto/refresh em /pizza-prime-lp2/obrigado).
// Copiar o index.html garante que o React Router assuma a rota.
copyFileSync("dist/index.html", "dist/404.html");

// Impede o processamento Jekyll no GitHub Pages.
writeFileSync("dist/.nojekyll", "");

// LPs curtas (/negocio e /oportunidade): HTML proprio com title/description/og
// da pagina (o preview do link no WhatsApp e no Instagram le so o HTML), ja
// pre-renderizado (o texto aparece antes do JavaScript) e com 200 no GitHub Pages.
const PAGINAS = [
  {
    rota: "/negocio",
    modulo: "src/pages/Negocio.tsx",
    title: "Franquia Pizza Prime | Modelo, investimento e números da rede",
    description:
      "Modelo delivery testado em mais de 100 unidades: investimento de R$ 249 mil + R$ 50 mil de capital de giro, cozinha central e suporte do ponto à inauguração. Fale com o time de expansão.",
  },
  {
    rota: "/oportunidade",
    modulo: "src/pages/Oportunidade.tsx",
    title: "Franquia Pizza Prime | A força de uma rede na conta da sua pizzaria",
    description:
      "Uma das maiores redes de pizzarias do Brasil: mais de 100 unidades, média de 3 lojas por franqueado e o modelo Delivery a partir de R$ 249 mil + R$ 50 mil de capital de giro. Fale com o time de expansão.",
  },
  {
    rota: "/franquia",
    modulo: "src/pages/Franquia.tsx",
    title: "Franquia Pizza Prime | Seu próximo grande negócio começa aqui",
    description:
      "Pizza vende 365 dias por ano. Entre em uma das maiores redes de pizzarias do Brasil: +100 unidades, suporte do primeiro passo em diante e o modelo Delivery por R$ 249 mil + R$ 50 mil de capital de giro. Fale com o time de expansão.",
  },
];

const trocar = (html, regex, novo, nome) => {
  if (!regex.test(html)) throw new Error(`postbuild: não achei ${nome} no index.html`);
  return html.replace(regex, novo);
};

const { render } = await import(pathToFileURL("dist-ssr/negocio.js").href);
for (const p of PAGINAS) {
  const corpo = render(p.rota);
  if (!corpo.includes("formulario")) throw new Error(`postbuild: pré-renderização de ${p.rota} veio sem o formulário`);
  let html = comPreload(htmlOriginal, arquivosDe(p.modulo));
  html = trocar(html, /<title>[^<]*<\/title>/, `<title>${p.title}</title>`, "<title>");
  html = trocar(html, /(<meta name="description" content=")[^"]*"/, `$1${p.description}"`, "description");
  html = trocar(html, /(<meta property="og:title" content=")[^"]*"/, `$1${p.title}"`, "og:title");
  html = trocar(html, /(<meta property="og:description" content=")[^"]*"/, `$1${p.description}"`, "og:description");
  html = trocar(html, /(<meta name="twitter:title" content=")[^"]*"/, `$1${p.title}"`, "twitter:title");
  html = trocar(html, /(<meta name="twitter:description" content=")[^"]*"/, `$1${p.description}"`, "twitter:description");
  html = trocar(html, /<div id="root"><\/div>/, `<div id="root">${corpo}</div>`, `<div id="root">`);
  mkdirSync(`dist${p.rota}`, { recursive: true });
  writeFileSync(`dist${p.rota}/index.html`, html);
}

rmSync("dist/.vite", { recursive: true, force: true });
rmSync("dist-ssr", { recursive: true, force: true });

console.log("postbuild: index.html, 404.html, .nojekyll, negocio/, oportunidade/ e franquia/ (pré-renderizadas) gerados");
