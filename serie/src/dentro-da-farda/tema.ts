// tema.ts — identidade visual de DENTRO DA FARDA. Nenhuma cor ou curva fora daqui.
import { Easing } from "remotion";

export const tema = {
  cor: {
    // destaques da série (um por vez em cada plano)
    vermelho: "#FF3B4A",
    ciano: "#2FE3FF",
    // luz ciano NO CORPO dos bonecos: bem mais clara, para o boneco continuar branco
    luzCiano: "#B5F1FF",
    luzQuente: "#FFF0D6",
    luzFria: "#D3E6F5",

    // personagens
    boneco: "#F1F3F8",
    sombra: "#05070C",
    roupaEscura: "#151A26",
    roupaMedia: "#2A3142",
    gravata: "#10131C",

    // cenários noturnos
    noite: "#05070B",
    concreto: "#1A1F29",
    concretoClaro: "#2A303C",
    concretoEscuro: "#0E1118",
    parede: "#161B25",
    paredeClara: "#222937",
    madeira: "#2A2019",
    madeiraClara: "#3A2C22",
    piso: "#0B0E14",
    faixaAmarela: "#C9A227",
    fluorescente: "#D8E6F2",
    lampadaQuente: "#F2C98A",
    texto: "#F4F6FA",
    textoFraco: "#A3ABBA",
  },
  fonte: {
    titulo: "Anton",
    texto: "Inter",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
} as const;
