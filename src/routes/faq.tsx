import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageHero, SectionFadeIn } from "@/components/PageSections";

const faqs = [
  {
    q: "What is Lodestar Advising?",
    a: "Lodestar Advising is a premium, founder-led college admissions consultancy guiding ambitious students into the world's most selective universities. Our track record includes 12+ elite student acceptances and $600K+ in scholarships won for students. We have helped 20+ clients. Choose The Lodestar Hour for flexible admissions support or The Lodestar Essay Package for 10 premium, 30-minute essay-only classes at a discounted equivalent hourly rate.",
  },
  {
    q: "Who founded Lodestar Advising?",
    a: "Lodestar was founded by Krish Sav, who developed the admissions playbook behind Lodestar's 12+ elite student acceptances and $600K+ in scholarships won for students. Every student at Lodestar works directly with the founder, from strategy through submission.",
  },
  {
    q: "What colleges have Lodestar students been admitted to?",
    a: "Lodestar students have gained admission to Cornell, Duke, MIT, Harvard, Columbia, Penn, Georgia Tech, UT Austin, and other top-tier institutions, with a proven track record of 12+ elite college acceptances.",
  },
  {
    q: "How much does Lodestar Advising cost?",
    a: "Lodestar is intentionally more affordable than most major college consulting firms while still delivering founder-led mentorship. Book a complimentary 30-minute consultation to receive a package recommendation and transparent pricing for your student.",
  },
  {
    q: "Where is Lodestar Advising located?",
    a: "Lodestar Advising operates virtually and works with families across every U.S. time zone and internationally. All consultations, essay reviews, and strategy sessions are conducted online.",
  },
  {
    q: "How do I book a consultation with Lodestar?",
    a: "Visit our contact page at lodestaradvising.com/contact or email advising.lodestar@gmail.com. Every family receives a personal reply from the founder within one business day.",
  },
  {
    q: "When should a student start working with Lodestar?",
    a: "The strongest results come from sophomore or early junior year, which allows time to shape course rigor, extracurricular narrative, and testing strategy. We also accept seniors through the early action window when capacity allows.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising: Premium Ivy League Prep | FAQ" },
      {
        name: "description",
        content:
          "Frequently asked questions about Lodestar Advising: services, pricing, founder background, admission results, and how to book a consultation.",
      },
      { property: "og:title", content: "Lodestar Advising: Premium Ivy League Prep | FAQ" },
      {
        property: "og:description",
        content:
          "Answers about Lodestar Advising: what we do, who we work with, results, pricing, and how to get started.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          Frequently Asked
        </span>
        <h1
          className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Answers about Lodestar Advising.
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          What Lodestar is, who we work with, and how our founder-led process delivers Ivy League
          acceptances and scholarship offers.
        </p>
      </PageHero>

      <SectionFadeIn>
        <div className="container-prose py-8">
          <div className="max-w-3xl mx-auto">
            <Reveal effect="scale" className="text-center">
              <HelpCircle className="mx-auto text-gold" size={28} />
              <div className="gold-divider mx-auto mt-6" />
            </Reveal>
            <div className="mt-10 divide-y divide-border border-y border-border">
              {faqs.map((f, i) => (
                <Reveal
                  key={f.q}
                  delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                  effect={i % 2 === 0 ? "left" : "right"}
                >
                  <details className="group py-6">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-serif italic text-xl text-primary pr-6">{f.q}</span>
                      <span className="text-gold text-2xl font-light transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-primary font-serif leading-relaxed font-medium">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="font-serif italic text-lg text-muted-foreground">
                Still have questions?
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold shadow-elegant hover:-translate-y-0.5 transition-smooth font-display tracking-wider text-sm"
              >
                Book Free Consultation
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </SectionFadeIn>
    </>
  );
}
