import type { AudioBands } from "./types";

const SILENT: AudioBands = {
  bass: 0,
  mid: 0,
  treble: 0,
  beat: 0,
  peak: 0,
  bins: null,
};

class AudioEngine {
  el: HTMLAudioElement;
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  source: MediaElementAudioSourceNode | null = null;
  dest: MediaStreamAudioDestinationNode | null = null;
  freq = new Uint8Array(1024);
  bands: AudioBands = { ...SILENT, bins: this.freq };
  private beatHold = 0;
  private lastBass = 0;
  file: File | null = null;
  name: string | null = null;

  constructor() {
    this.el = document.createElement("audio");
    this.el.crossOrigin = "anonymous";
    this.el.preload = "auto";
    this.el.loop = true;
  }

  async ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;
    const source = ctx.createMediaElementSource(this.el);
    const dest = ctx.createMediaStreamDestination();
    source.connect(analyser);
    analyser.connect(ctx.destination);
    source.connect(dest);
    this.ctx = ctx;
    this.analyser = analyser;
    this.source = source;
    this.dest = dest;
    this.freq = new Uint8Array(analyser.frequencyBinCount);
    this.bands.bins = this.freq;
    if (ctx.state === "suspended") await this.ctx.resume();
  }

  async waitMetadata() {
    if (Number.isFinite(this.el.duration) && this.el.duration > 0) return;
    await new Promise<void>((resolve, reject) => {
      const ok = () => {
        cleanup();
        resolve();
      };
      const fail = () => {
        cleanup();
        reject(new Error("áudio inválido"));
      };
      const cleanup = () => {
        this.el.removeEventListener("loadedmetadata", ok);
        this.el.removeEventListener("error", fail);
      };
      this.el.addEventListener("loadedmetadata", ok);
      this.el.addEventListener("error", fail);
    });
  }

  async loadFile(file: File) {
    await this.ensure();
    if (this.el.src.startsWith("blob:")) URL.revokeObjectURL(this.el.src);
    this.el.src = URL.createObjectURL(file);
    this.name = file.name;
    this.file = file;
    this.el.load();
    await this.waitMetadata();
    await this.el.play().catch(() => undefined);
  }

  async toggle() {
    await this.ensure();
    if (this.el.paused) await this.el.play();
    else this.el.pause();
  }

  async play() {
    await this.ensure();
    await this.el.play().catch(() => undefined);
  }

  pause() {
    this.el.pause();
  }

  async rewind() {
    this.el.currentTime = 0;
    if (this.el.currentTime < 0.15) return;
    await new Promise<void>((resolve) => {
      const done = () => {
        this.el.removeEventListener("seeked", done);
        resolve();
      };
      this.el.addEventListener("seeked", done);
      window.setTimeout(done, 500);
    });
  }

  setLoop(v: boolean) {
    this.el.loop = v;
  }

  get playing() {
    return !this.el.paused && !this.el.ended;
  }

  get duration() {
    const d = this.el.duration;
    return Number.isFinite(d) ? d : 0;
  }

  get currentTime() {
    return this.el.currentTime || 0;
  }

  async decodeBuffer(): Promise<AudioBuffer> {
    if (!this.file) throw new Error("sem faixa");
    await this.ensure();
    const data = await this.file.arrayBuffer();
    return this.ctx!.decodeAudioData(data.slice(0));
  }

  tick(): AudioBands {
    if (!this.analyser || this.el.paused) {
      this.bands.bass *= 0.86;
      this.bands.mid *= 0.86;
      this.bands.treble *= 0.86;
      this.bands.beat *= 0.82;
      this.bands.peak *= 0.9;
      this.beatHold *= 0.9;
      return this.bands;
    }
    this.analyser.getByteFrequencyData(this.freq);
    const n = this.freq.length;
    const avg = (from: number, to: number) => {
      let s = 0;
      const a = Math.max(0, from);
      const b = Math.min(n, to);
      for (let i = a; i < b; i++) s += this.freq[i] ?? 0;
      return b > a ? s / (b - a) / 255 : 0;
    };
    const bass = Math.pow(avg(0, 12), 0.85);
    const mid = avg(12, 80);
    const treble = avg(80, 280);
    const peak = Math.max(bass, mid, treble);
    const onset = bass - this.lastBass;
    this.lastBass = bass;
    if (onset > 0.08 && bass > 0.32 && this.beatHold < 0.2) {
      this.beatHold = 1;
    } else {
      this.beatHold = Math.max(0, this.beatHold - 0.045);
    }
    this.bands.bass = bass;
    this.bands.mid = mid;
    this.bands.treble = treble;
    this.bands.peak = peak;
    this.bands.beat = this.beatHold;
    return this.bands;
  }
}

let engine: AudioEngine | null = null;

export function getAudio(): AudioEngine {
  if (typeof document === "undefined") {
    throw new Error("audio is browser-only");
  }
  if (!engine) engine = new AudioEngine();
  return engine;
}

export function silentBands(): AudioBands {
  return SILENT;
}
