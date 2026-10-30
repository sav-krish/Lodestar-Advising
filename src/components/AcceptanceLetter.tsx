import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowDown, Compass } from "lucide-react";
import { acceptanceFrame, scrollProgress } from "@/lib/acceptance-motion";
import "@/styles/acceptance.css";

const confetti = Array.from({ length: 36 }, (_, index) => {
  const angle = (index / 36) * Math.PI * 2;
  const distance = 140 + ((index * 47) % 170);
  return {
    "--dx": `${Math.cos(angle) * distance}px`,
    "--dy": `${Math.sin(angle) * distance - 150}px`,
    "--spin": `${(index % 2 ? 1 : -1) * (240 + index * 27)}deg`,
    "--piece-angle": `${index * 37}deg`,
  } as CSSProperties;
});

export function AcceptanceLetter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    const pin = element?.querySelector<HTMLElement>(".acceptance-pin");
    if (!element || !pin) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-height: 500px)");
    let frame = 0;
    let current = 0;
    let lastTime = 0;
    let measuring = true;
    let target = 0;

    const paint = (p: number) => {
      const v = acceptanceFrame(p);
      const properties: Record<string, string | number> = {
        "--flap": `${v.flap}deg`,
        "--lift": v.lift,
        "--seal-opacity": 1 - Math.min(1, Math.abs(v.flap) / 75),
        "--envelope-rotate": `${v.envelopeRotate}deg`,
        "--envelope-tilt": `${v.envelopeTilt}deg`,
        "--envelope-yaw": `${v.envelopeYaw}deg`,
        "--envelope-y": `${v.envelopeY}%`,
        "--envelope-opacity": v.envelopeOpacity,
        "--letter-rotate": `${v.letterRotate}deg`,
        "--letter-tilt": `${v.letterTilt}deg`,
        "--letter-yaw": `${v.letterYaw}deg`,
        "--letter-layer": v.lift > 78 ? 6 : 2,
        "--flap-layer": v.flap < -90 ? 1 : 5,
        "--burst": v.confetti,
        "--fall": v.confetti * v.confetti,
        "--confetti-opacity": Math.sin(v.confetti * Math.PI),
        "--story-progress": v.progress,
      };
      for (const [key, value] of Object.entries(properties))
        element.style.setProperty(key, String(value));
      element.dataset.chapter = p < 0.33 ? "begin" : p < 0.69 ? "open" : "next";
    };

    const update = (time: number) => {
      frame = 0;
      if (preference.matches || compact.matches) {
        current = 1;
        paint(1);
        return;
      }
      if (measuring) {
        const rect = element.getBoundingClientRect();
        const header =
          parseFloat(getComputedStyle(element).getPropertyValue("--site-header-height")) || 80;
        target = scrollProgress(rect.top - header, rect.height, pin.offsetHeight);
        measuring = false;
      }
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 65));
      if (Math.abs(target - current) < 0.0001) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(update);
      else lastTime = 0;
    };
    const requestUpdate = () => {
      measuring = true;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(requestUpdate);
    resize.observe(element);
    resize.observe(pin);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    preference.addEventListener("change", requestUpdate);
    compact.addEventListener("change", requestUpdate);
    requestUpdate();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      preference.removeEventListener("change", requestUpdate);
      compact.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <>
      <section
        ref={ref}
        className="acceptance-story"
        aria-labelledby="acceptance-title"
        data-chapter="begin"
      >
        <div className="acceptance-pin">
          <div className="acceptance-layout container-prose">
            <div className="acceptance-copy">
              <p className="acceptance-eyebrow">The next chapter</p>
              <h2 id="acceptance-title">
                Some moments
                <br /> change <em>everything.</em>
              </h2>
              <p className="acceptance-intro">
                The ideas. The drafts. The work that is yours alone. One day, it all becomes a new
                beginning.
              </p>
              <div className="acceptance-chapters" aria-hidden="true">
                <div className="acceptance-chapter" data-step="begin">
                  <span>01 / The possibility</span>
                  <p>A future worth imagining.</p>
                </div>
                <div className="acceptance-chapter" data-step="open">
                  <span>02 / The moment</span>
                  <p>All that work. A whole new world.</p>
                </div>
                <div className="acceptance-chapter" data-step="next">
                  <span>03 / Your next chapter</span>
                  <p>Take a breath. Take it in.</p>
                </div>
              </div>
              <a href="#after-acceptance" className="acceptance-skip">
                Continue to the stories <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
            <div
              className="acceptance-visual"
              role="img"
              aria-label="An envelope opens to reveal a celebration letter: Congratulations. Your next chapter is waiting. An illustration of the possibility ahead, not a guarantee of admission."
            >
              <div className="acceptance-light" />
              <div className="acceptance-assembly" aria-hidden="true">
                <div className="acceptance-envelope-back" />
                <div className="acceptance-letter-track">
                  <div className="acceptance-paper">
                    <div className="acceptance-paper-front">
                      <div className="acceptance-letterhead">
                        <Compass size={25} strokeWidth={1} />
                        <span>A new beginning</span>
                      </div>
                      <div className="acceptance-paper-rule" />
                      <p className="acceptance-salutation">Dear future you,</p>
                      <h3>Congratulations.</h3>
                      <p className="acceptance-paper-deck">
                        Your next chapter
                        <br />
                        is waiting.
                      </p>
                      <p className="acceptance-paper-body">
                        There is a place for your curiosity.
                        <br />A place for your ambition.
                        <br />A place to become who you will be.
                      </p>
                      <div className="acceptance-paper-signoff">
                        <span>Here’s to what comes next.</span>
                        <span>Lodestar Advising</span>
                      </div>
                    </div>
                    <div className="acceptance-paper-back">
                      <Compass size={70} strokeWidth={0.7} />
                      <span>Find your direction.</span>
                    </div>
                  </div>
                </div>
                <div className="acceptance-envelope-front">
                  <div className="acceptance-envelope-fold" />
                  <span>Lodestar Advising</span>
                </div>
                <div className="acceptance-flap" />
                <div className="acceptance-seal">
                  <Compass size={23} strokeWidth={1} />
                </div>
              </div>
              <div className="acceptance-celebration" aria-hidden="true">
                {confetti.map((style, index) => (
                  <span key={index} style={style} />
                ))}
              </div>
              <p className="acceptance-visual-caption" aria-hidden="true">
                <span />
                Scroll to unfold the possibility
              </p>
            </div>
          </div>
          <div className="acceptance-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
    </>
  );
}
