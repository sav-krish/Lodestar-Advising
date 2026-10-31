import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function notifyOwner(subject: string, text: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Lodestar Portal <onboarding@resend.dev>",
      to: [Deno.env.get("OWNER_NOTIFICATION_EMAIL") ?? "advising.lodestar@gmail.com"],
      subject,
      text,
    }),
  });
}

async function validSignature(request: Request, body: string) {
  const secret = Deno.env.get("CALCOM_WEBHOOK_SECRET");
  const signature = request.headers.get("x-cal-signature-256");
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return signature === expected;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const body = await request.text();
  if (!(await validSignature(request, body))) {
    return new Response("Invalid webhook signature", { status: 401 });
  }

  const payload = JSON.parse(body);
  const booking = payload.booking ?? payload;
  const event = payload.triggerEvent ?? payload.event;
  const reference = booking.uid ?? booking.id;
  const attendee = booking.attendees?.[0]?.email ?? booking.attendee?.email;
  if (!reference || !attendee) return new Response("Missing booking identity", { status: 400 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", attendee.toLowerCase())
    .maybeSingle();
  if (profileError) return new Response(profileError.message, { status: 500 });
  if (!profile) return new Response("Student account not found", { status: 404 });

  if (event === "BOOKING_CANCELLED" || event === "BOOKING_CANCELLED_BY_HOST") {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("calcom_reference", reference);
    if (error) return new Response(error.message, { status: 500 });
    return new Response("Booking cancelled", { status: 200 });
  }

  if (event === "BOOKING_RESCHEDULED") {
    const { error } = await supabase
      .from("bookings")
      .update({ starts_at: booking.startTime ?? null })
      .eq("calcom_reference", reference);
    if (error) return new Response(error.message, { status: 500 });
    return new Response("Booking updated", { status: 200 });
  }

  const { error } = await supabase.from("bookings").upsert(
    {
      student_id: profile.id,
      starts_at: booking.startTime ?? null,
      calcom_reference: reference,
      status: "scheduled",
    },
    { onConflict: "calcom_reference" },
  );
  if (error) return new Response(error.message, { status: 500 });
  await notifyOwner(
    `New Lodestar session booked by ${attendee}`,
    `A new Cal.com session was booked.\nStudent: ${attendee}\nStart time: ${booking.startTime ?? "Not provided"}`,
  );
  return new Response("Booking recorded", { status: 200 });
});
