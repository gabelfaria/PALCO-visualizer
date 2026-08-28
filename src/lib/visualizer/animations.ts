import type { AudioBands, MotionKind, MotionSample } from "./types";

export const MOTIONS: { id: MotionKind; label: string; hint: string }[] = [
  { id: "none", label: "Parado", hint: "Sem looping" },
  { id: "vibrate", label: "Vibrar", hint: "Treme no lugar" },
  { id: "swing", label: "Balançar", hint: "Oscila como um pêndulo" },
  { id: "spin", label: "Girar", hint: "Rotação contínua" },
  { id: "pulse", label: "Pulsar", hint: "Cresce e diminui" },
  { id: "float", label: "Flutuar", hint: "Sobe e desce suave" },
  { id: "bounce", label: "Quicar", hint: "Bounce elástico" },
  { id: "orbit", label: "Órbita", hint: "Circula em volta" },
  { id: "glitch", label: "Glitch", hint: "Cortes digitais" },
  { id: "wave", label: "Onda", hint: "Desliza em seno" },
  { id: "flicker", label: "Piscar", hint: "Pisca a luz" },
  { id: "pendulum", label: "Pêndulo", hint: "Preso no topo" },
  { id: "breathe", label: "Respirar", hint: "Lento, vivo" },
  { id: "beat", label: "Batida", hint: "Reage ao grave" },
  { id: "figure8", label: "Infinito", hint: "Percorre um 8" },
  { id: "zoom", label: "Zoom", hint: "Aproxima e afasta" },
  { id: "drift", label: "Deriva", hint: "Flutua à deriva" },
  { id: "echo", label: "Eco", hint: "Deixa rastros" },
  { id: "shakespin", label: "Giro-treme", hint: "Gira e treme" },
  { id: "heartbeat", label: "Coração", hint: "Pulso duplo" },
  { id: "slide", label: "Slide", hint: "Vai e volta" },
  { id: "spiral", label: "Espiral", hint: "Entra em espiral" },
  { id: "pop", label: "Pop", hint: "Estoura na batida" },
  { id: "tilt", label: "Tilt", hint: "Inclina em 3D" },
  { id: "kaleido", label: "Caleido", hint: "Gira e muda a cor" },
];

const IDENTITY: MotionSample = {
  dx: 0,
  dy: 0,
  rot: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  hue: 0,
  ghosts: 0,
};

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function rest(): MotionSample {
  return { ...IDENTITY };
}

