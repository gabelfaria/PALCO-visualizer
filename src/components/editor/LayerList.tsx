import { ChevronDown, ChevronUp, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import type { ReactNode } from "react";
import { useStudio } from "@/lib/visualizer/store";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LayerList() {
  const layers = useStudio((s) => s.layers);
  const selectedId = useStudio((s) => s.selectedId);

  if (layers.length === 0) {
    return <p className="text-sm text-muted">Nenhuma camada ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Camadas</Label>
      <ul className="flex flex-col gap-1">
        {[...layers].reverse().map((layer) => {
          const selected = layer.id === selectedId;
          return (
            <li key={layer.id}>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-1.5 py-1",
                  selected ? "bg-elevated" : "hover:bg-elevated/50",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left text-xs text-foreground"
                  onClick={() => useStudio.getState().select(layer.id)}
                >
                  {layer.name}
                </button>
                <IconBtn
                  label={layer.visible ? "Ocultar" : "Mostrar"}
                  onClick={() =>
                    useStudio.getState().updateLayer(layer.id, { visible: !layer.visible }, true)
                  }
                >
                  {layer.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </IconBtn>
                <IconBtn
                  label={layer.locked ? "Destrancar" : "Trancar"}
                  onClick={() =>
                    useStudio.getState().updateLayer(layer.id, { locked: !layer.locked }, true)
                  }
                >
                  {layer.locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                </IconBtn>
                <IconBtn
                  label="Subir"
                  onClick={() => useStudio.getState().moveLayer(layer.id, 1)}
                >
                  <ChevronUp className="size-3.5" />
                </IconBtn>
                <IconBtn
                  label="Descer"
                  onClick={() => useStudio.getState().moveLayer(layer.id, -1)}
                >
                  <ChevronDown className="size-3.5" />
                </IconBtn>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-sm text-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}
