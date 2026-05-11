# Pizza Prime — Landing Page (Deploy)

Build de produção validado para **https://f5estrategia.github.io/pizza-prime-lp2/**.

## Status do build

- React Router com `basename=/pizza-prime-lp2/` ✓
- Vite `base=/pizza-prime-lp2/` ✓
- Favicon, foto do fundador, JS, CSS e 404 SPA validados localmente ✓
- `.nojekyll` incluído ✓

## Como publicar (recomendado: git)

A UI web do GitHub filtra arquivos ocultos (`.nojekyll` não sobe via drag-and-drop), então o git é o caminho seguro:

```bash
cd "pizza-prime-lp2"
git init
git add .
git commit -m "Deploy: build com basename e foto do fundador corrigidos"
git branch -M main
git remote add origin https://github.com/f5estrategia/pizza-prime-lp2.git
git push -u origin main --force
```

> O `--force` substitui o build antigo (que apontava para `/pizza-prime-lp/`).

## Alternativa: UI web do GitHub

1. No repo `pizza-prime-lp2`, **apague todos os arquivos antigos** (eles referenciam `/pizza-prime-lp/` que não existe).
2. Arraste o conteúdo desta pasta na UI de upload.
3. Crie o `.nojekyll` manualmente: **Add file → Create new file → nome `.nojekyll` → conteúdo vazio → Commit**.

## Depois do push

1. Aguarde 1–2 minutos.
2. Abra https://f5estrategia.github.io/pizza-prime-lp2/ com **Ctrl+Shift+R** (hard refresh, evita cache do build antigo).

## Conteúdo da pasta

- `index.html` + `404.html` — entry + fallback SPA
- `.nojekyll` — desabilita Jekyll no GitHub Pages
- `assets/` — JS, CSS e todas as imagens com hash de cache
- `lovable-uploads/05634cf5-...jpg` — foto do fundador (referenciada via path absoluto no código)
- `favicon.ico`, `placeholder.svg`, `robots.txt`
