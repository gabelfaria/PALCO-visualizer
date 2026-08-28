import { mixAudioDrive, sampleMotion } from "./animations";
import { getImage } from "./images";
import type { AudioBands, Layer, ProjectSnapshot } from "./types";
import { STAGE_H, STAGE_W } from "./types";

let noise: HTMLCanvasElement | null = null;

function getNoise() {
  if (noise) return noise;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return c;
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  noise = c;
  return c;
}

function drawFitted(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  mode: "cover" | "contain",
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const r = STAGE_W / STAGE_H;
  let dw: number;
  let dh: number;
  if (mode === "cover" ? ir > r : ir < r) {
    dh = STAGE_H;
    dw = STAGE_H * ir;
  } else {
    dw = STAGE_W;
    dh = STAGE_W / ir;
  }
  ctx.drawImage(img, (STAGE_W - dw) / 2, (STAGE_H - dh) / 2, dw, dh);
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  clock: number,
  audio: AudioBands,
  sampleT: number,
  alphaMul: number,
) {
  const img = getImage(layer.src);
  if (!img) return;
  let sample = sampleMotion(layer.motion, sampleT, layer.intensity, layer.speed, layer.phase, audio);
  sample = mixAudioDrive(sample, layer.audioDrive, audio);
  ctx.save();
  ctx.globalAlpha = layer.opacity * sample.opacity * alphaMul;
  ctx.globalCompositeOperation = layer.blend;
  if (sample.hue) ctx.filter = `hue-rotate(${sample.hue}deg)`;
  ctx.translate(layer.x + sample.dx, layer.y + sample.dy);
  ctx.rotate(layer.rotation + sample.rot);
  ctx.scale(
    layer.scale * sample.scaleX * (layer.flipX ? -1 : 1),
    layer.scale * sample.scaleY,
  );
  ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
  ctx.restore();
}

function drawSpectrum(ctx: CanvasRenderingContext2D, audio: AudioBands, intensity: number) {
  const bins = audio.bins;
  if (!bins) return;
  const count = 72;
  const gap = 4;
  const total = STAGE_W * 0.72;
  const bw = (total - gap * (count - 1)) / count;
  const x0 = (STAGE_W - total) / 2;
  const base = STAGE_H - 64;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < count; i++) {
    const src = Math.floor((i / count) * Math.min(bins.length * 0.45, bins.length));
    const v = (bins[src] ?? 0) / 255;
    const h = Math.max(4, v * 220 * intensity);
    const x = x0 + i * (bw + gap);
    ctx.fillStyle = `rgba(232,228,212,${0.18 + v * 0.55})`;
    ctx.fillRect(x, base - h, bw, h);
  }
  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, amount: number) {
  const g = ctx.createRadialGradient(
    STAGE_W / 2,
    STAGE_H / 2,
    STAGE_H * 0.25,
    STAGE_W / 2,
    STAGE_H / 2,
    STAGE_W * 0.72,
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${amount})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
}

function drawGrain(ctx: CanvasRenderingContext2D, amount: number, clock: number) {
  const n = getNoise();
  ctx.save();
  ctx.globalAlpha = amount * 0.22;
  ctx.globalCompositeOperation = "overlay";
  const ox = (clock * 37) % 64;
  const oy = (clock * 53) % 64;
  ctx.drawImage(n, -ox, -oy, STAGE_W + 64, STAGE_H + 64);
  ctx.restore();
}

export function layerSample(layer: Layer, clock: number, audio: AudioBands) {
  return mixAudioDrive(
    sampleMotion(layer.motion, clock, layer.intensity, layer.speed, layer.phase, audio),
    layer.audioDrive,
    audio,
  );
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  project: ProjectSnapshot,
  clock: number,
  audio: AudioBands,
  chrome: { selectedId: string | null } | null,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#08080a";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (project.backgroundSrc) {
    const bg = getImage(project.backgroundSrc);
    if (bg) drawFitted(ctx, bg, project.backgroundFit);
  }

  for (const layer of project.layers) {
    if (!layer.visible) continue;
    const sample = layerSample(layer, clock, audio);
    if (sample.ghosts > 0) {
      for (let g = sample.ghosts; g >= 1; g--) {
        drawLayer(ctx, layer, clock, audio, clock - g * 0.08, 0.22 / g);
      }
    }
    drawLayer(ctx, layer, clock, audio, clock, 1);
  }

  if (project.spectrum) drawSpectrum(ctx, audio, project.spectrumIntensity);
  if (project.vignette > 0) drawVignette(ctx, project.vignette);
  if (project.grain > 0) drawGrain(ctx, project.grain, clock);

  if (chrome?.selectedId) {
    const layer = project.layers.find((l) => l.id === chrome.selectedId);
    if (layer) drawChrome(ctx, layer, clock, audio);
  }
}

function drawChrome(ctx: CanvasRenderingContext2D, layer: Layer, clock: number, audio: AudioBands) {
  const s = layerSample(layer, clock, audio);
  const w = layer.width * layer.scale * s.scaleX;
  const h = layer.height * layer.scale * s.scaleY;
  ctx.save();
  ctx.translate(layer.x + s.dx, layer.y + s.dy);
  ctx.rotate(layer.rotation + s.rot);
  ctx.strokeStyle = "rgba(232,228,212,0.85)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.setLineDash([]);
  const hs = 10;
  const corners = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ];
  ctx.fillStyle = "#e8e4d4";
  for (const [x, y] of corners) {
    ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs);
  }
  ctx.restore();
}

export function hitLayer(
  layers: Layer[],
  x: number,
  y: number,
  clock: number,
  audio: AudioBands,
): Layer | null {
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]!;
    if (!layer.visible || layer.locked) continue;
    if (pointInLayer(layer, x, y, clock, audio)) return layer;
  }
  return null;
}

export function pointInLayer(
  layer: Layer,
  px: number,
  py: number,
  clock: number,
  audio: AudioBands,
): boolean {
  const s = layerSample(layer, clock, audio);
  const dx = px - (layer.x + s.dx);
  const dy = py - (layer.y + s.dy);
  const rot = -(layer.rotation + s.rot);
  const lx = dx * Math.cos(rot) - dy * Math.sin(rot);
  const ly = dx * Math.sin(rot) + dy * Math.cos(rot);
  const hw = (layer.width * layer.scale * s.scaleX) / 2;
  const hh = (layer.height * layer.scale * s.scaleY) / 2;
  return Math.abs(lx) <= hw && Math.abs(ly) <= hh;
}

export function hitHandle(
  layer: Layer,
  px: number,
  py: number,
  clock: number,
  audio: AudioBands,
  handlePx: number,
): number | null {
  const s = layerSample(layer, clock, audio);
  const dx = px - (layer.x + s.dx);
  const dy = py - (layer.y + s.dy);
  const rot = -(layer.rotation + s.rot);
  const lx = dx * Math.cos(rot) - dy * Math.sin(rot);
  const ly = dx * Math.sin(rot) + dy * Math.cos(rot);
  const hw = (layer.width * layer.scale * s.scaleX) / 2;
  const hh = (layer.height * layer.scale * s.scaleY) / 2;
  const corners = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];
  const pad = handlePx;
  for (let i = 0; i < 4; i++) {
    const [cx, cy] = corners[i]!;
    if (Math.abs(lx - cx) <= pad && Math.abs(ly - cy) <= pad) return i;
  }
  return null;
}
