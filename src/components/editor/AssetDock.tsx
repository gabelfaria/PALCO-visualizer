import { ImagePlus, Sticker } from "lucide-react";
import { useRef } from "react";
import { BACKGROUNDS, STICKERS } from "@/lib/visualizer/catalog";
import { useStudio } from "@/lib/visualizer/store";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AssetDock() {
  const backgroundSrc = useStudio((s) => s.backgroundSrc);
  const bgInput = useRef<HTMLInputElement>(null);
  const pngInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Fundo 1920×1080</Label>
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={() => bgInput.current?.click()}
          >
            Enviar foto
          </button>
          <input
            ref={bgInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void useStudio.getState().uploadBackground(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => useStudio.getState().setBackground(bg.src)}
              className={cn(
                "overflow-hidden rounded-md text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow] duration-150 ease-out",
                backgroundSrc === bg.src && "shadow-[0_0_0_1px_var(--color-primary)]",
              )}
            >
              <img src={bg.src} alt={bg.name} className="aspect-video w-full object-cover" />
              <span className="block px-2 py-1.5 text-xs text-muted">{bg.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => bgInput.current?.click()}
            className="flex aspect-video flex-col items-center justify-center gap-1 rounded-md bg-elevated text-muted hover:text-foreground"
          >
            <ImagePlus className="size-4" />
            <span className="text-xs">Sua foto</span>
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Peças PNG</Label>
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={() => pngInput.current?.click()}
          >
            Enviar PNG
          </button>
          <input
            ref={pngInput}
            type="file"
            accept="image/png,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void useStudio.getState().addPng(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {STICKERS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => void useStudio.getState().addSticker(st)}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md bg-elevated p-1.5 hover:bg-elevated/70"
            >
              <img src={st.src} alt={st.name} className="max-h-12 max-w-full object-contain" />
              <span className="text-xs text-muted">{st.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => pngInput.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md bg-elevated text-muted hover:text-foreground"
          >
            <Sticker className="size-4" />
            <span className="text-xs">PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
