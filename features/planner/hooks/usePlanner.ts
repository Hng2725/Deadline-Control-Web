"use client";

import { useEffect, useState } from "react";
import { addDays, toDateKey } from "@/lib/date";
import { loadState, normalizeState, saveState } from "@/lib/storage";
import { Plan, PlannerState, Task, Template, UserProfile } from "../types";

const colors: Plan["color"][] = ["violet", "orange", "blue", "pink"];

export function usePlanner() {
  const [data, setData] = useState<PlannerState>({ storageVersion: 2, plans: [], tasks: [], profile: { displayName: "Jordan Doe", email: "", bio: "", avatarColor: "peach" } });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => { loadState().then((state) => { setData(state); setIsReady(true); }); }, []);
  useEffect(() => { if (isReady) void saveState(data); }, [data, isReady]);

  function addPlan(input: Omit<Plan, "id" | "color" | "createdAt"> & { color?: Plan["color"] }) {
    const plan: Plan = { ...input, id: crypto.randomUUID(), color: input.color ?? colors[data.plans.length % colors.length], createdAt: new Date().toISOString() };
    setData((current) => ({ ...current, plans: [...current.plans, plan] }));
    return plan;
  }
  function updatePlan(id: string, patch: Partial<Omit<Plan, "id" | "createdAt">>) { setData((current) => ({ ...current, plans: current.plans.map((plan) => plan.id === id ? { ...plan, ...patch } : plan) })); }
  function deletePlan(id: string) { setData((current) => ({ ...current, plans: current.plans.filter((plan) => plan.id !== id), tasks: current.tasks.filter((task) => task.planId !== id) })); }
  function addTask(input: Omit<Task, "id" | "status" | "order" | "calendarOrder"> & { status?: Task["status"] }) {
    const task: Task = { ...input, id: crypto.randomUUID(), status: input.status ?? "todo", order: 0, calendarOrder: 0 };
    setData((current) => ({ ...current, tasks: [...current.tasks, { ...task, order: current.tasks.filter((item) => item.planId === input.planId).length + 1, calendarOrder: current.tasks.filter((item) => item.date === input.date).length + 1 }] }));
    return task;
  }
  function updateTask(id: string, patch: Partial<Omit<Task, "id">>) {
    setData((current) => {
      const task = current.tasks.find((item) => item.id === id);
      if (!task) return current;
      const nextTask = { ...task, ...patch };
      const shouldCreateRecurringTask = task.status === "todo" && nextTask.status === "done" && task.recurrence && !current.tasks.some((item) => item.recurrenceParentId === task.id);
      if (!shouldCreateRecurringTask) return { ...current, tasks: current.tasks.map((item) => item.id === id ? nextTask : item) };
      const date = addDays(task.date, task.recurrence === "daily" ? 1 : 7);
      const successor: Task = { ...task, id: crypto.randomUUID(), date, status: "todo", order: current.tasks.filter((item) => item.planId === task.planId).length + 1, calendarOrder: current.tasks.filter((item) => item.date === date).length + 1, recurrenceParentId: task.id };
      return { ...current, tasks: current.tasks.map((item) => item.id === id ? nextTask : item).concat(successor) };
    });
  }
  function moveTask(id: string, date: string) { setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, date, calendarOrder: current.tasks.filter((item) => item.date === date && item.id !== id).length + 1 } : task) })); }
  function reorderCalendarTasks(date: string, sourceId: string, targetId: string) { setData((current) => { const items = current.tasks.filter((task) => task.date === date).sort((a, b) => a.calendarOrder - b.calendarOrder); const source = items.findIndex((task) => task.id === sourceId); const target = items.findIndex((task) => task.id === targetId); if (source < 0 || target < 0) return current; const [moved] = items.splice(source, 1); items.splice(target, 0, moved); const order = new Map(items.map((task, index) => [task.id, index + 1])); return { ...current, tasks: current.tasks.map((task) => order.has(task.id) ? { ...task, calendarOrder: order.get(task.id) ?? task.calendarOrder } : task) }; }); }
  function deleteTask(id: string) { setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) })); }
  function reorderTasks(planId: string, sourceId: string, targetId: string) {
    setData((current) => {
      const planTasks = current.tasks.filter((task) => task.planId === planId).sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.date.localeCompare(b.date));
      const sourceIndex = planTasks.findIndex((task) => task.id === sourceId);
      const targetIndex = planTasks.findIndex((task) => task.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const [moved] = planTasks.splice(sourceIndex, 1);
      planTasks.splice(targetIndex, 0, moved);
      const orders = new Map(planTasks.map((task, index) => [task.id, index + 1]));
      return { ...current, tasks: current.tasks.map((task) => orders.has(task.id) ? { ...task, order: orders.get(task.id) ?? task.order } : task) };
    });
  }
  function updateProfile(patch: Partial<UserProfile>) { setData((current) => ({ ...current, profile: { ...current.profile, ...patch } })); }
  function replaceState(nextState: unknown) { setData(normalizeState(nextState)); }
  function addTemplate(template: Template) {
    const plan = addPlan({ title: template.title, type: "deadline", deadline: addDays(toDateKey(), Number.parseInt(template.duration, 10)) });
    template.tasks.forEach((title, index) => addTask({ title, planId: plan.id, date: addDays(toDateKey(), index + 1), priority: index === 0 ? "High" : "Medium", estimateMinutes: 60, notes: "" }));
  }
  return { data, isReady, addPlan, updatePlan, deletePlan, addTask, updateTask, deleteTask, moveTask, reorderTasks, reorderCalendarTasks, updateProfile, replaceState, addTemplate };
}
