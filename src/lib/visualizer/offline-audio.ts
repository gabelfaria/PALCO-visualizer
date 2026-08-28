import type { AudioBands } from "./types";

const FFT = 2048;
const BINS = FFT / 2;
const MIN_DB = -100;
const MAX_DB = -30;
const SMOOTH = 0.78;

function fftInPlace(re: Float32Array, im: Float32Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]!;
      re[i] = re[j]!;
      re[j] = tr;
      const ti = im[i]!;
      im[i] = im[j]!;
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (2 * Math.PI) / len;
    const wlenRe = Math.cos(ang);
    const wlenIm = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      for (let j = 0; j < half; j++) {
        const p = i + j;
        const q = p + half;
        const vr = re[q]! * wRe - im[q]! * wIm;
        const vi = re[q]! * wIm + im[q]! * wRe;
        re[q] = re[p]! - vr;
        im[q] = im[p]! - vi;
        re[p] += vr;
        im[p] += vi;
        const nRe = wRe * wlenRe - wIm * wlenIm;
        wIm = wRe * wlenIm + wIm * wlenRe;
        wRe = nRe;
      }
    }
  }
}

export class OfflineAnalyser {
  private readonly ch0: Float32Array;
  private readonly ch1: Float32Array | null;
  private readonly sr: number;
  private readonly re = new Float32Array(FFT);
  private readonly im = new Float32Array(FFT);
  private readonly mag = new Float32Array(BINS);
  readonly bins = new Uint8Array(BINS);
  private lastBass = 0;
  private beatHold = 0;

  constructor(buffer: AudioBuffer) {
    this.ch0 = buffer.getChannelData(0);
    this.ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
    this.sr = buffer.sampleRate;
  }

  at(time: number): AudioBands {
    const start = Math.floor(time * this.sr);
    const len = this.ch0.length;
    for (let i = 0; i < FFT; i++) {
      const idx = start + i;
      let s = 0;
      if (idx >= 0 && idx < len) {
        s = this.ch0[idx]!;
        if (this.ch1) s = (s + (this.ch1[idx] ?? 0)) * 0.5;
      }
      const hann = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (FFT - 1)));
      this.re[i] = s * hann;
      this.im[i] = 0;
    }
    fftInPlace(this.re, this.im);
    const range = MAX_DB - MIN_DB;
    for (let i = 0; i < BINS; i++) {
      const mag = Math.hypot(this.re[i]!, this.im[i]!) / FFT;
      const db = mag > 1e-12 ? 20 * Math.log10(mag) : MIN_DB;
      const byte = Math.max(0, Math.min(255, ((db - MIN_DB) / range) * 255));
      this.mag[i] = SMOOTH * this.mag[i]! + (1 - SMOOTH) * byte;
      this.bins[i] = this.mag[i]!;
    }
    const avg = (from: number, to: number) => {
      let s = 0;
      const a = Math.max(0, from);
      const b = Math.min(BINS, to);
      for (let i = a; i < b; i++) s += this.bins[i] ?? 0;
      return b > a ? s / (b - a) / 255 : 0;
    };
    const bass = Math.pow(avg(0, 12), 0.85);
    const mid = avg(12, 80);
    const treble = avg(80, 280);
    const peak = Math.max(bass, mid, treble);
    const onset = bass - this.lastBass;
    this.lastBass = bass;
    if (onset > 0.08 && bass > 0.32 && this.beatHold < 0.2) this.beatHold = 1;
    else this.beatHold = Math.max(0, this.beatHold - 0.045);
    return {
      bass,
      mid,
      treble,
      peak,
      beat: this.beatHold,
      bins: this.bins,
    };
  }
}
