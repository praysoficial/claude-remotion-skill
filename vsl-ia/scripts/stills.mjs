// Renderiza frames-chave para inspeção: node scripts/stills.mjs 3.5 6.5 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const BROWSER = "/opt/pw-browsers/chromium_headless_shell";
const out = process.env.OUT || "out/stills";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "VSL", browserExecutable: BROWSER });
for (const s of process.argv.slice(2)) {
  const frame = Math.round(parseFloat(s) * 30);
  await renderStill({ serveUrl, composition: comp, frame, output: `${out}/t${s}.jpg`, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5, browserExecutable: BROWSER, overwrite: true });
  console.log("ok", s);
}
