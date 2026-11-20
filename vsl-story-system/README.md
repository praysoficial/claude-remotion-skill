# VSL — Story System

VSL horizontal (1920×1080, 30 fps, ~3 min 10 s) feita em Remotion, montada sobre a narração
original e sincronizada palavra a palavra com a transcrição do áudio.

## Como renderizar

1. Coloque os arquivos de mídia (não versionados):
   - `public/narracao.mp3` — narração
   - `public/img/tiktok.png` e `public/img/instagram.png` — capturas dos perfis (1080×2388)
   - `public/logo.png` — logo oficial do Story System (PNG transparente)
2. Em `src/brand.ts`, mude `HAS_LOGO` para `true` e ajuste `LOGO_ASPECT` (largura ÷ altura da logo).
   Se a logo usar outras cores, ajuste a paleta em `src/theme.ts`.
3. `npm install && npm run audio && npm run render`

## Estrutura

| Arquivo | Função |
| --- | --- |
| `src/captions.ts` | Legendas geradas da transcrição (timestamps por palavra) |
| `src/VSL.tsx` | Mapa de cenas ↔ trechos da narração, transições, trilha, SFX |
| `src/scenes/ActOne.tsx` | Gancho, ciclo, dor, virada participativa, prova TikTok/Instagram |
| `src/scenes/ActTwo.tsx` | Conceito, pilares, revelação, módulos, a diferença |
| `src/scenes/ActThree.tsx` | Método, objeção, transparência, CTA |
| `src/components/Device.tsx` | Celular 3D, câmera com keyframes, destaques sobre as capturas |
| `scripts/gen-audio.mjs` | Trilha e efeitos sintetizados (sem arquivos externos) |
| `scripts/stills.mjs` | Renderiza frames avulsos para revisão |

Todos os números exibidos vêm das capturas: Instagram 10,1 mil seguidores, 5 posts,
337,0 mil visualizações em 30 dias, Reel com 264 mil; TikTok 10,7 mil seguidores, 56,7 mil curtidas.
