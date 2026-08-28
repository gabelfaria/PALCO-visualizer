import { HelpCircle, RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AssetDock } from "./AssetDock";
import { Inspector } from "./Inspector";
import { LayerList } from "./LayerList";
import { Stage } from "./Stage";
import { Transport } from "./Transport";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { runtime } from "@/lib/visualizer/runtime";
import { useStudio } from "@/lib/visualizer/store";
import { STAGE_H, STAGE_W } from "@/lib/visualizer/types";

export function Editor() {
  const hydrate = useStudio((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const s = useStudio.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (s.selectedId) s.duplicateLayer(s.selectedId);
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        if (s.recording) return;
        s.setPlaying(!s.playing);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (s.selectedId) s.removeLayer(s.selectedId);
        return;
      }
      if (e.key === "[" && s.selectedId) s.moveLayer(s.selectedId, -1);
      if (e.key === "]" && s.selectedId) s.moveLayer(s.selectedId, 1);
      const step = e.shiftKey ? 16 : 2;
      if (s.selectedId && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const layer = s.layers.find((l) => l.id === s.selectedId);
        if (!layer || layer.locked) return;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        s.updateLayer(layer.id, {
          x: Math.min(STAGE_W, Math.max(0, layer.x + dx)),
          y: Math.min(STAGE_H, Math.max(0, layer.y + dy)),
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col bg-background text-foreground">
        <Header />
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
            <ScrollArea className="h-full p-4">
              <AssetDock />
            </ScrollArea>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <Stage />
            <Transport />
          </div>
          <aside className="hidden w-72 shrink-0 flex-col border-l border-border bg-surface lg:flex">
            <ScrollArea className="h-full p-4">
              <Inspector />
              <Separator className="my-5" />
              <LayerList />
            </ScrollArea>
          </aside>
        </div>
        <MobileDock />
        <Toaster theme="dark" position="bottom-center" />
      </div>
    </TooltipProvider>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-3 py-2.5 md:px-5">
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold tracking-tight">Palco</p>
        <p className="hidden text-xs text-muted sm:block">Estúdio de visualizers 1920×1080</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => useStudio.getState().undo()}>
        <Undo2 /> Desfazer
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          runtime.clock = 0;
          useStudio.getState().reset();
        }}
      >
        <RotateCcw /> Novo
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Ajuda">
            <HelpCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Como usar</DialogTitle>
          <DialogDescription>
            Coloque uma foto 1920×1080 no fundo, solte PNGs no palco e escolha o looping de cada
            peça. O slider de intensidade controla o quanto ela se mexe. Importe uma música e
            use Exportar — o Palco monta o vídeo frame a frame com a duração da faixa, sem gravar
            em tempo real. Deixa a guia aberta até acabar.
          </DialogDescription>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li>Espaço — tocar / pausar</li>
            <li>Delete — remover peça</li>
            <li>Ctrl+D — duplicar</li>
            <li>Setas — empurrar · Shift — 16 px</li>
            <li>[ e ] — ordem das camadas</li>
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function MobileDock() {
  return (
    <div className="border-t border-border bg-surface px-3 py-2 lg:hidden">
      <Tabs defaultValue="pecas">
        <TabsList>
          <TabsTrigger value="pecas">Peças</TabsTrigger>
          <TabsTrigger value="animar">Animar</TabsTrigger>
          <TabsTrigger value="camadas">Camadas</TabsTrigger>
        </TabsList>
        <TabsContent value="pecas" className="max-h-56 overflow-y-auto">
          <AssetDock />
        </TabsContent>
        <TabsContent value="animar" className="max-h-56 overflow-y-auto">
          <Inspector />
        </TabsContent>
        <TabsContent value="camadas" className="max-h-56 overflow-y-auto">
          <LayerList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
