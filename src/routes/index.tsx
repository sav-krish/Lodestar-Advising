import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-campus.gif";
import {
  GraduationCap,
  Target,
  ArrowRight,
  Award,
  BookMarked,
  Compass,
  PenLine,
  Trophy,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CollegeMarquee } from "@/components/CollegeMarquee";
import { ScrollCanvasBackdrop, ScrollScrub } from "@/components/ScrollEffects";
import { ReviewsSection, reviews } from "@/components/ReviewsSection";
import { totalReviewCount, averageRating } from "@/data/reviews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising | Premium Ivy League Admissions Prep & College Counseling" },
      {
        name: "description",
        content:
          "Lodestar Advising: premium, founder-led college admissions counseling with 12+ elite acceptances, $600K+ in scholarships won for students, and 20+ clients helped. Also known as Lodestar, Lodestar College, Lodestar CCG, Lodestar Guidance.",
      },
      { property: "og:title", content: "Lodestar Advising | Premium Ivy League Admissions Prep" },
      {
        property: "og:description",
        content:
          "Founder-led college admissions counseling. 12+ elite acceptances, $600K+ in scholarships, and 20+ clients helped.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/" },
    ],
    links: [
      { rel: "canonical", href: "https://lodestaradvising.com/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Lodestar Advising",
          url: "https://lodestaradvising.com/",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: String(totalReviewCount),
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
            },
            reviewBody: r.text,
          })),
        }),
      },
    ],
  }),
  component: Home,
});

const process = [
  {
    icon: Compass,
    step: "01",
    title: "Discovery",
    body: "A one on one diagnostic of academics, ambitions, and the story only you can tell.",
  },
  {
    icon: Target,
    step: "02",
    title: "Strategy",
    body: "A bespoke college list, course rigor plan, and scholarship roadmap built around your goals.",
  },
  {
    icon: PenLine,
    step: "03",
    title: "Execution",
    body: "Essays, supplements, activities, and interviews refined under founder led mentorship.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Acceptance",
    body: "We celebrate offers, weigh scholarships, and choose the campus that fits your future.",
  },
];

