import { useState, useRef } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    emailjs?: {
      sendForm: (
        serviceId: string,
        templateId: string,
        formEl: HTMLFormElement,
      ) => Promise<unknown>;
    };
  }
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current || !window.emailjs) {
      setStatus("error");
      return;
    }

    setSending(true);
    setStatus("idle");

    try {
      await window.emailjs.sendForm("service_d4ussw9", "template_6pci7ez", formRef.current);
      setStatus("success");
      if (formRef.current) {
        formRef.current.reset();
      }
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Email send failed:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-8 md:p-10 rounded-xl bg-card border border-border shadow-elegant space-y-5 hover:shadow-soft transition-smooth"
    >
      <h2 className="text-2xl italic">Reach out to us with any questions</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="from_name" className="block text-sm font-medium mb-2">
            Student Name
          </label>
          <input
            id="from_name"
            name="from_name"
            type="text"
            placeholder="Student Name"
            required
            className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>
        <div>
          <label htmlFor="graduation_year" className="block text-sm font-medium mb-2">
            Graduation Year
          </label>
          <input
            id="graduation_year"
            name="graduation_year"
            type="text"
            placeholder="Graduation Year"
            required
            className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>
        <div>
          <label htmlFor="from_email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="from_email"
            name="from_email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            required
            className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        />
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-center gap-2 p-4 rounded-md bg-green-50 border border-green-200">
          <CheckCircle2 size={18} className="text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            Your consultation request has been sent successfully!
          </span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 p-4 rounded-md bg-red-50 border border-red-200">
          <AlertCircle size={18} className="text-red-600" />
          <span className="text-sm text-red-700 font-medium">
            Failed to send message. Please try again.
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full py-3.5 rounded-md bg-gradient-gold text-gold-foreground font-semibold shadow-soft hover:translate-y-[-1px] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {sending ? "Sending..." : "Request Consultation"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        We'll get back to you within one business day.
      </p>
    </form>
  );
}
