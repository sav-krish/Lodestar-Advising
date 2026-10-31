import { describe, expect, test } from "bun:test";
import { parseCalcomEvent } from "./webhook.ts";

const event = (triggerEvent = "BOOKING_CREATED", overrides = {}) => ({
  triggerEvent,
  createdAt: "2026-10-31T12:00:00Z",
  payload: {
    uid: "booking-new",
    attendees: [{ email: "Student@Example.com" }],
    startTime: "2026-11-02T15:00:00Z",
    eventTypeId: 123,
    type: "lodestar-hour",
    ...overrides,
  },
});

describe("Cal.com event contract", () => {
  test("reads the standard Cal.com payload envelope", () => {
    expect(parseCalcomEvent(event())).toEqual({
      event: "BOOKING_CREATED",
      reference: "booking-new",
      previousReference: null,
      attendee: "student@example.com",
      startsAt: "2026-11-02T15:00:00Z",
      eventTypeId: "123",
      eventTypeSlug: "lodestar-hour",
    });
  });

  test("keeps both booking UIDs when a session is rescheduled", () => {
    expect(
      parseCalcomEvent(event("BOOKING_RESCHEDULED", { rescheduleUid: "booking-old" })),
    ).toMatchObject({ reference: "booking-new", previousReference: "booking-old" });
  });

  test("ignores unsupported events instead of creating a scheduled booking", () => {
    expect(parseCalcomEvent(event("MEETING_ENDED"))).toBeNull();
    expect(parseCalcomEvent(event("BOOKING_REQUESTED"))).toBeNull();
  });

  test("rejects malformed supported events", () => {
    expect(() => parseCalcomEvent(null)).toThrow();
    expect(() => parseCalcomEvent(event("BOOKING_CREATED", { uid: null }))).toThrow();
    expect(() => parseCalcomEvent(event("BOOKING_CREATED", { startTime: "invalid" }))).toThrow();
    expect(() => parseCalcomEvent(event("BOOKING_CREATED", { attendees: [] }))).toThrow();
  });

  test("cancellation keeps the UID without requiring a current attendee account", () => {
    expect(parseCalcomEvent(event("BOOKING_CANCELLED", { attendees: [] }))).toMatchObject({
      event: "BOOKING_CANCELLED",
      reference: "booking-new",
      attendee: null,
    });
  });
});
