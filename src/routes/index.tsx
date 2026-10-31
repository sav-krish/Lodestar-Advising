import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, Check, ExternalLink, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CollegeMarquee } from "@/components/CollegeMarquee";
import { AcceptanceLetter } from "@/components/AcceptanceLetter";
import { clientsHelped, programs } from "@/data/programs";
import { reviews, featuredReviews, totalReviewCount, averageRating } from "@/data/reviews";
import "@/styles/home.css";
import "@/styles/hero.css";

const consultationUrl = "https://cal.com/krish-s/lodestar?overlayCalendar=true";

const faqs = [
  {
    q: "Where should I start?",
    a: "Start with a free, 30-minute consultation with Krish. Bring your questions, share what you are working on, and talk through which session format fits your needs. There is no registration fee.",
  },
  {
    q: "What can we cover in The Lodestar Hour?",
    a: "The one-hour session is flexible: Common App and supplemental essays, an activities list, resume feedback, college search, scholarship support, or your admissions questions. You choose what needs attention.",
  },
  {
    q: "How does the Essay Package work?",
    a: "The Lodestar Essay Package includes ten 30-minute classes with Krish, focused only on essays. Work on brainstorming, structure, writing, and revision for your Common App and supplemental essays. Contact us to talk through the package.",
  },
  {
    q: "Who will I work with?",
    a: "You work directly with Lodestar founder Krish Sav. Sessions are personal, with space to ask questions and understand the feedback. You remain the author of your application and your essays.",
  },
  {
    q: "Can we meet remotely?",
    a: "Yes. Consultations and sessions are virtual. Sessions are scheduled around school and family commitments, Monday to Saturday, 9am to 8pm Central Time.",
  },
];

const process = [
  {
    step: "01",
    title: "Bring your questions.",
    body: "Meet Krish in a free consultation. Share where you are in the process and what would help you move forward.",
  },
  {
    step: "02",
    title: "Choose your focus.",
    body: "Use a flexible hour for admissions questions, or ten shorter classes to develop your essays. Choose the support that fits.",
  },
  {
    step: "03",
    title: "Leave with a next step.",
    body: "Work through ideas and feedback together. Understand the reasoning behind each edit, then make the work your own.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lodestar Advising | Personal College Admissions & Essay Coaching" },
      {
        name: "description",
        content: `Personal, founder-led college admissions guidance with Krish Sav. Choose a flexible hour or ten focused essay classes. ${clientsHelped}+ clients helped. Start with a free consultation.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Lodestar Advising | Your Story. Your Next Chapter." },
      {
        property: "og:description",
        content:
          "Work directly with Krish Sav on college applications and essays. Personal guidance, clear next steps, and room for your own voice.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/" }],
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
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Lodestar programs",
            itemListElement: programs.map((p) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: p.name,
                description: `${p.summary} ${p.points.join(". ")}.`,
              },
            })),
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero home-hero-blue" aria-labelledby="home-title">
        <div className="home-container home-hero-inner">
          <div className="home-hero-copy">
            <h1 id="home-title">
              Your story.
              <br />
              <em>
                Your next
                <br className="home-hero-break" /> chapter.
              </em>
            </h1>
            <p className="home-hero-description">
              Thoughtful college admissions and essay coaching, directly with Krish Sav. Find your
              direction, strengthen your application, and keep your own voice.
            </p>
            <div className="home-actions">
              <a
                href={consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="home-button home-button-gold"
              >
                Book a free consultation
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link to="/" hash="programs" className="home-text-link">
                Find your fit
                <ArrowDownRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="programs"
        className="home-programs home-section"
        aria-labelledby="programs-title"
      >
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <h2 id="programs-title">
                Support for where
                <br />
                <em>you are right now.</em>
              </h2>
            </div>
          </div>
          <div className="home-program-list">
            {programs.map((program) => (
              <article key={program.id} className="home-program">
                <div className="home-program-intro">
                  <p className="home-eyebrow">
                    {program.scope === "essays-only"
                      ? "Focused essay coaching"
                      : "Flexible admissions support"}
                  </p>
                  <h3>{program.name}</h3>
                  <p>{program.summary}</p>
                  <div className="home-program-duration">
                    <strong>
                      {program.sessionCount === 1 ? "1 session" : `${program.sessionCount} classes`}
                    </strong>
                    <span>{program.sessionMinutes} minutes each</span>
                  </div>
                </div>
                <div className="home-program-details">
                  <ul>
                    {program.points.map((point) => (
                      <li key={point}>
                        <Check size={16} aria-hidden="true" />
                        <span className="font-serif">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/services" className="home-text-link">
                    Explore {program.id === "hour" ? "the Hour" : "the Essay Package"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="home-process home-section" aria-labelledby="process-title">
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <h2 id="process-title">
                Start with a conversation.
                <br />
                <em>Build from there.</em>
              </h2>
            </div>
          </div>
          <div className="home-process-grid">
            {process.map((step) => (
              <article key={step.step}>
                <div className="home-process-number">
                  <span>{step.step}</span>
                  <ArrowRight size={22} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AcceptanceLetter />

      <section
        id="after-acceptance"
        className="home-reviews home-section"
        aria-labelledby="reviews-title"
      >
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <h2 id="reviews-title">
                Personal guidance.
                <br />
                <em>A shared experience.</em>
              </h2>
            </div>
            <div className="home-review-rating">
              <span
                className="home-stars"
                aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={17} aria-hidden="true" />
                ))}
              </span>
              <p>
                <strong>{averageRating.toFixed(1)}</strong> from {totalReviewCount} Google reviews
              </p>
            </div>
          </div>
          <div className="home-review-grid">
            {featuredReviews.map((review) => (
              <figure key={review.name} className="home-review">
                <span className="home-quote-mark" aria-hidden="true">
                  “
                </span>
                <blockquote>{review.text}</blockquote>
                <figcaption>
                  <span className="home-review-name">{review.name}</span>
                  <span className="home-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} size={11} aria-hidden="true" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <a
            href="https://g.page/r/CfNGPVfR8HxDEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="home-text-link home-review-link"
          >
            Read reviews on Google
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="home-colleges home-section" aria-labelledby="colleges-title">
        <div className="home-container">
          <div className="home-colleges-heading">
            <h2 id="colleges-title">
              Where the founder’s
              <br />
              <em>journey has led.</em>
            </h2>
          </div>
          <CollegeMarquee />
        </div>
      </section>

      <section className="home-faq home-section" aria-labelledby="faq-title">
        <div className="home-container home-faq-layout">
          <div>
            <h2 id="faq-title">
              Before we <br />
              <em>say hello.</em>
            </h2>
            <p>
              Something else on your mind?
              <br />
              <Link to="/contact" className="home-text-link">
                Get in touch
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </p>
          </div>
          <div className="home-faq-list">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>
                  <span>{faq.q}</span>
                  <span className="home-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-closing" aria-labelledby="closing-title">
        <div className="home-container home-closing-inner">
          <h2 id="closing-title">
            Let’s talk about
            <br />
            <em>what comes next.</em>
          </h2>
          <p>
            A free, 30-minute conversation with Krish.
            <br />
            Your questions, your goals, a place to start.
          </p>
          <a
            href={consultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-button home-button-gold"
          >
            Book a free consultation
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
