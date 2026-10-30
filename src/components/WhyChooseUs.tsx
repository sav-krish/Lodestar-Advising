const reasons = [
  {
    title: "A familiar face, every session.",
    body: "Work directly with founder Krish Sav. Pick up the conversation with someone who knows what you are working toward.",
  },
  {
    title: "Feedback you can understand.",
    body: "Talk through the reasoning behind an edit or a suggestion. Build the confidence to take the next step yourself.",
  },
  {
    title: "Room for your real life.",
    body: "Virtual sessions around school and family commitments. Monday to Saturday, 9am to 8pm Central Time.",
  },
  {
    title: "A thoughtful place to start.",
    body: "Meet in a free, 30-minute consultation. Choose the guidance you need, with no registration fee.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      className="lodestar-values bg-primary py-20 text-primary-foreground md:py-28"
      aria-labelledby="values-title"
    >
      <div className="container-prose grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div>
          <h2
            id="values-title"
            className="mt-6 max-w-md font-serif text-4xl font-semibold leading-[1.06] md:text-5xl"
          >
            Good guidance starts
            <br />
            <em className="font-normal">with knowing you.</em>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-primary-foreground/75">
            Space to ask the small questions. A person to think things through with. And an
            application that stays your own.
          </p>
          <div className="mt-10 h-px w-16 bg-gold" aria-hidden="true" />
        </div>
        <div className="divide-y divide-primary-foreground/20 border-t border-primary-foreground/20">
          {reasons.map((reason) => (
            <div key={reason.title} className="py-6 first:pt-6 last:pb-0">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-primary-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-[1.8] text-primary-foreground/75">
                  {reason.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
