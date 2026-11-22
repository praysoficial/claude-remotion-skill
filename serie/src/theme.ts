// theme.ts — única fonte de cores, curvas e molas da série.
// Nunca escreva hex ou easing direto num componente.
import { Easing } from "remotion";

export const theme = {
  cores: {
    // personagem
    boneco: "#F4F6FB",
    bonecoSombra: "#0B1024",

    // quarto à noite
    parede: "#141C36",
    paredeBaixo: "#0B1022",
    chao: "#0A0D19",
    chaoFundo: "#05070D",
    rodape: "#070A14",
    silhueta: "#070A14",
    moveis: "#0E1426",
    moveisBorda: "#1C2747",
    cobertor: "#131B35",
    ceuTopo: "#1E2F5C",
    ceuBaixo: "#0E1733",
    lua: "#E3E9FF",
    estrela: "#C9D6FF",

    // monitor — a única fonte de luz forte (cor herói)
    tela: "#D9ECFF",
    telaBorda: "#7DB2FF",
    luzMonitor: "#7FB0FF",
    luzMonitorForte: "#B8D6FF",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  mola: {
    // poses: um pouco de overshoot dá peso ao gesto
    gesto: { damping: 13, stiffness: 110, mass: 0.9 },
    suave: { damping: 20, stiffness: 90, mass: 1 },
  },
} as const;
