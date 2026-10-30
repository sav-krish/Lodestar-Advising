import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/lodestar-wordmark.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Programs" },
  { to: "/results", label: "Results" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-prose flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Lodestar logo"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-smooth"
          />
          <span className="font-display text-sm tracking-[0.16em] uppercase text-foreground">
            Lodestar Advising
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="link-underline text-[0.7rem] font-display uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-smooth"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-[0.7rem] font-semibold uppercase tracking-[0.2em] font-display hover:opacity-90 transition-smooth shadow-soft"
          >
            Book Consultation
          </Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container-prose py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground font-display uppercase tracking-[0.2em] text-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
