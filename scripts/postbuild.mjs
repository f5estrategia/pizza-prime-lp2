import { copyFileSync, writeFileSync } from "node:fs";

// SPA fallback: o GitHub Pages serve 404.html quando a rota nao existe como
// arquivo estatico (ex: acesso direto/refresh em /pizza-prime-lp2/obrigado).
// Copiar o index.html garante que o React Router assuma a rota.
copyFileSync("dist/index.html", "dist/404.html");

// Impede o processamento Jekyll no GitHub Pages.
writeFileSync("dist/.nojekyll", "");

console.log("postbuild: dist/404.html e dist/.nojekyll gerados");
