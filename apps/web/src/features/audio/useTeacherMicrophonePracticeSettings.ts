"use client";

import { useEffect, useState } from "react";
import {
  getMicrophonePracticeSettings,
  getTeacherMicrophoneApprovalStorageKey,
  parseStoredTeacherMicrophoneApproval,
} from "@/features/tenant/microphonePracticeSettings";
import type { TenantConfig, TenantMicrophonePracticeSettings } from "@/features/tenant/types";

/** Keeps the teacher's microphone decision consistent across every student entry surface. */
export function useTeacherMicrophonePracticeSettings(
  tenant: TenantConfig,
): TenantMicrophonePracticeSettings {
  const settings = getMicrophonePracticeSettings(tenant);
  const storageKey = getTeacherMicrophoneApprovalStorageKey(tenant.id);
  const [teacherApproved, setTeacherApproved] = useState(settings.localRecordReplayEnabled);

  useEffect(() => {
    function syncTeacherApproval() {
      const storedApproval = parseStoredTeacherMicrophoneApproval(window.localStorage.getItem(storageKey));
      setTeacherApproved(storedApproval ?? settings.localRecordReplayEnabled);
    }

    syncTeacherApproval();
    window.addEventListener("storage", syncTeacherApproval);

    return () => window.removeEventListener("storage", syncTeacherApproval);
  }, [settings.localRecordReplayEnabled, storageKey]);

  return {
    ...settings,
    localRecordReplayEnabled: settings.localRecordReplayEnabled && teacherApproved,
  };
}
