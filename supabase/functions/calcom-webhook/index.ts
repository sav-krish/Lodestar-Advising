import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseCalcomEvent } from "./webhook.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function notifyOwner(
  bookingId: string,
  notification: { email: string; starts_at: string | null },
) {
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("RESEND_FROM_EMAIL");
  if (!key || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `calcom-booking/${bookingId}`,
    },
    body: JSON.stringify({
      from,
      to: [Deno.env.get("OWNER_NOTIFICATION_EMAIL") ?? "sav.krish01@gmail.com"],
      subject: `New Lodestar session booked by ${notification.email}`,
      text: `A Cal.com session was booked.\nStudent: ${notification.email}\nStart time: ${notification.starts_at ?? "Not provided"}\nBooking ID: ${bookingId}`,
    }),
  });
  return response.ok;
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
    ["verify"],
  );
  if (!/^[0-9a-f]{64}$/i.test(signature)) return false;
  const bytes = Uint8Array.from(signature.match(/.{2}/g)!, (part) => Number.parseInt(part, 16));
  return crypto.subtle.verify("HMAC", key, bytes, new TextEncoder().encode(body));
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!Deno.env.get("CALCOM_WEBHOOK_SECRET")) {
    return new Response("Webhook signing secret is not configured", { status: 503 });
  }
  const body = await request.text();
  if (!(await validSignature(request, body))) {
    return new Response("Invalid webhook signature", { status: 401 });
  }

  let event;
  try {
    event = parseCalcomEvent(JSON.parse(body));
  } catch {
    return new Response("Invalid webhook payload", { status: 400 });
  }
  if (!event) return new Response("Event ignored", { status: 200 });

  const expectedId = Deno.env.get("CALCOM_EVENT_TYPE_ID");
  const expectedSlug = Deno.env.get("CALCOM_EVENT_TYPE_SLUG") ?? "lodestar-hour";
  if (expectedId ? event.eventTypeId !== expectedId : event.eventTypeSlug !== expectedSlug) {
    return new Response("Event type ignored", { status: 200 });
  }

  try {
    let studentId: string | null = null;
    if (event.attendee) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", event.attendee)
        .maybeSingle();
      if (error) return new Response("Student lookup failed", { status: 500 });
      studentId = profile?.id ?? null;
    }
    const { data: booking, error } = await supabase.rpc("record_calcom_booking", {
      p_event: event.event,
      p_reference: event.reference,
      p_previous_reference: event.previousReference,
      p_student_id: studentId,
      p_starts_at: event.startsAt,
    });
    if (error) {
      return new Response(
        error.code === "P0002" ? "Student account not found" : "Booking could not be recorded",
        {
          status: error.code === "P0002" ? 404 : 500,
        },
      );
    }
    if (booking.notify_owner) {
      if (!Deno.env.get("RESEND_API_KEY") || !Deno.env.get("RESEND_FROM_EMAIL")) {
        return new Response("Booking recorded; notification service is not configured", {
          status: 503,
        });
      }
      if (!(await notifyOwner(booking.booking_id, booking.notification))) {
        return new Response("Booking recorded; notification delivery failed", { status: 502 });
      }
      const { error: notificationError } = await supabase
        .from("bookings")
        .update({ owner_notified_at: new Date().toISOString() })
        .eq("id", booking.booking_id)
        .is("owner_notified_at", null);
      if (notificationError) {
        return new Response("Booking recorded; notification receipt could not be saved", {
          status: 500,
        });
      }
    }
    return new Response("Booking recorded", { status: 200 });
  } catch {
    return new Response("Booking processing failed; retry this webhook", { status: 502 });
  }
});
