"use client";

import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, DeleteOutlined, EditOutlined, HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";
import { Plan, Task } from "../types";

type Props = { plan: Plan; tasks: Task[]; onBack: () => void; onAddTask: () => void; onEditPlan: () => void; onDeletePlan: () => void; onEditTask: (task: Task) => void; onToggleTask: (task: Task) => void; onReorder: (sourceId: string, targetId: string) => void; focusedTaskId?: string };

export function PlanFlow({ plan, tasks, onBack, onAddTask, onEditPlan, onDeletePlan, onEditTask, onToggleTask, onReorder, focusedTaskId }: Props) {
  const orderedTasks = [...tasks].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.date.localeCompare(b.date));
  const completed = orderedTasks.filter((task) => task.status === "done").length;
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  useEffect(() => { if (!focusedTaskId) return; setHighlightedTaskId(focusedTaskId); document.getElementById(`task-${focusedTaskId}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); const timeout = window.setTimeout(() => setHighlightedTaskId(null), 3000); return () => window.clearTimeout(timeout); }, [focusedTaskId]);

  return <section className="plan-flow-page">
    <div className="plan-flow-top"><button className="back-button" onClick={onBack}><ArrowLeftOutlined /> All plans</button><div className="flow-actions"><button className="text-button" onClick={onEditPlan}><EditOutlined /> Edit plan</button><button className="text-button danger-text" onClick={onDeletePlan}><DeleteOutlined /> Delete</button></div></div>
    <div className={`plan-flow-hero ${plan.color}`}><div><p className="eyebrow">{plan.type === "deadline" ? "DEADLINE PLAN" : "WORK PLAN"}</p><h2>{plan.title}</h2><p>{plan.deadline ? `Target date: ${formatDate(plan.deadline, { weekday: "long", month: "long", day: "numeric" })}` : "A flexible plan you can move at your pace."}</p></div><div className="flow-progress"><strong>{completed}/{orderedTasks.length}</strong><span>steps complete</span><i><em style={{ width: `${orderedTasks.length ? (completed / orderedTasks.length) * 100 : 0}%` }} /></i></div></div>
    <div className="flow-heading"><div><p className="eyebrow">YOUR EXECUTION FLOW</p><h2>Small steps, in the right order.</h2><p>Drag a card onto another step to update the sequence. Arrows show what comes next.</p></div><button className="primary-button" onClick={onAddTask}><PlusOutlined /> Add task</button></div>
    {orderedTasks.length ? <div className="task-flow" aria-label="Task execution flow">{orderedTasks.map((task, index) => <div className="flow-node" key={task.id} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId && draggedId !== task.id) onReorder(draggedId, task.id); setDraggedId(null); }}><article id={`task-${task.id}`} className={`flow-task ${task.status === "done" ? "complete" : ""} ${task.priority.toLowerCase()} ${task.id === highlightedTaskId ? "focused" : ""}`} draggable onDragStart={() => setDraggedId(task.id)} onClick={() => onEditTask(task)}><div className="flow-task-head"><button className="check" onClick={(event) => { event.stopPropagation(); onToggleTask(task); }}>{task.status === "done" && <CheckOutlined />}</button><span>Step {index + 1}</span><b><HolderOutlined /></b></div><h3>{task.title}</h3>{task.notes && <p>{task.notes}</p>}<footer><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><small>{formatDate(task.date)}  /  {task.estimate}</small></footer></article>{index < orderedTasks.length - 1 && <div className="flow-connector" aria-hidden="true"><i><ArrowRightOutlined /></i></div>}</div>)}</div> : <div className="flow-empty"><span><PlusOutlined /></span><h3>Turn this plan into small, clear steps.</h3><p>Add your first task, then build the flow by dragging cards into the sequence.</p><button className="primary-button" onClick={onAddTask}><PlusOutlined /> Add first task</button></div>}
  </section>;
}
