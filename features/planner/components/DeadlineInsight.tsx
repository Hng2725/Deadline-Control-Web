import { getDeadlineInsight } from "@/lib/deadline";
import { Plan, Task } from "../types";

export function DeadlineInsight({ plan, tasks }: { plan: Plan; tasks: Task[] }) {
  if (!plan.deadline) return null;
  const insight = getDeadlineInsight(plan.deadline, tasks.filter((task) => task.status === "todo").length);
  const label = insight.status === "overdue" ? `${Math.abs(insight.daysRemaining)} days overdue` : insight.status === "dueToday" ? "Due today" : `${insight.daysRemaining} days remaining`;
  return <div className={`deadline-insight ${insight.status}`}><span>{label}</span>{insight.isOverloaded && <strong>More tasks than days left</strong>}</div>;
}
