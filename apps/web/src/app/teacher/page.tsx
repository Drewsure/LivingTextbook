import { AppShell } from "@/components/layout/AppShell";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { sampleFoundationStatusSnapshot } from "@/data/sampleFoundationStatusSnapshot";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { FoundationStatusSnapshotPanel } from "@/features/policy/FoundationStatusSnapshotPanel";
import { getTeacherMediaLibraryPath } from "@/features/routes/routeContracts";
import { TeacherAssistLanguagePanel } from "@/features/teacher/TeacherAssistLanguagePanel";
import { TeacherLaunchPanel } from "@/features/teacher/TeacherLaunchPanel";
import { TeacherMicrophonePracticePanel } from "@/features/teacher/TeacherMicrophonePracticePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default function TeacherPage() {
  return (
    <AppShell tenant={ministarTenant}>
      <div className="grid gap-5">
        <FoundationStatusSnapshotPanel snapshot={sampleFoundationStatusSnapshot} />
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
          href="/teacher/reporting"
        >
          Open teacher reporting readiness workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Coded learner slots, report package boundaries, export blockers, and sensitive-data exclusions.
          </span>
        </a>
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href="/teacher/assignments"
        >
          Open assignment rollout workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Private links, QR entry, roster scope, pilot scheduling blockers, and target-language progress rules.
          </span>
        </a>
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href="/teacher/entitlements"
        >
          Open package entitlement workbench
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Optional paid features, AI generation, Voice Tutor, microphone scoring, storage/export, and local companion
            package boundaries.
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
        <a
          className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
          href={getTeacherMediaLibraryPath(ministarTenant.id)}
        >
          Open MiniStar media library
          <span className="mt-1 block text-xs font-semibold text-[var(--tenant-muted)]">
            Review audio-first Level 1 media, playlist bindings, support-language limits, and local bundle readiness.
          </span>
        </a>
      </div>
    </AppShell>
  );
}
