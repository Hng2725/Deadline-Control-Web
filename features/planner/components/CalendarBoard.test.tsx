import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalendarBoard } from "./CalendarBoard";

describe("CalendarBoard", () => {
  it("opens a task preview when task content is clicked", () => {
    const task = { id: "task", title: "Open me", planId: "plan", date: "2026-08-18", priority: "High" as const, status: "todo" as const, estimateMinutes: 30, order: 1, calendarOrder: 1 };
    const onViewTask = vi.fn();
    render(<CalendarBoard days={[{ date: task.date, label: "Mon", number: 18 }]} mode="week" title="Calendar" currentDate={task.date} tasks={[task]} plans={[{ id: "plan", title: "Plan", type: "work", color: "violet", createdAt: "2026-01-01" }]} status="all" planId="all" priority="all" onStatus={vi.fn()} onPlan={vi.fn()} onPriority={vi.fn()} onMode={vi.fn()} onPrevious={vi.fn()} onNext={vi.fn()} onToday={vi.fn()} onViewTask={onViewTask} onNewTask={vi.fn()} onMoveTask={vi.fn()} onReorder={vi.fn()} />);
    fireEvent.click(screen.getByText("Open me").closest("button")!);
    expect(onViewTask).toHaveBeenCalledWith(task);
  });
});
