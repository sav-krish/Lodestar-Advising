const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const segment = (p: number, start: number, end: number) => ease(clamp((p - start) / (end - start)));

export function scrollProgress(top: number, height: number, viewport: number) {
  return clamp(-top / Math.max(1, height - viewport));
}

/** One reversible timeline keeps all physical layers together during fast scrolling. */
export function acceptanceFrame(progress: number) {
  const p = clamp(progress);
  const turn = segment(p, 0, 0.25);
  const lift = segment(p, 0.32, 0.73);
  const settle = segment(p, 0.72, 0.91);
  const twist = segment(p, 0.47, 0.82);
  return {
    flap: -178 * segment(p, 0.15, 0.34),
    lift: 100 * lift,
    envelopeRotate: -13 * (1 - turn) + Math.sin(lift * Math.PI) * 5,
    envelopeTilt: 26 * (1 - turn),
    envelopeYaw: -24 * (1 - turn),
    envelopeY: 12 + 24 * lift,
    envelopeOpacity: 1 - 0.72 * settle,
    letterRotate: -9 * Math.sin(lift * Math.PI) * (1 - settle),
    letterTilt: 12 * Math.sin(lift * Math.PI) * (1 - settle),
    letterYaw: twist === 1 ? 0 : -360 * twist,
    confetti: segment(p, 0.65, 1),
    progress: p,
  };
}
