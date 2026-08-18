"use client";

import { AimOutlined, ArrowLeftOutlined, ArrowRightOutlined, BellOutlined, BookOutlined, CalendarOutlined, CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, GlobalOutlined, HomeOutlined, MoreOutlined, PlusOutlined, RocketOutlined, SearchOutlined, UnorderedListOutlined, WarningOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { addDays, formatDate, monthDays, toDateKey, weekDays } from "@/lib/date";
import { templates } from "./templates";
import { Plan, Task } from "./types";
import { usePlanner } from "./hooks/usePlanner";
import { PlanCard } from "./components/PlanCard";
import { PlanModal, ProfileModal, TaskModal, TaskPreviewModal } from "./components/PlannerModal";
import { TaskRow } from "./components/TaskRow";
import { PlanFlow } from "./components/PlanFlow";

type View = "dashboard" | "plans" | "calendar" | "community" | "plan";
type TaskFilter = "all" | "todo" | "done";
type PlanFilter = "all" | "completed" | "in-progress" | "overdue";

export function PlannerApp() {
  const planner = usePlanner();
  const [view, setView] = useState<View>("dashboard");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [calendarMode, setCalendarMode] = useState<"week" | "month">("week");
  const [calendarDate, setCalendarDate] = useState(toDateKey());
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [planModal, setPlanModal] = useState<Plan | "new" | null>(null);
  const [taskModal, setTaskModal] = useState<{ task?: Task; date?: string; planId?: string } | null>(null);
  const [taskPreview, setTaskPreview] = useState<Task | null>(null);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [planSearch, setPlanSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const todayKey = toDateKey();
  const profile = planner.data.profile;
  const activePlan = planner.data.plans.find((plan) => plan.id === activePlanId);
  const plansById = useMemo(() => new Map(planner.data.plans.map((plan) => [plan.id, plan])), [planner.data.plans]);
  const todoTasks = planner.data.tasks.filter((task) => task.status === "todo");
  const todayTasks = todoTasks.filter((task) => task.date === todayKey);
  const overdue = todoTasks.filter((task) => task.date < todayKey).length;
  const complete = planner.data.tasks.filter((task) => task.status === "done").length;
  const closestDeadline = planner.data.plans.filter((plan) => plan.deadline).sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)))[0];
  const calendarDays = calendarMode === "week" ? weekDays(calendarDate) : monthDays(calendarDate);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [view]);

  if (!planner.isReady) return <main className="loading-screen"><span className="brand-mark">D</span><p>Opening your workspace...</p></main>;

  function openCalendar(date?: string) {
    const nextTask = [...planner.data.tasks]
      .filter((task) => task.status === "todo")
      .sort((a, b) => a.date.localeCompare(b.date))
      .find((task) => task.date >= todayKey) ?? planner.data.tasks[0];
    setCalendarDate(date ?? nextTask?.date ?? todayKey);
    setCalendarMode("week");
    setView("calendar");
  }
  function openNewTask(date?: string) {
    if (!planner.data.plans.length) { setPlanModal("new"); return; }
    setTaskModal({ date: date ?? todayKey });
  }
  function handlePlanDelete(plan: Plan) {
    if (window.confirm(`Delete "${plan.title}" and its ${planner.data.tasks.filter((task) => task.planId === plan.id).length} tasks?`)) planner.deletePlan(plan.id);
  }
  function handleTaskDelete(task: Task) {
    if (window.confirm(`Delete "${task.title}"?`)) { planner.deleteTask(task.id); setTaskModal(null); }
  }
  function shiftCalendar(amount: number) { setCalendarDate(addDays(calendarDate, calendarMode === "week" ? amount * 7 : amount * 30)); }
  function calendarTitle() { return calendarMode === "week" ? `${formatDate(calendarDays[0].date)}  -  ${formatDate(calendarDays.at(-1)!.date, { month: "short", day: "numeric", year: "numeric" })}` : formatDate(calendarDate, { month: "long", year: "numeric" }); }

  return <main className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setView("dashboard")}><span className="brand-mark">D</span><span>Deyline</span></button>
      <p className="eyebrow">YOUR SPACE</p>
      <nav><button className={view === "dashboard" ? "nav-item active" : "nav-item"} onClick={() => setView("dashboard")}><HomeOutlined />Overview</button><button className={view === "plans" || view === "plan" ? "nav-item active" : "nav-item"} onClick={() => setView("plans")}><UnorderedListOutlined />My plans</button><button className={view === "calendar" ? "nav-item active" : "nav-item"} onClick={() => openCalendar()}><CalendarOutlined />Calendar</button><button className={view === "community" ? "nav-item active" : "nav-item"} onClick={() => setView("community")}><GlobalOutlined />Community</button></nav>
      <button className="sidebar-footer profile-trigger" onClick={() => setProfileModalOpen(true)}><div className={`tiny-avatar ${profile.avatarColor}`}>{profileInitials(profile.displayName)}</div><div><strong>{profile.displayName}</strong><small>{profile.email || "Local workspace"}</small></div><MoreOutlined /></button>
    </aside>
    <section className="workspace">
      <header className="topbar"><div><p className="eyebrow">{formatDate(todayKey, { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</p><h1>{view === "dashboard" ? `Good morning, ${firstName(profile.displayName)}.` : view === "plan" ? activePlan?.title ?? "Plan" : titleForView(view)}</h1></div><div className="top-actions"><button className="round-button" aria-label="Notifications"><BellOutlined /><i /></button><button className={`avatar ${profile.avatarColor}`} aria-label="Edit your profile" onClick={() => setProfileModalOpen(true)}>{profileInitials(profile.displayName)}</button><button className="primary-button" onClick={() => setPlanModal("new")}><PlusOutlined /> New plan</button></div></header>
      {view === "dashboard" && <Dashboard todayTasks={todayTasks} overdue={overdue} complete={complete} total={planner.data.tasks.length} deadline={closestDeadline} plans={planner.data.plans} tasks={planner.data.tasks} plansById={plansById} onToggle={(task) => planner.updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })} onEditTask={(task) => setTaskModal({ task })} onDeleteTask={handleTaskDelete} onViewCalendar={() => openCalendar()} onViewPlans={() => setView("plans")} onEditPlan={(plan) => setPlanModal(plan)} onDeletePlan={handlePlanDelete} onOpenPlan={(plan) => { setActivePlanId(plan.id); setView("plan"); }} />}
      {view === "plans" && <PlansPage plans={planner.data.plans} tasks={planner.data.tasks} today={todayKey} query={planSearch} filter={planFilter} onQuery={setPlanSearch} onFilter={setPlanFilter} onNew={() => setPlanModal("new")} onEdit={(plan) => setPlanModal(plan)} onDelete={handlePlanDelete} onOpen={(plan) => { setActivePlanId(plan.id); setView("plan"); }} />}
      {view === "calendar" && <CalendarPage days={calendarDays} mode={calendarMode} title={calendarTitle()} currentDate={todayKey} tasks={planner.data.tasks} plansById={plansById} filter={filter} onFilter={setFilter} onMode={setCalendarMode} onPrevious={() => shiftCalendar(-1)} onNext={() => shiftCalendar(1)} onToday={() => setCalendarDate(todayKey)} onViewTask={setTaskPreview} onNewTask={openNewTask} />}
      {view === "community" && <CommunityPage query={search} onQuery={setSearch} onUse={(template) => { planner.addTemplate(template); setView("plans"); }} />}
      {view === "plan" && activePlan && <PlanFlow plan={activePlan} tasks={planner.data.tasks.filter((task) => task.planId === activePlan.id)} onBack={() => setView("plans")} onAddTask={() => setTaskModal({ date: todayKey, planId: activePlan.id })} onEditPlan={() => setPlanModal(activePlan)} onDeletePlan={() => { handlePlanDelete(activePlan); setView("plans"); }} onEditTask={(task) => setTaskModal({ task })} onToggleTask={(task) => planner.updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })} onReorder={(sourceId, targetId) => planner.reorderTasks(activePlan.id, sourceId, targetId)} focusedTaskId={focusedTaskId ?? undefined} />}
    </section>
    {planModal && <PlanModal plan={planModal === "new" ? undefined : planModal} onClose={() => setPlanModal(null)} onSubmit={(input) => { if (planModal === "new") planner.addPlan(input); else planner.updatePlan(planModal.id, input); setPlanModal(null); }} />}
    {profileModalOpen && <ProfileModal profile={profile} onClose={() => setProfileModalOpen(false)} onSave={(nextProfile) => { planner.updateProfile(nextProfile); setProfileModalOpen(false); }} />}
    {taskPreview && <TaskPreviewModal task={taskPreview} plan={plansById.get(taskPreview.planId)} onClose={() => setTaskPreview(null)} onOpenPlan={() => { setActivePlanId(taskPreview.planId); setFocusedTaskId(taskPreview.id); setTaskPreview(null); setView("plan"); }} />}
    {taskModal && <TaskModal task={taskModal.task} plans={planner.data.plans} defaultDate={taskModal.date ?? todayKey} defaultPlanId={taskModal.planId} onClose={() => setTaskModal(null)} onDelete={taskModal.task ? () => handleTaskDelete(taskModal.task!) : undefined} onSubmit={(input) => { if (taskModal.task) planner.updateTask(taskModal.task.id, input); else planner.addTask(input); setCalendarDate(input.date); setCalendarMode("week"); setTaskModal(null); if (!taskModal.task) setView("calendar"); }} />}
  </main>;
}

