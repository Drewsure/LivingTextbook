"use client";

import { useEffect, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import {
  getDefaultAssistLanguageEnabled,
  getTeacherAssistLanguageApprovalStorageKey,
  parseStoredTeacherAssistLanguageApproval,
  serializeTeacherAssistLanguageApproval,
} from "@/features/tenant/assistLanguageSettings";
import type { TenantConfig } from "@/features/tenant/types";

interface TeacherAssistLanguagePanelProps {
  tenant: TenantConfig;
}

export function TeacherAssistLanguagePanel({ tenant }: TeacherAssistLanguagePanelProps) {
  const storageKey = getTeacherAssistLanguageApprovalStorageKey(tenant.id);
  const availableAssistLanguages = tenant.languageSettings?.assistLanguages ?? [];
  const hasAssistLanguages = availableAssistLanguages.length > 0;
  const [assistLanguageEnabled, setAssistLanguageEnabled] = useState(getDefaultAssistLanguageEnabled(tenant));

  useEffect(() => {
    const storedApproval = parseStoredTeacherAssistLanguageApproval(window.localStorage.getItem(storageKey));
    setAssistLanguageEnabled(storedApproval ?? getDefaultAssistLanguageEnabled(tenant));
  }, [storageKey, tenant]);

  function handleAssistLanguageChange(enabled: boolean) {
    window.localStorage.setItem(storageKey, serializeTeacherAssistLanguageApproval(enabled));
    setAssistLanguageEnabled(enabled);
  }

  const visible = hasAssistLanguages && assistLanguageEnabled;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Support language control</p>
          <h2 className="mt-1 text-lg font-bold">Assist language visibility</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            Assist language can help comprehension, but it cannot complete English practice, unlock games, award mastery, or replace target-language listening.
          </p>
        </div>
        <StatusPill label={visible ? "Assist visible" : "Assist off"} tone={visible ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <AssistFact label="Available" value={hasAssistLanguages ? availableAssistLanguages.join(", ") : "None"} />
        <AssistFact label="Default" value={getDefaultAssistLanguageEnabled(tenant) ? "On" : "Off"} />
        <AssistFact label="Progression" value="Target language only" />
      </dl>

      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-sm leading-6 text-[var(--tenant-muted)]">
          This is a local teacher preview setting for the current browser. A future launch-session setting must carry the same rule into real classrooms.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={visible ? "primary" : "secondary"} onClick={() => handleAssistLanguageChange(true)} disabled={!hasAssistLanguages}>
            Show assist language
          </Button>
          <Button type="button" variant={!visible ? "primary" : "secondary"} onClick={() => handleAssistLanguageChange(false)}>
            Keep assist off
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AssistFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
