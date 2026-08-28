const cache = new Map<string, HTMLImageElement>();
const waiters = new Map<string, Promise<HTMLImageElement>>();

export function getImage(src: string): HTMLImageElement | null {
  const hit = cache.get(src);
  if (hit?.complete && hit.naturalWidth > 0) return hit;
  if (!waiters.has(src)) {
    const img = hit ?? new Image();
    img.crossOrigin = "anonymous";
    cache.set(src, img);
    const p = new Promise<HTMLImageElement>((resolve, reject) => {
      if (img.complete && img.naturalWidth > 0) {
        resolve(img);
        return;
      }
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("fail"));
    });
    waiters.set(src, p);
    if (img.src !== src) img.src = src;
  }
  return null;
}

export function preload(src: string): Promise<HTMLImageElement> {
  getImage(src);
  return waiters.get(src) ?? Promise.reject(new Error("no image"));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function fitInside(w: number, h: number, max: number) {
  const m = Math.max(w, h);
  if (m <= max) return { width: w, height: h };
  const k = max / m;
  return { width: w * k, height: h * k };
}
