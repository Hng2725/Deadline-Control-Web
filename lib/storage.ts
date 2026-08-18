import { addDays, toDateKey } from "./date";
import { Plan, PlannerState, Task, UserProfile } from "@/features/planner/types";

export type { Plan, PlannerState, Priority, Status, Task, UserProfile } from "@/features/planner/types";

const DB_NAME = "deyline-planner";
const STORE = "workspace";
const KEY = "current";
export const defaultProfile: UserProfile = { displayName: "Jordan Doe", email: "jordan@example.com", bio: "Building calm systems for meaningful work.", avatarColor: "peach" };

function makeDemoState(): PlannerState {
  const today = toDateKey(); const createdAt = new Date().toISOString();
  const plans: Plan[] = [{ id: "launch", title: "Portfolio website", type: "deadline", deadline: addDays(today, 7), color: "violet", createdAt }, { id: "growth", title: "Career growth", type: "work", color: "orange", createdAt }, { id: "trip", title: "Summer trip", type: "deadline", deadline: addDays(today, 25), color: "blue", createdAt }];
  const tasks: Task[] = [{ id: "t1", title: "Finish case study layout", planId: "launch", date: today, priority: "High", status: "todo", estimateMinutes: 120, order: 1, calendarOrder: 1 }, { id: "t2", title: "Write project narrative", planId: "launch", date: addDays(today, 1), priority: "High", status: "todo", estimateMinutes: 90, order: 2, calendarOrder: 1 }, { id: "t3", title: "Review visual references", planId: "launch", date: today, priority: "Medium", status: "done", estimateMinutes: 45, order: 3, calendarOrder: 2 }, { id: "t4", title: "Update professional profile", planId: "growth", date: addDays(today, 2), priority: "Medium", status: "todo", estimateMinutes: 60, order: 1, calendarOrder: 1 }, { id: "t5", title: "Book accommodation", planId: "trip", date: addDays(today, 4), priority: "Low", status: "todo", estimateMinutes: 30, order: 1, calendarOrder: 1 }];
  return { storageVersion: 2, plans, tasks, profile: defaultProfile };
}

export const demoState = makeDemoState();
export function parseEstimateMinutes(value: unknown) { const text = String(value ?? "").toLowerCase(); const hours = Number(text.match(/(\d+)\s*h/)?.[1] ?? 0); const minutes = Number(text.match(/(\d+)\s*m/)?.[1] ?? 0); return hours || minutes ? hours * 60 + minutes : 30; }
export function normalizeState(value: unknown): PlannerState {
  const input = value && typeof value === "object" ? value as { plans?: unknown; tasks?: unknown; profile?: unknown } : {};
  const plans = Array.isArray(input.plans) ? input.plans.filter((plan): plan is Plan => Boolean(plan && typeof plan === "object" && typeof (plan as Plan).id === "string" && typeof (plan as Plan).title === "string")) : [];
  const profile = input.profile && typeof input.profile === "object" ? { ...defaultProfile, ...(input.profile as Partial<UserProfile>) } : defaultProfile;
  const rawTasks = Array.isArray(input.tasks) ? input.tasks : [];
  const tasks = rawTasks.filter((task): task is Record<string, unknown> => Boolean(task && typeof task === "object" && typeof (task as { id?: unknown }).id === "string")).map((task, index) => ({ id: String(task.id), title: String(task.title ?? "Untitled task"), planId: String(task.planId ?? ""), date: String(task.date ?? toDateKey()), priority: task.priority === "High" || task.priority === "Low" ? task.priority : "Medium", status: task.status === "done" ? "done" : "todo", estimateMinutes: typeof task.estimateMinutes === "number" ? task.estimateMinutes : parseEstimateMinutes(task.estimate), notes: typeof task.notes === "string" ? task.notes : "", order: typeof task.order === "number" ? task.order : index + 1, calendarOrder: typeof task.calendarOrder === "number" ? task.calendarOrder : index + 1, recurrence: task.recurrence === "daily" || task.recurrence === "weekly" ? task.recurrence : undefined, recurrenceParentId: typeof task.recurrenceParentId === "string" ? task.recurrenceParentId : undefined } satisfies Task));
  tasks.sort((a, b) => a.planId.localeCompare(b.planId) || a.order - b.order || a.id.localeCompare(b.id)).forEach((task, index, all) => { task.order = all.filter((item) => item.planId === task.planId).indexOf(task) + 1; });
  tasks.sort((a, b) => a.date.localeCompare(b.date) || a.calendarOrder - b.calendarOrder || a.id.localeCompare(b.id)).forEach((task, index, all) => { task.calendarOrder = all.filter((item) => item.date === task.date).indexOf(task) + 1; });
  return { storageVersion: 2, plans, tasks, profile };
}
function openDatabase(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
export async function loadState(): Promise<PlannerState> { try { const db = await openDatabase(); const state = await new Promise<PlannerState>((resolve, reject) => { const request = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY); request.onsuccess = () => resolve(request.result ? normalizeState(request.result) : makeDemoState()); request.onerror = () => reject(request.error); }); db.close(); return state; } catch { return makeDemoState(); } }
let writeQueue = Promise.resolve();
export function saveState(state: PlannerState) { writeQueue = writeQueue.then(async () => { const db = await openDatabase(); await new Promise<void>((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(state, KEY); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); db.close(); }); return writeQueue; }
