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
  const tasks: Task[] = [{ id: "t1", title: "Finish case study layout", planId: "launch", date: today, priority: "High", status: "todo", estimate: "2h" }, { id: "t2", title: "Write project narrative", planId: "launch", date: addDays(today, 1), priority: "High", status: "todo", estimate: "1h 30m" }, { id: "t3", title: "Review visual references", planId: "launch", date: today, priority: "Medium", status: "done", estimate: "45m" }, { id: "t4", title: "Update professional profile", planId: "growth", date: addDays(today, 2), priority: "Medium", status: "todo", estimate: "1h" }, { id: "t5", title: "Book accommodation", planId: "trip", date: addDays(today, 4), priority: "Low", status: "todo", estimate: "30m" }];
  return { plans, tasks, profile: defaultProfile };
}

export const demoState = makeDemoState();
function openDatabase(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
export async function loadState(): Promise<PlannerState> { try { const db = await openDatabase(); return await new Promise((resolve, reject) => { const request = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY); request.onsuccess = () => { const stored = request.result as Partial<PlannerState> | undefined; resolve(stored ? { plans: stored.plans ?? [], tasks: stored.tasks ?? [], profile: stored.profile ?? defaultProfile } : makeDemoState()); }; request.onerror = () => reject(request.error); }); } catch { return makeDemoState(); } }
export async function saveState(state: PlannerState) { try { const db = await openDatabase(); await new Promise<void>((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(state, KEY); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); } catch { /* Browser storage may be unavailable. */ } }
