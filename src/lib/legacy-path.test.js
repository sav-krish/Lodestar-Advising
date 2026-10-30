import { expect, test } from "bun:test";
import { legacyHashPath } from "./legacy-path.ts";

test("old shared page and article links keep their destination", () => {
  expect(legacyHashPath("#/services")).toBe("/services");
  expect(legacyHashPath("#/insights/student-voice")).toBe("/insights/student-voice");
});
test("ordinary section anchors and external-looking paths are not rewritten", () => {
  expect(legacyHashPath("#programs")).toBeNull();
  expect(legacyHashPath("#//example.com")).toBeNull();
  expect(legacyHashPath("#/\\example.com")).toBeNull();
});
