import { DeleteOutlined } from "@ant-design/icons";
import { formatDuration } from "@/lib/date";
import { Plan, Task } from "../types";

type Props = { task: Task; plan?: Plan; onToggle: () => void; onEdit: () => void; onDelete: () => void };

export function TaskRow({ task, plan, onToggle, onEdit, onDelete }: Props) {
  return <div className={task.status === "done" ? "task-row complete" : "task-row"} onClick={onEdit} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onEdit()}>
    <button className="check" onClick={(event) => { event.stopPropagation(); onToggle(); }} aria-label={`Mark ${task.title} as ${task.status === "done" ? "not done" : "done"}`} />
    <div className="task-main"><strong>{task.title}</strong><span><i className={`dot ${task.priority.toLowerCase()}`} /> {plan?.title ?? "Personal"} <b> / </b> {formatDuration(task.estimateMinutes)}</span></div>
    {task.status === "done" && <button className="undo-button" onClick={(event) => { event.stopPropagation(); onToggle(); }} aria-label={`Undo ${task.title}`}>Undo</button>}
    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
    <button className="delete visible-on-hover" onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label={`Delete ${task.title}`}><DeleteOutlined /></button>
  </div>;
}
