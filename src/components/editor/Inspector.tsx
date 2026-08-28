import {
  Copy,
  FlipHorizontal,
  Maximize,
  Scan,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { MOTIONS } from "@/lib/visualizer/animations";
import { selectedLayer, useStudio } from "@/lib/visualizer/store";
import type { BlendMode, Layer } from "@/lib/visualizer/types";
import { STAGE_H, STAGE_W } from "@/lib/visualizer/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const BLENDS: { id: BlendMode; label: string }[] = [
  { id: "source-over", label: "Normal" },
  { id: "screen", label: "Tela" },
  { id: "lighter", label: "Soma" },
  { id: "overlay", label: "Overlay" },
  { id: "multiply", label: "Multi" },
];

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {value ? <span className="font-mono text-xs text-subtle tabular-nums">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function Inspector() {
  const layer = useStudio(selectedLayer);
  const updateLayer = useStudio((s) => s.updateLayer);
  if (!layer) {
    return (
      <div className="flex h-full flex-col items-start justify-center px-1 py-6">
        <p className="font-display text-base font-semibold tracking-tight text-balance">Nenhuma peça</p>
        <p className="mt-1 text-sm text-muted text-pretty">
          Selecione um PNG no palco ou solte um arquivo para animar.
        </p>
      </div>
    );
  }

  const patch = (p: Partial<Layer>, commit = false) => updateLayer(layer.id, p, commit);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <Field label="Nome">
        <Input value={layer.name} onChange={(e) => patch({ name: e.target.value })} />
      </Field>

      <Field label="Looping">
        <div className="grid grid-cols-3 gap-1">
          {MOTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.hint}
              onClick={() => patch({ motion: m.id }, true)}
              className={cn(
                "h-8 rounded-sm px-1 text-xs font-medium tracking-wide transition-[background-color,color] duration-150 ease-out",
                layer.motion === m.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-elevated text-muted hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Intensidade" value={`${Math.round(layer.intensity * 100)}`}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[layer.intensity]}
          onValueChange={([v]) => patch({ intensity: v ?? 0 })}
        />
      </Field>

      <Field label="Velocidade" value={`${layer.speed.toFixed(2)}×`}>
        <Slider
          min={0}
          max={3}
          step={0.05}
          value={[layer.speed]}
          onValueChange={([v]) => patch({ speed: v ?? 1 })}
        />
      </Field>

      <Field label="Escala" value={`${Math.round(layer.scale * 100)}%`}>
        <Slider
          min={0.08}
          max={4}
          step={0.01}
          value={[layer.scale]}
          onValueChange={([v]) => patch({ scale: v ?? 1 })}
        />
      </Field>

      <Field label="Opacidade" value={`${Math.round(layer.opacity * 100)}%`}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[layer.opacity]}
          onValueChange={([v]) => patch({ opacity: v ?? 1 })}
        />
      </Field>

      <Field label="Áudio" value={`${Math.round(layer.audioDrive * 100)}`}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[layer.audioDrive]}
          onValueChange={([v]) => patch({ audioDrive: v ?? 0 })}
        />
      </Field>

      <Field label="Mistura">
        <div className="flex flex-wrap gap-1">
          {BLENDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => patch({ blend: b.id }, true)}
              className={cn(
                "h-8 rounded-sm px-2 text-xs font-medium transition-[background-color,color] duration-150 ease-out",
                layer.blend === b.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-elevated text-muted hover:text-foreground",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => useStudio.getState().duplicateLayer(layer.id)}
        >
          <Copy /> Duplicar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => patch({ flipX: !layer.flipX }, true)}>
          <FlipHorizontal /> Espelhar
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => patch({ x: STAGE_W / 2, y: STAGE_H / 2 }, true)}
        >
          <Scan /> Centrar
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            patch(
              {
                x: STAGE_W / 2,
                y: STAGE_H / 2,
                scale: Math.min(STAGE_W / layer.width, STAGE_H / layer.height),
                rotation: 0,
              },
              true,
            )
          }
        >
          <Maximize /> Preencher
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="col-span-2"
          onClick={() => useStudio.getState().removeLayer(layer.id)}
        >
          <Trash2 /> Remover
        </Button>
      </div>
    </div>
  );
}
