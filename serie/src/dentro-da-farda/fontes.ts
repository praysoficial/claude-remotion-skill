// fontes.ts — fontes locais (public/fontes), carregadas uma vez antes do primeiro frame.
// Ficam dentro do projeto para o render não depender de rede. Licença: SIL OFL 1.1.
import { continueRender, delayRender, staticFile } from "remotion";

const FONTES: [string, string, string][] = [
  ["Anton", "fontes/Anton-400.ttf", "400"],
  ["Inter", "fontes/Inter-600.ttf", "600"],
  ["Inter", "fontes/Inter-800.ttf", "800"],
  ["JetBrains Mono", "fontes/JetBrainsMono-500.ttf", "500"],
  ["JetBrains Mono", "fontes/JetBrainsMono-700.ttf", "700"],
];

if (typeof document !== "undefined") {
  const h = delayRender("Carregando fontes locais");
  Promise.all(
    FONTES.map(([familia, arq, peso]) => {
      const f = new FontFace(familia, `url(${staticFile(arq)})`, { weight: peso });
      return f.load().then((ok) => document.fonts.add(ok));
    }),
  )
    .then(() => continueRender(h))
    .catch((err) => {
      console.error(err);
      continueRender(h);
    });
}
