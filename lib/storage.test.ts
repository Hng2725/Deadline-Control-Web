import { describe, expect, it } from "vitest";
import { normalizeState, parseEstimateMinutes } from "./storage";

describe("parseEstimateMinutes", () => {
  it("migrates legacy hour and minute estimates", () => {
    expect(parseEstimateMinutes("1h 30m")).toBe(90);
    expect(parseEstimateMinutes("45m")).toBe(45);
  });
});

describe("normalizeState", () => {
  it("migrates legacy tasks with deterministic plan and calendar order", () => {
    const state = normalizeState({
      plans: [{ id: "plan", title: "Plan", type: "work", color: "violet", createdAt: "2026-01-01" }],
      tasks: [{ id: "task", title: "Task", planId: "plan", date: "2026-08-18", priority: "High", status: "todo", estimate: "2h" }],
      profile: { displayName: "A", email: "", bio: "", avatarColor: "peach" },
    });

    expect(state.storageVersion).toBe(2);
    expect(state.tasks[0]).toMatchObject({ order: 1, calendarOrder: 1, estimateMinutes: 120 });
  });
});
