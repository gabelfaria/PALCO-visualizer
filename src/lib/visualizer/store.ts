import { create } from "zustand";
import { BACKGROUNDS, type StickerDef } from "./catalog";
import { fileToDataUrl, fitInside, preload } from "./images";
import { loadProject, saveProject } from "./persist";
import type { BlendMode, Layer, MotionKind, ProjectSnapshot } from "./types";
import { STAGE_H, STAGE_W } from "./types";
import { uid } from "@/lib/utils";

type StudioState = {
  backgroundSrc: string | null;
  backgroundFit: "cover" | "contain";
  layers: Layer[];
  selectedId: string | null;
  playing: boolean;
  clock: number;
  spectrum: boolean;
  spectrumIntensity: number;
  vignette: number;
  grain: number;
  recording: boolean;
  exporting: boolean;
  ready: boolean;
  past: ProjectSnapshot[];
  future: ProjectSnapshot[];
  hydrate: () => Promise<void>;
  snapshot: () => ProjectSnapshot;
  commit: () => void;
  undo: () => void;
  redo: () => void;
  persistSoon: () => void;
  setBackground: (src: string | null) => void;
  uploadBackground: (file: File) => Promise<void>;
  addSticker: (sticker: StickerDef, at?: { x: number; y: number }) => Promise<void>;
  addPng: (file: File, at?: { x: number; y: number }) => Promise<void>;
  select: (id: string | null) => void;
  updateLayer: (id: string, patch: Partial<Layer>, commit?: boolean) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  moveLayer: (id: string, dir: 1 | -1) => void;
  setPlaying: (v: boolean) => void;
  setClock: (t: number) => void;
  setSpectrum: (v: boolean) => void;
  setSpectrumIntensity: (v: number) => void;
  setVignette: (v: number) => void;
  setGrain: (v: number) => void;
  setRecording: (v: boolean) => void;
  setExporting: (v: boolean) => void;
  reset: () => void;
};

function demoLayers(): Layer[] {
  return [
    makeLayer({
      id: "demo-aneis",
      name: "Anéis",
      src: "/overlays/aneis.svg",
      x: 960,
      y: 540,
      width: 720,
      height: 720,
      motion: "pulse",
      intensity: 0.55,
      speed: 0.7,
      blend: "screen",
      audioDrive: 0.7,
      phase: 0.4,
    }),
    makeLayer({
      id: "demo-vinil",
      name: "Vinil",
      src: "/overlays/vinil.png",
      x: 430,
      y: 700,
      width: 380,
      height: 382,
      motion: "spin",
      intensity: 0.7,
      speed: 0.55,
      phase: 1.1,
    }),
    makeLayer({
      id: "demo-faisca",
      name: "Faísca",
      src: "/overlays/faisca.png",
      x: 1480,
      y: 280,
      width: 280,
      height: 286,
      motion: "flicker",
      intensity: 0.8,
      speed: 1.2,
      blend: "screen",
      phase: 2.2,
    }),
  ];
}

function makeLayer(partial: Partial<Layer> & Pick<Layer, "name" | "src">): Layer {
  return {
    id: uid(),
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    width: 360,
    height: 360,
    rotation: 0,
    scale: 1,
    opacity: 1,
    motion: "float",
    intensity: 0.6,
    speed: 1,
    phase: Math.random() * Math.PI * 2,
    blend: "source-over",
    audioDrive: 0.25,
    flipX: false,
    locked: false,
    visible: true,
    ...partial,
  };
}

function defaultProject(): ProjectSnapshot {
  return {
    version: 1,
    backgroundSrc: BACKGROUNDS[0].src,
    backgroundFit: "cover",
    layers: demoLayers(),
    spectrum: true,
    spectrumIntensity: 0.55,
    vignette: 0.45,
    grain: 0.12,
  };
}

