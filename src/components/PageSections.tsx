import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollCanvasBackdrop, ScrollScrub } from "@/components/ScrollEffects";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

/** Navy hero used at the top of inner pages */
export function PageHero({ children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary text-primary-foreground py-24 md:py-28",
        className,
      )}
    >
      <div className="container-prose relative z-10">{children}</div>
    </section>
  );
}

/** Cream section that fades in from navy above */
export function SectionFadeIn({ children, className }: SectionProps) {
  return <section className={cn("section-fade-in py-20 md:py-24", className)}>{children}</section>;
}

/** Navy band with soft fade into the next section */
export function SectionPrimaryBand({ children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "section-primary-band bg-primary text-primary-foreground py-20 md:py-24",
        className,
      )}
    >
      <div className="container-prose relative z-10">{children}</div>
    </section>
  );
}

/** Homepage-style blend: navy → cream with canvas motion (Lodestar Promise pattern) */
export function SectionBlendPanel({ children, className }: SectionProps) {
  return (
    <section className={cn("promise-section relative overflow-hidden py-24 md:py-28", className)}>
      <ScrollCanvasBackdrop className="promise-canvas" />
      <div className="container-prose relative z-10">
        <ScrollScrub strength={34}>{children}</ScrollScrub>
      </div>
    </section>
  );
}

/** Thin gradient bridge between two section tones */
export function SectionBridge({ from = "primary" }: { from?: "primary" | "background" }) {
  return (
    <div
      aria-hidden
      className={cn("section-bridge", from === "background" && "section-bridge--from-light")}
    />
  );
}
