// Trilha (56s, 118 BPM) + SFX sintetizados — sem assets externos.
// Trilha acompanha os atos da narração: tensão (0–42s), virada (42s), pausa no
// "Mas existe um detalhe" (77s), revelação (91–94s), oferta e CTA (167s+).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}
let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed / 2147483647) * 2 - 1;
};
const secs = (s) => Math.round(s * SR);
const save = (name, arr) => writeFileSync(join(OUT, name), wav(arr));

// ---------- SFX ----------
{ // whoosh
  const N = secs(0.5), o = new Float32Array(N);
  let lp = 0, lp2 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * Math.pow(t, 0.6)) ** 2;
    const c = 0.03 + 0.2 * Math.sin(Math.PI * t);
    lp += c * (rnd() - lp);
    lp2 += c * (lp - lp2);
    o[i] = lp2 * env * 1.6;
  }
  save("whoosh.wav", o);
}
{ // pop
  const N = secs(0.16), o = new Float32Array(N);
  let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    ph += (2 * Math.PI * (820 - 420 * t)) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 9) * 0.55;
  }
  save("pop.wav", o);
}
{ // tick
  const N = secs(0.06), o = new Float32Array(N);
  let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    ph += (2 * Math.PI * 2100) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 12) * 0.35;
  }
  save("tick.wav", o);
}
{ // impact — sub drop + noise crack
  const N = secs(1.6), o = new Float32Array(N);
  let ph = 0, lp = 0;
  for (let i = 0; i < N; i++) {
    const ts = i / SR, t = i / N;
    ph += (2 * Math.PI * (34 + 70 * Math.exp(-ts * 14))) / SR;
    lp += 0.08 * (rnd() - lp);
    o[i] = Math.sin(ph) * Math.exp(-t * 3.2) * 0.9 + lp * Math.exp(-ts * 18) * 0.9;
  }
  save("impact.wav", o);
}
{ // riser — 2.2s rising filtered noise + tone
  const N = secs(2.2), o = new Float32Array(N);
  let lp = 0, ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const c = 0.01 + 0.35 * t * t;
    lp += c * (rnd() - lp);
    ph += (2 * Math.PI * (180 + 700 * t * t)) / SR;
    const env = Math.pow(t, 2.2);
    o[i] = (lp * 0.8 + Math.sin(ph) * 0.12) * env;
  }
  save("riser.wav", o);
}
{ // shimmer — soft bell arpeggio (A maior add9)
  const N = secs(1.8), o = new Float32Array(N);
  const notes = [880, 1108.7, 1318.5, 1760, 1975.5];
  notes.forEach((f, k) => {
    const s0 = secs(k * 0.07);
    for (let i = s0; i < N; i++) {
      const ts = (i - s0) / SR;
      o[i] += Math.sin(2 * Math.PI * f * ts) * Math.exp(-ts * 2.6) * 0.09;
    }
  });
  save("shimmer.wav", o);
}

// ---------- Trilha (190s) ----------
const DUR = 56;
const N = DUR * SR;
const bed = new Float32Array(N);
const BPM = 118;
const beat = 60 / BPM;
const bar = beat * 4;
// progressão: Am – F – C – G (2 compassos cada)
const chords = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [196, 261.63, 329.63],
  [196, 246.94, 293.66],
];
// intensidade por tempo (0..1) — segue a narrativa
const keys = [
  [0, 0.55], [9.7, 0.45], [13.2, 0.75], [15.2, 0.0], [15.6, 0.5], [21.3, 0.7], [28.0, 0.9],
  [37.9, 0.6], [45.5, 0.85], [46.84, 1.0], [51.0, 1.0], [55.0, 0.7], [56, 0],
];
const inten = (t) => {
  for (let k = 0; k < keys.length - 1; k++) {
    const [a, va] = keys[k], [b, vb] = keys[k + 1];
    if (t >= a && t <= b) {
      const p = (t - a) / (b - a);
      const e = p * p * (3 - 2 * p);
      return va + (vb - va) * e;
    }
  }
  return 0;
};
const pulseOn = (t) => (t > 0.3 && t < 15.2) || (t > 19.0 && t < 55.2);

let lpPad = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const I = inten(t);
  const ci = Math.floor(t / (bar * 2)) % chords.length;
  const chord = chords[ci];
  const tin = (t % (bar * 2)) / (bar * 2);
  const xf = Math.min(1, tin * 12) * Math.min(1, (1 - tin) * 12); // crossfade suave
  let pad = 0;
  for (const f of chord) {
    pad += Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.003 * t + 1.3);
    pad += 0.25 * Math.sin(2 * Math.PI * f * 2.001 * t);
  }
  pad *= 0.045 * xf * (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.11 * t));
  lpPad += 0.12 * (pad - lpPad);
  // sub bass na fundamental
  const sub = Math.sin(2 * Math.PI * (chord[0] / 2) * t) * 0.08 * xf;
  bed[i] = (lpPad + sub) * (0.4 + 0.6 * I);
}
// batidas suaves (kick + hat) nos atos de movimento
for (let tb = 0; tb < DUR; tb += beat) {
  if (!pulseOn(tb)) continue;
  const I = inten(tb);
  const s0 = secs(tb);
  let ph = 0;
  for (let i = 0; i < secs(0.3) && s0 + i < N; i++) {
    const ts = i / SR;
    ph += (2 * Math.PI * (48 + 90 * Math.exp(-ts * 30))) / SR;
    bed[s0 + i] += Math.sin(ph) * Math.exp(-ts * 11) * 0.32 * I;
  }
  const h0 = secs(tb + beat / 2);
  for (let i = 0; i < secs(0.04) && h0 + i < N; i++) {
    bed[h0 + i] += rnd() * Math.exp(-(i / SR) * 90) * 0.035 * I;
  }
}
// fade in/out
for (let i = 0; i < N; i++) {
  const t = i / SR;
  bed[i] *= Math.min(1, t / 1.2) * Math.min(1, (DUR - t) / 3);
}
// normaliza
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(bed[i]));
for (let i = 0; i < N; i++) bed[i] = (bed[i] / peak) * 0.85;
save("bed.wav", bed);
console.log("audio ok");
