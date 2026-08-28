import { useEffect, useRef, type DragEvent, type PointerEvent } from "react";
import { getAudio } from "@/lib/visualizer/audio";
import { hitHandle, hitLayer, renderFrame } from "@/lib/visualizer/render";
import { runtime } from "@/lib/visualizer/runtime";
import { useStudio } from "@/lib/visualizer/store";
import { STAGE_H, STAGE_W } from "@/lib/visualizer/types";
import { cn } from "@/lib/utils";

function toStage(e: { clientX: number; clientY: number }, el: HTMLCanvasElement) {
  const r = el.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * STAGE_W,
    y: ((e.clientY - r.top) / r.height) * STAGE_H,
    handle: (12 / r.width) * STAGE_W,
  };
}

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<
    | {
        mode: "move" | "scale";
        id: string;
        ox: number;
        oy: number;
        startX: number;
        startY: number;
        startScale: number;
      }
    | null
  >(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = STAGE_W;
    canvas.height = STAGE_H;
    runtime.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const state = useStudio.getState();
      if (state.exporting) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (state.playing && !document.hidden) runtime.clock += dt;
      try {
        runtime.audio = getAudio().tick();
      } catch {
        /* ssr */
      }
      renderFrame(
        ctx,
        state.snapshot(),
        runtime.clock,
        runtime.audio,
        state.recording ? null : { selectedId: state.selectedId },
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (runtime.canvas === canvas) runtime.canvas = null;
    };
  }, []);

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const p = toStage(e, canvas);
    const state = useStudio.getState();
    const selected = state.layers.find((l) => l.id === state.selectedId);
    if (selected && !selected.locked) {
      const handle = hitHandle(selected, p.x, p.y, runtime.clock, runtime.audio, p.handle);
      if (handle !== null) {
        drag.current = {
          mode: "scale",
          id: selected.id,
          ox: p.x,
          oy: p.y,
          startX: selected.x,
          startY: selected.y,
          startScale: selected.scale,
        };
        return;
      }
    }
    const hit = hitLayer(state.layers, p.x, p.y, runtime.clock, runtime.audio);
    if (hit) {
      state.select(hit.id);
      drag.current = {
        mode: "move",
        id: hit.id,
        ox: p.x - hit.x,
        oy: p.y - hit.y,
        startX: hit.x,
        startY: hit.y,
        startScale: hit.scale,
      };
    } else {
      state.select(null);
    }
  }

  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const d = drag.current;
    if (!canvas || !d) return;
    const p = toStage(e, canvas);
    if (d.mode === "move") {
      useStudio.getState().updateLayer(d.id, { x: p.x - d.ox, y: p.y - d.oy });
    } else {
      const dist0 = Math.hypot(d.ox - d.startX, d.oy - d.startY) || 1;
      const dist1 = Math.hypot(p.x - d.startX, p.y - d.startY);
      const scale = Math.max(0.08, d.startScale * (dist1 / dist0));
      useStudio.getState().updateLayer(d.id, { scale });
    }
  }

  function onPointerUp() {
    if (drag.current) useStudio.getState().commit();
    drag.current = null;
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const canvas = canvasRef.current;
    const at = canvas
      ? toStage({ clientX: e.clientX, clientY: e.clientY }, canvas)
      : { x: STAGE_W / 2, y: STAGE_H / 2 };
    if (file.type.startsWith("audio/")) {
      await getAudio().loadFile(file);
      useStudio.getState().setPlaying(true);
      return;
    }
    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      await useStudio.getState().addPng(file, { x: at.x, y: at.y });
      return;
    }
    if (file.type.startsWith("image/")) {
      await useStudio.getState().uploadBackground(file);
    }
  }

  const recording = useStudio((s) => s.recording);

  return (
    <div
      className="flex min-h-0 flex-1 items-center justify-center p-3 md:p-5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "relative aspect-video w-full max-w-7xl overflow-hidden rounded-lg bg-canvas shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
          recording && "shadow-[0_0_0_2px_var(--color-record)]",
        )}
      >
        <canvas
          ref={canvasRef}
          className="size-full cursor-crosshair touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <span className="pointer-events-none absolute right-2 bottom-2 rounded-sm bg-background/70 px-1.5 py-0.5 font-mono text-xs tracking-wide text-muted tabular-nums">
          {recording ? "Exportando" : "1920×1080"}
        </span>
      </div>
    </div>
  );
}
