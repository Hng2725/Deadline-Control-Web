import { Template } from "./types";

export const templates: Template[] = [
  { id: "exam", title: "Prepare for an exam", icon: "✦", duration: "14 days", level: "Focused", description: "Turn a big exam into calm, daily progress.", tasks: ["Gather study materials", "Create revision blocks", "Take a practice test"] },
  { id: "portfolio", title: "Launch a portfolio", icon: "◈", duration: "10 days", level: "Creative", description: "A focused launch plan for your personal site.", tasks: ["Outline case studies", "Design the pages", "Publish and share"] },
  { id: "week", title: "Weekly reset", icon: "☼", duration: "7 days", level: "Light", description: "Organise your work and make space for what matters.", tasks: ["Review inbox", "Pick three priorities", "Plan the week"] },
];
