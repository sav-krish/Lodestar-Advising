import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageHero, SectionFadeIn } from "@/components/PageSections";

interface EventItem {
  title: string;
  dateLabel: string;
  description: string;
  location?: string;
  /** ISO end datetime. Event auto-hides once this moment has passed. */
  endsAt: string;
  startsAt?: string;
  cta?: { label: string; href: string };
}

/**
 * Add events here. Anything whose `endsAt` is in the past is filtered out
 * automatically, so past events disappear from the page and the structured
 * data without any manual cleanup.
 */
const allEvents: EventItem[] = [];

function getUpcomingEvents(now: Date = new Date()): EventItem[] {
  return allEvents
    .filter((e) => new Date(e.endsAt).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
}

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising: Premium Ivy League Prep | Events" },
      {
        name: "description",
        content:
          "Upcoming Lodestar Advising events, webinars, workshops, and info sessions on Ivy League admissions, essay coaching, and scholarship strategy.",
      },
      { property: "og:title", content: "Lodestar Advising: Premium Ivy League Prep | Events" },
      {
        property: "og:description",
        content:
          "Free webinars, workshops, and admissions info sessions from Lodestar Advising.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/events" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/events" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lodestar Advising Events",
          itemListElement: getUpcomingEvents().map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: e.title,
              description: e.description,
              startDate: e.startsAt ?? e.endsAt,
              endDate: e.endsAt,
              eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "VirtualLocation",
                url: e.cta?.href ?? "https://lodestaradvising.com/events",
              },
              organizer: {
                "@type": "Organization",
                name: "Lodestar Advising",
                url: "https://lodestaradvising.com",
              },
              ...(e.cta ? { url: e.cta.href } : {}),
            },
          })),
        }),
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          Events
        </span>
        <h1
          className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Workshops, webinars, and admissions insights.
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          Join Lodestar Advising for free founder-led sessions on Ivy
          League strategy, essay craft, and scholarship planning.
        </p>
      </PageHero>

      <SectionFadeIn>
        <div className="container-prose py-20">
          <div className="max-w-3xl mx-auto">
            <Reveal effect="scale" className="text-center">
              <CalendarDays className="mx-auto text-gold" size={28} />
              <div className="gold-divider mx-auto mt-6" />
              <h2 className="mt-8 font-serif italic text-4xl text-primary">
                Upcoming Events
              </h2>
            </Reveal>

            {upcomingEvents.length === 0 && (
              <Reveal effect="scale">
                <div className="mt-12 rounded-lg border border-border bg-card p-10 text-center shadow-soft">
                  <Clock className="mx-auto text-gold" size={24} />
                  <p className="mt-5 font-serif italic text-xl text-primary">
                    No events are scheduled right now.
                  </p>
                  <p className="mt-3 font-serif text-muted-foreground">
                    New workshops and info sessions are announced here. Check back soon,
                    or book a one-on-one strategy call in the meantime.
                  </p>
                </div>
              </Reveal>
            )}

            <div className="mt-12 space-y-8">
              {upcomingEvents.map((e, i) => (
                <Reveal key={e.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <article className="relative rounded-lg border border-gold/40 bg-gradient-to-br from-background to-gold/5 p-8 md:p-10 shadow-elegant overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-gold" />
                    <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-gold font-display font-semibold">
                      <Clock size={12} />
                      {e.dateLabel}
                    </span>
                    <h3 className="mt-4 font-serif italic text-3xl md:text-4xl text-primary">
                      {e.title}
                    </h3>
                    {e.location && (
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] font-display text-muted-foreground">
                        {e.location}
                      </p>
                    )}
                    <p className="mt-5 font-serif text-lg text-primary leading-relaxed">
                      {e.description}
                    </p>
                    {e.cta && (
                      <div className="mt-8">
                        <a
                          href={e.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-gradient-gold text-primary font-semibold shadow-elegant hover:-translate-y-0.5 transition-smooth font-display tracking-wider text-sm"
                        >
                          {e.cta.label}
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="font-serif italic text-lg text-muted-foreground">
                Want a one-on-one strategy call instead?
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
