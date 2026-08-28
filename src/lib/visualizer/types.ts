export const STAGE_W = 1920;
export const STAGE_H = 1080;

export type MotionKind =
  | "none"
  | "vibrate"
  | "swing"
  | "spin"
  | "pulse"
  | "float"
  | "bounce"
  | "orbit"
  | "glitch"
  | "wave"
  | "flicker"
  | "pendulum"
  | "breathe"
  | "beat"
  | "figure8"
  | "zoom"
  | "drift"
  | "echo"
  | "shakespin"
  | "heartbeat"
  | "slide"
  | "spiral"
  | "pop"
  | "tilt"
  | "kaleido";

export type BlendMode = "source-over" | "screen" | "multiply" | "overlay" | "lighter";

export type Layer = {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  motion: MotionKind;
  intensity: number;
  speed: number;
  phase: number;
  blend: BlendMode;
  audioDrive: number;
  flipX: boolean;
  locked: boolean;
  visible: boolean;
};

export type AudioBands = {
  bass: number;
  mid: number;
  treble: number;
  beat: number;
  peak: number;
  bins: Uint8Array | null;
};

export type MotionSample = {
  dx: number;
  dy: number;
  rot: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  hue: number;
  ghosts: number;
};

export type ProjectSnapshot = {
  version: 1;
  backgroundSrc: string | null;
  backgroundFit: "cover" | "contain";
  layers: Layer[];
  spectrum: boolean;
  spectrumIntensity: number;
  vignette: number;
  grain: number;
};
