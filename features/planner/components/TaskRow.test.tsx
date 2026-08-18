import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskRow } from "./TaskRow";

describe("TaskRow", () => {
  it("keeps a completed task visible with an undo control", () => {
    const onToggle = vi.fn();
    render(<TaskRow task={{ id: "task", title: "Completed task", planId: "plan", date: "2026-08-18", priority: "High", status: "done", estimateMinutes: 30, order: 1, calendarOrder: 1 }} onToggle={onToggle} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Undo Completed task" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark Completed task as not done" })).toHaveClass("check");
    expect(screen.queryByRole("img", { name: "check" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo Completed task" }));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
