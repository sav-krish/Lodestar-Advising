const reasons = [
  {
    title: "No Registration Fee",
    body: "There is no sign-up or registration fee to work with Lodestar. You only pay for the guidance you choose.",
  },
  {
    title: "Flexible Scheduling",
    body: "Sessions are scheduled around school, sports, and family life, Monday to Saturday, 9am to 8pm CST.",
  },
  {
    title: "Founder-Led Sessions",
    body: "You work directly with Krish Sav, not a rotating bench of assistants, so strategy stays consistent from start to submit.",
  },
  {
    title: "Free First Consultation",
    body: "Start with a complimentary 30-minute consultation. If Lodestar is not the right fit, you owe nothing.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-primary py-20 text-primary-foreground md:py-24">
      <div className="container-prose">
        <h2 className="font-serif italic text-3xl font-semibold md:text-4xl">Why families choose Lodestar</h2>
        <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-primary-foreground/25 pt-6">
              <h3 className="font-serif italic text-xl font-semibold text-primary-foreground">{r.title}</h3>
              <p className="mt-3 max-w-lg text-sm font-serif leading-relaxed text-primary-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
