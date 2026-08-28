import { OfflineAnalyser } from "./offline-audio";
import { renderFrame } from "./render";
import type { ProjectSnapshot } from "./types";
import { STAGE_H, STAGE_W } from "./types";

export const EXPORT_FPS = 30;

export type ExportProgress = {
  frame: number;
  frames: number;
  time: number;
  duration: number;
};

export async function exportVisualizer(opts: {
  canvas: HTMLCanvasElement;
  buffer: AudioBuffer;
  project: ProjectSnapshot;
  signal: AbortSignal;
  onProgress?: (p: ExportProgress) => void;
}): Promise<{ blob: Blob; ext: "mp4" | "webm" }> {
  if (typeof document === "undefined") {
    throw new Error("export is browser-only");
  }

  const {
    AudioBufferSource,
    BufferTarget,
    CanvasSource,
    Mp4OutputFormat,
    Output,
    QUALITY_HIGH,
    WebMOutputFormat,
    canEncodeAudio,
    canEncodeVideo,
  } = await import("mediabunny");

  const { canvas, buffer, project, signal } = opts;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("canvas indisponível");

  const duration = buffer.duration;
  const frames = Math.max(1, Math.round(duration * EXPORT_FPS));
  const frameDur = 1 / EXPORT_FPS;

  const wantAvc = await canEncodeVideo("avc", { width: STAGE_W, height: STAGE_H, quality: QUALITY_HIGH });
  const wantAac = await canEncodeAudio("aac");
  const mp4 = wantAvc && wantAac;

  const target = new BufferTarget();
  const output = new Output({
    format: mp4 ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  });

  const video = new CanvasSource(canvas, {
    codec: mp4 ? "avc" : "vp9",
    quality: QUALITY_HIGH,
    keyFrameInterval: 2,
  });
  output.addVideoTrack(video, { frameRate: EXPORT_FPS });

  const audio = new AudioBufferSource({
    codec: mp4 ? "aac" : "opus",
    quality: QUALITY_HIGH,
  });
  output.addAudioTrack(audio);

  const analyser = new OfflineAnalyser(buffer);
  await output.start();

  try {
    if (signal.aborted) throw new DOMException("aborted", "AbortError");
    await audio.add(buffer);

    for (let i = 0; i < frames; i++) {
      if (signal.aborted) throw new DOMException("aborted", "AbortError");
      const t = i * frameDur;
      const bands = analyser.at(t);
      renderFrame(ctx, project, t, bands, null);
      await video.add(t, frameDur);
      if (i % 4 === 0) {
        opts.onProgress?.({ frame: i + 1, frames, time: t, duration });
        if (document.visibilityState === "visible") {
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
        }
      }
    }
    opts.onProgress?.({ frame: frames, frames, time: duration, duration });
    await output.finalize();
  } catch (err) {
    await output.cancel().catch(() => undefined);
    throw err;
  }

  const bytes = target.buffer;
  if (!bytes) throw new Error("ficheiro vazio");
  const ext = mp4 ? "mp4" : "webm";
  const mime = mp4 ? "video/mp4" : "video/webm";
  return { blob: new Blob([bytes], { type: mime }), ext };
}
