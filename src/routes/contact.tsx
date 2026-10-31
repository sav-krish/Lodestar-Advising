import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { PageHero, SectionFadeIn } from "@/components/PageSections";
import { ScrollScrub } from "@/components/ScrollEffects";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lodestar Advising: Premium Ivy League Prep | Contact" },
      {
        name: "description",
        content:
          "Book a complimentary 30 minute consultation with Lodestar's founder. Reach us by email, phone, or the inquiry form.",
      },
      { property: "og:title", content: "Lodestar Advising: Premium Ivy League Prep | Contact" },
      {
        property: "og:description",
        content:
          "Book a complimentary 30 minute consultation with Lodestar's founder. Reach us by email, phone, or the inquiry form.",
      },
      { property: "og:url", content: "https://lodestaradvising.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://lodestaradvising.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Lodestar Advising",
          url: "https://lodestaradvising.com",
          email: "advising.lodestar@gmail.com",
          telephone: "+1-608-421-3736",
          areaServed: "Worldwide",
          priceRange: "$$",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "09:00",
              closes: "20:00",
            },
          ],
        }),
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          Get in touch
        </span>
        <h1
          className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Let's design your path forward.
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up"
          style={{ animationDelay: "0.35s" }}
        >
          A 30-minute consultation with the founder, free, with zero obligation.
        </p>
      </PageHero>

      <SectionFadeIn>
        <div className="container-prose">
          <Reveal as="div" effect="scale">
            <div className="text-center">
              <div className="gold-divider mx-auto" />
              <h2 className="mt-4 text-3xl italic">Book your free consultation</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Pick a time that works for you. The consultation is 30 minutes, free, and with the
                founder.
              </p>
            </div>
            <div className="mt-8 rounded-xl overflow-hidden border border-border bg-card shadow-elegant">
              <iframe
                src="https://cal.com/krish-s/lodestar?overlayCalendar=true"
                title="Book a free consultation with Lodestar Advising"
                loading="lazy"
                className="w-full h-[720px] border-0"
              />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Calendar not loading?{" "}
              <a
                href="https://cal.com/krish-s/lodestar?overlayCalendar=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                Open the booking page in a new tab
              </a>
              .
            </p>
          </Reveal>
        </div>
      </SectionFadeIn>

      <SectionFadeIn>
        <ScrollScrub strength={20}>
          <div className="container-prose grid md:grid-cols-5 gap-12">
            <Reveal as="div" className="md:col-span-2 space-y-8" effect="left">
              <div>
                <div className="gold-divider" />
                <h2 className="mt-4 text-2xl">Reach our team</h2>
                <p className="mt-3 text-muted-foreground">
                  All inquiries receive a personal reply within one business day.
                </p>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-4 items-start group">
                  <Mail
                    className="text-gold mt-1 transition-transform duration-300 group-hover:scale-110"
                    size={20}
                  />
                  <div>
                    <div className="font-medium">advising.lodestar@gmail.com</div>
                    <div className="text-sm text-muted-foreground">General and admissions</div>
                  </div>
                </li>
                <li className="flex gap-4 items-start group">
                  <Phone
                    className="text-gold mt-1 transition-transform duration-300 group-hover:scale-110"
                    size={20}
                  />
                  <div>
                    <div className="font-medium">+1 (608) 421-3736</div>
                    <div className="text-sm text-muted-foreground">Mon to Sat · 9am to 8pm CST</div>
                  </div>
                </li>
                <li className="flex gap-4 items-start group">
                  <MapPin
                    className="text-gold mt-1 transition-transform duration-300 group-hover:scale-110"
                    size={20}
                  />
                  <div>
                    <div className="font-medium">Available online worldwide</div>
                    <div className="text-sm text-muted-foreground">
                      Virtual consultations across all time zones
                    </div>
                  </div>
                </li>
                <li className="flex gap-4 items-start group">
                  <Clock
                    className="text-gold mt-1 transition-transform duration-300 group-hover:scale-110"
                    size={20}
                  />
                  <div>
                    <div className="font-medium">Reply within one business day</div>
                    <div className="text-sm text-muted-foreground">
                      Personal response from the founder
                    </div>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal as="div" delay={2} className="md:col-span-3" effect="right">
              <ContactForm />
            </Reveal>
          </div>
        </ScrollScrub>
      </SectionFadeIn>
    </>
  );
}
