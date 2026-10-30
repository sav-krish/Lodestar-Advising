/** Preserve previously shared hash routes while leaving in-page anchors alone. */
export function legacyHashPath(hash: string): string | null {
  if (!/^#\/(?![/\\])/.test(hash)) return null;
  return hash.slice(1);
}
