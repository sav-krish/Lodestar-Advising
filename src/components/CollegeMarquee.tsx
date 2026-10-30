import cornell from "@/assets/logos/cornell.png";
import duke from "@/assets/logos/duke.png";
import gatech from "@/assets/logos/gatech.png";
import utexas from "@/assets/logos/utexas.png";
import wisconsin from "@/assets/logos/wisconsin.png";
import northeastern from "@/assets/logos/northeastern.png";
import minnesota from "@/assets/logos/minnesota.png";
import tamu from "@/assets/logos/tamu.png";
import harvard from "@/assets/logos/harvard.svg";
import mit from "@/assets/logos/mit.png";
import penn from "@/assets/logos/penn.png";
import princeton from "@/assets/logos/princeton.png";
import { useEffect, useId, useRef, useState } from "react";
import "@/styles/college-marquee.css";

const colleges = [
  { name: "Harvard University", logo: harvard },
  { name: "Princeton University", logo: princeton },
  { name: "Massachusetts Institute of Technology", logo: mit },
  { name: "University of Pennsylvania", logo: penn },
  { name: "Cornell University", logo: cornell },
  { name: "Duke University", logo: duke },
  { name: "Georgia Tech", logo: gatech },
  { name: "UT Austin", logo: utexas },
  { name: "Texas A&M University", logo: tamu },
  { name: "UW Madison", logo: wisconsin },
  { name: "Northeastern University", logo: northeastern },
  { name: "University of Minnesota", logo: minnesota },
];

export function CollegeMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const viewportId = useId();
  const [isPaused, setIsPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isInView, setIsInView] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => document.visibilityState === "visible",
  );
  const isRunning = !isPaused && isInView && isDocumentVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsPaused(preference.matches);
    const updateVisibility = () => setIsDocumentVisible(document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.01,
    });

    if (viewportRef.current) observer.observe(viewportRef.current);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const sequence = sequenceRef.current;
    if (!isRunning || !viewport || !sequence) return;

    let sequenceWidth = sequence.getBoundingClientRect().width;
    let origin = viewport.scrollLeft;
    let startedAt: number | null = null;
    let frameId = 0;

    // Each complete sequence takes 52 seconds, independent of frame rate.
    const animate = (timestamp: number) => {
      if (startedAt === null) startedAt = timestamp;
      if (sequenceWidth > 0) {
        viewport.scrollLeft =
          (origin + ((timestamp - startedAt) / 52_000) * sequenceWidth) % sequenceWidth;
      }
      frameId = window.requestAnimationFrame(animate);
    };
    const observer = new ResizeObserver(() => {
      sequenceWidth = sequence.getBoundingClientRect().width;
      origin = viewport.scrollLeft;
      startedAt = null;
    });

    observer.observe(sequence);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [isRunning]);

  return (
    <div className="college-marquee">
      <div
        id={viewportId}
        ref={viewportRef}
        className="college-marquee-viewport"
        data-running={isRunning}
        role="region"
        aria-label="Founder acceptances at top universities"
        tabIndex={0}
      >
        <div className="college-marquee-track">
          <ul ref={sequenceRef} className="college-marquee-sequence">
            {colleges.map((college) => (
              <li key={college.name} className="college-marquee-item">
                <img src={college.logo} alt={college.name} loading="lazy" draggable={false} />
              </li>
            ))}
          </ul>
          <ul className="college-marquee-sequence" aria-hidden="true">
            {colleges.map((college) => (
              <li key={college.name} className="college-marquee-item">
                <img src={college.logo} alt="" loading="lazy" draggable={false} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