function Dashboard({ todayTasks, overdue, complete, total, deadline, plans, tasks, plansById, onToggle, onEditTask, onDeleteTask, onViewCalendar, onViewPlans, onEditPlan, onDeletePlan, onOpenPlan }: { todayTasks: Task[]; overdue: number; complete: number; total: number; deadline?: Plan; plans: Plan[]; tasks: Task[]; plansById: Map<string, Plan>; onToggle: (task: Task) => void; onEditTask: (task: Task) => void; onDeleteTask: (task: Task) => void; onViewCalendar: () => void; onViewPlans: () => void; onEditPlan: (plan: Plan) => void; onDeletePlan: (plan: Plan) => void; onOpenPlan: (plan: Plan) => void }) {
  const daysToDeadline = deadline?.deadline ? Math.max(0, Math.ceil((new Date(`${deadline.deadline}T12:00:00`).getTime() - new Date(`${toDateKey()}T12:00:00`).getTime()) / 86_400_000)) : 0;
  return <><section className="overview-grid"><article className="metric-card violet-card"><span className="metric-icon"><AimOutlined /></span><p>FOCUS TODAY</p><strong>{todayTasks.length} <small>tasks</small></strong><div className="metric-progress"><span style={{ width: `${Math.min(100, todayTasks.length * 28)}%` }} /></div><em>One small step at a time</em></article><article className="metric-card peach-card"><span className="metric-icon"><ClockCircleOutlined /></span><p>UP NEXT</p><strong>{daysToDeadline} <small>days</small></strong><em>{deadline ? deadline.title : "No upcoming deadline"}</em></article><article className="metric-card mint-card"><span className="metric-icon"><CheckCircleOutlined /></span><p>COMPLETED</p><strong>{complete} <small>tasks</small></strong><em>{total ? Math.round((complete / total) * 100) : 0}% of all tasks</em></article><article className="metric-card rose-card"><span className="metric-icon"><WarningOutlined /></span><p>NEEDS ATTENTION</p><strong>{overdue} <small>tasks</small></strong><em>{overdue ? "Let's bring it back on track" : "You are all caught up"}</em></article></section><section className="panel today-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR DAY</p><h2>Today&apos;s focus</h2></div><button className="text-button" onClick={onViewCalendar}>View calendar <span><ArrowRightOutlined /></span></button></div><div className="task-list">{todayTasks.length ? todayTasks.map((task) => <TaskRow key={task.id} task={task} plan={plansById.get(task.planId)} onToggle={() => onToggle(task)} onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} />) : <Empty title="A clear day ahead" body="Add a task from the calendar to make a gentle start." />}</div></section><section className="bottom-grid"><div className="panel plans-panel"><div className="panel-heading"><div><p className="eyebrow">KEEP GOING</p><h2>Active plans</h2></div><button className="text-button" onClick={onViewPlans}>See all <span><ArrowRightOutlined /></span></button></div><div className="plan-cards">{plans.slice(0, 3).map((plan) => <PlanCard key={plan.id} plan={plan} tasks={tasks.filter((task) => task.planId === plan.id)} onEdit={() => onEditPlan(plan)} onDelete={() => onDeletePlan(plan)} onOpen={() => onOpenPlan(plan)} />)}</div></div><div className="quote-card"><span>"</span><p>Great things are done by a series of small things brought together.</p><small> -  Vincent van Gogh</small></div></section></>;
}

