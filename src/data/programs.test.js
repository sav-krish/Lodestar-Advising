import { describe, expect, test } from "bun:test";
import { clientsHelped, programs } from "./programs.ts";

describe("current Lodestar offers", () => {
  test("offers only the Hour and essay package", () => {
    expect(programs.map((p) => p.id)).toEqual(["hour", "essay-package"]);
  });
  test("the Hour is one customizable 60-minute admissions session", () => {
    expect(programs[0].sessionCount).toBe(1);
    expect(programs[0].sessionMinutes).toBe(60);
    expect(programs[0].scope).toBe("admissions");
  });
  test("the package includes ten 30-minute classes", () => {
    expect(programs[1].sessionCount).toBe(10);
    expect(programs[1].sessionMinutes).toBe(30);
  });
  test("the package is exclusively for essays", () => {
    expect(programs[1].scope).toBe("essays-only");
  });
  test("the essay package costs $550 without an hourly-discount claim", () => {
    expect(programs[1].priceCents).toBe(55000);
    expect(programs[1].discountedHourlyRate).toBe(false);
  });
  test("at least twenty clients have been helped", () => {
    expect(clientsHelped).toBe(20);
  });
});
