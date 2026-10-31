import { createFileRoute } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CalendarDays, FileUp, LogIn, LogOut, ShieldCheck } from "lucide-react";
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
type PortalSession = { user: { id: string; email?: string } };
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
  const [session, setSession] = useState<PortalSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [creditCount, setCreditCount] = useState(0);
  const [message, setMessage] = useState("");
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUserRef = useRef<string | null>(null);
  const userId = session?.user.id ?? null;

  const configured = Boolean(supabase);
  const hasApprovedPayment = payments.some((payment) => payment.status === "approved");
  const currentPrice = useMemo(() => hourPrice(), []);
  const showMessage = useCallback(
    (next: string) => {
      if (currentUserRef.current === userId) setMessage(next);
    },
    [userId],
  );

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    let authRevision = 0;
    const updateSession = (next: PortalSession | null) => {
      if (cancelled) return;
      const nextUserId = next?.user.id ?? null;
      if (currentUserRef.current !== nextUserId) {
        currentUserRef.current = nextUserId;
        setProfile(null);
        setPayments([]);
        setBookings([]);
        setMaterials([]);
        setCreditCount(0);
        setMessage("");
        setBusy(false);
        setLoading(Boolean(nextUserId));
      }
      setSession(next);
    };
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      authRevision += 1;
      updateSession(nextSession ? { user: nextSession.user } : null);
    });
    const initialRevision = authRevision;
    void supabase.auth.getSession().then(({ data }) => {
      if (authRevision === initialRevision) {
        updateSession(data.session ? { user: data.session.user } : null);
      }
    });
    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client || !userId) return;
    let cancelled = false;
    const isCurrent = () => !cancelled && currentUserRef.current === userId;
    const load = async () => {
      setLoading(true);
      try {
        const [profileResult, paymentResult, creditResult, bookingResult, materialResult] =
          await Promise.all([
            client.from("profiles").select("*").eq("id", userId).maybeSingle(),
            client
              .from("payment_submissions")
              .select("*")
              .order("created_at", { ascending: false }),
            client
              .from("booking_credits")
              .select("credits_total, credits_used")
              .eq("student_id", userId),
            client.from("bookings").select("*").order("created_at", { ascending: false }),
            client.from("student_materials").select("*").order("created_at", { ascending: false }),
          ]);
        if (!isCurrent()) return;
        if (profileResult.error) {
          setMessage(profileResult.error.message);
        } else if (!profileResult.data) {
          setMessage(
            "Your student profile is not ready. Please reload this page or contact Lodestar for help.",
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
      } catch (error) {
        if (isCurrent()) {
          setMessage(error instanceof Error ? error.message : "Your portal could not load.");
        }
      } finally {
        if (isCurrent()) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

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
    const actor = session.user.id;
    const isCurrent = () => currentUserRef.current === actor;
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
      if (!isCurrent()) return;
      if (upload.error) {
        setMessage(upload.error.message);
        setBusy(false);
        return;
      }
    }
    const { data: payment, error } = await supabase
      .from("payment_submissions")
      .insert({
        student_id: session.user.id,
        program,
        amount_cents: program === "hour" ? currentPrice : 55000,
        receipt_path: receiptPath,
      })
      .select("id")
      .single();
    if (!isCurrent()) return;
    if (!error && payment) {
      const notification = await supabase.functions.invoke("notify-payment", {
        body: { payment_id: payment.id },
      });
      if (!isCurrent()) return;
      if (notification.error) {
        setMessage("Payment submitted. The owner will review it shortly.");
        setBusy(false);
        return;
      }
    }
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
  if (!profile || profile.id !== userId)
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
          <h1>{profile.role === "admin" ? "Owner dashboard" : "Student portal"}</h1>
          <p className="portal-muted portal-heading-note">
            {profile.role === "admin"
              ? "Review payments, manage credits, and keep student sessions up to date."
              : "Use your portal to schedule, submit payment confirmations, and share materials."}
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
          onMessage={showMessage}
        />
      ) : (
        <div className="portal-grid">
          <section className="portal-card portal-card-wide">
            <p className="portal-eyebrow">Your next step</p>
            <h2>Schedule your Lodestar Hour</h2>
            <p className="portal-muted">
              Choose a time that works for you. Submit your Zelle confirmation below so the owner
              can review your payment.
            </p>
            <div className="portal-calendar">
              <iframe title="Schedule your Lodestar Hour" src={calcomBookingUrl} loading="lazy" />
            </div>
            <a
              className="portal-button portal-button-secondary"
              href={calcomBookingUrl}
              target="_blank"
              rel="noreferrer"
            >
              <CalendarDays size={17} /> Open scheduler in a new tab
            </a>
          </section>
          <section className="portal-card">
            <p className="portal-eyebrow">Payment confirmation</p>
            <h2>Send your payment details</h2>
            <p className="portal-muted">
              Zelle {currentPrice === 5000 ? "$50" : "$60"} to <strong>608-421-3736</strong>. Your
              first payment needs a receipt; later confirmations do not.
            </p>
            <PaymentForm
              onSubmit={submitPayment}
              busy={busy}
              hasPriorPayment={payments.length > 0}
              price={currentPrice}
            />
          </section>
          <section className="portal-card">
            <p className="portal-eyebrow">Portal access</p>
            <h2>Everything in one place.</h2>
            <p className="portal-muted">
              Book a time, send payment confirmation, and upload materials here. The owner will
              review payment submissions separately.
            </p>
          </section>
          <section className="portal-card">
            <p className="portal-eyebrow">Materials</p>
            <h2>Upload a file</h2>
            <MaterialUpload userId={session.user.id} onMessage={showMessage} />
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
          <input
            name="password"
            type="password"
            minLength={mode === "sign-up" ? 12 : undefined}
            required
          />
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
