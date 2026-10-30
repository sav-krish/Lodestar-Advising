import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: ElementType;
  once?: boolean;
  effect?: "up" | "scale" | "left" | "right" | "soft";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as: As = "div",
  once = true,
  effect = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const delayClass = delay ? `reveal-delay-${delay}` : "";
  const effectClass = effect !== "up" ? `reveal-${effect}` : "";
  return (
    <As
      ref={ref as never}
      className={cn("reveal", effectClass, delayClass, visible && "is-visible", className)}
    >
      {children}
    </As>
  );
}
