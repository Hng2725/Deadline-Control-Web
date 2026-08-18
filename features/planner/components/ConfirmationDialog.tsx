"use client";

import { useEffect, useRef } from "react";

type Props = { title: string; description: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void };

export function ConfirmationDialog({ title, description, confirmLabel, onCancel, onConfirm }: Props) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { confirmButtonRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [onCancel]);
  return <div className="confirmation-backdrop" onMouseDown={onCancel}><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onMouseDown={(event) => event.stopPropagation()}><p className="eyebrow">CONFIRM ACTION</p><h2 id="confirmation-title">{title}</h2><p>{description}</p><div className="confirmation-actions"><button className="text-button" onClick={onCancel}>Cancel</button><button ref={confirmButtonRef} className="primary-button" onClick={onConfirm}>{confirmLabel}</button></div></section></div>;
}