function PlansPage({ plans, tasks, today, query, filter, onQuery, onFilter, onNew, onEdit, onDelete, onOpen }: { plans: Plan[]; tasks: Task[]; today: string; query: string; filter: PlanFilter; onQuery: (value: string) => void; onFilter: (value: PlanFilter) => void; onNew: () => void; onEdit: (plan: Plan) => void; onDelete: (plan: Plan) => void; onOpen: (plan: Plan) => void }) {
  const visiblePlans = plans.filter((plan) => { const status = planStatus(plan, tasks, today); return plan.title.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "all" || status === filter); });
  const filterLabels: { value: PlanFilter; label: string }[] = [{ value: "all", label: "All" }, { value: "in-progress", label: "In progress" }, { value: "completed", label: "Completed" }, { value: "overdue", label: "Overdue" }];
  return <section className="page-panel"><div className="page-heading"><div><p className="eyebrow">YOUR WORK</p><h2>Plans that move you forward</h2></div><button className="primary-button" onClick={onNew}><PlusOutlined /> New plan</button></div><div className="plans-toolbar"><label className="plan-search"><SearchOutlined /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search plans by name" /></label><div className="plan-filter-chips">{filterLabels.map((item) => <button key={item.value} className={filter === item.value ? "active" : ""} onClick={() => onFilter(item.value)}>{item.label}</button>)}</div></div>{visiblePlans.length ? <div className="plan-cards large">{visiblePlans.map((plan) => <PlanCard key={plan.id} plan={plan} tasks={tasks.filter((task) => task.planId === plan.id)} onEdit={() => onEdit(plan)} onDelete={() => onDelete(plan)} onOpen={() => onOpen(plan)} />)}</div> : <Empty title="No matching plans" body="Try another search or status filter." />}</section>; }

