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

// LP /negocio: HTML proprio com title/description/og da pagina (o preview do
// link no WhatsApp e no Instagram le so o HTML), ja pre-renderizado (o texto
// aparece antes do JavaScript) e com 200 no GitHub Pages.
const NEGOCIO = {
  title: "Franquia Pizza Prime | Modelo, investimento e números da rede",
  description:
    "Modelo delivery testado em mais de 100 unidades: investimento de R$ 249 mil + R$ 50 mil de capital de giro, cozinha central e suporte do ponto à inauguração. Fale com o time de expansão.",
};

const trocar = (html, regex, novo, nome) => {
  if (!regex.test(html)) throw new Error(`postbuild: não achei ${nome} no index.html`);
  return html.replace(regex, novo);
};

const { render } = await import(pathToFileURL("dist-ssr/negocio.js").href);
const corpo = render();
if (!corpo.includes("formulario")) throw new Error("postbuild: pré-renderização da /negocio veio sem o formulário");

let html = comPreload(htmlOriginal, arquivosDe("src/pages/Negocio.tsx"));
html = trocar(html, /<title>[^<]*<\/title>/, `<title>${NEGOCIO.title}</title>`, "<title>");
html = trocar(html, /(<meta name="description" content=")[^"]*"/, `$1${NEGOCIO.description}"`, "description");
html = trocar(html, /(<meta property="og:title" content=")[^"]*"/, `$1${NEGOCIO.title}"`, "og:title");
html = trocar(html, /(<meta property="og:description" content=")[^"]*"/, `$1${NEGOCIO.description}"`, "og:description");
html = trocar(html, /(<meta name="twitter:title" content=")[^"]*"/, `$1${NEGOCIO.title}"`, "twitter:title");
html = trocar(html, /(<meta name="twitter:description" content=")[^"]*"/, `$1${NEGOCIO.description}"`, "twitter:description");
html = trocar(html, /<div id="root"><\/div>/, `<div id="root">${corpo}</div>`, '<div id="root">');
mkdirSync("dist/negocio", { recursive: true });
writeFileSync("dist/negocio/index.html", html);

rmSync("dist/.vite", { recursive: true, force: true });
rmSync("dist-ssr", { recursive: true, force: true });

console.log("postbuild: index.html, 404.html, .nojekyll e negocio/index.html (pré-renderizada) gerados");
