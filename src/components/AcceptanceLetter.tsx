import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, Sparkles } from "lucide-react";

export function AcceptanceLetter() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`acceptance-moment ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="acceptance-moment-title"
    >
      <div className="container-prose">
        <div className="acceptance-moment-grid">
          <div className="acceptance-moment-copy">
            <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
              The moment we work toward
            </span>
            <h2
              id="acceptance-moment-title"
              className="mt-5 font-serif text-4xl italic text-primary md:text-5xl"
            >
              The work is personal. So is the destination.
            </h2>
            <div className="gold-divider mt-6" />
            <p className="mt-7 max-w-xl font-serif text-lg leading-relaxed text-foreground">
              Before the campus tour, the move-in day, or the first lecture, there is a quieter
              moment. A student opens an envelope and sees a future they helped build.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              This is an illustrative Lodestar moment, not a promise of admission. Our role is to
              make each student&apos;s preparation thoughtful, rigorous, and unmistakably their own.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-primary font-display">
              <ArrowDown size={16} className="text-gold" aria-hidden="true" />
              Scroll to open
            </div>
          </div>

          <div
            className="acceptance-stage"
            aria-label="Illustration of opening an acceptance letter"
          >
            <div className="acceptance-stage-glow" aria-hidden="true" />
            <div className="acceptance-envelope">
              <div className="acceptance-letter">
                <div className="acceptance-letter-header">
                  <span className="acceptance-letter-mark">L</span>
                  <span>Office of Undergraduate Admission</span>
                </div>
                <div className="acceptance-letter-rule" />
                <p className="acceptance-letter-kicker">A new chapter begins</p>
                <h3>Congratulations, future scholar.</h3>
                <p>Your curiosity, character, and commitment have somewhere new to grow.</p>
                <div className="acceptance-letter-signature">
                  <Check size={15} aria-hidden="true" />
                  <span>Prepared with intention</span>
                </div>
              </div>
              <div className="acceptance-envelope-pocket" aria-hidden="true" />
              <div className="acceptance-envelope-flap" aria-hidden="true" />
            </div>
            <div className="acceptance-stage-caption">
              <Sparkles size={15} aria-hidden="true" />
              One student. One story. One next step.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
