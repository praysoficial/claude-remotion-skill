// quadros.mjs — renderiza quadros soltos de uma composição com um único bundle.
// uso: node scripts/dentro-da-farda/quadros.mjs <saida_dir> <seg1> <seg2> ...   (tempos em segundos)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [saida, ...tempos] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "DDF-Ep01", inputProps: { comAudio: false }, browserExecutable });
for (const s of tempos) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(Number(s) * comp.fps));
  const out = path.join(saida, `q_${String(frame).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition: comp, frame, output: out, inputProps: { comAudio: false }, browserExecutable, scale: Number(process.env.ESCALA ?? 0.5), overwrite: true });
  console.log(`${s}s -> ${out}`);
}
