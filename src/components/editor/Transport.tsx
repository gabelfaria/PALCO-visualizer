import { Circle, Download, ImageDown, Music2, Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { getAudio } from "@/lib/visualizer/audio";
import { exportVisualizer } from "@/lib/visualizer/export-offline";
import {
  downloadBlob,
  fileStem,
  formatClock,
  pickMime,
  startCapture,
  stopCapture,
  combineStreams,
} from "@/lib/visualizer/recorder";
import { runtime } from "@/lib/visualizer/runtime";
import { useStudio } from "@/lib/visualizer/store";
import { cn } from "@/lib/utils";

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
  const abortRef = useRef<AbortController | null>(null);
  const [track, setTrack] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [now, setNow] = useState(0);
  const [duration, setDuration] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(runtime.clock);
      try {
        const a = getAudio();
        setNow(a.currentTime);
        if (a.duration > 0) setDuration(a.duration);
      } catch {
        /* SSR / first paint */
      }
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  async function onMusic(file: File) {
    try {
      const audio = getAudio();
      await audio.loadFile(file);
      setTrack(file.name);
      setDuration(audio.duration);
      setNow(audio.currentTime);
      useStudio.getState().setPlaying(true);
      toast("Música pronta — o looping reage ao grave");
    } catch (err) {
      console.error(err);
      toast("Não deu para ler a música");
    }
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
    if (exporting) return;
    if (recording) {
      recRef.current && stopCapture(recRef.current);
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

  async function exportTrack() {
    if (exporting) {
      abortRef.current?.abort();
      return;
    }
    const canvas = runtime.canvas;
    if (!canvas) return;
    const audio = getAudio();
    if (!audio.name || !audio.file) {
      toast("Importe uma música para exportar");
      audioInput.current?.click();
      return;
    }

    const ac = new AbortController();
    abortRef.current = ac;
    setExporting(true);
    setNow(0);
    audio.pause();
    useStudio.getState().setPlaying(false);
    useStudio.getState().setRecording(true);
    useStudio.getState().setExporting(true);

    let wake: WakeLockSentinel | null = null;
    try {
      wake = await navigator.wakeLock?.request("screen");
    } catch {
      /* unsupported */
    }

    const onHidden = () => {
      if (document.visibilityState === "hidden") {
        toast("A guia foi para segundo plano — o Chrome pode pausar. Deixa o Palco visível até acabar.");
      }
    };
    document.addEventListener("visibilitychange", onHidden);

    try {
      const buffer = await audio.decodeBuffer();
      const length = buffer.duration;
      if (!(length > 0.05)) throw new Error("duração inválida");
      setDuration(length);
      toast("A montar o vídeo frame a frame — mais rápido que a música");
      const { blob, ext } = await exportVisualizer({
        canvas,
        buffer,
        project: useStudio.getState().snapshot(),
        signal: ac.signal,
        onProgress: (p) => {
          setNow(p.time);
          setDuration(p.duration);
        },
      });
      downloadBlob(blob, `palco-${fileStem(audio.name)}.${ext}`);
      toast(`Visualizer exportado · ${formatClock(length)}`);
    } catch (err) {
      if (ac.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) {
        toast("Exportação cancelada");
      } else {
        console.error(err);
        toast("Não deu para exportar o vídeo");
      }
    } finally {
      document.removeEventListener("visibilitychange", onHidden);
      await wake?.release().catch(() => undefined);
      useStudio.getState().setRecording(false);
      useStudio.getState().setExporting(false);
      setExporting(false);
      abortRef.current = null;
    }
  }

  const pct = duration > 0 ? Math.min(1, (exporting ? now : 0) / duration) : 0;
  const clockLabel = duration > 0 ? `${formatClock(now)} / ${formatClock(duration)}` : formatClock(elapsed);

  return (
    <div className="relative flex flex-wrap items-center gap-3 border-t border-border bg-surface px-3 py-3 md:gap-4 md:px-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-elevated"
        aria-hidden={!exporting}
      >
        <div
          className={cn("h-full origin-left bg-primary transition-transform duration-150", !exporting && "scale-x-0")}
          style={{ transform: `scaleX(${exporting ? pct : 0})` }}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          aria-label={playing ? "Pausar" : "Tocar"}
          disabled={exporting}
          onClick={() => {
            const next = !playing;
            useStudio.getState().setPlaying(next);
            if (next) void getAudio().ensure();
            else getAudio().pause();
          }}
        >
          {playing ? <Pause /> : <Play className="ml-0.5" />}
        </Button>
        <Button
          variant={recording && !exporting ? "record" : "secondary"}
          size="icon"
          aria-label={recording && !exporting ? "Parar gravação" : "Gravar clip"}
          disabled={exporting}
          onClick={() => void toggleRecord()}
        >
          {recording && !exporting ? <Square /> : <Circle className="fill-current" />}
        </Button>
        <span className="font-mono text-xs text-muted tabular-nums">{clockLabel}</span>
        <BassMeter />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => audioInput.current?.click()} disabled={exporting}>
          <Music2 />
          <span className="max-w-40 truncate">{track ?? "Música"}</span>
        </Button>
        <input
          id="palco-audio"
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

        <div className="relative z-10 flex items-center gap-2 rounded-md bg-elevated px-2 py-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="flex flex-col leading-none">
            <span className="text-xs tracking-wide text-subtle">Exportar</span>
            <span className="font-mono text-xs text-foreground tabular-nums">
              {duration > 0 ? formatClock(duration) : "—"}
            </span>
          </div>
          <Button
            size="sm"
            variant={exporting ? "record" : "default"}
            onClick={() => void exportTrack()}
            aria-label={exporting ? "Cancelar exportação" : "Exportar visualizer com a duração da música"}
          >
            {exporting ? <Square /> : <Download />}
            {exporting ? "Cancelar" : "Exportar"}
          </Button>
        </div>

        <Button variant="secondary" size="sm" onClick={exportFrame} disabled={exporting}>
          <ImageDown /> Quadro
        </Button>
      </div>

      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-4">
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
