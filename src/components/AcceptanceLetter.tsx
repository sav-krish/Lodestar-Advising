import { useEffect, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
          </div>

          <div
            className="acceptance-stage"
            aria-label="Illustration of opening an acceptance letter"
          >
            <div className="acceptance-stage-glow" aria-hidden="true" />
            <div className="acceptance-confetti" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="acceptance-orbit acceptance-orbit-one" aria-hidden="true" />
            <div className="acceptance-orbit acceptance-orbit-two" aria-hidden="true" />
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
