import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BookMarked, ArrowRight } from "lucide-react";
import { PageHero, SectionFadeIn, SectionPrimaryBand, SectionBlendPanel } from "@/components/PageSections";
import { ScrollScrub } from "@/components/ScrollEffects";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising: Premium Ivy League Prep | Results" },
      {
        name: "description",
        content:
          "12+ elite college acceptances, $600K+ in scholarships won for students, and 20+ clients helped. The results that shape every Lodestar strategy.",
      },
      { property: "og:title", content: "Lodestar Advising: Premium Ivy League Prep | Results" },
      {
        property: "og:description",
        content:
          "12+ elite college acceptances, $600K+ in scholarships won for students, and 20+ clients helped. The results that shape every Lodestar strategy.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/results" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/results" }],
  }),
  component: Results,
});

const colleges = [
  "Harvard University",
  "Princeton University",
  "Massachusetts Institute of Technology",
  "University of Pennsylvania",
  "Columbia University",
  "Cornell University",
  "Duke University",
  "Georgia Tech",
  "UT Austin",
  "Texas A&M University",
  "UW Madison",
  "Northeastern University",
];

function Results() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          Results
        </span>
        <h1
          className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Outcomes that open doors.
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          12+ elite college acceptances and $600K+ in scholarships won for the students we guide. Every
          framework we teach is drawn from real, proven student outcomes.
        </p>
      </PageHero>

      <SectionFadeIn>
        <ScrollScrub strength={22}>
          <div className="container-prose grid grid-cols-1 gap-5 max-w-3xl mx-auto">
            {[
              { k: "12+", v: "Elite college acceptances for Lodestar students" },
              { k: "20+", v: "Clients helped" },
              { k: "4", v: "Featured in news articles" },
            ].map((s, i) => (
              <Reveal key={s.v} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} effect={i % 2 === 0 ? "left" : "right"}>
                <div className="flex items-center justify-between gap-6 p-8 min-h-[7rem] rounded-xl bg-card border border-border shadow-soft hover-lift hover:shadow-elegant hover:border-gold/40">
                  <div className="font-serif italic text-4xl md:text-5xl text-gold leading-none shrink-0">
                    {s.k}
                  </div>
                  <div className="text-right text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground font-display">
                    {s.v}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </ScrollScrub>
      </SectionFadeIn>

      <SectionPrimaryBand className="acceptances-section">
        <Reveal className="text-center">
          <BookMarked className="mx-auto text-gold" size={28} />
          <h2 className="mt-4 text-center font-serif italic">
            <span className="block text-5xl md:text-6xl text-gold leading-none">12+</span>
            <span className="block text-2xl md:text-3xl mt-2">Elite College Acceptances</span>
          </h2>
          <div className="gold-divider mx-auto mt-4" />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((c, i) => (
            <Reveal key={c} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} effect={i % 2 === 0 ? "left" : "right"}>
              <div className="p-6 rounded-lg bg-primary-foreground/[0.04] border border-primary-foreground/10 text-center font-serif italic text-lg hover-lift hover:border-gold/50">
                {c}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 text-center text-sm tracking-[0.2em] uppercase text-gold/90 font-display">
            Real acceptances · Real scholarships · Real students
          </p>
        </Reveal>
      </SectionPrimaryBand>




      <WhyChooseUs />

      <SectionBlendPanel>
        <Reveal effect="scale" className="promise-panel max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl italic">Strategy proven by student results.</h2>
          <div className="gold-divider mx-auto mt-6" />
          <p className="mt-6 font-serif text-lg text-muted-foreground leading-relaxed">
            From course rigor to scholarship positioning to the final supplemental essay, Lodestar's
            playbook is built from real student outcomes, not theory borrowed from a manual. Every
            family receives the same framework that produced our students' elite acceptances.
          </p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.2em] font-display hover:opacity-90 transition-smooth"
          >
            Start your journey
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </SectionBlendPanel>
    </>
  );
}
