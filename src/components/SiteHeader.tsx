import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import logo from "@/assets/lodestar-wordmark.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Programs" },
  { to: "/results", label: "Results" },
  { to: "/events", label: "Events" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container-prose site-header-inner">
        <Link to="/" className="site-wordmark" aria-label="Lodestar Advising home">
          <img src={logo} alt="" width={36} height={36} />
          <span>Lodestar Advising</span>
        </Link>
        <nav className="site-desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="site-nav-link"
              activeProps={{ "aria-current": "page" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="site-nav-cta">
            Book a consultation <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/portal"
            className="text-[0.7rem] font-display uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-smooth"
          >
            Student Portal
          </Link>
        </nav>
        <button
          ref={toggle}
          type="button"
          className="site-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav id="site-mobile-nav" className="site-mobile-nav" aria-label="Mobile navigation">
          <div className="container-prose">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="site-nav-link"
                activeProps={{ "aria-current": "page" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="site-nav-cta">
              Book a consultation <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
