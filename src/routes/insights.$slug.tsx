import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { PageHero, SectionFadeIn } from "@/components/PageSections";
import { insights, type Insight } from "@/data/insights";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const insight = insights.find((item) => item.slug === params.slug);
    if (!insight) throw notFound();
    return insight;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Lodestar Advising` },
          { name: "description", content: loaderData.dek },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.dek },
        ]
      : [],
    links: [
      { rel: "canonical", href: `https://lodestaradvising.com/insights/${loaderData?.slug ?? ""}` },
    ],
  }),
  component: InsightArticle,
});

function InsightArticle() {
  const insight = Route.useLoaderData();

  return (
    <>
      <PageHero>
        <div className="flex items-center gap-3 text-[0.65rem] font-display uppercase tracking-[0.18em] text-gold">
          <span>{insight.category}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1 text-primary-foreground">
            <Clock3 size={13} />
            {insight.readTime}
          </span>
        </div>
        <h1 className="mt-5 max-w-4xl text-5xl italic md:text-7xl animate-fade-up">
          {insight.title}
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-primary-foreground animate-fade-up">
          {insight.dek}
        </p>
        <p className="mt-8 text-[0.7rem] font-display uppercase tracking-[0.18em] text-gold">
          Published {insight.date}
        </p>
      </PageHero>

      <SectionFadeIn>
        <article className="container-prose max-w-3xl py-24">
          <div className="space-y-7 font-serif text-xl leading-relaxed text-foreground">
            {insight.body.map((paragraph: Insight["body"][number]) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-gold">
              Sources and further reading
            </h2>
            <ul className="mt-5 space-y-3">
              {insight.sources.map((source: Insight["sources"][number]) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground underline decoration-gold/60 underline-offset-4 hover:text-foreground"
                  >
                    {source.label}
                    <ArrowUpRight size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-5">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.18em] text-primary hover:text-gold"
            >
              <ArrowLeft size={16} />
              All insights
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-5 py-3 font-display text-xs uppercase tracking-[0.16em] text-gold-foreground shadow-soft hover:-translate-y-0.5"
            >
              Talk with Lodestar
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>
      </SectionFadeIn>
    </>
  );
}
