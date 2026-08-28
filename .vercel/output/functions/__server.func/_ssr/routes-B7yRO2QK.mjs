import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as CircleHelp, S as Circle, T as ChevronDown, _ as FlipHorizontal, a as Sticker, b as Download, c as RotateCcw, d as Music2, f as Maximize, g as ImageDown, h as ImagePlus, i as Trash2, l as Play, m as LockOpen, n as Undo2, o as Square, p as Lock, s as Scan, t as X, u as Pause, v as Eye, w as ChevronUp, x as Copy, y as EyeOff } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { a as CanvasSource, c as canEncodeAudio, i as AudioBufferSource, l as canEncodeVideo, n as Mp4OutputFormat, o as BufferTarget, r as WebMOutputFormat, s as QUALITY_HIGH, t as Output } from "../_libs/mediabunny.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { t as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B7yRO2QK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BACKGROUNDS = [{
	id: "palco",
	name: "Palco vazio",
	src: "/backgrounds/palco.jpg"
}, {
	id: "bokeh",
	name: "Bokeh",
	src: "/backgrounds/bokeh.jpg"
}];
var STICKERS = [
	{
		id: "vinil",
		name: "Vinil",
		src: "/overlays/vinil.png",
		motion: "spin"
	},
	{
		id: "fones",
		name: "Fones",
		src: "/overlays/fones.png",
		motion: "swing"
	},
	{
		id: "microfone",
		name: "Microfone",
		src: "/overlays/microfone.png",
		motion: "float"
	},
	{
		id: "fita",
		name: "Fita",
		src: "/overlays/fita.png",
		motion: "tilt"
	},
	{
		id: "caixa",
		name: "Caixa",
		src: "/overlays/caixa.png",
		motion: "beat"
	},
	{
		id: "faisca",
		name: "Faísca",
		src: "/overlays/faisca.png",
		motion: "flicker"
	},
	{
		id: "aneis",
		name: "Anéis",
		src: "/overlays/aneis.svg",
		motion: "pulse",
		defaultScale: 1.4
	},
	{
		id: "nota",
		name: "Nota",
		src: "/overlays/nota.svg",
		motion: "bounce"
	},
	{
		id: "raio",
		name: "Raio",
		src: "/overlays/raio.svg",
		motion: "glitch"
	},
	{
		id: "halo",
		name: "Halo",
		src: "/overlays/halo.svg",
		motion: "breathe",
		defaultScale: 1.8
	}
];
var cache = /* @__PURE__ */ new Map();
var waiters = /* @__PURE__ */ new Map();
function getImage(src) {
	const hit = cache.get(src);
	if (hit?.complete && hit.naturalWidth > 0) return hit;
	if (!waiters.has(src)) {
		const img = hit ?? new Image();
		img.crossOrigin = "anonymous";
		cache.set(src, img);
		const p = new Promise((resolve, reject) => {
			if (img.complete && img.naturalWidth > 0) {
				resolve(img);
				return;
			}
			img.onload = () => resolve(img);
			img.onerror = () => reject(/* @__PURE__ */ new Error("fail"));
		});
		waiters.set(src, p);
		if (img.src !== src) img.src = src;
	}
	return null;
}
function preload(src) {
	getImage(src);
	return waiters.get(src) ?? Promise.reject(/* @__PURE__ */ new Error("no image"));
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
function fitInside(w, h, max) {
	const m = Math.max(w, h);
	if (m <= max) return {
		width: w,
		height: h
	};
	const k = max / m;
	return {
		width: w * k,
		height: h * k
	};
}
var DB = "palco";
var STORE = "project";
var KEY = "current";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function saveProject(data) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(data, KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function loadProject() {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error);
	});
}
var STAGE_W = 1920;
var STAGE_H = 1080;
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function demoLayers() {
	return [
		makeLayer({
			id: "demo-aneis",
			name: "Anéis",
			src: "/overlays/aneis.svg",
			x: 960,
			y: 540,
			width: 720,
			height: 720,
			motion: "pulse",
			intensity: .55,
			speed: .7,
			blend: "screen",
			audioDrive: .7,
			phase: .4
		}),
		makeLayer({
			id: "demo-vinil",
			name: "Vinil",
			src: "/overlays/vinil.png",
			x: 430,
			y: 700,
			width: 380,
			height: 382,
			motion: "spin",
			intensity: .7,
			speed: .55,
			phase: 1.1
		}),
		makeLayer({
			id: "demo-faisca",
			name: "Faísca",
			src: "/overlays/faisca.png",
			x: 1480,
			y: 280,
			width: 280,
			height: 286,
			motion: "flicker",
			intensity: .8,
			speed: 1.2,
			blend: "screen",
			phase: 2.2
		})
	];
}
function makeLayer(partial) {
	return {
		id: uid(),
		x: STAGE_W / 2,
		y: STAGE_H / 2,
		width: 360,
		height: 360,
		rotation: 0,
		scale: 1,
		opacity: 1,
		motion: "float",
		intensity: .6,
		speed: 1,
		phase: Math.random() * Math.PI * 2,
		blend: "source-over",
		audioDrive: .25,
		flipX: false,
		locked: false,
		visible: true,
		...partial
	};
}
function defaultProject() {
	return {
		version: 1,
		backgroundSrc: BACKGROUNDS[0].src,
		backgroundFit: "cover",
		layers: demoLayers(),
		spectrum: true,
		spectrumIntensity: .55,
		vignette: .45,
		grain: .12
	};
}
function applySnapshot(s) {
	return {
		backgroundSrc: s.backgroundSrc,
		backgroundFit: s.backgroundFit,
		layers: s.layers,
		spectrum: s.spectrum,
		spectrumIntensity: s.spectrumIntensity,
		vignette: s.vignette,
		grain: s.grain,
		selectedId: s.layers[s.layers.length - 1]?.id ?? null
	};
}
var persistTimer = null;
var useStudio = create((set, get) => ({
	...applySnapshot(defaultProject()),
	playing: true,
	clock: 0,
	recording: false,
	exporting: false,
	ready: false,
	past: [],
	future: [],
	snapshot: () => {
		const s = get();
		return {
			version: 1,
			backgroundSrc: s.backgroundSrc,
			backgroundFit: s.backgroundFit,
			layers: s.layers,
			spectrum: s.spectrum,
			spectrumIntensity: s.spectrumIntensity,
			vignette: s.vignette,
			grain: s.grain
		};
	},
	persistSoon: () => {
		if (persistTimer) clearTimeout(persistTimer);
		persistTimer = setTimeout(() => {
			saveProject(get().snapshot());
		}, 400);
	},
	commit: () => {
		const snap = get().snapshot();
		set((s) => ({
			past: [...s.past.slice(-29), snap],
			future: []
		}));
		get().persistSoon();
	},
	undo: () => {
		const { past, snapshot } = get();
		const prev = past[past.length - 1];
		if (!prev) return;
		const current = snapshot();
		set({
			...applySnapshot(prev),
			past: past.slice(0, -1),
			future: [...get().future, current]
		});
		get().persistSoon();
	},
	redo: () => {
		const { future, snapshot } = get();
		const next = future[future.length - 1];
		if (!next) return;
		const current = snapshot();
		set({
			...applySnapshot(next),
			future: future.slice(0, -1),
			past: [...get().past, current]
		});
		get().persistSoon();
	},
	hydrate: async () => {
		try {
			const saved = await loadProject();
			if (saved?.version === 1) {
				set({
					...applySnapshot(saved),
					ready: true
				});
				const srcs = [saved.backgroundSrc, ...saved.layers.map((l) => l.src)].filter(Boolean);
				await Promise.all(srcs.map((s) => preload(s).catch(() => void 0)));
				return;
			}
		} catch {}
		const current = get();
		set({
			ready: true,
			selectedId: current.layers[1]?.id ?? current.layers[0]?.id ?? null
		});
		await Promise.all([current.backgroundSrc, ...current.layers.map((l) => l.src)].filter(Boolean).map((s) => preload(s).catch(() => void 0)));
	},
	setBackground: (src) => {
		get().commit();
		set({ backgroundSrc: src });
		if (src) preload(src);
		get().persistSoon();
	},
	uploadBackground: async (file) => {
		const src = await fileToDataUrl(file);
		get().setBackground(src);
	},
	addSticker: async (sticker, at) => {
		const img = await preload(sticker.src);
		const fitted = fitInside(img.naturalWidth, img.naturalHeight, 520);
		const scale = sticker.defaultScale ?? 1;
		const layer = makeLayer({
			name: sticker.name,
			src: sticker.src,
			x: at?.x ?? 960,
			y: at?.y ?? 540,
			width: fitted.width,
			height: fitted.height,
			scale,
			motion: sticker.motion
		});
		get().commit();
		set((s) => ({
			layers: [...s.layers, layer],
			selectedId: layer.id
		}));
		get().persistSoon();
	},
	addPng: async (file, at) => {
		const src = await fileToDataUrl(file);
		const img = await preload(src);
		const fitted = fitInside(img.naturalWidth, img.naturalHeight, 640);
		const layer = makeLayer({
			name: file.name.replace(/\.[^.]+$/, ""),
			src,
			x: at?.x ?? 960,
			y: at?.y ?? 540,
			width: fitted.width,
			height: fitted.height,
			motion: "float"
		});
		get().commit();
		set((s) => ({
			layers: [...s.layers, layer],
			selectedId: layer.id
		}));
		get().persistSoon();
	},
	select: (id) => set({ selectedId: id }),
	updateLayer: (id, patch, commit = false) => {
		if (commit) get().commit();
		set((s) => ({ layers: s.layers.map((l) => l.id === id ? {
			...l,
			...patch
		} : l) }));
		get().persistSoon();
	},
	removeLayer: (id) => {
		get().commit();
		set((s) => ({
			layers: s.layers.filter((l) => l.id !== id),
			selectedId: s.selectedId === id ? null : s.selectedId
		}));
		get().persistSoon();
	},
	duplicateLayer: (id) => {
		const src = get().layers.find((l) => l.id === id);
		if (!src) return;
		const copy = {
			...src,
			id: uid(),
			x: src.x + 36,
			y: src.y + 36,
			name: `${src.name} cópia`,
			phase: Math.random() * Math.PI * 2
		};
		get().commit();
		set((s) => ({
			layers: [...s.layers, copy],
			selectedId: copy.id
		}));
		get().persistSoon();
	},
	moveLayer: (id, dir) => {
		const layers = [...get().layers];
		const i = layers.findIndex((l) => l.id === id);
		if (i < 0) return;
		const j = i + dir;
		if (j < 0 || j >= layers.length) return;
		const tmp = layers[i];
		layers[i] = layers[j];
		layers[j] = tmp;
		get().commit();
		set({ layers });
		get().persistSoon();
	},
	setPlaying: (v) => set({ playing: v }),
	setClock: (t) => set({ clock: t }),
	setSpectrum: (v) => {
		set({ spectrum: v });
		get().persistSoon();
	},
	setSpectrumIntensity: (v) => {
		set({ spectrumIntensity: v });
		get().persistSoon();
	},
	setVignette: (v) => {
		set({ vignette: v });
		get().persistSoon();
	},
	setGrain: (v) => {
		set({ grain: v });
		get().persistSoon();
	},
	setRecording: (v) => set({ recording: v }),
	setExporting: (v) => set({ exporting: v }),
	reset: () => {
		const demo = defaultProject();
		get().commit();
		set({
			...applySnapshot(demo),
			clock: 0,
			playing: true
		});
		get().persistSoon();
	}
}));
function selectedLayer(state) {
	if (!state.selectedId) return null;
	return state.layers.find((l) => l.id === state.selectedId) ?? null;
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function AssetDock() {
	const backgroundSrc = useStudio((s) => s.backgroundSrc);
	const bgInput = (0, import_react.useRef)(null);
	const pngInput = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fundo 1920×1080" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted hover:text-foreground",
					onClick: () => bgInput.current?.click(),
					children: "Enviar foto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: bgInput,
					type: "file",
					accept: "image/*",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) useStudio.getState().uploadBackground(f);
						e.target.value = "";
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-1.5",
			children: [BACKGROUNDS.map((bg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useStudio.getState().setBackground(bg.src),
				className: cn("overflow-hidden rounded-md text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow] duration-150 ease-out", backgroundSrc === bg.src && "shadow-[0_0_0_1px_var(--color-primary)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: bg.src,
					alt: bg.name,
					className: "aspect-video w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block px-2 py-1.5 text-xs text-muted",
					children: bg.name
				})]
			}, bg.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => bgInput.current?.click(),
				className: "flex aspect-video flex-col items-center justify-center gap-1 rounded-md bg-elevated text-muted hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					children: "Sua foto"
				})]
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Peças PNG" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted hover:text-foreground",
					onClick: () => pngInput.current?.click(),
					children: "Enviar PNG"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: pngInput,
					type: "file",
					accept: "image/png,image/*",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) useStudio.getState().addPng(f);
						e.target.value = "";
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-1.5",
			children: [STICKERS.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void useStudio.getState().addSticker(st),
				className: "flex aspect-square flex-col items-center justify-center gap-1 rounded-md bg-elevated p-1.5 hover:bg-elevated/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: st.src,
					alt: st.name,
					className: "max-h-12 max-w-full object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: st.name
				})]
			}, st.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => pngInput.current?.click(),
				className: "flex aspect-square flex-col items-center justify-center gap-1 rounded-md bg-elevated text-muted hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sticker, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					children: "PNG"
				})]
			})]
		})] })]
	});
}
var MOTIONS = [
	{
		id: "none",
		label: "Parado",
		hint: "Sem looping"
	},
	{
		id: "vibrate",
		label: "Vibrar",
		hint: "Treme no lugar"
	},
	{
		id: "swing",
		label: "Balançar",
		hint: "Oscila como um pêndulo"
	},
	{
		id: "spin",
		label: "Girar",
		hint: "Rotação contínua"
	},
	{
		id: "pulse",
		label: "Pulsar",
		hint: "Cresce e diminui"
	},
	{
		id: "float",
		label: "Flutuar",
		hint: "Sobe e desce suave"
	},
	{
		id: "bounce",
		label: "Quicar",
		hint: "Bounce elástico"
	},
	{
		id: "orbit",
		label: "Órbita",
		hint: "Circula em volta"
	},
	{
		id: "glitch",
		label: "Glitch",
		hint: "Cortes digitais"
	},
	{
		id: "wave",
		label: "Onda",
		hint: "Desliza em seno"
	},
	{
		id: "flicker",
		label: "Piscar",
		hint: "Pisca a luz"
	},
	{
		id: "pendulum",
		label: "Pêndulo",
		hint: "Preso no topo"
	},
	{
		id: "breathe",
		label: "Respirar",
		hint: "Lento, vivo"
	},
	{
		id: "beat",
		label: "Batida",
		hint: "Reage ao grave"
	},
	{
		id: "figure8",
		label: "Infinito",
		hint: "Percorre um 8"
	},
	{
		id: "zoom",
		label: "Zoom",
		hint: "Aproxima e afasta"
	},
	{
		id: "drift",
		label: "Deriva",
		hint: "Flutua à deriva"
	},
	{
		id: "echo",
		label: "Eco",
		hint: "Deixa rastros"
	},
	{
		id: "shakespin",
		label: "Giro-treme",
		hint: "Gira e treme"
	},
	{
		id: "heartbeat",
		label: "Coração",
		hint: "Pulso duplo"
	},
	{
		id: "slide",
		label: "Slide",
		hint: "Vai e volta"
	},
	{
		id: "spiral",
		label: "Espiral",
		hint: "Entra em espiral"
	},
	{
		id: "pop",
		label: "Pop",
		hint: "Estoura na batida"
	},
	{
		id: "tilt",
		label: "Tilt",
		hint: "Inclina em 3D"
	},
	{
		id: "kaleido",
		label: "Caleido",
		hint: "Gira e muda a cor"
	}
];
var IDENTITY = {
	dx: 0,
	dy: 0,
	rot: 0,
	scaleX: 1,
	scaleY: 1,
	opacity: 1,
	hue: 0,
	ghosts: 0
};
function hash(n) {
	const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return s - Math.floor(s);
}
function rest() {
	return { ...IDENTITY };
}
function sampleMotion(kind, t, intensity, speed, phase, audio) {
	const i = intensity;
	const w = t * speed + phase;
	const bass = audio.bass;
	const beat = audio.beat;
	const s = rest();
	switch (kind) {
		case "none": return s;
		case "vibrate": {
			const amp = 10 * i;
			s.dx = Math.sin(w * 37.1) * amp + Math.sin(w * 53.7) * amp * .35;
			s.dy = Math.cos(w * 41.3) * amp + Math.sin(w * 29.9) * amp * .3;
			s.rot = Math.sin(w * 19) * .07 * i;
			return s;
		}
		case "swing": {
			const ang = Math.sin(w * 2.15) * (.55 * i);
			s.rot = ang;
			s.dx = Math.sin(ang) * 28 * i;
			s.dy = (1 - Math.cos(ang)) * 18 * i;
			return s;
		}
		case "spin":
			s.rot = w * (.7 + i * 1.6);
			return s;
		case "pulse": {
			const k = 1 + (.5 + .5 * Math.sin(w * 3.2)) * .28 * i;
			s.scaleX = k;
			s.scaleY = k;
			return s;
		}
		case "float":
			s.dy = Math.sin(w * 1.7) * 36 * i;
			s.dx = Math.sin(w * .9) * 10 * i;
			s.rot = Math.sin(w * 1.1) * .12 * i;
			return s;
		case "bounce": {
			const cycle = w * 1.35 % (Math.PI * 2) / (Math.PI * 2);
			const drop = Math.abs(Math.sin(cycle * Math.PI));
			const eased = 1 - Math.pow(1 - drop, 2.4);
			s.dy = -(eased * 90 * i);
			s.scaleY = 1 - (1 - eased) * .18 * i;
			s.scaleX = 1 + (1 - eased) * .12 * i;
			return s;
		}
		case "orbit": {
			const r = 70 * i;
			s.dx = Math.cos(w * 1.6) * r;
			s.dy = Math.sin(w * 1.6) * r * .62;
			s.rot = w * 1.6;
			return s;
		}
		case "glitch": {
			const slot = Math.floor(w * 11);
			if (hash(slot + phase * 10) > .68) {
				s.dx = (hash(slot + 1) - .5) * 90 * i;
				s.dy = (hash(slot + 2) - .5) * 48 * i;
				s.rot = (hash(slot + 3) - .5) * .35 * i;
				s.scaleX = 1 + (hash(slot + 4) - .5) * .25 * i;
				s.hue = (hash(slot + 5) - .5) * 80 * i;
			}
			return s;
		}
		case "wave":
			s.dx = Math.sin(w * 2.4) * 80 * i;
			s.dy = Math.sin(w * 2.4 * 2) * 12 * i;
			s.rot = Math.cos(w * 2.4) * .18 * i;
			return s;
		case "flicker": {
			const on = hash(Math.floor(w * 14) + 9) > .22 * (1 - i * .4);
			s.opacity = on ? 1 : .08 + (1 - i) * .4;
			const k = 1 + (on ? .04 : -.04) * i;
			s.scaleX = k;
			s.scaleY = k;
			return s;
		}
		case "pendulum": {
			const ang = Math.sin(w * 1.8) * (.7 * i);
			s.rot = ang;
			s.dx = Math.sin(ang) * 120 * i;
			s.dy = (1 - Math.cos(ang)) * 50 * i;
			return s;
		}
		case "breathe": {
			const p = .5 + .5 * Math.sin(w * 1.15);
			const k = 1 + p * .16 * i;
			s.scaleX = k;
			s.scaleY = k;
			s.opacity = .62 + p * .38;
			return s;
		}
		case "beat": {
			const punch = Math.pow(Math.max(bass, beat), 1.35);
			const k = 1 + punch * .5 * i;
			s.scaleX = k;
			s.scaleY = k;
			s.dy = -punch * 18 * i;
			return s;
		}
		case "figure8": {
			const a = w * 1.5;
			s.dx = Math.sin(a) * 90 * i;
			s.dy = Math.sin(a * 2) * 42 * i;
			s.rot = Math.cos(a) * .25 * i;
			return s;
		}
		case "zoom": {
			const p = .5 + .5 * Math.sin(w * .85);
			const k = 1 - .08 * i + p * .34 * i;
			s.scaleX = k;
			s.scaleY = k;
			return s;
		}
		case "drift":
			s.dx = Math.sin(w * .37 + 1.2) * 48 * i + Math.sin(w * .91) * 10 * i;
			s.dy = Math.cos(w * .29) * 36 * i + Math.sin(w * .6) * 8 * i;
			s.rot = Math.sin(w * .4) * .2 * i;
			return s;
		case "echo": {
			const p = .5 + .5 * Math.sin(w * 2.6);
			s.dx = Math.sin(w * 1.8) * 16 * i;
			s.dy = Math.cos(w * 1.4) * 10 * i;
			s.scaleX = 1 + p * .06 * i;
			s.scaleY = s.scaleX;
			s.ghosts = 3;
			return s;
		}
		case "shakespin": {
			const amp = 7 * i;
			s.rot = w * (.9 + i);
			s.dx = Math.sin(w * 41) * amp;
			s.dy = Math.cos(w * 37) * amp;
			return s;
		}
		case "heartbeat": {
			const cycle = w * 1.2 % (Math.PI * 2);
			const k = 1 + (Math.exp(-Math.pow((cycle - .45) * 5, 2)) + Math.exp(-Math.pow((cycle - 1.15) * 5.5, 2)) * .7) * .32 * i;
			s.scaleX = k;
			s.scaleY = k;
			return s;
		}
		case "slide":
			s.dx = Math.sin(w * 1.55) * 110 * i;
			s.scaleX = 1 + Math.abs(Math.cos(w * 1.55)) * .06 * i;
			s.scaleY = 2 - s.scaleX;
			return s;
		case "spiral": {
			const p = .5 + .5 * Math.sin(w * 1.1);
			const r = (20 + 90 * p) * i;
			s.dx = Math.cos(w * 3.2) * r;
			s.dy = Math.sin(w * 3.2) * r;
			s.rot = w * 3.2;
			const k = .75 + p * .5;
			s.scaleX = k;
			s.scaleY = k;
			return s;
		}
		case "pop": {
			const punch = Math.pow(Math.max(beat, bass * .8), 1.2);
			const k = 1 + punch * .7 * i;
			s.scaleX = k;
			s.scaleY = k;
			s.rot = (hash(Math.floor(t * 8) + phase) - .5) * punch * .2 * i;
			return s;
		}
		case "tilt": {
			const p = Math.sin(w * 1.9);
			s.rot = p * .22 * i;
			s.scaleX = 1 + p * .18 * i;
			s.scaleY = 1 - p * .12 * i;
			s.dy = Math.sin(w * .9) * 10 * i;
			return s;
		}
		case "kaleido": {
			s.rot = w * 1.1;
			const p = .5 + .5 * Math.sin(w * 2.4);
			const k = 1 + p * .14 * i;
			s.scaleX = k;
			s.scaleY = k;
			s.hue = w * 70 * i % 360;
			s.opacity = .75 + p * .25;
			return s;
		}
		default: return s;
	}
}
function mixAudioDrive(sample, drive, audio) {
	if (drive <= .001) return sample;
	const punch = Math.pow(Math.max(audio.bass, audio.beat), 1.25) * drive;
	const k = 1 + punch * .35;
	return {
		...sample,
		scaleX: sample.scaleX * k,
		scaleY: sample.scaleY * k,
		dy: sample.dy - punch * 10,
		opacity: Math.min(1, sample.opacity * (.85 + punch * .3))
	};
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none select-none transition-[scale,background-color,color,opacity,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-elevated text-foreground hover:bg-elevated/80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
			ghost: "text-muted hover:text-foreground hover:bg-elevated",
			outline: "bg-transparent text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.10)] hover:bg-elevated",
			record: "bg-record text-foreground hover:bg-record/90",
			danger: "text-record hover:bg-record/15"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 px-2.5 text-xs rounded-sm",
			lg: "h-11 px-5",
			icon: "size-10",
			"icon-sm": "size-8 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md bg-elevated px-3 text-sm text-foreground outline-none shadow-[0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/40", className),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none items-center select-none py-2", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-primary shadow-[0_0_0_1px_rgba(10,10,11,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" })]
	});
}
var BLENDS = [
	{
		id: "source-over",
		label: "Normal"
	},
	{
		id: "screen",
		label: "Tela"
	},
	{
		id: "lighter",
		label: "Soma"
	},
	{
		id: "overlay",
		label: "Overlay"
	},
	{
		id: "multiply",
		label: "Multi"
	}
];
function Field({ label, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-subtle tabular-nums",
				children: value
			}) : null]
		}), children]
	});
}
function Inspector() {
	const layer = useStudio(selectedLayer);
	const updateLayer = useStudio((s) => s.updateLayer);
	if (!layer) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-start justify-center px-1 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-base font-semibold tracking-tight text-balance",
			children: "Nenhuma peça"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted text-pretty",
			children: "Selecione um PNG no palco ou solte um arquivo para animar."
		})]
	});
	const patch = (p, commit = false) => updateLayer(layer.id, p, commit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nome",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: layer.name,
					onChange: (e) => patch({ name: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Looping",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1",
					children: MOTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: m.hint,
						onClick: () => patch({ motion: m.id }, true),
						className: cn("h-8 rounded-sm px-1 text-xs font-medium tracking-wide transition-[background-color,color] duration-150 ease-out", layer.motion === m.id ? "bg-primary text-primary-foreground" : "bg-elevated text-muted hover:text-foreground"),
						children: m.label
					}, m.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Intensidade",
				value: `${Math.round(layer.intensity * 100)}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 1,
					step: .01,
					value: [layer.intensity],
					onValueChange: ([v]) => patch({ intensity: v ?? 0 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Velocidade",
				value: `${layer.speed.toFixed(2)}×`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 3,
					step: .05,
					value: [layer.speed],
					onValueChange: ([v]) => patch({ speed: v ?? 1 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Escala",
				value: `${Math.round(layer.scale * 100)}%`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: .08,
					max: 4,
					step: .01,
					value: [layer.scale],
					onValueChange: ([v]) => patch({ scale: v ?? 1 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Opacidade",
				value: `${Math.round(layer.opacity * 100)}%`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 1,
					step: .01,
					value: [layer.opacity],
					onValueChange: ([v]) => patch({ opacity: v ?? 1 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Áudio",
				value: `${Math.round(layer.audioDrive * 100)}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 1,
					step: .01,
					value: [layer.audioDrive],
					onValueChange: ([v]) => patch({ audioDrive: v ?? 0 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Mistura",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: BLENDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ blend: b.id }, true),
						className: cn("h-8 rounded-sm px-2 text-xs font-medium transition-[background-color,color] duration-150 ease-out", layer.blend === b.id ? "bg-primary text-primary-foreground" : "bg-elevated text-muted hover:text-foreground"),
						children: b.label
					}, b.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => useStudio.getState().duplicateLayer(layer.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), " Duplicar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => patch({ flipX: !layer.flipX }, true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, {}), " Espelhar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => patch({
							x: STAGE_W / 2,
							y: STAGE_H / 2
						}, true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, {}), " Centrar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => patch({
							x: STAGE_W / 2,
							y: STAGE_H / 2,
							scale: Math.min(STAGE_W / layer.width, STAGE_H / layer.height),
							rotation: 0
						}, true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, {}), " Preencher"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "danger",
						size: "sm",
						className: "col-span-2",
						onClick: () => useStudio.getState().removeLayer(layer.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), " Remover"]
					})
				]
			})
		]
	});
}
function LayerList() {
	const layers = useStudio((s) => s.layers);
	const selectedId = useStudio((s) => s.selectedId);
	if (layers.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Nenhuma camada ainda."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Camadas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-1",
			children: [...layers].reverse().map((layer) => {
				const selected = layer.id === selectedId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center gap-1.5 rounded-md px-1.5 py-1", selected ? "bg-elevated" : "hover:bg-elevated/50"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-w-0 flex-1 truncate text-left text-xs text-foreground",
							onClick: () => useStudio.getState().select(layer.id),
							children: layer.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: layer.visible ? "Ocultar" : "Mostrar",
							onClick: () => useStudio.getState().updateLayer(layer.id, { visible: !layer.visible }, true),
							children: layer.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: layer.locked ? "Destrancar" : "Trancar",
							onClick: () => useStudio.getState().updateLayer(layer.id, { locked: !layer.locked }, true),
							children: layer.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Subir",
							onClick: () => useStudio.getState().moveLayer(layer.id, 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Descer",
							onClick: () => useStudio.getState().moveLayer(layer.id, -1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
						})
					]
				}) }, layer.id);
			})
		})]
	});
}
function IconBtn({ children, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "flex size-8 items-center justify-center rounded-sm text-muted hover:text-foreground",
		children
	});
}
var SILENT = {
	bass: 0,
	mid: 0,
	treble: 0,
	beat: 0,
	peak: 0,
	bins: null
};
var AudioEngine = class {
	el;
	ctx = null;
	analyser = null;
	source = null;
	dest = null;
	freq = /* @__PURE__ */ new Uint8Array(1024);
	bands = {
		...SILENT,
		bins: this.freq
	};
	beatHold = 0;
	lastBass = 0;
	file = null;
	name = null;
	constructor() {
		this.el = document.createElement("audio");
		this.el.crossOrigin = "anonymous";
		this.el.preload = "auto";
		this.el.loop = true;
	}
	async ensure() {
		if (this.ctx) {
			if (this.ctx.state === "suspended") await this.ctx.resume();
			return;
		}
		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 2048;
		analyser.smoothingTimeConstant = .78;
		const source = ctx.createMediaElementSource(this.el);
		const dest = ctx.createMediaStreamDestination();
		source.connect(analyser);
		analyser.connect(ctx.destination);
		source.connect(dest);
		this.ctx = ctx;
		this.analyser = analyser;
		this.source = source;
		this.dest = dest;
		this.freq = new Uint8Array(analyser.frequencyBinCount);
		this.bands.bins = this.freq;
		if (ctx.state === "suspended") await this.ctx.resume();
	}
	async waitMetadata() {
		if (Number.isFinite(this.el.duration) && this.el.duration > 0) return;
		await new Promise((resolve, reject) => {
			const ok = () => {
				cleanup();
				resolve();
			};
			const fail = () => {
				cleanup();
				reject(/* @__PURE__ */ new Error("áudio inválido"));
			};
			const cleanup = () => {
				this.el.removeEventListener("loadedmetadata", ok);
				this.el.removeEventListener("error", fail);
			};
			this.el.addEventListener("loadedmetadata", ok);
			this.el.addEventListener("error", fail);
		});
	}
	async loadFile(file) {
		await this.ensure();
		if (this.el.src.startsWith("blob:")) URL.revokeObjectURL(this.el.src);
		this.el.src = URL.createObjectURL(file);
		this.name = file.name;
		this.file = file;
		this.el.load();
		await this.waitMetadata();
		await this.el.play().catch(() => void 0);
	}
	async toggle() {
		await this.ensure();
		if (this.el.paused) await this.el.play();
		else this.el.pause();
	}
	async play() {
		await this.ensure();
		await this.el.play().catch(() => void 0);
	}
	pause() {
		this.el.pause();
	}
	async rewind() {
		this.el.currentTime = 0;
		if (this.el.currentTime < .15) return;
		await new Promise((resolve) => {
			const done = () => {
				this.el.removeEventListener("seeked", done);
				resolve();
			};
			this.el.addEventListener("seeked", done);
			window.setTimeout(done, 500);
		});
	}
	setLoop(v) {
		this.el.loop = v;
	}
	get playing() {
		return !this.el.paused && !this.el.ended;
	}
	get duration() {
		const d = this.el.duration;
		return Number.isFinite(d) ? d : 0;
	}
	get currentTime() {
		return this.el.currentTime || 0;
	}
	async decodeBuffer() {
		if (!this.file) throw new Error("sem faixa");
		await this.ensure();
		const data = await this.file.arrayBuffer();
		return this.ctx.decodeAudioData(data.slice(0));
	}
	tick() {
		if (!this.analyser || this.el.paused) {
			this.bands.bass *= .86;
			this.bands.mid *= .86;
			this.bands.treble *= .86;
			this.bands.beat *= .82;
			this.bands.peak *= .9;
			this.beatHold *= .9;
			return this.bands;
		}
		this.analyser.getByteFrequencyData(this.freq);
		const n = this.freq.length;
		const avg = (from, to) => {
			let s = 0;
			const a = Math.max(0, from);
			const b = Math.min(n, to);
			for (let i = a; i < b; i++) s += this.freq[i] ?? 0;
			return b > a ? s / (b - a) / 255 : 0;
		};
		const bass = Math.pow(avg(0, 12), .85);
		const mid = avg(12, 80);
		const treble = avg(80, 280);
		const peak = Math.max(bass, mid, treble);
		const onset = bass - this.lastBass;
		this.lastBass = bass;
		if (onset > .08 && bass > .32 && this.beatHold < .2) this.beatHold = 1;
		else this.beatHold = Math.max(0, this.beatHold - .045);
		this.bands.bass = bass;
		this.bands.mid = mid;
		this.bands.treble = treble;
		this.bands.peak = peak;
		this.bands.beat = this.beatHold;
		return this.bands;
	}
};
var engine = null;
function getAudio() {
	if (typeof document === "undefined") throw new Error("audio is browser-only");
	if (!engine) engine = new AudioEngine();
	return engine;
}
var noise = null;
function getNoise() {
	if (noise) return noise;
	const c = document.createElement("canvas");
	c.width = 128;
	c.height = 128;
	const g = c.getContext("2d");
	if (!g) return c;
	const img = g.createImageData(128, 128);
	for (let i = 0; i < img.data.length; i += 4) {
		const v = Math.random() * 255;
		img.data[i] = v;
		img.data[i + 1] = v;
		img.data[i + 2] = v;
		img.data[i + 3] = 255;
	}
	g.putImageData(img, 0, 0);
	noise = c;
	return c;
}
function drawFitted(ctx, img, mode) {
	const ir = img.naturalWidth / img.naturalHeight;
	const r = STAGE_W / STAGE_H;
	let dw;
	let dh;
	if (mode === "cover" ? ir > r : ir < r) {
		dh = STAGE_H;
		dw = STAGE_H * ir;
	} else {
		dw = STAGE_W;
		dh = STAGE_W / ir;
	}
	ctx.drawImage(img, (STAGE_W - dw) / 2, (STAGE_H - dh) / 2, dw, dh);
}
function drawLayer(ctx, layer, clock, audio, sampleT, alphaMul) {
	const img = getImage(layer.src);
	if (!img) return;
	let sample = sampleMotion(layer.motion, sampleT, layer.intensity, layer.speed, layer.phase, audio);
	sample = mixAudioDrive(sample, layer.audioDrive, audio);
	ctx.save();
	ctx.globalAlpha = layer.opacity * sample.opacity * alphaMul;
	ctx.globalCompositeOperation = layer.blend;
	if (sample.hue) ctx.filter = `hue-rotate(${sample.hue}deg)`;
	ctx.translate(layer.x + sample.dx, layer.y + sample.dy);
	ctx.rotate(layer.rotation + sample.rot);
	ctx.scale(layer.scale * sample.scaleX * (layer.flipX ? -1 : 1), layer.scale * sample.scaleY);
	ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
	ctx.restore();
}
function drawSpectrum(ctx, audio, intensity) {
	const bins = audio.bins;
	if (!bins) return;
	const count = 72;
	const gap = 4;
	const total = STAGE_W * .72;
	const bw = (total - 284) / count;
	const x0 = (STAGE_W - total) / 2;
	const base = STAGE_H - 64;
	ctx.save();
	ctx.globalCompositeOperation = "screen";
	for (let i = 0; i < count; i++) {
		const v = (bins[Math.floor(i / count * Math.min(bins.length * .45, bins.length))] ?? 0) / 255;
		const h = Math.max(4, v * 220 * intensity);
		const x = x0 + i * (bw + gap);
		ctx.fillStyle = `rgba(232,228,212,${.18 + v * .55})`;
		ctx.fillRect(x, base - h, bw, h);
	}
	ctx.restore();
}
function drawVignette(ctx, amount) {
	const g = ctx.createRadialGradient(STAGE_W / 2, STAGE_H / 2, STAGE_H * .25, STAGE_W / 2, STAGE_H / 2, STAGE_W * .72);
	g.addColorStop(0, "rgba(0,0,0,0)");
	g.addColorStop(1, `rgba(0,0,0,${amount})`);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, STAGE_W, STAGE_H);
}
function drawGrain(ctx, amount, clock) {
	const n = getNoise();
	ctx.save();
	ctx.globalAlpha = amount * .22;
	ctx.globalCompositeOperation = "overlay";
	const ox = clock * 37 % 64;
	const oy = clock * 53 % 64;
	ctx.drawImage(n, -ox, -oy, STAGE_W + 64, STAGE_H + 64);
	ctx.restore();
}
function layerSample(layer, clock, audio) {
	return mixAudioDrive(sampleMotion(layer.motion, clock, layer.intensity, layer.speed, layer.phase, audio), layer.audioDrive, audio);
}
function renderFrame(ctx, project, clock, audio, chrome) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.filter = "none";
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "#08080a";
	ctx.fillRect(0, 0, STAGE_W, STAGE_H);
	if (project.backgroundSrc) {
		const bg = getImage(project.backgroundSrc);
		if (bg) drawFitted(ctx, bg, project.backgroundFit);
	}
	for (const layer of project.layers) {
		if (!layer.visible) continue;
		const sample = layerSample(layer, clock, audio);
		if (sample.ghosts > 0) for (let g = sample.ghosts; g >= 1; g--) drawLayer(ctx, layer, clock, audio, clock - g * .08, .22 / g);
		drawLayer(ctx, layer, clock, audio, clock, 1);
	}
	if (project.spectrum) drawSpectrum(ctx, audio, project.spectrumIntensity);
	if (project.vignette > 0) drawVignette(ctx, project.vignette);
	if (project.grain > 0) drawGrain(ctx, project.grain, clock);
	if (chrome?.selectedId) {
		const layer = project.layers.find((l) => l.id === chrome.selectedId);
		if (layer) drawChrome(ctx, layer, clock, audio);
	}
}
function drawChrome(ctx, layer, clock, audio) {
	const s = layerSample(layer, clock, audio);
	const w = layer.width * layer.scale * s.scaleX;
	const h = layer.height * layer.scale * s.scaleY;
	ctx.save();
	ctx.translate(layer.x + s.dx, layer.y + s.dy);
	ctx.rotate(layer.rotation + s.rot);
	ctx.strokeStyle = "rgba(232,228,212,0.85)";
	ctx.lineWidth = 2;
	ctx.setLineDash([8, 6]);
	ctx.strokeRect(-w / 2, -h / 2, w, h);
	ctx.setLineDash([]);
	const hs = 10;
	const corners = [
		[-w / 2, -h / 2],
		[w / 2, -h / 2],
		[w / 2, h / 2],
		[-w / 2, h / 2]
	];
	ctx.fillStyle = "#e8e4d4";
	for (const [x, y] of corners) ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs);
	ctx.restore();
}
function hitLayer(layers, x, y, clock, audio) {
	for (let i = layers.length - 1; i >= 0; i--) {
		const layer = layers[i];
		if (!layer.visible || layer.locked) continue;
		if (pointInLayer(layer, x, y, clock, audio)) return layer;
	}
	return null;
}
function pointInLayer(layer, px, py, clock, audio) {
	const s = layerSample(layer, clock, audio);
	const dx = px - (layer.x + s.dx);
	const dy = py - (layer.y + s.dy);
	const rot = -(layer.rotation + s.rot);
	const lx = dx * Math.cos(rot) - dy * Math.sin(rot);
	const ly = dx * Math.sin(rot) + dy * Math.cos(rot);
	const hw = layer.width * layer.scale * s.scaleX / 2;
	const hh = layer.height * layer.scale * s.scaleY / 2;
	return Math.abs(lx) <= hw && Math.abs(ly) <= hh;
}
function hitHandle(layer, px, py, clock, audio, handlePx) {
	const s = layerSample(layer, clock, audio);
	const dx = px - (layer.x + s.dx);
	const dy = py - (layer.y + s.dy);
	const rot = -(layer.rotation + s.rot);
	const lx = dx * Math.cos(rot) - dy * Math.sin(rot);
	const ly = dx * Math.sin(rot) + dy * Math.cos(rot);
	const hw = layer.width * layer.scale * s.scaleX / 2;
	const hh = layer.height * layer.scale * s.scaleY / 2;
	const corners = [
		[-hw, -hh],
		[hw, -hh],
		[hw, hh],
		[-hw, hh]
	];
	const pad = handlePx;
	for (let i = 0; i < 4; i++) {
		const [cx, cy] = corners[i];
		if (Math.abs(lx - cx) <= pad && Math.abs(ly - cy) <= pad) return i;
	}
	return null;
}
var runtime = {
	clock: 0,
	canvas: null,
	audio: {
		bass: 0,
		mid: 0,
		treble: 0,
		beat: 0,
		peak: 0,
		bins: null
	}
};
function toStage(e, el) {
	const r = el.getBoundingClientRect();
	return {
		x: (e.clientX - r.left) / r.width * STAGE_W,
		y: (e.clientY - r.top) / r.height * STAGE_H,
		handle: 12 / r.width * STAGE_W
	};
}
function Stage() {
	const canvasRef = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.width = STAGE_W;
		canvas.height = STAGE_H;
		runtime.canvas = canvas;
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!ctx) return;
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			const state = useStudio.getState();
			if (state.exporting) {
				raf = requestAnimationFrame(loop);
				return;
			}
			if (state.playing && !document.hidden) runtime.clock += dt;
			try {
				runtime.audio = getAudio().tick();
			} catch {}
			renderFrame(ctx, state.snapshot(), runtime.clock, runtime.audio, state.recording ? null : { selectedId: state.selectedId });
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			if (runtime.canvas === canvas) runtime.canvas = null;
		};
	}, []);
	function onPointerDown(e) {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.setPointerCapture(e.pointerId);
		const p = toStage(e, canvas);
		const state = useStudio.getState();
		const selected = state.layers.find((l) => l.id === state.selectedId);
		if (selected && !selected.locked) {
			if (hitHandle(selected, p.x, p.y, runtime.clock, runtime.audio, p.handle) !== null) {
				drag.current = {
					mode: "scale",
					id: selected.id,
					ox: p.x,
					oy: p.y,
					startX: selected.x,
					startY: selected.y,
					startScale: selected.scale
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
				startScale: hit.scale
			};
		} else state.select(null);
	}
	function onPointerMove(e) {
		const canvas = canvasRef.current;
		const d = drag.current;
		if (!canvas || !d) return;
		const p = toStage(e, canvas);
		if (d.mode === "move") useStudio.getState().updateLayer(d.id, {
			x: p.x - d.ox,
			y: p.y - d.oy
		});
		else {
			const dist0 = Math.hypot(d.ox - d.startX, d.oy - d.startY) || 1;
			const dist1 = Math.hypot(p.x - d.startX, p.y - d.startY);
			const scale = Math.max(.08, d.startScale * (dist1 / dist0));
			useStudio.getState().updateLayer(d.id, { scale });
		}
	}
	function onPointerUp() {
		if (drag.current) useStudio.getState().commit();
		drag.current = null;
	}
	async function onDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (!file) return;
		const canvas = canvasRef.current;
		const at = canvas ? toStage({
			clientX: e.clientX,
			clientY: e.clientY
		}, canvas) : {
			x: STAGE_W / 2,
			y: STAGE_H / 2
		};
		if (file.type.startsWith("audio/")) {
			await getAudio().loadFile(file);
			useStudio.getState().setPlaying(true);
			return;
		}
		if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
			await useStudio.getState().addPng(file, {
				x: at.x,
				y: at.y
			});
			return;
		}
		if (file.type.startsWith("image/")) await useStudio.getState().uploadBackground(file);
	}
	const recording = useStudio((s) => s.recording);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-0 flex-1 items-center justify-center p-3 md:p-5",
		onDragOver: (e) => e.preventDefault(),
		onDrop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative aspect-video w-full max-w-7xl overflow-hidden rounded-lg bg-canvas shadow-[0_0_0_1px_rgba(255,255,255,0.06)]", recording && "shadow-[0_0_0_2px_var(--color-record)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "size-full cursor-crosshair touch-none",
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute right-2 bottom-2 rounded-sm bg-background/70 px-1.5 py-0.5 font-mono text-xs tracking-wide text-muted tabular-nums",
				children: recording ? "Exportando" : "1920×1080"
			})]
		})
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.10)] transition-[background-color] duration-150 ease-out data-[state=checked]:bg-primary data-[state=unchecked]:bg-elevated focus-visible:ring-2 focus-visible:ring-ring/40 outline-none", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-foreground transition-transform duration-150 ease-out data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground" })
	});
}
var FFT = 2048;
var BINS = FFT / 2;
var MIN_DB = -100;
var SMOOTH = .78;
function fftInPlace(re, im) {
	const n = re.length;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const tr = re[i];
			re[i] = re[j];
			re[j] = tr;
			const ti = im[i];
			im[i] = im[j];
			im[j] = ti;
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const ang = 2 * Math.PI / len;
		const wlenRe = Math.cos(ang);
		const wlenIm = Math.sin(ang);
		const half = len >> 1;
		for (let i = 0; i < n; i += len) {
			let wRe = 1;
			let wIm = 0;
			for (let j = 0; j < half; j++) {
				const p = i + j;
				const q = p + half;
				const vr = re[q] * wRe - im[q] * wIm;
				const vi = re[q] * wIm + im[q] * wRe;
				re[q] = re[p] - vr;
				im[q] = im[p] - vi;
				re[p] += vr;
				im[p] += vi;
				const nRe = wRe * wlenRe - wIm * wlenIm;
				wIm = wRe * wlenIm + wIm * wlenRe;
				wRe = nRe;
			}
		}
	}
}
var OfflineAnalyser = class {
	ch0;
	ch1;
	sr;
	re = new Float32Array(FFT);
	im = new Float32Array(FFT);
	mag = new Float32Array(BINS);
	bins = new Uint8Array(BINS);
	lastBass = 0;
	beatHold = 0;
	constructor(buffer) {
		this.ch0 = buffer.getChannelData(0);
		this.ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
		this.sr = buffer.sampleRate;
	}
	at(time) {
		const start = Math.floor(time * this.sr);
		const len = this.ch0.length;
		for (let i = 0; i < FFT; i++) {
			const idx = start + i;
			let s = 0;
			if (idx >= 0 && idx < len) {
				s = this.ch0[idx];
				if (this.ch1) s = (s + (this.ch1[idx] ?? 0)) * .5;
			}
			const hann = .5 * (1 - Math.cos(2 * Math.PI * i / 2047));
			this.re[i] = s * hann;
			this.im[i] = 0;
		}
		fftInPlace(this.re, this.im);
		const range = 70;
		for (let i = 0; i < BINS; i++) {
			const mag = Math.hypot(this.re[i], this.im[i]) / FFT;
			const db = mag > 1e-12 ? 20 * Math.log10(mag) : MIN_DB;
			const byte = Math.max(0, Math.min(255, (db - MIN_DB) / range * 255));
			this.mag[i] = SMOOTH * this.mag[i] + .21999999999999997 * byte;
			this.bins[i] = this.mag[i];
		}
		const avg = (from, to) => {
			let s = 0;
			const a = Math.max(0, from);
			const b = Math.min(BINS, to);
			for (let i = a; i < b; i++) s += this.bins[i] ?? 0;
			return b > a ? s / (b - a) / 255 : 0;
		};
		const bass = Math.pow(avg(0, 12), .85);
		const mid = avg(12, 80);
		const treble = avg(80, 280);
		const peak = Math.max(bass, mid, treble);
		const onset = bass - this.lastBass;
		this.lastBass = bass;
		if (onset > .08 && bass > .32 && this.beatHold < .2) this.beatHold = 1;
		else this.beatHold = Math.max(0, this.beatHold - .045);
		return {
			bass,
			mid,
			treble,
			peak,
			beat: this.beatHold,
			bins: this.bins
		};
	}
};
async function exportVisualizer(opts) {
	const { canvas, buffer, project, signal } = opts;
	const ctx = canvas.getContext("2d", { alpha: false });
	if (!ctx) throw new Error("canvas indisponível");
	const duration = buffer.duration;
	const frames = Math.max(1, Math.round(duration * 30));
	const frameDur = 1 / 30;
	const wantAvc = await canEncodeVideo("avc", {
		width: STAGE_W,
		height: STAGE_H,
		quality: QUALITY_HIGH
	});
	const wantAac = await canEncodeAudio("aac");
	const mp4 = wantAvc && wantAac;
	const target = new BufferTarget();
	const output = new Output({
		format: mp4 ? new Mp4OutputFormat() : new WebMOutputFormat(),
		target
	});
	const video = new CanvasSource(canvas, {
		codec: mp4 ? "avc" : "vp9",
		quality: QUALITY_HIGH,
		keyFrameInterval: 2
	});
	output.addVideoTrack(video, { frameRate: 30 });
	const audio = new AudioBufferSource({
		codec: mp4 ? "aac" : "opus",
		quality: QUALITY_HIGH
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
			renderFrame(ctx, project, t, analyser.at(t), null);
			await video.add(t, frameDur);
			if (i % 4 === 0) {
				opts.onProgress?.({
					frame: i + 1,
					frames,
					time: t,
					duration
				});
				if (document.visibilityState === "visible") await new Promise((r) => requestAnimationFrame(() => r()));
			}
		}
		opts.onProgress?.({
			frame: frames,
			frames,
			time: duration,
			duration
		});
		await output.finalize();
	} catch (err) {
		await output.cancel().catch(() => void 0);
		throw err;
	}
	const bytes = target.buffer;
	if (!bytes) throw new Error("ficheiro vazio");
	const ext = mp4 ? "mp4" : "webm";
	return {
		blob: new Blob([bytes], { type: mp4 ? "video/mp4" : "video/webm" }),
		ext
	};
}
function pickMime() {
	for (const c of [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm;codecs=vp9",
		"video/webm",
		"video/mp4"
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
	return "video/webm";
}
function combineStreams(video, audio) {
	const tracks = [...video.getVideoTracks()];
	if (audio) tracks.push(...audio.getAudioTracks());
	return new MediaStream(tracks);
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function formatClock(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
	const total = Math.floor(seconds);
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function fileStem(name) {
	return (name.replace(/\.[^.]+$/, "").replace(/[<>:"/\\|?*]+/g, "").trim() || "visualizer").slice(0, 48);
}
function stopCapture(rec) {
	if (rec.state === "inactive") return;
	try {
		rec.requestData();
	} catch {}
	rec.stop();
}
function BassMeter() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const loop = () => {
			if (ref.current) {
				const v = Math.max(.04, runtime.audio.bass);
				ref.current.style.transform = `scaleX(${v})`;
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden h-1 w-16 overflow-hidden rounded-full bg-elevated sm:block",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "h-full origin-left bg-primary"
		})
	});
}
function Transport() {
	const playing = useStudio((s) => s.playing);
	const recording = useStudio((s) => s.recording);
	const spectrum = useStudio((s) => s.spectrum);
	const spectrumIntensity = useStudio((s) => s.spectrumIntensity);
	const vignette = useStudio((s) => s.vignette);
	const grain = useStudio((s) => s.grain);
	const audioInput = (0, import_react.useRef)(null);
	const recRef = (0, import_react.useRef)(null);
	const chunks = (0, import_react.useRef)([]);
	const abortRef = (0, import_react.useRef)(null);
	const [track, setTrack] = (0, import_react.useState)(null);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [now, setNow] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			setElapsed(runtime.clock);
			try {
				const a = getAudio();
				setNow(a.currentTime);
				if (a.duration > 0) setDuration(a.duration);
			} catch {}
		}, 200);
		return () => window.clearInterval(id);
	}, []);
	async function onMusic(file) {
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
			downloadBlob(new Blob(chunks.current, { type: mime }), `palco-visualizer.${mime.includes("mp4") ? "mp4" : "webm"}`);
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
		let wake = null;
		try {
			wake = await navigator.wakeLock?.request("screen");
		} catch {}
		const onHidden = () => {
			if (document.visibilityState === "hidden") toast("A guia foi para segundo plano — o Chrome pode pausar. Deixa o Palco visível até acabar.");
		};
		document.addEventListener("visibilitychange", onHidden);
		try {
			const buffer = await audio.decodeBuffer();
			const length = buffer.duration;
			if (!(length > .05)) throw new Error("duração inválida");
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
				}
			});
			downloadBlob(blob, `palco-${fileStem(audio.name)}.${ext}`);
			toast(`Visualizer exportado · ${formatClock(length)}`);
		} catch (err) {
			if (ac.signal.aborted || err instanceof DOMException && err.name === "AbortError") toast("Exportação cancelada");
			else {
				console.error(err);
				toast("Não deu para exportar o vídeo");
			}
		} finally {
			document.removeEventListener("visibilitychange", onHidden);
			await wake?.release().catch(() => void 0);
			useStudio.getState().setRecording(false);
			useStudio.getState().setExporting(false);
			setExporting(false);
			abortRef.current = null;
		}
	}
	const pct = duration > 0 ? Math.min(1, (exporting ? now : 0) / duration) : 0;
	const clockLabel = duration > 0 ? `${formatClock(now)} / ${formatClock(duration)}` : formatClock(elapsed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-wrap items-center gap-3 border-t border-border bg-surface px-3 py-3 md:gap-4 md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-elevated",
				"aria-hidden": !exporting,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full origin-left bg-primary transition-transform duration-150", !exporting && "scale-x-0"),
					style: { transform: `scaleX(${exporting ? pct : 0})` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon",
						"aria-label": playing ? "Pausar" : "Tocar",
						disabled: exporting,
						onClick: () => {
							const next = !playing;
							useStudio.getState().setPlaying(next);
							if (next) getAudio().ensure();
							else getAudio().pause();
						},
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: recording && !exporting ? "record" : "secondary",
						size: "icon",
						"aria-label": recording && !exporting ? "Parar gravação" : "Gravar clip",
						disabled: exporting,
						onClick: () => void toggleRecord(),
						children: recording && !exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "fill-current" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted tabular-nums",
						children: clockLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BassMeter, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => audioInput.current?.click(),
						disabled: exporting,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-40 truncate",
							children: track ?? "Música"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "palco-audio",
						ref: audioInput,
						type: "file",
						accept: "audio/*",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onMusic(f);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex items-center gap-2 rounded-md bg-elevated px-2 py-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col leading-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-wide text-subtle",
								children: "Exportar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-foreground tabular-nums",
								children: duration > 0 ? formatClock(duration) : "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: exporting ? "record" : "default",
							onClick: () => void exportTrack(),
							"aria-label": exporting ? "Cancelar exportação" : "Exportar visualizer com a duração da música",
							children: [exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), exporting ? "Cancelar" : "Exportar"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: exportFrame,
						disabled: exporting,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDown, {}), " Quadro"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex shrink-0 flex-wrap items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: spectrum,
							onCheckedChange: (v) => useStudio.getState().setSpectrum(v)
						}), "Spectrum"]
					}),
					spectrum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-24 items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .01,
							value: [spectrumIntensity],
							onValueChange: ([v]) => useStudio.getState().setSpectrumIntensity(v ?? 0)
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden w-28 items-center gap-2 md:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: "Vinheta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .01,
							value: [vignette],
							onValueChange: ([v]) => useStudio.getState().setVignette(v ?? 0)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden w-28 items-center gap-2 lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: "Grain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .01,
							value: [grain],
							onValueChange: ([v]) => useStudio.getState().setGrain(v ?? 0)
						})]
					})
				]
			})
		]
	});
}
function Dialog({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, { ...props });
}
function DialogTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger$1, { ...props });
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal$1, { ...props });
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-background/80", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 flex size-8 items-center justify-center rounded-sm text-muted hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Fechar"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-2 text-sm text-muted text-pretty", className),
		...props
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$1, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "size-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2 touch-none select-none p-0.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
function Separator({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Tabs({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		className: cn("flex flex-col", className),
		...props
	});
}
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("flex h-11 items-center gap-1 rounded-lg bg-elevated p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex flex-1 items-center justify-center rounded-md px-2 text-xs font-medium text-muted transition-[background-color,color] duration-150 ease-out data-[state=active]:bg-surface data-[state=active]:text-foreground", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-3 min-h-0 flex-1", className),
		...props
	});
}
function TooltipProvider({ delayDuration = 250, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
function Editor() {
	const hydrate = useStudio((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			const tag = e.target?.tagName;
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
			if (s.selectedId && [
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) {
				e.preventDefault();
				const layer = s.layers.find((l) => l.id === s.selectedId);
				if (!layer || layer.locked) return;
				const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
				const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
				s.updateLayer(layer.id, {
					x: Math.min(STAGE_W, Math.max(0, layer.x + dx)),
					y: Math.min(STAGE_H, Math.max(0, layer.y + dy))
				});
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "h-full p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetDock, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transport, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-72 shrink-0 flex-col border-l border-border bg-surface lg:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea, {
							className: "h-full p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerList, {})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center"
			})
		]
	}) });
}
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center gap-3 border-b border-border bg-surface px-3 py-2.5 md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "Palco"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs text-muted sm:block",
					children: "Estúdio de visualizers 1920×1080"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => useStudio.getState().undo(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {}), " Desfazer"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => {
					runtime.clock = 0;
					useStudio.getState().reset();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), " Novo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Ajuda",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Como usar" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Coloque uma foto 1920×1080 no fundo, solte PNGs no palco e escolha o looping de cada peça. O slider de intensidade controla o quanto ela se mexe. Importe uma música e use Exportar — o Palco monta o vídeo frame a frame com a duração da faixa, sem gravar em tempo real. Deixa a guia aberta até acabar." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-1.5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Espaço — tocar / pausar" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Delete — remover peça" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ctrl+D — duplicar" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Setas — empurrar · Shift — 16 px" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "[ e ] — ordem das camadas" })
						]
					})
				] })]
			})
		]
	});
}
function MobileDock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-t border-border bg-surface px-3 py-2 lg:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "pecas",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "pecas",
						children: "Peças"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "animar",
						children: "Animar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "camadas",
						children: "Camadas"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "pecas",
					className: "max-h-56 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetDock, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "animar",
					className: "max-h-56 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "camadas",
					className: "max-h-56 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerList, {})
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {});
}
//#endregion
export { Home as component };