function applySnapshot(s: ProjectSnapshot) {
  return {
    backgroundSrc: s.backgroundSrc as string | null,
    backgroundFit: s.backgroundFit,
    layers: s.layers,
    spectrum: s.spectrum,
    spectrumIntensity: s.spectrumIntensity,
    vignette: s.vignette,
    grain: s.grain,
    selectedId: s.layers[s.layers.length - 1]?.id ?? null,
  };
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

export const useStudio = create<StudioState>((set, get) => ({
  ...applySnapshot(defaultProject()),
  playing: true,
  clock: 0,
  recording: false,
  exporting: false,
  ready: false,
  past: [],
  future: [],

  snapshot: () => {
    const s = get();
    return {
      version: 1 as const,
      backgroundSrc: s.backgroundSrc,
      backgroundFit: s.backgroundFit,
      layers: s.layers,
      spectrum: s.spectrum,
      spectrumIntensity: s.spectrumIntensity,
      vignette: s.vignette,
      grain: s.grain,
    };
  },

  persistSoon: () => {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      void saveProject(get().snapshot());
    }, 400);
  },

  commit: () => {
    const snap = get().snapshot();
    set((s) => ({ past: [...s.past.slice(-29), snap], future: [] }));
    get().persistSoon();
  },

  undo: () => {
    const { past, snapshot } = get();
    const prev = past[past.length - 1];
    if (!prev) return;
    const current = snapshot();
    set({
      ...applySnapshot(prev),
      past: past.slice(0, -1),
      future: [...get().future, current],
    });
    get().persistSoon();
  },

  redo: () => {
    const { future, snapshot } = get();
    const next = future[future.length - 1];
    if (!next) return;
    const current = snapshot();
    set({
      ...applySnapshot(next),
      future: future.slice(0, -1),
      past: [...get().past, current],
    });
    get().persistSoon();
  },

  hydrate: async () => {
    try {
      const saved = await loadProject();
      if (saved?.version === 1) {
        set({ ...applySnapshot(saved), ready: true });
        const srcs = [
          saved.backgroundSrc,
          ...saved.layers.map((l) => l.src),
        ].filter(Boolean) as string[];
        await Promise.all(srcs.map((s) => preload(s).catch(() => undefined)));
        return;
      }
    } catch {
      /* empty studio is fine */
    }
    const current = get();
    set({
      ready: true,
      selectedId: current.layers[1]?.id ?? current.layers[0]?.id ?? null,
    });
    await Promise.all(
      [current.backgroundSrc, ...current.layers.map((l) => l.src)]
        .filter(Boolean)
        .map((s) => preload(s as string).catch(() => undefined)),
    );
  },

  setBackground: (src) => {
    get().commit();
    set({ backgroundSrc: src });
    if (src) void preload(src);
    get().persistSoon();
  },

  uploadBackground: async (file) => {
    const src = await fileToDataUrl(file);
    get().setBackground(src);
  },

  addSticker: async (sticker, at) => {
    const img = await preload(sticker.src);
    const fitted = fitInside(img.naturalWidth, img.naturalHeight, 520);
    const scale = sticker.defaultScale ?? 1;
    const layer = makeLayer({
      name: sticker.name,
      src: sticker.src,
      x: at?.x ?? STAGE_W / 2,
      y: at?.y ?? STAGE_H / 2,
      width: fitted.width,
      height: fitted.height,
      scale,
      motion: sticker.motion,
    });
    get().commit();
    set((s) => ({ layers: [...s.layers, layer], selectedId: layer.id }));
    get().persistSoon();
  },

  addPng: async (file, at) => {
    const src = await fileToDataUrl(file);
    const img = await preload(src);
    const fitted = fitInside(img.naturalWidth, img.naturalHeight, 640);
    const layer = makeLayer({
      name: file.name.replace(/\.[^.]+$/, ""),
      src,
      x: at?.x ?? STAGE_W / 2,
      y: at?.y ?? STAGE_H / 2,
      width: fitted.width,
      height: fitted.height,
      motion: "float",
    });
    get().commit();
    set((s) => ({ layers: [...s.layers, layer], selectedId: layer.id }));
    get().persistSoon();
  },

  select: (id) => set({ selectedId: id }),

  updateLayer: (id, patch, commit = false) => {
    if (commit) get().commit();
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
    get().persistSoon();
  },

  removeLayer: (id) => {
    get().commit();
    set((s) => ({
      layers: s.layers.filter((l) => l.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    get().persistSoon();
  },

  duplicateLayer: (id) => {
    const src = get().layers.find((l) => l.id === id);
    if (!src) return;
    const copy: Layer = {
      ...src,
      id: uid(),
      x: src.x + 36,
      y: src.y + 36,
      name: `${src.name} cópia`,
      phase: Math.random() * Math.PI * 2,
    };
    get().commit();
    set((s) => ({ layers: [...s.layers, copy], selectedId: copy.id }));
    get().persistSoon();
  },

  moveLayer: (id, dir) => {
    const layers = [...get().layers];
    const i = layers.findIndex((l) => l.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= layers.length) return;
    const tmp = layers[i]!;
    layers[i] = layers[j]!;
    layers[j] = tmp;
    get().commit();
    set({ layers });
    get().persistSoon();
  },

  setPlaying: (v) => set({ playing: v }),
  setClock: (t) => set({ clock: t }),
  setSpectrum: (v) => {
    set({ spectrum: v });
    get().persistSoon();
  },
  setSpectrumIntensity: (v) => {
    set({ spectrumIntensity: v });
    get().persistSoon();
  },
  setVignette: (v) => {
    set({ vignette: v });
    get().persistSoon();
  },
  setGrain: (v) => {
    set({ grain: v });
    get().persistSoon();
  },
  setRecording: (v) => set({ recording: v }),
  setExporting: (v) => set({ exporting: v }),

  reset: () => {
    const demo = defaultProject();
    get().commit();
    set({ ...applySnapshot(demo), clock: 0, playing: true });
    get().persistSoon();
  },
}));

export function selectedLayer(state: StudioState): Layer | null {
  if (!state.selectedId) return null;
  return state.layers.find((l) => l.id === state.selectedId) ?? null;
}

export type { BlendMode, MotionKind };
