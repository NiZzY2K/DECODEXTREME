type SequenceOptions = {
  canvas: HTMLCanvasElement;
  count: number;
  frameUrl: (index: number) => string;
  cacheSize: number;
  initialFrames: number;
  idleBatch: number;
  onReady: () => void;
};

/** Decode a moving window; the rest stays in the browser's HTTP cache. */
export function createFrameSequence({
  canvas, count, frameUrl, cacheSize, initialFrames, idleBatch, onReady,
}: SequenceOptions) {
  const context = canvas.getContext("2d", { alpha: false });
  const frames = new Map<number, HTMLImageElement>();
  const pending = new Map<number, Promise<void>>();
  const controller = new AbortController();
  let destroyed = false;
  let target = 0;
  let lastDrawn = -1;
  let direction = 1;
  let ready = false;
  let idleId: number | undefined;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let width = 0;
  let height = 0;

  const draw = (force = false) => {
    if (destroyed || !context || !width || !height) return;
    let index = target;
    if (!frames.has(index)) {
      const loaded = [...frames.keys()];
      if (!loaded.length) return;
      index = loaded.reduce((a, b) => Math.abs(a - target) <= Math.abs(b - target) ? a : b);
    }
    if (index === lastDrawn && !force) return;
    const frame = frames.get(index);
    if (!frame?.naturalWidth) return;
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
    const frameWidth = frame.naturalWidth * scale;
    const frameHeight = frame.naturalHeight * scale;
    context.drawImage(frame, (width - frameWidth) / 2, (height - frameHeight) / 2, frameWidth, frameHeight);
    lastDrawn = index;
    canvas.dataset.frame = String(index);
    if (!ready) {
      ready = true;
      onReady();
    }
  };

  const evict = () => {
    if (frames.size <= cacheSize) return;
    const furthest = [...frames.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
    for (const index of furthest.slice(0, frames.size - cacheSize)) frames.delete(index);
  };

  const load = (index: number): Promise<void> => {
    if (destroyed || index < 0 || index >= count || frames.has(index)) return Promise.resolve();
    const existing = pending.get(index);
    if (existing) return existing;
    const promise = new Promise<void>((resolve) => {
      const frame = new Image();
      frame.decoding = "async";
      frame.onload = () => {
        if (!destroyed) {
          frames.set(index, frame);
          evict();
          draw();
        }
        pending.delete(index);
        resolve();
      };
      frame.onerror = () => { pending.delete(index); resolve(); };
      frame.src = frameUrl(index);
    });
    pending.set(index, promise);
    return promise;
  };

  const schedule = (callback: () => void) => {
    if (destroyed) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(callback, { timeout: 1000 });
    else timerId = setTimeout(callback, 80);
  };

  let prefetchIndex = initialFrames;
  const prefetch = async () => {
    if (destroyed) return;
    const end = Math.min(count, prefetchIndex + idleBatch);
    await Promise.all(Array.from({ length: end - prefetchIndex }, (_, offset) => {
      const index = prefetchIndex + offset;
      return fetch(frameUrl(index), { cache: "force-cache", signal: controller.signal, priority: "low" })
        .then((response) => response.ok ? response.arrayBuffer() : undefined)
        .catch(() => undefined);
    }));
    prefetchIndex = end;
    if (prefetchIndex < count) schedule(() => { void prefetch(); });
  };

  void load(0).then(async () => {
    for (let first = 1; first < Math.min(initialFrames, count) && !destroyed; first += idleBatch) {
      await Promise.all(Array.from({
        length: Math.min(idleBatch, initialFrames - first, count - first),
      }, (_, offset) => load(first + offset)));
    }
    schedule(() => { void prefetch(); });
  });

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = canvas.width = Math.round(bounds.width * dpr);
    height = canvas.height = Math.round(bounds.height * dpr);
    draw(true);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    setProgress(progress: number) {
      const next = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
      if (next !== target) direction = next > target ? 1 : -1;
      target = next;
      draw();
      if (!frames.has(target)) void load(target);
      if (pending.size < idleBatch * 2) {
        for (let offset = 1; offset <= 4; offset++) void load(target + offset * direction);
        void load(target - direction);
      }
    },
    destroy() {
      destroyed = true;
      controller.abort();
      observer.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      frames.clear();
      pending.clear();
    },
  };
}

