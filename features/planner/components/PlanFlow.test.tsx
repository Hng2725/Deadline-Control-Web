import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanFlow } from "./PlanFlow";

describe("PlanFlow", () => {
  it("shows a confirmation dialog before completing every unfinished task", () => {
    const onCompleteAll = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<PlanFlow plan={{ id: "plan", title: "Launch", type: "work", color: "violet", createdAt: "2026-08-18" }} tasks={[{ id: "task", title: "First step", planId: "plan", date: "2026-08-18", priority: "High", status: "todo", estimateMinutes: 30, order: 1, calendarOrder: 1 }]} onBack={vi.fn()} onAddTask={vi.fn()} onCompleteAll={onCompleteAll} onEditPlan={vi.fn()} onDeletePlan={vi.fn()} onEditTask={vi.fn()} onToggleTask={vi.fn()} onReorder={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Complete all" }));
    const dialog = screen.getByRole("dialog", { name: "Complete all tasks" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Complete all" }));

    expect(onCompleteAll).toHaveBeenCalledOnce();
  });

  it("shows undo for a completed task and places notes below its priority", () => {
    const onToggleTask = vi.fn();
    render(<PlanFlow plan={{ id: "plan", title: "Launch", type: "work", color: "violet", createdAt: "2026-08-18" }} tasks={[{ id: "task", title: "First step", notes: "Check the final copy", planId: "plan", date: "2026-08-18", priority: "High", status: "done", estimateMinutes: 30, order: 1, calendarOrder: 1 }]} onBack={vi.fn()} onAddTask={vi.fn()} onCompleteAll={vi.fn()} onEditPlan={vi.fn()} onDeletePlan={vi.fn()} onEditTask={vi.fn()} onToggleTask={onToggleTask} onReorder={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Undo First step" }));

    expect(onToggleTask).toHaveBeenCalledOnce();
    const note = screen.getByText("Check the final copy");
    const taskCard = note.closest("article")!;
    expect(within(taskCard).queryByRole("img", { name: "holder" })).not.toBeInTheDocument();
    expect(within(taskCard).queryByRole("img", { name: "check" })).not.toBeInTheDocument();
    expect(within(taskCard).getByText("High").compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
