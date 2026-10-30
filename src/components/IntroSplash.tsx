import { useEffect, useState } from "react";
import logo from "@/assets/lodestar-wordmark.png";

export function IntroSplash() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only show once per session
    if (sessionStorage.getItem("lodestar-intro-shown")) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("lodestar-intro-shown", "1");
    document.body.style.overflow = "hidden";
    const fade = setTimeout(() => setPhase("fading"), 1800);
    const done = setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
    }, 2600);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 splash-rise">
        <img
          src={logo}
          alt="Lodestar Advising"
          className="h-32 w-auto object-contain splash-glow"
        />
        <div className="splash-divider" />
        <span className="font-display text-[0.7rem] uppercase tracking-[0.5em] text-gold splash-fade-late">
          Lodestar Advising
        </span>
      </div>
    </div>
  );
}
