import { toDateKey } from "./date";

export type DeadlineStatus = "overdue" | "dueToday" | "urgent" | "soon" | "planned";

export type DeadlineInsight = {
  status: DeadlineStatus;
  daysRemaining: number;
  isOverloaded: boolean;
};

export function getDeadlineInsight(deadline: string, unfinishedTasks: number, today = toDateKey()): DeadlineInsight {
  const daysRemaining = Math.round((new Date(`${deadline}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86_400_000);
  const status: DeadlineStatus = daysRemaining < 0 ? "overdue" : daysRemaining === 0 ? "dueToday" : daysRemaining <= 3 ? "urgent" : daysRemaining <= 7 ? "soon" : "planned";
  return { status, daysRemaining, isOverloaded: unfinishedTasks > Math.max(daysRemaining, 1) };
}
