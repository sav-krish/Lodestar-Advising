import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { clientsHelped, programs } from "@/data/programs";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Lodestar Advising: Premium Ivy League Prep | Programs" },
      {
        name: "description",
        content:
          "Choose The Lodestar Hour for flexible admissions support or The Lodestar Essay Package: 10 premium, 30-minute essay classes for $550. 20+ clients helped.",
      },
      { property: "og:title", content: "Lodestar Advising | The Lodestar Hour & Essay Package" },
      {
        property: "og:description",
        content:
          "Flexible one-hour admissions support or ten focused, 30-minute essay classes. Work directly with Krish Sav. 20+ clients helped.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://lodestaradvising.com/services" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: programs.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: p.name,
              description: `${p.summary} ${p.points.join(". ")}. ${p.priceSummary}`,
              provider: { "@type": "Organization", name: "Lodestar Advising" },
            },
          })),
        }),
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="programs-page font-serif">
      <section className="container-prose pt-16 pb-12 md:pt-24 md:pb-16">
        <p className="text-sm font-display uppercase text-muted-foreground">
          Lodestar Advising · Programs
        </p>
        <h1 className="mt-5 max-w-3xl font-serif italic text-4xl font-semibold leading-tight md:text-6xl">
          Two ways to work together.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Get help with your next admissions question, or make time to focus on your essays. Every
          session is with Krish Sav.
        </p>
        <p className="mt-8 text-sm font-medium text-primary">
          {clientsHelped}+ clients helped. No registration fee.
        </p>
      </section>

      <section className="container-prose pb-20 md:pb-24" aria-label="Offered plans">
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          {programs.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-lg border border-border bg-secondary p-7 md:p-10 transition-colors duration-200 hover:border-primary/30 motion-reduce:transition-none"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {p.sessionCount === 1 ? "Flexible support" : "Focused essay coaching"}
              </p>
              <h2 className="mt-4 font-serif italic text-3xl font-semibold leading-tight">
                {p.name}
              </h2>
              <p className="mt-4 min-h-14 leading-relaxed text-muted-foreground">{p.summary}</p>
              <div className="my-7 border-y border-border py-5">
                <p className="text-xl font-semibold">
                  {p.sessionCount === 1 ? "1 × 60-minute session" : "10 × 30-minute classes"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {p.id === "essay-package"
                    ? "5 hours of essay coaching in total"
                    : "Choose the topic. We’ll work through it together."}
                </p>
              </div>
              <ul className="flex-1 space-y-4">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 min-h-20">
                <p className="font-medium">
                  {p.id === "essay-package" ? "Ten essay classes" : "One Lodestar Hour"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.priceSummary}
                </p>
              </div>
              <Button asChild size="lg" className="mt-6 h-12 w-full font-display text-xs uppercase">
                <Link to="/contact">
                  {p.id === "hour" ? "Ask about the Hour" : "Ask about the essay package"}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <WhyChooseUs />

      <section className="container-prose py-20 text-center md:py-24">
        <h2 className="font-serif italic text-3xl font-semibold md:text-4xl">
          Let’s find the right fit.
        </h2>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted-foreground">
          Talk through your goals in a free 30-minute consultation before choosing a plan.
        </p>
        <Button asChild size="lg" className="mt-7 h-12 font-display text-xs uppercase">
          <Link to="/contact">
            Book free consultation
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
