import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatDate } from "@/lib/date";
import { Plan, Task } from "../types";

type Props = { plan: Plan; tasks: Task[]; onOpen: () => void; onEdit: () => void; onDelete: () => void };

export function PlanCard({ plan, tasks, onOpen, onEdit, onDelete }: Props) {
  const done = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return <article className={`plan-card ${plan.color} interactive-plan-card`} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onOpen()}>
    <div className="card-top"><span className="plan-type">{plan.type === "deadline" ? "DEADLINE PLAN" : "WORK PLAN"}</span><div className="card-actions"><button onClick={(event) => { event.stopPropagation(); onEdit(); }} aria-label={`Edit ${plan.title}`}><EditOutlined /></button><button onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label={`Delete ${plan.title}`}><DeleteOutlined /></button></div></div>
    <h3>{plan.title}</h3>
    <p>{plan.deadline ? `Due ${formatDate(plan.deadline)}` : "Ongoing personal plan"}</p>
    <div className="card-progress"><div><span>{done}/{tasks.length} tasks done</span><b>{progress}%</b></div><i><em style={{ width: `${progress}%` }} /></i></div>
  </article>;
}
