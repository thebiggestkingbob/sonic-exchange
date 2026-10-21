"use client";
import { useEffect, useRef } from "react";
/** A procedural sound sculpture: no video downloads, external libraries or tracking. */
export function SoundWorld({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const host = surface.current;
    const context = node?.getContext("2d", { alpha: true });
    if (!node || !host || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      visible = true,
      time = 0;
    function resize() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      node!.width = width * dpr;
      node!.height = height * dpr;
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(time);
    }
    function render(t: number) {
      const c = context!;
      c.clearRect(0, 0, width, height);
      const scale = Math.min(width * 0.4, height * 0.43);
      const angle = t * 0.13 + 0.35 + pointer.x * 0.16;
      const tilt = -0.36 + Math.sin(t * 0.12) * 0.12 + pointer.y * 0.12;
      const points: { x: number; y: number; depth: number; hue: number }[][] =
        [];
      const rings = 108,
        sides = 26;
      for (let i = 0; i <= rings; i++) {
        const u = (i / rings) * Math.PI * 2;
        const row = [];
        for (let j = 0; j <= sides; j++) {
          const v = (j / sides) * Math.PI * 2;
          const fold = 1 + 0.14 * Math.sin(u * 3 + t * 0.28);
          const radius = 0.77 + 0.12 * Math.cos(u * 2 - t * 0.22);
          const tube = 0.24 * fold;
          let x = (radius + tube * Math.cos(v + u * 1.5)) * Math.cos(u);
          const y = (radius + tube * Math.cos(v + u * 1.5)) * Math.sin(u);
          let z =
            tube * Math.sin(v + u * 1.5) + 0.16 * Math.sin(u * 3 + t * 0.2);
          const rx = x * Math.cos(angle) + z * Math.sin(angle);
          z = -x * Math.sin(angle) + z * Math.cos(angle);
          x = rx;
          const ry = y * Math.cos(tilt) - z * Math.sin(tilt);
          z = y * Math.sin(tilt) + z * Math.cos(tilt);
          const perspective = 2.8 / (2.8 - z);
          row.push({
            x: width / 2 + x * scale * perspective,
            y: height / 2 + ry * scale * perspective,
            depth: z,
            hue: 255 + 75 * Math.sin(u + v * 0.2 + t * 0.12),
          });
        }
        points.push(row);
      }
      // Draw back to front to give the open mesh its dimensional form.
      const segments: { a: (typeof points)[0][0]; b: (typeof points)[0][0] }[] =
        [];
      for (let i = 0; i < rings; i++)
        for (let j = 0; j < sides; j++) {
          segments.push({ a: points[i][j], b: points[i + 1][j] });
          segments.push({ a: points[i][j], b: points[i][j + 1] });
        }
      segments.sort((a, b) => a.a.depth - b.a.depth);
      for (const { a, b } of segments) {
        const light = (a.depth + 1.1) / 2.2;
        c.strokeStyle = `hsla(${a.hue}, ${70 + light * 20}%, ${42 + light * 37}%, ${0.13 + light * 0.68})`;
        c.lineWidth = 0.55 + light * 0.6;
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
      }
      c.fillStyle = "#e6c6ff";
      for (let i = 0; i < 38; i++) {
        const a = i * 2.39996 + t * 0.025;
        const r = scale * (1.15 + (i % 5) * 0.09);
        const x = width / 2 + Math.cos(a) * r;
        const y = height / 2 + Math.sin(a) * r * 0.7;
        c.globalAlpha = 0.18 + (i % 4) * 0.12;
        c.beginPath();
        c.arc(x, y, i % 3 ? 0.8 : 1.6, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    }
    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (
        now - last < 40 ||
        !visible ||
        document.hidden ||
        paused ||
        reduced.matches
      )
        return;
      time += Math.min((now - last) / 1000 || 0.04, 0.06);
      last = now;
      render(time);
    }
    function move(event: PointerEvent) {
      if (reduced.matches || paused) return;
      const b = host!.getBoundingClientRect();
      pointer.x = (event.clientX - b.left) / b.width - 0.5;
      pointer.y = (event.clientY - b.top) / b.height - 0.5;
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    observer.observe(host);
    const motionChange = () => {
      render(time);
    };
    reduced.addEventListener("change", motionChange);
    host.addEventListener("pointermove", move);
    resize();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      reduced.removeEventListener("change", motionChange);
      host.removeEventListener("pointermove", move);
    };
  }, [paused]);
  return (
    <div className="sound-world-surface" ref={surface} aria-hidden="true">
      <div className="sound-world-halo" />
      <canvas ref={canvas} />
      <span className="world-coordinate coordinate-a">26°12′ S / 28°02′ E</span>
      <span className="world-coordinate coordinate-b">
        SOUND HAS NO BORDERS.
      </span>
    </div>
  );
}
