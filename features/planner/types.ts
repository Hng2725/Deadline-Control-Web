export type Priority = "High" | "Medium" | "Low";
export type Status = "todo" | "done";
export type PlanType = "deadline" | "work";

export type UserProfile = { displayName: string; email: string; bio: string; avatarColor: "peach" | "violet" | "mint" | "blue" };

export type Plan = { id: string; title: string; type: PlanType; deadline?: string; color: "violet" | "orange" | "blue" | "pink"; createdAt: string };
export type Recurrence = "daily" | "weekly";
export type Task = { id: string; title: string; planId: string; date: string; priority: Priority; status: Status; estimateMinutes: number; notes?: string; order: number; calendarOrder: number; recurrence?: Recurrence; recurrenceParentId?: string };
export type PlannerState = { storageVersion: 2; plans: Plan[]; tasks: Task[]; profile: UserProfile };
export type Template = { id: string; title: string; icon: string; duration: string; level: string; description: string; tasks: string[] };
