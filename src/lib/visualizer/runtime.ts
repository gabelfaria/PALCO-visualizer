import type { AudioBands } from "./types";

export const runtime: {
  clock: number;
  canvas: HTMLCanvasElement | null;
  audio: AudioBands;
} = {
  clock: 0,
  canvas: null,
  audio: {
    bass: 0,
    mid: 0,
    treble: 0,
    beat: 0,
    peak: 0,
    bins: null,
  },
};