function CalendarPage({ days, mode, title, currentDate, tasks, plansById, filter, onFilter, onMode, onPrevious, onNext, onToday, onViewTask, onNewTask }: { days: ReturnType<typeof weekDays>; mode: "week" | "month"; title: string; currentDate: string; tasks: Task[]; plansById: Map<string, Plan>; filter: TaskFilter; onFilter: (value: TaskFilter) => void; onMode: (value: "week" | "month") => void; onPrevious: () => void; onNext: () => void; onToday: () => void; onViewTask: (task: Task) => void; onNewTask: (date: string) => void }) { return <section className={`page-panel calendar-panel ${mode === "month" ? "month-mode" : ""}`}><div className="page-heading"><div><p className="eyebrow">YOUR SCHEDULE</p><h2>{title}</h2></div><div className="calendar-controls"><button className="icon-text" onClick={onPrevious}><ArrowLeftOutlined /></button><button className="icon-text today-control" onClick={onToday}>Today</button><button className="icon-text" onClick={onNext}><ArrowRightOutlined /></button><div className="segmented"><button className={mode === "week" ? "active" : ""} onClick={() => onMode("week")}>Week</button><button className={mode === "month" ? "active" : ""} onClick={() => onMode("month")}>Month</button></div></div></div><div className="calendar-legend"><span><i className="dot violet" />High priority</span><span><i className="dot orange" />Medium priority</span><span><i className="dot blue" />Low priority</span><span className="calendar-readonly">View-only calendar</span><select value={filter} onChange={(event) => onFilter(event.target.value as TaskFilter)}><option value="all">All tasks</option><option value="todo">To do</option><option value="done">Completed</option></select></div><div className="calendar-grid">{days.map((day) => { const dateTasks = tasks.filter((task) => task.date === day.date && (filter === "all" || task.status === filter)); return <div className={`${day.date === currentDate ? "day-column is-today" : "day-column"} ${"isCurrentMonth" in day && !day.isCurrentMonth ? "other-month" : ""}`} key={day.date}><header><span>{mode === "week" || day.number <= 7 ? day.label : ""}</span><b>{day.number}</b></header><div className="day-dropzone">{dateTasks.map((task) => <CalendarTask key={task.id} task={task} plan={plansById.get(task.planId)} onView={() => onViewTask(task)} />)}<button className="add-task" onClick={() => onNewTask(day.date)}><PlusOutlined /> Add task</button></div></div>; })}</div><p className="drag-hint">Select a task to view its details, then open it in My Plans to manage it.</p></section>; }

