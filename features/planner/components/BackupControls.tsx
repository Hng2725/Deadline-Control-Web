"use client";

import { ChangeEvent } from "react";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { PlannerState } from "../types";

export function BackupControls({ state, onImport }: { state: PlannerState; onImport: (value: unknown) => void }) {
  function exportBackup() { const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `deyline-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); }
  function importBackup(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const value = JSON.parse(String(reader.result)); if (window.confirm("Replace this local workspace with the imported backup?")) onImport(value); } catch { window.alert("This file is not a valid Deyline backup."); } finally { event.target.value = ""; } }; reader.readAsText(file); }
  return <div className="backup-controls"><button className="text-button" onClick={exportBackup}><DownloadOutlined /> Export backup</button><label className="text-button"><UploadOutlined /> Import backup<input type="file" accept="application/json,.json" onChange={importBackup} /></label></div>;
}
