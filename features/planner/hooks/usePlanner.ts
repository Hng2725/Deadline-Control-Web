"use client";

import { useEffect, useState } from "react";
import { addDays, toDateKey } from "@/lib/date";
import { loadState, saveState } from "@/lib/storage";
import { Plan, PlannerState, Task, Template, UserProfile } from "../types";

const colors: Plan["color"][] = ["violet", "orange", "blue", "pink"];

export function usePlanner() {
  const [data, setData] = useState<PlannerState>({ plans: [], tasks: [], profile: { displayName: "Jordan Doe", email: "", bio: "", avatarColor: "peach" } });
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
  function addTask(input: Omit<Task, "id" | "status" | "order"> & { status?: Task["status"]; order?: number }) {
    const task: Task = { ...input, id: crypto.randomUUID(), status: input.status ?? "todo", order: input.order ?? data.tasks.filter((item) => item.planId === input.planId).length + 1 };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    return task;
  }
  function updateTask(id: string, patch: Partial<Omit<Task, "id">>) { setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, ...patch } : task) })); }
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
      return { ...current, tasks: current.tasks.map((task) => orders.has(task.id) ? { ...task, order: orders.get(task.id) } : task) };
    });
  }
  function updateProfile(patch: Partial<UserProfile>) { setData((current) => ({ ...current, profile: { ...current.profile, ...patch } })); }
  function addTemplate(template: Template) {
    const plan = addPlan({ title: template.title, type: "deadline", deadline: addDays(toDateKey(), Number.parseInt(template.duration, 10)) });
    template.tasks.forEach((title, index) => addTask({ title, planId: plan.id, date: addDays(toDateKey(), index + 1), priority: index === 0 ? "High" : "Medium", estimate: "1h", notes: "", order: index + 1 }));
  }
  return { data, isReady, addPlan, updatePlan, deletePlan, addTask, updateTask, deleteTask, reorderTasks, updateProfile, addTemplate };
}
