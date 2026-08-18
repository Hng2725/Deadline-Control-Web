import { describe, expect, it } from "vitest";
import { getDeadlineInsight } from "./deadline";

describe("getDeadlineInsight", () => {
  const today = "2026-08-18";

  it("marks a deadline in three days as urgent", () => {
    expect(getDeadlineInsight("2026-08-21", 2, today)).toMatchObject({ status: "urgent", daysRemaining: 3, isOverloaded: false });
  });

  it("marks unfinished work beyond available days as overloaded", () => {
    expect(getDeadlineInsight("2026-08-20", 3, today)).toMatchObject({ status: "urgent", daysRemaining: 2, isOverloaded: true });
  });

  it("marks a past deadline as overdue", () => {
    expect(getDeadlineInsight("2026-08-17", 1, today)).toMatchObject({ status: "overdue", daysRemaining: -1 });
  });
});
