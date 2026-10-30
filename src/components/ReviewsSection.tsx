import { Star, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  reviews,
  featuredReviews,
  averageRating,
} from "@/data/reviews";

// Re-export so existing imports (e.g. JSON-LD in routes/index.tsx) keep working.
export { reviews };

export function ReviewsSection() {
  const avgDisplay = Number.isInteger(averageRating)
    ? averageRating.toFixed(1)
    : averageRating.toFixed(1);

  return (
    <section className="section-fade-in py-24">
      <div className="container-prose">
        <Reveal effect="scale" className="text-center max-w-2xl mx-auto">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
            Google Reviews
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl italic text-primary">
            Families trust Lodestar.
          </h2>
          <div className="gold-divider mx-auto mt-6" />
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex" aria-label={`${avgDisplay} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-serif text-lg text-primary font-semibold">
              {avgDisplay}
            </span>
            <span className="text-primary font-serif">
              · Trusted by families
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredReviews.map((r, i) => (
            <Reveal
              key={r.name}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              effect={i % 2 === 0 ? "left" : "right"}
            >
              <figure className="h-full p-7 rounded-xl bg-card border border-border shadow-soft hover-lift hover:border-gold/50 flex flex-col">
                <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
                  {[...Array(r.rating)].map((_, s) => (
                    <Star key={s} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 font-serif text-primary leading-relaxed font-medium flex-1">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border">
                  <div className="font-display text-sm tracking-wider text-primary font-semibold">
                    {r.name}
                  </div>
                  <div className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mt-1">
                    Verified Google Review
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a
            href="https://g.page/r/CfNGPVfR8HxDEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md border border-gold/60 text-primary hover:bg-gold/10 transition-smooth font-display tracking-wider text-sm"
          >
            Read All Reviews on Google
            <ExternalLink size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
