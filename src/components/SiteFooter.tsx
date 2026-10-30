import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/lodestar-wordmark.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-prose py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Lodestar logo" className="h-10 w-auto object-contain" />
            <span className="font-display text-sm tracking-[0.22em] uppercase">Lodestar</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground max-w-sm font-serif italic leading-relaxed">
            Lodestar Advising: premium Ivy League admissions prep and founder-led college counseling for ambitious students aiming for the world's most selective universities.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/lodestar-college-guidance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-gold transition-smooth"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com/lodestarccg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-gold transition-smooth"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61589790796992"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-gold transition-smooth"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-gold font-display">Established · MMXXVI</p>
        </div>
        <div>
          <h4 className="font-display text-xs uppercase tracking-[0.2em] mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground">
            <li><Link to="/services">Programs</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xs uppercase tracking-[0.2em] mb-4 text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground">
            <li>advising.lodestar@gmail.com</li>
            <li>+1 (608) 421-3736</li>
            <li>Mon to Sat · 9am to 8pm CST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-prose py-6 text-[0.65rem] text-primary-foreground flex justify-between font-display tracking-[0.18em] uppercase">
          <span>© {new Date().getFullYear()} Lodestar Advising</span>
          <span>Crafted for future scholars.</span>
        </div>
      </div>
    </footer>
  );
}
