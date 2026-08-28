export function pickMime(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm",
    "video/mp4",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "video/webm";
}

export function combineStreams(video: MediaStream, audio: MediaStream | null): MediaStream {
  const tracks: MediaStreamTrack[] = [...video.getVideoTracks()];
  if (audio) tracks.push(...audio.getAudioTracks());
  return new MediaStream(tracks);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fileStem(name: string): string {
  const stem = name
    .replace(/\.[^.]+$/, "")
    .replace(/[<>:"/\\|?*]+/g, "")
    .trim();
  return (stem || "visualizer").slice(0, 48);
}

export function startCapture(
  canvas: HTMLCanvasElement,
  audioStream: MediaStream | null,
): { rec: MediaRecorder; mime: string; done: Promise<Blob> } {
  const video = canvas.captureStream(30);
  const mixed = combineStreams(video, audioStream);
  const mime = pickMime();
  let rec: MediaRecorder;
  try {
    rec = new MediaRecorder(mixed, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  } catch {
    rec = new MediaRecorder(mixed, { mimeType: mime });
  }
  const chunks: Blob[] = [];
  const done = new Promise<Blob>((resolve, reject) => {
    rec.ondataavailable = (ev) => {
      if (ev.data.size) chunks.push(ev.data);
    };
    rec.onerror = () => reject(new Error("gravação falhou"));
    rec.onstop = () => resolve(new Blob(chunks, { type: mime }));
  });
  rec.start(250);
  return { rec, mime, done };
}

export function stopCapture(rec: MediaRecorder) {
  if (rec.state === "inactive") return;
  try {
    rec.requestData();
  } catch {
    /* some engines throw if no data yet */
  }
  rec.stop();
}
