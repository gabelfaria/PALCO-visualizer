import type { MotionKind } from "./types";

export type StickerDef = {
  id: string;
  name: string;
  src: string;
  motion: MotionKind;
  defaultScale?: number;
};

export const BACKGROUNDS = [
  { id: "palco", name: "Palco vazio", src: "/backgrounds/palco.jpg" },
  { id: "bokeh", name: "Bokeh", src: "/backgrounds/bokeh.jpg" },
] as const;

export const STICKERS: StickerDef[] = [
  { id: "vinil", name: "Vinil", src: "/overlays/vinil.png", motion: "spin" },
  { id: "fones", name: "Fones", src: "/overlays/fones.png", motion: "swing" },
  { id: "microfone", name: "Microfone", src: "/overlays/microfone.png", motion: "float" },
  { id: "fita", name: "Fita", src: "/overlays/fita.png", motion: "tilt" },
  { id: "caixa", name: "Caixa", src: "/overlays/caixa.png", motion: "beat" },
  { id: "faisca", name: "Faísca", src: "/overlays/faisca.png", motion: "flicker" },
  { id: "aneis", name: "Anéis", src: "/overlays/aneis.svg", motion: "pulse", defaultScale: 1.4 },
  { id: "nota", name: "Nota", src: "/overlays/nota.svg", motion: "bounce" },
  { id: "raio", name: "Raio", src: "/overlays/raio.svg", motion: "glitch" },
  { id: "halo", name: "Halo", src: "/overlays/halo.svg", motion: "breathe", defaultScale: 1.8 },
];
