import { Circle, ImageDown, Music2, Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { getAudio } from "@/lib/visualizer/audio";
import { combineStreams, downloadBlob, pickMime } from "@/lib/visualizer/recorder";
import { runtime } from "@/lib/visualizer/runtime";
import { useStudio } from "@/lib/visualizer/store";

function BassMeter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (ref.current) {
        const v = Math.max(0.04, runtime.audio.bass);
        ref.current.style.transform = `scaleX(${v})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="hidden h-1 w-16 overflow-hidden rounded-full bg-elevated sm:block" aria-hidden>
      <div ref={ref} className="h-full origin-left bg-primary" />
    </div>
  );
}

export function Transport() {
  const playing = useStudio((s) => s.playing);
  const recording = useStudio((s) => s.recording);
  const spectrum = useStudio((s) => s.spectrum);
  const spectrumIntensity = useStudio((s) => s.spectrumIntensity);
  const vignette = useStudio((s) => s.vignette);
  const grain = useStudio((s) => s.grain);
  const audioInput = useRef<HTMLInputElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [track, setTrack] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed(runtime.clock), 250);
    return () => window.clearInterval(id);
  }, []);

  async function onMusic(file: File) {
    const audio = getAudio();
    await audio.loadFile(file);
    setTrack(file.name);
    useStudio.getState().setPlaying(true);
    toast("Música pronta — o looping reage ao grave");
  }

  function exportFrame() {
    const canvas = runtime.canvas;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, "palco-quadro.png");
      toast("Quadro 1920×1080 salvo");
    }, "image/png");
  }

  async function toggleRecord() {
    if (recording) {
      recRef.current?.stop();
      return;
    }
    const canvas = runtime.canvas;
    if (!canvas) return;
    useStudio.getState().setPlaying(true);
    useStudio.getState().setRecording(true);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const video = canvas.captureStream(30);
    const audio = getAudio();
    await audio.ensure();
    if (!audio.playing && audio.name) await audio.play();
    const mixed = combineStreams(video, audio.dest?.stream ?? null);
    const mime = pickMime();
    const rec = new MediaRecorder(mixed, { mimeType: mime });
    chunks.current = [];
    rec.ondataavailable = (ev) => {
      if (ev.data.size) chunks.current.push(ev.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: mime });
      const ext = mime.includes("mp4") ? "mp4" : "webm";
      downloadBlob(blob, `palco-visualizer.${ext}`);
      useStudio.getState().setRecording(false);
      recRef.current = null;
      toast("Visualizer exportado");
    };
    rec.start(250);
    recRef.current = rec;
    toast("Gravando o palco…");
  }

  const mm = Math.floor(elapsed / 60);
  const ss = Math.floor(elapsed % 60);

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-surface px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-5">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          aria-label={playing ? "Pausar" : "Tocar"}
          onClick={() => {
            const next = !playing;
            useStudio.getState().setPlaying(next);
            if (next) void getAudio().ensure();
          }}
        >
          {playing ? <Pause /> : <Play className="ml-0.5" />}
        </Button>
        <Button
          variant={recording ? "record" : "secondary"}
          size="icon"
          aria-label={recording ? "Parar gravação" : "Gravar"}
          onClick={() => void toggleRecord()}
        >
          {recording ? <Square /> : <Circle className="fill-current" />}
        </Button>
        <span className="font-mono text-xs text-muted tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </span>
        <BassMeter />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => audioInput.current?.click()}>
          <Music2 />
          <span className="max-w-40 truncate">{track ?? "Música"}</span>
        </Button>
        <input
          ref={audioInput}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onMusic(f);
            e.target.value = "";
          }}
        />
        <Button variant="secondary" size="sm" onClick={exportFrame}>
          <ImageDown /> Quadro
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-muted">
          <Switch checked={spectrum} onCheckedChange={(v) => useStudio.getState().setSpectrum(v)} />
          Spectrum
        </label>
        {spectrum ? (
          <div className="flex w-24 items-center gap-2">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[spectrumIntensity]}
              onValueChange={([v]) => useStudio.getState().setSpectrumIntensity(v ?? 0)}
            />
          </div>
        ) : null}
        <div className="hidden w-28 items-center gap-2 md:flex">
          <span className="text-xs text-subtle">Vinheta</span>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[vignette]}
            onValueChange={([v]) => useStudio.getState().setVignette(v ?? 0)}
          />
        </div>
        <div className="hidden w-28 items-center gap-2 lg:flex">
          <span className="text-xs text-subtle">Grain</span>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[grain]}
            onValueChange={([v]) => useStudio.getState().setGrain(v ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}