const faqs = [
  {
    q: "Who is Lodestar for?",
    a: "Ambitious freshmen, sophomores, juniors, and seniors aiming for top thirty universities, honors programs, and meaningful scholarship awards.",
  },
  {
    q: "How is this different from a typical college counselor?",
    a: "Every plan is built and delivered by the founder, Krish Sav, using a methodology that has produced 12+ elite college acceptances and $600K+ in scholarship offers for students. You work directly with the architect of the playbook, not a rotating associate.",
  },
  {
    q: "Why Lodestar?",
    a: "We believe premium guidance should not require premium pricing. Lodestar is more affordable than most major college consulting firms while delivering founder-led mentorship. Our track record includes 12+ elite acceptances and $600K+ in scholarships won for students; we bring that same rigor to every family we serve.",
  },
  {
    q: "Do you work with families remotely?",
    a: "Yes. All consultations are virtual, which means we serve families across every U.S. time zone and internationally.",
  },
  {
    q: "What results have Lodestar students achieved?",
    a: "Our students have earned 12+ acceptances to elite universities and won $600K+ in scholarship offers. We publish verified Google reviews from families so you can read about real outcomes before booking a call.",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Ivy covered college campus at golden hour"
            width={1600}
            height={1024}
            fetchPriority="high"
            decoding="async"
            className="hero-media w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        </div>
        <div className="relative container-prose py-32 md:py-44 text-primary-foreground">

          <h1
            className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] max-w-4xl italic animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Lodestar Advising
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg text-primary-foreground leading-relaxed font-serif animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Work directly with Krish Sav on your essays, college search, and admissions questions. Choose a flexible hour or ten focused essay classes.
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="https://cal.com/krish-s/lodestar?overlayCalendar=true"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-md shimmer-gold text-gold-foreground font-semibold shadow-elegant hover:-translate-y-0.5 transition-smooth font-display tracking-wider text-sm"
            >
              Book Free Consultation
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-smooth font-display tracking-wider text-sm"
            >
              Explore Programs
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 max-w-xl gap-8 border-t border-primary-foreground/15 pt-8">
            {[
              { k: "12+", v: "Elite College Acceptances" },
              { k: "20+", v: "Clients Helped" },
            ].map((s, i) => (
              <Reveal key={s.v} delay={((i % 2) + 1) as 1 | 2}>
                <div className="font-serif text-3xl text-gold italic">{s.k}</div>
                <div className="text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground mt-2 font-display">
                  {s.v}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="section-fade-in">
        <div className="container-prose py-24">
        <ScrollScrub strength={18}>
        <Reveal effect="soft" className="max-w-3xl mx-auto text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
            The Playbook Behind Every Student
          </span>
          <div className="gold-divider mx-auto mt-6" />
          <p className="mt-8 font-serif text-2xl md:text-3xl italic leading-snug text-foreground">
            "We translate hard-won admissions experience into real student outcomes. Families come to us for the strategy, stay for the results, and leave with acceptances they once thought were out of reach."
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
            Krish Sav, Founder
          </p>
        </Reveal>
        </ScrollScrub>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="container-prose">
          <Reveal effect="scale" className="text-center max-w-2xl mx-auto">
            <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
              Our Approach
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl italic">Excellence, individually crafted.</h2>
            <div className="gold-divider mx-auto mt-6" />
          </Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Strategic Diagnostics",
                body: "We begin by mapping your strengths, gaps, and ambitions, building a roadmap as singular as your story.",
              },
              {
                icon: GraduationCap,
                title: "Founder Led Mentorship",
                body: "Guidance from someone who lived the elite admissions journey, not a corporate script.",
              },
              {
                icon: Award,
                title: "Scholarship Strategy",
                body: "Architected applications that don't just earn admission, they earn six figure scholarship offers.",
              },
            ].map((p, i) => (
              <Reveal
                key={p.title}
                delay={(i + 1) as 1 | 2 | 3}
                effect={i === 0 ? "left" : i === 1 ? "scale" : "right"}
              >
                <div className="group p-8 rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/10 backdrop-blur-sm hover-lift hover:border-gold/40 h-full">
                  <div className="w-12 h-12 rounded-md bg-gradient-gold flex items-center justify-center text-gold-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <p.icon size={22} />
                  </div>
                  <h3 className="mt-6 font-serif italic text-2xl text-primary-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-serif text-base leading-relaxed text-primary-foreground">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Lodestar Process */}
      <section className="container-prose py-24">
        <Reveal effect="scale" className="text-center max-w-2xl mx-auto">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
            The Lodestar Process
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl italic">
            Four steps to your acceptance.
          </h2>
          <div className="gold-divider mx-auto mt-6" />
        </Reveal>
        <ScrollScrub className="mt-16 process-scrub" strength={24}>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {process.map((p, i) => (
              <Reveal key={p.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} effect="scale">
                <div className="group relative p-7 rounded-xl bg-card border border-border shadow-soft hover-lift hover:shadow-elegant hover:border-gold/50 h-full">
                  <div className="font-display text-[0.65rem] tracking-[0.3em] text-gold">
                    {p.step}
                  </div>
                  <div className="mt-4 w-11 h-11 rounded-md bg-gradient-gold flex items-center justify-center text-gold-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <p.icon size={20} />
                  </div>
                  <h3 className="mt-5 font-serif italic text-2xl text-primary">{p.title}</h3>
                  <p className="mt-3 text-sm text-primary font-serif leading-relaxed font-medium">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </ScrollScrub>
      </section>

      {/* Visual separator */}
      <div className="bg-primary py-8">
        <div className="container-prose">
          <div className="gold-divider mx-auto" />
        </div>
      </div>

      {/* Acceptances banner */}
      <section className="acceptances-section bg-primary text-primary-foreground py-24">
        <div className="container-prose text-center">
          <Reveal effect="scale">
            <BookMarked className="mx-auto text-gold" size={28} />
            <h2 className="mt-4 font-serif text-3xl md:text-4xl italic">Where our story begins.</h2>
            <div className="gold-divider mx-auto mt-4" />
          </Reveal>
          <Reveal effect="soft" className="mt-12">
            <div className="rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/10 backdrop-blur-sm py-8">
              <CollegeMarquee />
            </div>
          </Reveal>
          <Reveal>
            <p className="mt-8 text-sm tracking-[0.2em] uppercase text-gold/90 font-display">
              Real student acceptances · Real scholarship offers
            </p>
          </Reveal>
        </div>
      </section>

      {/* Google Reviews */}
      <WhyChooseUs />

      <ReviewsSection />

      {/* Promise */}
      <section className="promise-section relative overflow-hidden py-24 md:py-32">
        <ScrollCanvasBackdrop className="promise-canvas" />
        <div className="container-prose relative z-10">
          <ScrollScrub strength={38}>
            <Reveal effect="scale" className="promise-panel max-w-4xl mx-auto text-center">
              <ShieldCheck className="promise-icon mx-auto text-gold" size={34} />
              <span className="mt-5 block text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
                The Lodestar Promise
              </span>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl italic">
                Strategy, transparency, partnership.
              </h2>
              <div className="gold-divider mx-auto mt-6" />
              <p className="mt-8 font-serif text-lg md:text-xl leading-relaxed text-muted-foreground">
                Every Lodestar family receives the founder directly on every revision, a transparent
                timeline of milestones, and a roadmap that adapts as your story grows. We measure
                success in acceptance letters won for students and scholarship dollars secured, not billable hours.
              </p>
              <div className="promise-proof-row" aria-label="Lodestar Promise pillars">
                {["Founder revisions", "Transparent milestones", "Adaptive roadmap"].map((item) => (
                  <div className="promise-proof" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </ScrollScrub>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-prose py-24">
        <Reveal effect="scale" className="text-center max-w-2xl mx-auto">
          <HelpCircle className="mx-auto text-gold" size={28} />
          <span className="mt-4 block text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display">
            Frequently Asked
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl italic">
            Answers before the first call.
          </h2>
          <div className="gold-divider mx-auto mt-6" />
        </Reveal>
        <div className="mt-14 max-w-3xl mx-auto divide-y divide-border border-y border-border">
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
                <p className="mt-4 text-primary font-serif leading-relaxed font-medium">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-prose py-24 text-center">
        <Reveal effect="scale">
          <h2 className="font-serif text-4xl md:text-5xl italic">
            Your future begins with a conversation.
          </h2>
          <div className="gold-divider mx-auto mt-6" />
          <p className="mt-6 font-serif italic text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Schedule a complimentary 30 minute consultation with our founder.
          </p>
          <a
            href="https://cal.com/krish-s/lodestar?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold shadow-elegant hover:-translate-y-0.5 transition-smooth font-display tracking-wider text-sm"
          >
            Begin Your Journey
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>

        </Reveal>
      </section>
    </>
  );
}
