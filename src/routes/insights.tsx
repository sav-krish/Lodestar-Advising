import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageHero, SectionFadeIn } from "@/components/PageSections";
import { insights } from "@/data/insights";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Admissions Insights | Lodestar Advising" },
      {
        name: "description",
        content:
          "Lodestar Advising insights on the 2026 to 2027 admissions cycle, application strategy, AI and authenticity, and selective college preparation.",
      },
      { property: "og:title", content: "Admissions Insights | Lodestar Advising" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/insights" }],
  }),
  component: Insights,
});

function Insights() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          The Lodestar Journal
        </span>
        <h1 className="mt-4 max-w-3xl text-5xl italic md:text-6xl animate-fade-up">
          A clearer read on a changing admissions landscape.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg text-primary-foreground animate-fade-up">
          Original guidance for ambitious students and families navigating the 2026 to 2027
          application cycle.
        </p>
      </PageHero>

      <SectionFadeIn>
        <div className="container-prose py-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Reveal key={insight.slug} delay={((index % 3) + 1) as 1 | 2 | 3} effect="scale">
                <article className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-soft transition-smooth hover:-translate-y-1 hover:border-gold/50 hover:shadow-elegant">
                  <div className="flex items-center justify-between gap-4 text-[0.65rem] font-display uppercase tracking-[0.18em] text-gold">
                    <span>{insight.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock3 size={13} />
                      {insight.readTime}
                    </span>
                  </div>
                  <h2 className="mt-6 text-3xl italic text-primary">{insight.title}</h2>
                  <p className="mt-4 flex-1 font-serif text-base leading-relaxed text-muted-foreground">
                    {insight.dek}
                  </p>
                  <Link
                    to="/insights/$slug"
                    params={{ slug: insight.slug }}
                    className="mt-8 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.18em] text-primary transition-smooth group-hover:text-gold"
                  >
                    Read the brief
                    <ArrowUpRight size={16} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionFadeIn>
    </>
  );
}
