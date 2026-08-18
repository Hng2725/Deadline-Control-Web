export type Priority = "High" | "Medium" | "Low";
export type Status = "todo" | "done";
export type PlanType = "deadline" | "work";

export type UserProfile = { displayName: string; email: string; bio: string; avatarColor: "peach" | "violet" | "mint" | "blue" };

export type Plan = { id: string; title: string; type: PlanType; deadline?: string; color: "violet" | "orange" | "blue" | "pink"; createdAt: string };
export type Task = { id: string; title: string; planId: string; date: string; priority: Priority; status: Status; estimate: string; notes?: string; order?: number };
export type PlannerState = { plans: Plan[]; tasks: Task[]; profile: UserProfile };
export type Template = { id: string; title: string; icon: string; duration: string; level: string; description: string; tasks: string[] };
