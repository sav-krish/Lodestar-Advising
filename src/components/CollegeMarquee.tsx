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
import { useState } from "react";

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
  const [activeCollege, setActiveCollege] = useState<string | null>(null);

  return (
    <div className="logo-wall" role="list" aria-label="Founder acceptances at top universities">
      <div className="logo-wall-grid">
        {colleges.map((c) => (
          <button
            key={c.name}
            type="button"
            role="listitem"
            aria-label={c.name}
            aria-pressed={activeCollege === c.name}
            onClick={() => setActiveCollege((current) => (current === c.name ? null : c.name))}
            className="logo-wall-item"
            data-active={activeCollege === c.name ? "true" : "false"}
          >
            <img
              src={c.logo}
              alt={`${c.name} logo`}
              loading="lazy"
              className="h-20 md:h-24 w-auto object-contain drop-shadow-md"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
