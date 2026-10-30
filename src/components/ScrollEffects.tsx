import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollScrubProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function ScrollScrub({ children, className, strength = 36 }: ScrollScrubProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.style.setProperty("--scrub-y", "0px");
      el.style.setProperty("--scrub-scale", "1");
      el.style.setProperty("--scrub-opacity", "1");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      const centered = progress - 0.5;

      el.style.setProperty("--scrub-y", `${-centered * strength}px`);
      el.style.setProperty("--scrub-scale", `${0.985 + progress * 0.025}`);
      el.style.setProperty("--scrub-opacity", `${clamp(progress * 1.5, 0.86, 1)}`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("scroll-scrub", className)}>
      {children}
    </div>
  );
}

export function ScrollCanvasBackdrop({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let frame = 0;
    let alive = true;
    let visible = true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      frame = 0;
      if (!alive) return;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.floor(width * dpr);
      const pixelHeight = Math.floor(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const viewport = window.innerHeight || 1;
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      const now = prefersReducedMotion ? 0 : performance.now() * 0.001;

      const glow = ctx.createRadialGradient(
        width * (0.28 + progress * 0.24),
        height * (0.24 + Math.sin(now * 0.45) * 0.05),
        0,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.74,
      );
      glow.addColorStop(0, "rgba(24, 40, 71, 0.06)");
      glow.addColorStop(0.34, "rgba(24, 40, 71, 0.03)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const compassX = width * (0.76 - progress * 0.08);
      const compassY = height * (0.32 + progress * 0.12);
      const compassRadius = Math.min(width, height) * 0.24;

      ctx.save();
      ctx.translate(compassX, compassY);
      ctx.rotate((progress - 0.5) * 0.18);
      ctx.strokeStyle = "rgba(161, 125, 53, 0.12)";
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= 3; ring += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, compassRadius * (ring / 3), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, -compassRadius);
      ctx.lineTo(0, compassRadius);
      ctx.moveTo(-compassRadius, 0);
      ctx.lineTo(compassRadius, 0);
      ctx.strokeStyle = "rgba(161, 125, 53, 0.08)";
      ctx.stroke();
      ctx.fillStyle = "rgba(161, 125, 53, 0.34)";
      ctx.beginPath();
      ctx.moveTo(0, -compassRadius * 0.58);
      ctx.lineTo(compassRadius * 0.055, 0);
      ctx.lineTo(0, compassRadius * 0.58);
      ctx.lineTo(-compassRadius * 0.055, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.lineCap = "round";
      for (let i = 0; i < 4; i += 1) {
        const depth = (i + 1) / 4;
        const y = height * (0.22 + i * 0.16) + Math.sin(now * 0.35 + i) * 12;
        const drift = (progress - 0.5) * 120 * depth;

        ctx.beginPath();
        ctx.moveTo(width * -0.1 + drift, y);
        ctx.bezierCurveTo(
          width * 0.22,
          y - 52 * depth,
          width * 0.72,
          y + 62 * depth,
          width * 1.1 + drift,
          y - 16,
        );
        ctx.strokeStyle = `rgba(24, 40, 71, ${0.03 + depth * 0.02})`;
        ctx.lineWidth = 1 + depth * 0.8;
        ctx.stroke();
      }

      for (let i = 0; i < 18; i += 1) {
        const x = width * ((i * 0.137 + progress * 0.08) % 1) + Math.sin(now * 0.24 + i) * 8;
        const y = height * ((i * 0.211 + 0.18 + progress * 0.12) % 1);
        const radius = 1.2 + (i % 4) * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(24, 40, 71, ${0.06 + (i % 3) * 0.02})`;
        ctx.fill();
      }

      if (!prefersReducedMotion && visible) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !prefersReducedMotion && !frame) {
        frame = window.requestAnimationFrame(draw);
      }
    });
    observer.observe(canvas);
    draw();

    return () => {
      alive = false;
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("scroll-canvas", className)} aria-hidden="true" />;
}
