import { describe, expect, test } from "bun:test";
import { acceptanceFrame, scrollProgress } from "./acceptance-motion.ts";

describe("acceptance scroll story", () => {
  test("clamps the sequence before entry and after exit", () => {
    expect(scrollProgress(100, 2400, 800)).toBeCloseTo(0, 8);
    expect(scrollProgress(-1600, 2400, 800)).toBe(1);
    expect(scrollProgress(-9000, 2400, 800)).toBe(1);
    expect(scrollProgress(0, 0, 800)).toBeCloseTo(0, 8);
  });
  test("opens the flap before lifting the letter through the pocket", () => {
    const closed = acceptanceFrame(0);
    const opened = acceptanceFrame(0.35);
    const lifted = acceptanceFrame(0.7);
    expect(closed.flap).toBeCloseTo(0, 8);
    expect(closed.lift).toBeCloseTo(0, 8);
    expect(opened.flap).toBeLessThan(-150);
    expect(opened.lift).toBeLessThan(15);
    expect(lifted.lift).toBeGreaterThan(80);
    expect(lifted.confetti).toBeGreaterThan(0);
  });
  test("settles into a readable letter and reverses deterministically", () => {
    const final = acceptanceFrame(1);
    expect(final.letterRotate).toBeCloseTo(0, 8);
    expect(final.letterTilt).toBeCloseTo(0, 8);
    expect(final.letterYaw).toBeCloseTo(0, 8);
    expect(final.confetti).toBe(1);
    const halfway = acceptanceFrame(0.5);
    acceptanceFrame(1);
    expect(acceptanceFrame(0.5)).toEqual(halfway);
    expect(acceptanceFrame(-1)).toEqual(acceptanceFrame(0));
  });
  test("all animation values remain finite for every scroll position", () => {
    for (let i = 0; i <= 100; i++) {
      expect(Object.values(acceptanceFrame(i / 100)).every(Number.isFinite)).toBe(true);
    }
  });
});
