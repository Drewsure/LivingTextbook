import { Card, StatusPill } from "@living-textbook/ui";
import type { SessionSettingReadiness, TeacherSessionSetting } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import {
  resolveSampleTeacherSessionMonitorContext,
  type TeacherSessionMonitorContext,
} from "@/data/sampleTeacherSessionMonitor";
import { sampleTeacherSessionSettingsReviewPackets } from "@/data/sampleTeacherSessionSettingsReviewPacket";
import { TeacherSessionSettingsReviewPacketPanel } from "@/features/teacher/TeacherSessionSettingsReviewPacketPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const sampleContexts = [
  resolveSampleTeacherSessionMonitorContext("demo-unit-1"),
  resolveSampleTeacherSessionMonitorContext("partner-demo-unit-1"),
];

const settingsLinks = [
  { href: "/teacher/intake", label: "Foundation intake" },
  { href: "/teacher/persistence", label: "Persistence readiness" },
  { href: "/teacher/sessions/demo-unit-1", label: "MiniStar session monitor" },
  { href: "/teacher/sessions/partner-demo-unit-1", label: "Partner session monitor" },
];

const settingTone: Record<SessionSettingReadiness, "neutral" | "success" | "warning"> = {
  disabled: "neutral",
  enabled: "success",
  "premium-disabled": "neutral",
  "requires-persistence": "warning",
};

export default function TeacherSessionSettingsWorkbenchPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher session settings workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Teacher choices, paid options, and support-language boundaries</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused route gathers the launch-session settings that teachers and schools must review before
                classroom use. It keeps audio, support language, microphone practice, background media, reports, and
                AI Tutor package choices visible without enabling a setting save, real learner data collection, or live
                classroom launch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No setting save" tone="warning" />
              <StatusPill label="No live classroom launch" tone="warning" />
              <StatusPill label="AI Tutor optional paid package" tone="neutral" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {settingsLinks.map((link) => (
              <WorkbenchLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Target-language-only progress remains the rule. Support language cannot unlock progress, background
              media cannot become mastery evidence, raw audio is excluded from the core tier, transcripts remain
              blocked in core reporting, and learning audio always has priority over music, video, and microphone
              practice.
            </p>
          </section>
        </Card>

        <div className="grid gap-5">
          {sampleContexts.map((context) => (
            <SessionSettingsSnapshotCard key={context.launchSession.launchCode} context={context} />
          ))}
        </div>

        <TeacherSessionSettingsReviewPacketPanel packets={sampleTeacherSessionSettingsReviewPackets} />
      </div>
    </AppShell>
  );
}

function SessionSettingsSnapshotCard({ context }: { context: TeacherSessionMonitorContext }) {
  const settings = createSettingsSnapshot(context);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Settings snapshot</p>
          <h3 className="mt-1 text-lg font-bold">
            {context.tenant.displayName}: {context.launchSession.launchCode}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the machine-readable launch-session settings preview that must eventually travel to student
            devices. It is report context and policy evidence only; it cannot grant mastery, score support language, or
            mutate a scoring profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill
            label={`${context.sessionSettingErrors.length} guard block(s)`}
            tone={context.sessionSettingErrors.length > 0 ? "warning" : "success"}
          />
          <StatusPill
            label={`${context.sessionSettingWarnings.length} persistence warning(s)`}
            tone={context.sessionSettingWarnings.length > 0 ? "warning" : "neutral"}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <BoundaryFact label="Learning audio" value={settings.audioRequired ? "Always required" : "Missing"} />
        <BoundaryFact
          label="Assist language"
          value={settings.assistLanguage.enabled ? "Support-only preview" : "Teacher-controlled off"}
        />
        <BoundaryFact
          label="teacher_enablement_persisted"
          value={settings.assistLanguage.teacherEnablementPersisted ? "true" : "false"}
        />
        <BoundaryFact
          label="Microphone"
          value={settings.microphonePractice.enabled ? "Approval required" : "Disabled"}
        />
        <BoundaryFact
          label="Background media"
          value={settings.backgroundMedia.allowed ? "Ducks for learning audio" : "Disabled"}
        />
        <BoundaryFact label="AI Tutor" value={settings.aiTutor.enabled ? "Premium enabled" : "Premium disabled"} />
        <BoundaryFact
          label="Raw audio"
          value={settings.microphonePractice.storesRawAudio || settings.reporting.storesRawAudio ? "Blocked review" : "Excluded"}
        />
        <BoundaryFact label="Transcripts" value={settings.reporting.storesTranscript ? "Blocked review" : "Core blocked"} />
        <BoundaryFact label="Report export" value={settings.reporting.exportAllowed ? "Allowed" : "Policy blocked"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <SessionSettingsList
          title="Teacher controls"
          settings={context.settings}
        />
        <BoundaryList
          title="Persistence warnings"
          items={
            context.sessionSettingWarnings.length > 0
              ? context.sessionSettingWarnings
              : ["No settings persistence warnings."]
          }
          tone={context.sessionSettingWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <pre className="mt-5 max-h-96 overflow-auto rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-xs leading-5 text-[var(--tenant-text)]">
        {JSON.stringify(settings, null, 2)}
      </pre>
    </Card>
  );
}

function WorkbenchLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
      href={href}
    >
      {label}
      <span className="mt-1 block break-words text-xs font-semibold text-[var(--tenant-muted)]">{href}</span>
    </a>
  );
}

function BoundaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function SessionSettingsList({ title, settings }: { title: string; settings: TeacherSessionSetting[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(settings.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-2">
        {settings.map((setting) => (
          <article key={setting.settingId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h5 className="text-sm font-bold text-[var(--tenant-text)]">{setting.label}</h5>
              <StatusPill label={setting.status} tone={settingTone[setting.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{setting.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BoundaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function createSettingsSnapshot(context: TeacherSessionMonitorContext) {
  return {
    launchCode: context.launchSession.launchCode,
    tenantId: context.sessionSettings.tenantId,
    audioRequired: context.sessionSettings.audioRequired,
    assistLanguage: context.sessionSettings.assistLanguage,
    microphonePractice: context.sessionSettings.microphonePractice,
    backgroundMedia: context.sessionSettings.backgroundMedia,
    trainingRecovery: context.sessionSettings.trainingRecovery,
    aiTutor: context.sessionSettings.aiTutor,
    reporting: context.sessionSettings.reporting,
    blockedActions: [
      "No setting save",
      "No live classroom launch",
      "No support-language-only progress",
      "No background-media mastery",
      "No raw microphone audio upload",
      "No AI Tutor activation",
      "No report export",
    ],
  };
}
