export function toDateKey(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function addDays(date: string | Date, amount: number) {
  const value = typeof date === "string" ? new Date(`${date}T12:00:00`) : new Date(date);
  value.setDate(value.getDate() + amount);
  return toDateKey(value);
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en", options).format(new Date(`${date}T12:00:00`));
}

export function startOfWeek(date: string) {
  const value = new Date(`${date}T12:00:00`);
  const weekday = value.getDay() || 7;
  value.setDate(value.getDate() - weekday + 1);
  return toDateKey(value);
}

export function weekDays(anchorDate: string) {
  const firstDay = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(firstDay, index);
    const value = new Date(`${date}T12:00:00`);
    return { date, label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(value), number: value.getDate() };
  });
}

export function monthDays(anchorDate: string) {
  const value = new Date(`${anchorDate}T12:00:00`);
  const firstOfMonth = new Date(value.getFullYear(), value.getMonth(), 1);
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - leadingDays);
  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);
    const date = toDateKey(current);
    return { date, label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(current), number: current.getDate(), isCurrentMonth: current.getMonth() === value.getMonth() };
  });
}