function CalendarTask({ task, plan, onView }: { task: Task; plan?: Plan; onView: () => void }) { return <button className={`calendar-task readonly ${task.status === "done" ? "complete" : ""} ${task.priority.toLowerCase()}`} onClick={onView}><span className="calendar-status">{task.status === "done" ? "Completed" : "To do"}</span><strong>{task.title}</strong><small>{plan?.title} / {task.estimate}</small></button>; }

function CommunityPage({ query, onQuery, onUse }: { query: string; onQuery: (value: string) => void; onUse: (template: typeof templates[number]) => void }) { const matchingTemplates = templates.filter((template) => `${template.title} ${template.description} ${template.level}`.toLowerCase().includes(query.toLowerCase())); return <section className="page-panel community-panel"><div className="community-hero"><p className="eyebrow">LOCAL TEMPLATE LIBRARY</p><h2>Start with a plan that already works.</h2><p>Thoughtful frameworks for the projects and moments ahead.</p><div className="search"><SearchOutlined /> <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search templates" /></div></div><div className="template-grid">{matchingTemplates.map((template) => <article key={template.id} className="template-card"><div className="template-symbol">{template.id === "exam" ? <BookOutlined /> : template.id === "portfolio" ? <RocketOutlined /> : <CalendarOutlined />}</div><div className="template-labels"><span>{template.duration}</span><span>{template.level}</span></div><h3>{template.title}</h3><p>{template.description}</p><button className="secondary-button" onClick={() => onUse(template)}>Use this template <span><ArrowRightOutlined /></span></button></article>)}</div>{!matchingTemplates.length && <Empty title="No templates found" body="Try a shorter search term." />}</section>; }
function Empty({ title, body }: { title: string; body: string }) { return <div className="empty"><strong>{title}</strong><p>{body}</p></div>; }
function planStatus(plan: Plan, tasks: Task[], today: string): PlanFilter { const planTasks = tasks.filter((task) => task.planId === plan.id); const completed = planTasks.length > 0 && planTasks.every((task) => task.status === "done"); if (!completed && plan.deadline && plan.deadline < today) return "overdue"; return completed ? "completed" : "in-progress"; }
function profileInitials(name: string) { return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U"; }
function firstName(name: string) { return name.trim().split(" ")[0] || "there"; }
function titleForView(view: View) { return view === "plans" ? "My plans" : view === "calendar" ? "Calendar" : "Community"; }
