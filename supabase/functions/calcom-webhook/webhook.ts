export type BookingEvent = "BOOKING_CREATED" | "BOOKING_CANCELLED" | "BOOKING_RESCHEDULED";
export type CalcomEvent = {
  event: BookingEvent;
  reference: string;
  previousReference: string | null;
  attendee: string | null;
  startsAt: string | null;
  eventTypeId: string | null;
  eventTypeSlug: string | null;
};

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected a webhook object");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseCalcomEvent(value: unknown): CalcomEvent | null {
  const envelope = object(value);
  const event = envelope.triggerEvent;
  if (
    event !== "BOOKING_CREATED" &&
    event !== "BOOKING_CANCELLED" &&
    event !== "BOOKING_RESCHEDULED"
  ) {
    return null;
  }
  const booking = object(envelope.payload);
  const reference = text(booking.uid);
  if (!reference) throw new Error("Missing booking UID");
  const firstAttendee = Array.isArray(booking.attendees) ? booking.attendees[0] : null;
  const attendee = firstAttendee
    ? (text(object(firstAttendee).email)?.toLowerCase() ?? null)
    : null;
  if (event === "BOOKING_CREATED" && (!attendee || !attendee.includes("@"))) {
    throw new Error("Missing attendee email");
  }
  const startsAt = text(booking.startTime);
  if (
    (booking.startTime != null && !startsAt) ||
    (startsAt && Number.isNaN(Date.parse(startsAt)))
  ) {
    throw new Error("Invalid booking start time");
  }
  if (event !== "BOOKING_CANCELLED" && !startsAt) throw new Error("Missing booking start time");
  const previousReference = text(booking.rescheduleUid);
  if (event === "BOOKING_RESCHEDULED" && !previousReference) {
    throw new Error("Missing previous booking UID");
  }
  return {
    event,
    reference,
    previousReference,
    attendee,
    startsAt,
    eventTypeId:
      typeof booking.eventTypeId === "number"
        ? String(booking.eventTypeId)
        : text(booking.eventTypeId),
    eventTypeSlug: text(booking.type),
  };
}
