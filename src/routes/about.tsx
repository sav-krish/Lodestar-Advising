import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Sparkles, Heart, Compass, ArrowRight } from "lucide-react";
import {
  PageHero,
  SectionFadeIn,
  SectionPrimaryBand,
  SectionBlendPanel,
} from "@/components/PageSections";
import { ScrollScrub } from "@/components/ScrollEffects";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising: Premium Ivy League Prep | About" },
      {
        name: "description",
        content:
          "Meet Lodestar Advising: a premium college counseling firm with 12+ elite student acceptances, $600K+ in scholarships won for students, and 20+ clients helped. Founder Krish Sav built the playbook behind the results.",
      },
      { property: "og:title", content: "Lodestar Advising: Premium Ivy League Prep | About" },
      {
        property: "og:description",
        content:
          "Meet Lodestar Advising: 12+ elite student acceptances, $600K+ in scholarships won for students, and 20+ clients helped. Founder Krish Sav built the playbook behind the results.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/about" }],
  }),
  component: About,
});

const values = [
  {
    icon: Sparkles,
    title: "Excellence",
    body: "We hold every essay, every list, and every interview to the standard of the most selective rooms in the country.",
  },
  {
    icon: Heart,
    title: "Empathy",
    body: "We coach the student behind the application. Ambition deserves a guide who listens before strategizing.",
  },
  {
    icon: Compass,
    title: "Clarity",
    body: "Parents and students always know the next step. No jargon, no surprises, and no inflated promises.",
  },
];

function About() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          About Lodestar
        </span>
        <h1
          className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          A founder who lived the journey, now guiding yours.
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          Built from a real student's playbook, delivered with the rigor of a premium consultancy.
        </p>
      </PageHero>

      <SectionFadeIn>
        <div className="container-prose grid md:grid-cols-2 gap-16">
          <ScrollScrub strength={20}>
            <Reveal effect="left">
              <div className="gold-divider" />
              <h2 className="mt-4 text-3xl italic">Our Story</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed font-serif text-lg">
                Lodestar Advising was founded in MMXXVI by{" "}
                <span className="text-foreground font-semibold">Krish Sav</span>, a student who walked
                the elite admissions road firsthand and built a methodology that now produces 12+
                elite acceptances and $600K+ in scholarships for the students and families Lodestar serves.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed font-serif text-lg">
                Krish navigated the entire admissions process without a private counselor. Every
                essay, every shortlist, and every scholarship strategy was self-built. The result was a
                playbook that earned multiple acceptances to highly selective universities and{" "}
                <span className="text-foreground font-semibold">over $432,000 in scholarship dollars</span>
                {" "}across his own offers. He distilled that system into a repeatable counseling framework
                now applied to every Lodestar student.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed font-serif text-lg">
                Lodestar exists because he wished he'd had a guide. Now Lodestar is that guide for
                students and parents who deserve to understand the process just as clearly. The mission is
                simple: streamline the road, share the playbook, and make sure no family walks it alone.
              </p>
            </Reveal>
          </ScrollScrub>
          <ScrollScrub strength={20}>
            <Reveal delay={2} effect="right">
              <div className="gold-divider" />
              <h2 className="mt-4 text-3xl italic">Our Philosophy</h2>
              <ul className="mt-4 space-y-4 text-muted-foreground font-serif text-lg">
                <li>
                  <strong className="text-foreground not-italic font-serif font-semibold text-lg">
                    Personalized.
                  </strong>{" "}
                  No two students learn the same way, and no two strategies should look alike.
                </li>
                <li>
                  <strong className="text-foreground not-italic font-serif font-semibold text-lg">
                    Rigorous.
                  </strong>{" "}
                  We measure progress in earned admissions, scholarship dollars, and unlocked potential.
                </li>
                <li>
                  <strong className="text-foreground not-italic font-serif font-semibold text-lg">
                    Human.
                  </strong>{" "}
                  Ambition is fragile. We coach the student, not just the application.
                </li>
              </ul>
            </Reveal>
          </ScrollScrub>
        </div>
      </SectionFadeIn>



      <SectionPrimaryBand>
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
            Core Values
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl italic">What every family receives.</h2>
          <div className="gold-divider mx-auto mt-6" />
        </Reveal>
        <ScrollScrub className="mt-14" strength={22}>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i + 1) as 1 | 2 | 3} effect="scale">
                <div className="group p-8 rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/10 backdrop-blur-sm hover-lift hover:border-gold/40 h-full">
                  <div className="w-12 h-12 rounded-md bg-gradient-gold flex items-center justify-center text-gold-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <v.icon size={22} />
                  </div>
                  <h3 className="mt-6 font-serif italic text-2xl">{v.title}</h3>
                  <p className="mt-3 font-serif text-base leading-relaxed text-primary-foreground">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </ScrollScrub>
      </SectionPrimaryBand>

      <SectionBlendPanel>
        <div className="promise-panel max-w-3xl mx-auto text-center">
          <Reveal effect="scale">
            <h2 className="font-serif text-3xl md:text-4xl italic">Student Results</h2>
            <div className="gold-divider mx-auto mt-6" />
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[
              { k: "12+", v: "Elite college acceptances for Lodestar students" },
              { k: "$600K+", v: "Scholarship dollars won for students across offers" },
            ].map((p, i) => (
              <Reveal key={p.v} delay={(i + 1) as 1 | 2} effect="scale">
                <div className="p-8 rounded-xl bg-card/80 border border-border shadow-soft text-center">
                  <div className="font-serif italic text-5xl text-gold">{p.k}</div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={3}>
            <Link
              to="/results"
              className="group mt-10 inline-flex items-center gap-2 px-7 py-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.2em] font-display hover:opacity-90 transition-smooth"
            >
              See full results
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </SectionBlendPanel>
    </>
  );
}
