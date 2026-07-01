"use client";

import { useEffect, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import {
  getMicrophonePracticeSettings,
  getTeacherMicrophoneApprovalStorageKey,
  parseStoredTeacherMicrophoneApproval,
  serializeTeacherMicrophoneApproval,
} from "@/features/tenant/microphonePracticeSettings";
import type { TenantConfig } from "@/features/tenant/types";

interface TeacherMicrophonePracticePanelProps {
  tenant: TenantConfig;
}

export function TeacherMicrophonePracticePanel({ tenant }: TeacherMicrophonePracticePanelProps) {
  const settings = getMicrophonePracticeSettings(tenant);
  const storageKey = getTeacherMicrophoneApprovalStorageKey(tenant.id);
  const [localRecordReplayApproved, setLocalRecordReplayApproved] = useState(settings.localRecordReplayEnabled);

  useEffect(() => {
    const storedApproval = parseStoredTeacherMicrophoneApproval(window.localStorage.getItem(storageKey));
    setLocalRecordReplayApproved(storedApproval ?? settings.localRecordReplayEnabled);
  }, [settings.localRecordReplayEnabled, storageKey]);

  function handleApprovalChange(approved: boolean) {
    window.localStorage.setItem(storageKey, serializeTeacherMicrophoneApproval(approved));
    setLocalRecordReplayApproved(approved);
  }

  const localMicAllowed = settings.localRecordReplayEnabled && localRecordReplayApproved;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher control</p>
          <h2 className="mt-1 text-lg font-bold">Microphone approval</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            Local record/replay can be switched on for speaking practice. AI transcription or pronunciation scoring remains premium and separate from this core setting.
          </p>
        </div>
        <StatusPill label={localMicAllowed ? "Local mic allowed" : "Local mic off"} tone={localMicAllowed ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <PolicyFact label="Teacher approval" value={settings.teacherApprovalRequired ? "Required" : "Not required"} />
        <PolicyFact label="Local replay cost" value="No API cost" />
        <PolicyFact label="AI speech scoring" value={settings.aiSpeechScoringEnabled ? "Enabled" : "Premium off"} />
      </dl>

      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-sm leading-6 text-[var(--tenant-muted)]">{settings.privacyNotice}</p>
        <p className="text-sm font-semibold text-[var(--tenant-text)]">{settings.costNotice}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={localMicAllowed ? "primary" : "secondary"} onClick={() => handleApprovalChange(true)} disabled={!settings.localRecordReplayEnabled}>
            Allow local mic
          </Button>
          <Button type="button" variant={!localMicAllowed ? "primary" : "secondary"} onClick={() => handleApprovalChange(false)}>
            Keep mic off
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PolicyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
