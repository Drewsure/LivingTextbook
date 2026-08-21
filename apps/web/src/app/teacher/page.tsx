import { AppShell } from "@/components/layout/AppShell";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { TeacherAssistLanguagePanel } from "@/features/teacher/TeacherAssistLanguagePanel";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { TeacherMicrophonePracticePanel } from "@/features/teacher/TeacherMicrophonePracticePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function TeacherPage() {
  return (
    <AppShell tenant={ministarTenant}>
      <div className="grid gap-5">
        <TeacherLaunchPanel
          unit={levelOneUnitOne}
          launchSession={sampleLaunchSession}
          contentPackage={sampleMultimediaContentPackage}
        />
        <TeacherAssistLanguagePanel tenant={ministarTenant} />
        <TeacherMicrophonePracticePanel tenant={ministarTenant} />
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href="/teacher/session-settings"
        >
          Open teacher session settings workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Teacher choices, support-language boundaries, microphone approval, AI Tutor cost gates, and report safety.
          </span>
        </a>
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href="/teacher/persistence"
        >
          Open persistence readiness workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Backend, local companion, storage boundaries, and white-label cost controls.
          </span>
        </a>
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href="/teacher/game-readiness"
        >
          Open teacher game readiness workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Parent engines, active route replay, game offers, and Z.ai intake gates.
          </span>
        </a>
      </div>
    </AppShell>
  );
}
