import { describe, expect, it } from "vitest";
import { addMonths } from "./date";

describe("addMonths", () => {
  it("keeps the target month when navigating from the 31st", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
  });

  it("uses leap-day month lengths", () => {
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
  });

  it("moves backwards across a year boundary", () => {
    expect(addMonths("2026-01-31", -1)).toBe("2025-12-31");
  });
});
