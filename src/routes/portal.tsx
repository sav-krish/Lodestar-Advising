import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, FileUp, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { calcomBookingUrl, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Lodestar Student Portal" },
      {
        name: "description",
        content:
          "Secure Lodestar Advising student portal for payments, materials, and session scheduling.",
      },
    ],
  }),
  component: Portal,
});

type Profile = { id: string; email: string; full_name: string | null; role: "student" | "admin" };
type Payment = {
  id: string;
  student_id: string;
  program: string;
  amount_cents: number;
  status: string;
  receipt_path: string | null;
  created_at: string;
};
type Booking = {
  id: string;
  student_id: string;
  starts_at: string | null;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
};
type Material = {
  id: string;
  student_id: string;
  file_name: string;
  storage_path: string;
  created_at: string;
};

const cutoff = new Date("2026-11-16T00:00:00-06:00");
const hourPrice = () => (new Date() >= cutoff ? 6000 : 5000);

function Portal() {
  const [session, setSession] = useState<{ user: { id: string; email?: string } } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [creditCount, setCreditCount] = useState(0);
  const [message, setMessage] = useState("");
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(supabase);
  const hasApprovedPayment = payments.some((payment) => payment.status === "approved");
  const currentPrice = useMemo(() => hourPrice(), []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession({ user: data.session.user });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ? { user: nextSession.user } : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client || !session) return;
    const load = async () => {
      setLoading(true);
      const [profileResult, paymentResult, creditResult, bookingResult, materialResult] =
        await Promise.all([
          client.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
          client.from("payment_submissions").select("*").order("created_at", { ascending: false }),
          client
            .from("booking_credits")
            .select("credits_total, credits_used")
            .eq("student_id", session.user.id),
          client.from("bookings").select("*").order("created_at", { ascending: false }),
          client.from("student_materials").select("*").order("created_at", { ascending: false }),
        ]);
      if (profileResult.error) {
        setMessage(profileResult.error.message);
      } else if (!profileResult.data) {
        setMessage(
          "Your account is authenticated, but its Lodestar profile is missing. Run the portal profile repair SQL in Supabase, then sign in again.",
        );
      }
      setProfile(profileResult.data);
      setPayments(paymentResult.data ?? []);
      setCreditCount(
        (creditResult.data ?? []).reduce(
          (total, item) => total + item.credits_total - item.credits_used,
          0,
        ),
      );
      setBookings(bookingResult.data ?? []);
      setMaterials(materialResult.data ?? []);
      const firstDataError = [paymentResult.error, creditResult.error, bookingResult.error].find(
        (error) => error,
      );
      if (firstDataError && !profileResult.error) setMessage(firstDataError.message);
      setLoading(false);
    };
    void load();
  }, [session]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const result =
      authMode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: String(form.get("name") ?? "") } },
          });
    setMessage(
      result.error
        ? friendlyAuthError(result.error.message)
        : authMode === "sign-up"
          ? "Account created. Check your email to confirm your account, then sign in."
          : "Signed in.",
    );
    setBusy(false);
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/#/portal` },
    });
    if (error) setMessage(error.message);
  };

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !session) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const program = String(form.get("program"));
    const file = form.get("receipt");
    let receiptPath: string | null = null;
    if (file instanceof File && file.size > 0) {
      receiptPath = `${session.user.id}/${crypto.randomUUID()}-${file.name}`;
      const upload = await supabase.storage
        .from("student-materials")
        .upload(receiptPath, file, { upsert: false });
      if (upload.error) {
        setMessage(upload.error.message);
        setBusy(false);
        return;
      }
    }
    const { error } = await supabase.from("payment_submissions").insert({
      student_id: session.user.id,
      program,
      amount_cents: program === "hour" ? currentPrice : 55000,
      receipt_path: receiptPath,
    });
    setMessage(
      error?.message ?? "Payment submitted for review. Your portal will unlock after approval.",
    );
    setBusy(false);
  };

  if (!configured)
    return (
      <PortalShell>
        <Notice text="The portal is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel before enabling student access." />
      </PortalShell>
    );
  if (!session)
    return (
      <PortalShell>
        <AuthCard
          mode={authMode}
          setMode={setAuthMode}
          onSubmit={signIn}
          onGoogle={signInWithGoogle}
          busy={busy}
          message={message}
        />
      </PortalShell>
    );
  if (!profile)
    return (
      <PortalShell>
        <Notice
          text={
            message ||
            (loading
              ? "Loading your secure portal..."
              : "Your profile is still being prepared. Please sign out and sign in again.")
          }
        />
      </PortalShell>
    );

  return (
    <PortalShell>
      <div className="portal-heading">
        <div>
          <p className="portal-eyebrow">
            {profile.role === "admin" ? "Owner portal" : "Student portal"}
          </p>
          <h1>{profile.role === "admin" ? "Owner dashboard" : "Your Lodestar workspace"}</h1>
          <p className="portal-muted portal-heading-note">
            {profile.role === "admin"
              ? "Review payments, manage credits, and keep student sessions up to date."
              : `Signed in as ${profile.full_name || profile.email}.`}
          </p>
        </div>
        <button
          className="portal-button portal-button-secondary"
          onClick={() => void supabase?.auth.signOut()}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
      {profile.role === "admin" ? (
        <AdminPanel
          payments={payments}
          bookings={bookings}
          materials={materials}
          onMessage={setMessage}
        />
      ) : (
        <div className="portal-grid">
          <section className="portal-card portal-progress-card">
            <p className="portal-eyebrow">
              <CheckCircle2 size={15} /> Your progress
            </p>
            <h2>
              {bookings.filter((booking) => booking.status === "completed").length} classes
              completed
            </h2>
            <div className="portal-progress-track" aria-label="Completed class progress">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    bookings.filter((booking) => booking.status === "completed").length * 10,
                  )}%`,
                }}
              />
            </div>
            <p className="portal-muted">
              {bookings.filter((booking) => booking.status === "scheduled").length > 0
                ? "You have a session on the calendar. We will update your progress after it is complete."
                : "Completed sessions and upcoming bookings will appear here."}
            </p>
          </section>
          <section className="portal-card portal-progress-card">
            <p className="portal-eyebrow">Session history</p>
            <h2>
              {bookings.length} total session{bookings.length === 1 ? "" : "s"}
            </h2>
            <div className="portal-session-list">
              {bookings.slice(0, 4).map((booking) => (
                <div className="portal-session-row" key={booking.id}>
                  <span>
                    {booking.starts_at
                      ? new Date(booking.starts_at).toLocaleDateString()
                      : "Date pending"}
                  </span>
                  <strong>{booking.status}</strong>
                </div>
              ))}
              {bookings.length === 0 && <p className="portal-muted">No sessions recorded yet.</p>}
            </div>
          </section>
          <section className="portal-card portal-card-wide">
            <p className="portal-eyebrow">Your next step</p>
            <h2>
              {creditCount > 0
                ? "Your Lodestar Hour is ready to schedule."
                : "Start by confirming your payment."}
            </h2>
            <p className="portal-muted">
              Zelle {currentPrice === 5000 ? "$50" : "$60"} to <strong>608-421-3736</strong>. The
              first payment requires a receipt upload. Future Lodestar Hours require prepayment, but
              no new receipt upload.
            </p>
            {creditCount > 0 ? (
              <>
                <div className="portal-calendar">
                  <iframe
                    title="Schedule your Lodestar Hour"
                    src={calcomBookingUrl}
                    loading="lazy"
                  />
                </div>
                <a
                  className="portal-button portal-button-secondary"
                  href={calcomBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CalendarDays size={17} /> Open scheduler in a new tab
                </a>
              </>
            ) : (
              <PaymentForm
                onSubmit={submitPayment}
                busy={busy}
                hasPriorPayment={hasApprovedPayment}
                price={currentPrice}
              />
            )}
          </section>
          <section className="portal-card">
            <p className="portal-eyebrow">Access</p>
            <h2>
              {creditCount} hour credit{creditCount === 1 ? "" : "s"}
            </h2>
            <p className="portal-muted">
              {hasApprovedPayment
                ? "Approved payments unlock your scheduling link."
                : "Your submission will appear here after review."}
            </p>
          </section>
          <section className="portal-card">
            <p className="portal-eyebrow">Materials</p>
            <h2>Upload a file</h2>
            <MaterialUpload userId={session.user.id} onMessage={setMessage} />
          </section>
          {message && <Notice text={message} />}
        </div>
      )}
    </PortalShell>
  );
}

function friendlyAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "That email or password did not match. Check both fields and try again.";
  }
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Confirm your email from the message Supabase sent, then sign in again.";
  }
  if (message.toLowerCase().includes("user already registered")) {
    return "An account already exists for this email. Switch to Sign in.";
  }
  return message;
}

function PaymentForm({
  onSubmit,
  busy,
  hasPriorPayment,
  price,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  hasPriorPayment: boolean;
  price: number;
}) {
  return (
    <form className="portal-form" onSubmit={onSubmit}>
      <label>
        Program
        <select name="program" defaultValue="hour">
          <option value="hour">Lodestar Hour · ${(price / 100).toFixed(0)}</option>
          <option value="essay_package">Essay Package · $550</option>
        </select>
      </label>
      {!hasPriorPayment && (
        <label>
          First-payment receipt
          <input name="receipt" type="file" accept="image/*,.pdf" required />
        </label>
      )}
      <button className="portal-button" disabled={busy}>
        <FileUp size={16} /> {busy ? "Submitting..." : "Submit payment confirmation"}
      </button>
    </form>
  );
}

function MaterialUpload({
  userId,
  onMessage,
}: {
  userId: string;
  onMessage: (message: string) => void;
}) {
  return (
    <form
      className="portal-form"
      onSubmit={async (event) => {
        event.preventDefault();
        const input = event.currentTarget.elements.namedItem("material");
        if (!(input instanceof HTMLInputElement) || !input.files?.[0] || !supabase) return;
        const file = input.files[0];
        const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
        const result = await supabase.storage.from("student-materials").upload(path, file);
        if (result.error) onMessage(result.error.message);
        else {
          await supabase
            .from("student_materials")
            .insert({ student_id: userId, file_name: file.name, storage_path: path });
          onMessage("Material uploaded.");
        }
      }}
    >
      <input name="material" type="file" required />
      <button className="portal-button portal-button-secondary">
        <FileUp size={16} /> Upload material
      </button>
    </form>
  );
}

function AdminPanel({
  payments,
  bookings,
  materials,
  onMessage,
}: {
  payments: Payment[];
  bookings: Booking[];
  materials: Material[];
  onMessage: (message: string) => void;
}) {
  const [items, setItems] = useState(payments);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bookingItems, setBookingItems] = useState(bookings);
  const [studentNames, setStudentNames] = useState<Record<string, { name: string; email: string }>>(
    {},
  );

  useEffect(() => {
    if (!supabase) return;
    const ids = [
      ...new Set([
        ...payments.map((payment) => payment.student_id),
        ...bookings.map((booking) => booking.student_id),
        ...materials.map((material) => material.student_id),
      ]),
    ];
    if (ids.length === 0) return;
    void supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", ids)
      .then(({ data, error }) => {
        if (error) onMessage(error.message);
        else
          setStudentNames(
            Object.fromEntries(
              (data ?? []).map((student) => [
                student.id,
                { name: student.full_name || "Student", email: student.email },
              ]),
            ),
          );
      });
  }, [payments, bookings, materials, onMessage]);

  const review = async (payment: Payment, status: "approved" | "rejected") => {
    if (!supabase) return;
    setBusyId(payment.id);
    const { error } = await supabase
      .from("payment_submissions")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", payment.id);
    if (error) onMessage(error.message);
    else {
      setItems((current) =>
        current.map((item) => (item.id === payment.id ? { ...item, status } : item)),
      );
      onMessage(
        status === "approved" ? "Payment approved and credit created." : "Payment rejected.",
      );
    }
    setBusyId(null);
  };

  const markCompleted = async (booking: Booking) => {
    if (!supabase) return;
    setBusyId(booking.id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", booking.id);
    if (error) onMessage(error.message);
    else {
      setBookingItems((current) =>
        current.map((item) => (item.id === booking.id ? { ...item, status: "completed" } : item)),
      );
      onMessage("Session marked completed.");
    }
    setBusyId(null);
  };

  const openReceipt = async (path: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.storage
      .from("student-materials")
      .createSignedUrl(path, 300);
    if (error) onMessage(error.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="portal-card">
      <p className="portal-eyebrow">
        <ShieldCheck size={15} /> Owner access
      </p>
      <h2>Payment review</h2>
      <p className="portal-muted">
        {payments.length} submissions are visible to this account. Approving a Lodestar Hour creates
        one booking credit automatically.
      </p>
      <div className="portal-admin-list">
        {items.length === 0 && <p className="portal-muted">No payment submissions yet.</p>}
        {items.map((payment) => (
          <article className="portal-admin-row" key={payment.id}>
            <div>
              <strong>{payment.program === "hour" ? "Lodestar Hour" : "Essay Package"}</strong>
              <p className="portal-admin-student">
                {studentNames[payment.student_id]?.name || "Student"} ·{" "}
                {studentNames[payment.student_id]?.email || "Loading student details"}
              </p>
              <p className="portal-muted">
                ${(payment.amount_cents / 100).toFixed(0)} · {payment.status} ·{" "}
                {new Date(payment.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="portal-admin-list">
              <p className="portal-eyebrow">New material uploads</p>
              {materials.length === 0 && <p className="portal-muted">No materials uploaded yet.</p>}
              {materials.map((material) => (
                <article className="portal-admin-row" key={material.id}>
                  <div>
                    <strong>{material.file_name}</strong>
                    <p className="portal-admin-student">
                      {studentNames[material.student_id]?.name || "Student"} ·{" "}
                      {studentNames[material.student_id]?.email || "Loading student details"}
                    </p>
                    <p className="portal-muted">
                      Uploaded {new Date(material.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="portal-text-button"
                    onClick={async () => {
                      if (!supabase) return;
                      const { data, error } = await supabase.storage
                        .from("student-materials")
                        .createSignedUrl(material.storage_path, 300);
                      if (error) onMessage(error.message);
                      else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Open file
                  </button>
                </article>
              ))}
            </div>
            <div className="portal-admin-actions">
              {payment.receipt_path && (
                <button
                  className="portal-text-button"
                  onClick={() => void openReceipt(payment.receipt_path!)}
                >
                  View receipt
                </button>
              )}
              {payment.status === "pending" && (
                <>
                  <button
                    className="portal-button"
                    disabled={busyId === payment.id}
                    onClick={() => void review(payment, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="portal-button portal-button-secondary"
                    disabled={busyId === payment.id}
                    onClick={() => void review(payment, "rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="portal-admin-list">
        <p className="portal-eyebrow">Session tracking</p>
        {bookingItems.length === 0 && <p className="portal-muted">No sessions recorded yet.</p>}
        {bookingItems.map((booking) => (
          <article className="portal-admin-row" key={booking.id}>
            <div>
              <strong>
                {booking.starts_at ? new Date(booking.starts_at).toLocaleString() : "Date pending"}
              </strong>
              <p className="portal-muted">{booking.student_id}</p>
            </div>
            {booking.status === "scheduled" ? (
              <button
                className="portal-button"
                disabled={busyId === booking.id}
                onClick={() => void markCompleted(booking)}
              >
                Mark completed
              </button>
            ) : (
              <span className="portal-status">{booking.status}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
function AuthCard({
  mode,
  setMode,
  onSubmit,
  onGoogle,
  busy,
  message,
}: {
  mode: "sign-in" | "sign-up";
  setMode: (mode: "sign-in" | "sign-up") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogle: () => void;
  busy: boolean;
  message: string;
}) {
  return (
    <section className="portal-card portal-auth">
      <p className="portal-eyebrow">Lodestar secure access</p>
      <h1>{mode === "sign-in" ? "Sign in to your portal." : "Create your student account."}</h1>
      <p className="portal-muted">
        {mode === "sign-in"
          ? "Use your Lodestar email and password to continue."
          : "Create an account to submit payments, upload materials, and manage sessions."}
      </p>
      <button className="portal-button portal-button-secondary" onClick={onGoogle}>
        <LogIn size={16} /> Continue with Google
      </button>
      <div className="portal-divider">or</div>
      <form className="portal-form" onSubmit={onSubmit}>
        {mode === "sign-up" && (
          <label>
            Name
            <input name="name" required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={8} required />
        </label>
        <button className="portal-button" disabled={busy}>
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
      {message && <Notice text={message} />}
      <button
        className="portal-text-button"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
      >
        {mode === "sign-in" ? "Create a student account" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}
function Notice({ text }: { text: string }) {
  return (
    <p className="portal-notice" role="status">
      {text}
    </p>
  );
}
function PortalShell({ children }: { children: ReactNode }) {
  return (
    <main className="portal-shell">
      <div className="container-prose">{children}</div>
    </main>
  );
}