export function sampleMotion(
  kind: MotionKind,
  t: number,
  intensity: number,
  speed: number,
  phase: number,
  audio: AudioBands,
): MotionSample {
  const i = intensity;
  const w = t * speed + phase;
  const bass = audio.bass;
  const beat = audio.beat;
  const s = rest();

  switch (kind) {
    case "none":
      return s;
    case "vibrate": {
      const amp = 10 * i;
      s.dx = Math.sin(w * 37.1) * amp + Math.sin(w * 53.7) * amp * 0.35;
      s.dy = Math.cos(w * 41.3) * amp + Math.sin(w * 29.9) * amp * 0.3;
      s.rot = Math.sin(w * 19) * 0.07 * i;
      return s;
    }
    case "swing": {
      const ang = Math.sin(w * 2.15) * (0.55 * i);
      s.rot = ang;
      s.dx = Math.sin(ang) * 28 * i;
      s.dy = (1 - Math.cos(ang)) * 18 * i;
      return s;
    }
    case "spin": {
      s.rot = w * (0.7 + i * 1.6);
      return s;
    }
    case "pulse": {
      const p = 0.5 + 0.5 * Math.sin(w * 3.2);
      const k = 1 + p * 0.28 * i;
      s.scaleX = k;
      s.scaleY = k;
      return s;
    }
    case "float": {
      s.dy = Math.sin(w * 1.7) * 36 * i;
      s.dx = Math.sin(w * 0.9) * 10 * i;
      s.rot = Math.sin(w * 1.1) * 0.12 * i;
      return s;
    }
    case "bounce": {
      const cycle = ((w * 1.35) % (Math.PI * 2)) / (Math.PI * 2);
      const drop = Math.abs(Math.sin(cycle * Math.PI));
      const eased = 1 - Math.pow(1 - drop, 2.4);
      s.dy = -(eased * 90 * i);
      s.scaleY = 1 - (1 - eased) * 0.18 * i;
      s.scaleX = 1 + (1 - eased) * 0.12 * i;
      return s;
    }
    case "orbit": {
      const r = 70 * i;
      s.dx = Math.cos(w * 1.6) * r;
      s.dy = Math.sin(w * 1.6) * r * 0.62;
      s.rot = w * 1.6;
      return s;
    }
    case "glitch": {
      const slot = Math.floor(w * 11);
      const on = hash(slot + phase * 10) > 0.68;
      if (on) {
        s.dx = (hash(slot + 1) - 0.5) * 90 * i;
        s.dy = (hash(slot + 2) - 0.5) * 48 * i;
        s.rot = (hash(slot + 3) - 0.5) * 0.35 * i;
        s.scaleX = 1 + (hash(slot + 4) - 0.5) * 0.25 * i;
        s.hue = (hash(slot + 5) - 0.5) * 80 * i;
      }
      return s;
    }
    case "wave": {
      s.dx = Math.sin(w * 2.4) * 80 * i;
      s.dy = Math.sin(w * 2.4 * 2) * 12 * i;
      s.rot = Math.cos(w * 2.4) * 0.18 * i;
      return s;
    }
    case "flicker": {
      const slot = Math.floor(w * 14);
      const on = hash(slot + 9) > 0.22 * (1 - i * 0.4);
      s.opacity = on ? 1 : 0.08 + (1 - i) * 0.4;
      const k = 1 + (on ? 0.04 : -0.04) * i;
      s.scaleX = k;
      s.scaleY = k;
      return s;
    }
    case "pendulum": {
      const ang = Math.sin(w * 1.8) * (0.7 * i);
      s.rot = ang;
      s.dx = Math.sin(ang) * 120 * i;
      s.dy = (1 - Math.cos(ang)) * 50 * i;
      return s;
    }
    case "breathe": {
      const p = 0.5 + 0.5 * Math.sin(w * 1.15);
      const k = 1 + p * 0.16 * i;
      s.scaleX = k;
      s.scaleY = k;
      s.opacity = 0.62 + p * 0.38;
      return s;
    }
    case "beat": {
      const punch = Math.pow(Math.max(bass, beat), 1.35);
      const k = 1 + punch * 0.5 * i;
      s.scaleX = k;
      s.scaleY = k;
      s.dy = -punch * 18 * i;
      return s;
    }
    case "figure8": {
      const a = w * 1.5;
      s.dx = Math.sin(a) * 90 * i;
      s.dy = Math.sin(a * 2) * 42 * i;
      s.rot = Math.cos(a) * 0.25 * i;
      return s;
    }
    case "zoom": {
      const p = 0.5 + 0.5 * Math.sin(w * 0.85);
      const k = 1 - 0.08 * i + p * 0.34 * i;
      s.scaleX = k;
      s.scaleY = k;
      return s;
    }
    case "drift": {
      s.dx = Math.sin(w * 0.37 + 1.2) * 48 * i + Math.sin(w * 0.91) * 10 * i;
      s.dy = Math.cos(w * 0.29) * 36 * i + Math.sin(w * 0.6) * 8 * i;
      s.rot = Math.sin(w * 0.4) * 0.2 * i;
      return s;
    }
    case "echo": {
      const p = 0.5 + 0.5 * Math.sin(w * 2.6);
      s.dx = Math.sin(w * 1.8) * 16 * i;
      s.dy = Math.cos(w * 1.4) * 10 * i;
      s.scaleX = 1 + p * 0.06 * i;
      s.scaleY = s.scaleX;
      s.ghosts = 3;
      return s;
    }
    case "shakespin": {
      const amp = 7 * i;
      s.rot = w * (0.9 + i);
      s.dx = Math.sin(w * 41) * amp;
      s.dy = Math.cos(w * 37) * amp;
      return s;
    }
    case "heartbeat": {
      const cycle = (w * 1.2) % (Math.PI * 2);
      const a = Math.exp(-Math.pow((cycle - 0.45) * 5, 2));
      const b = Math.exp(-Math.pow((cycle - 1.15) * 5.5, 2));
      const p = a + b * 0.7;
      const k = 1 + p * 0.32 * i;
      s.scaleX = k;
      s.scaleY = k;
      return s;
    }
    case "slide": {
      s.dx = Math.sin(w * 1.55) * 110 * i;
      s.scaleX = 1 + Math.abs(Math.cos(w * 1.55)) * 0.06 * i;
      s.scaleY = 2 - s.scaleX;
      return s;
    }
    case "spiral": {
      const p = 0.5 + 0.5 * Math.sin(w * 1.1);
      const r = (20 + 90 * p) * i;
      s.dx = Math.cos(w * 3.2) * r;
      s.dy = Math.sin(w * 3.2) * r;
      s.rot = w * 3.2;
      const k = 0.75 + p * 0.5;
      s.scaleX = k;
      s.scaleY = k;
      return s;
    }
    case "pop": {
      const punch = Math.pow(Math.max(beat, bass * 0.8), 1.2);
      const k = 1 + punch * 0.7 * i;
      s.scaleX = k;
      s.scaleY = k;
      s.rot = (hash(Math.floor(t * 8) + phase) - 0.5) * punch * 0.2 * i;
      return s;
    }
    case "tilt": {
      const p = Math.sin(w * 1.9);
      s.rot = p * 0.22 * i;
      s.scaleX = 1 + p * 0.18 * i;
      s.scaleY = 1 - p * 0.12 * i;
      s.dy = Math.sin(w * 0.9) * 10 * i;
      return s;
    }
    case "kaleido": {
      s.rot = w * 1.1;
      const p = 0.5 + 0.5 * Math.sin(w * 2.4);
      const k = 1 + p * 0.14 * i;
      s.scaleX = k;
      s.scaleY = k;
      s.hue = (w * 70 * i) % 360;
      s.opacity = 0.75 + p * 0.25;
      return s;
    }
    default:
      return s;
  }
}

export function mixAudioDrive(sample: MotionSample, drive: number, audio: AudioBands): MotionSample {
  if (drive <= 0.001) return sample;
  const punch = Math.pow(Math.max(audio.bass, audio.beat), 1.25) * drive;
  const k = 1 + punch * 0.35;
  return {
    ...sample,
    scaleX: sample.scaleX * k,
    scaleY: sample.scaleY * k,
    dy: sample.dy - punch * 10,
    opacity: Math.min(1, sample.opacity * (0.85 + punch * 0.3)),
  };
}
