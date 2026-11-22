# Série: boneco palito

- `src/personagem/pose.ts`: tipo `Pose` (ângulos de tronco, cabeça, braços e pernas), biblioteca `POSES`, `mixPose`, `somaPose` (camadas aditivas), `poseNoTempo` (chaves em segundos) e `envelope`.
- `src/personagem/Boneco.tsx`: o personagem. `<Boneco pose x chao escala luz />` mantém os pés no chão em qualquer pose. `esqueleto()` devolve as juntas, para prender objetos à mão.
- `src/cenarios/QuartoNoite.tsx`: quarto escuro com o monitor como luz principal.
- `src/episodios/Teste.tsx`: teste de 5s, com aceno e braços cruzados.

```bash
npm install
npx remotion render src/index.ts Teste out/teste.mp4 --codec h264 --crf 17
```
