import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionFadeIn } from "@/components/PageSections";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero>
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-gold font-display animate-fade-in">
          Your information
        </span>
        <h1 className="mt-4 text-5xl md:text-6xl max-w-3xl italic animate-fade-up">
          Privacy, clearly stated.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-primary-foreground font-serif animate-fade-up">
          We use the information you share to respond to your inquiry and provide the admissions
          support you request.
        </p>
      </PageHero>

      <SectionFadeIn>
        <article className="container-prose max-w-3xl space-y-8 py-20 text-muted-foreground">
          <section>
            <h2 className="text-3xl italic text-foreground">What we collect</h2>
            <p className="mt-3 leading-relaxed">
              When you contact Lodestar Advising, we may collect your name, email address, phone
              number, graduation year, message, and the page or campaign that led you to us.
            </p>
          </section>
          <section>
            <h2 className="text-3xl italic text-foreground">How we use it</h2>
            <p className="mt-3 leading-relaxed">
              We use inquiry information to reply, schedule consultations, understand what support
              you need, and improve our website. We do not sell your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-3xl italic text-foreground">Services we use</h2>
            <p className="mt-3 leading-relaxed">
              Our inquiry form is delivered through EmailJS and consultation scheduling is provided
              through Cal.com. Those services process information according to their own privacy
              policies.
            </p>
          </section>
          <section>
            <h2 className="text-3xl italic text-foreground">Questions</h2>
            <p className="mt-3 leading-relaxed">
              To request access, correction, or deletion of information you have shared, email{" "}
              <a className="text-gold underline" href="mailto:advising.lodestar@gmail.com">
                advising.lodestar@gmail.com
              </a>
              .
            </p>
          </section>
        </article>
      </SectionFadeIn>
    </>
  );
}
