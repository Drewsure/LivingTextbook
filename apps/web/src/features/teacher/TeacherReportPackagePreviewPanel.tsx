import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent } from "@living-textbook/content-model";
import type { TeacherSessionMonitorContext } from "@/data/sampleTeacherSessionMonitor";

interface TeacherReportPackagePreviewPanelProps {
  context: TeacherSessionMonitorContext;
}

type ReportEventEffect = "learning-evidence" | "support-only" | "session-context";

interface ReportPackageRow {
  rowId: string;
  effect: ReportEventEffect;
  eventType: GameProgressEvent["type"];
  gameMode: string;
  learnerSlot: string;
  settingsProfileId: string;
  summary: string;
  scoreValue: string;
}

const effectTone: Record<ReportEventEffect, "neutral" | "success" | "warning"> = {
  "learning-evidence": "success",
  "session-context": "neutral",
  "support-only": "warning",
};

export function TeacherReportPackagePreviewPanel({ context }: TeacherReportPackagePreviewPanelProps) {
  const rows = createReportPackageRows(context.events);
  const learningRows = rows.filter((row) => row.effect === "learning-evidence");
  const supportRows = rows.filter((row) => row.effect === "support-only");
  const eventAcceptanceGate = context.eventAcceptanceGate;
  const eventAcceptanceBlocked = eventAcceptanceGate.items.filter((item) => item.status === "blocked").length;
  const eventAcceptanceWarnings = eventAcceptanceGate.items.filter((item) => item.status === "warning").length;
  const unitTitle = context.unit?.unitMeta.theme ?? context.launchSession.unitKey;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report package preview</p>
            <h2 className="mt-1 text-2xl font-bold">{unitTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This read-only preview shows the sanitized report package shape. It is useful for pilot handoff review, but export stays blocked until policy, persistence, access, retention, and format rules are accepted.
            </p>
          </div>
          <StatusPill label="Export blocked" tone="warning" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-[var(--tenant-text)]" href={`/teacher/sessions/${context.launchSession.launchCode}`}>
            Back to session monitor
          </a>
          <a className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-2 text-[var(--tenant-text)]" href="/teacher/intake">
            Review intake gates
          </a>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package boundary</p>
            <h3 className="mt-1 text-lg font-bold">{context.reportPackageBoundary.label}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              {context.reportPackageBoundary.decision}
            </p>
          </div>
          <StatusPill label={context.reportExportPlan.readiness} tone="warning" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Learning rows" value={String(learningRows.length)} />
          <Metric label="Support-only rows" value={String(supportRows.length)} />
          <Metric label="Allowed formats" value={context.reportExportPlan.allowedFormats.join(", ")} />
          <Metric label="Retention" value={context.reportExportPlan.retentionPolicy} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Event acceptance summary</p>
            <h3 className="mt-1 text-lg font-bold">{eventAcceptanceGate.label}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              {eventAcceptanceGate.decision}
            </p>
          </div>
          <StatusPill label={eventAcceptanceGate.status} tone={getEventAcceptanceTone(eventAcceptanceGate.status)} />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Gate items" value={String(eventAcceptanceGate.items.length)} />
          <Metric label="Blocked" value={String(eventAcceptanceBlocked)} />
          <Metric label="Warnings" value={String(eventAcceptanceWarnings)} />
        </dl>
        <div className="mt-5 grid gap-3">
          {eventAcceptanceGate.items.map((item) => (
            <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.owner}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
                </div>
                <StatusPill label={item.status} tone={item.status === "pass" ? "success" : "warning"} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{item.evidence}</p>
              <p className="mt-2 text-xs font-semibold text-[var(--tenant-text)]">Next: {item.nextStep}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report settings context</p>
            <h3 className="mt-1 text-lg font-bold">Settings context summary</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The report package may show which reviewed settings profile was active, but settings_context remains report-only and cannot create mastery, Star Dust, unlocks, or scoring changes.
            </p>
          </div>
          <StatusPill label={`${context.eventEnvelopeGate.settingsContexts.length} profile(s)`} tone="neutral" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {context.eventEnvelopeGate.settingsContexts.map((settingsContext) => (
            <section key={settingsContext.game_mode_settings_profile_id} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">game_mode_settings_profile_id</p>
              <h4 className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{settingsContext.game_mode_settings_profile_id}</h4>
              <p className="mt-2 break-words text-sm leading-6 text-[var(--tenant-muted)]">
                teacher_game_mode_settings_snapshot_id: {settingsContext.teacher_game_mode_settings_snapshot_id}
              </p>
            </section>
          ))}
        </div>
        <p className="mt-4 break-words text-xs leading-5 text-[var(--tenant-muted)]">
          progress_trigger_policy: target-language-only; support_language_progress_allowed: false; media_only_progress_allowed: false; scoring_profile_override_allowed: false; report-only settings context.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Sanitized event rows</p>
            <h3 className="mt-1 text-lg font-bold">What a teacher report package may summarize</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Rows are coded by learner slot and event effect. Sensitive raw audio, transcripts, open tutor chat, unreviewed notes, and private identifiers are not included.
            </p>
          </div>
          <StatusPill label={`${rows.length} rows`} tone={rows.length > 0 ? "success" : "neutral"} />
        </div>

        <div className="mt-5 grid gap-3">
          {rows.map((row) => (
            <section key={row.rowId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{row.eventType} / {row.gameMode}</p>
                  <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{row.summary}</h4>
                </div>
                <StatusPill label={row.effect} tone={effectTone[row.effect]} />
              </div>
              <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
                <ReportFact label="Learner slot" value={row.learnerSlot} />
                <ReportFact label="Score value" value={row.scoreValue} />
                <ReportFact label="Settings profile" value={row.settingsProfileId} />
                <ReportFact label="Raw media" value="Excluded" />
              </dl>
            </section>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <ReportRuleCard title="Included evidence" items={context.reportPackageBoundary.includedEvidence} tone="success" />
        <ReportRuleCard title="Support-only signals" items={context.reportPackageBoundary.supportOnlySignals} tone="neutral" />
        <ReportRuleCard title="Excluded sensitive fields" items={context.reportPackageBoundary.excludedSensitiveFields} tone="warning" />
      </div>
    </div>
  );
}

function getEventAcceptanceTone(status: TeacherSessionMonitorContext["eventAcceptanceGate"]["status"]) {
  return status === "ready" ? "success" : "warning";
}

function createReportPackageRows(events: GameProgressEvent[]): ReportPackageRow[] {
  return events.map((event, index) => ({
    rowId: `${event.type}:${event.occurredAt}:${index}`,
    effect: getReportEventEffect(event),
    eventType: event.type,
    gameMode: event.gameMode,
    learnerSlot: getLearnerSlot(event.studentSessionId),
    settingsProfileId: `settings-${event.gameMode}`,
    summary: summarizeReportEvent(event),
    scoreValue: getScoreValue(event),
  }));
}

function getReportEventEffect(event: GameProgressEvent): ReportEventEffect {
  const supportOnlyEventTypes: GameProgressEvent["type"][] = [
    "audio_requested",
    "media_playlist_opened",
    "media_started",
    "media_paused",
    "media_completed",
    "background_media_enabled",
    "background_media_disabled",
    "route_guidance_listened",
  ];
  const learningEvidenceEventTypes: GameProgressEvent["type"][] = [
    "entry_practice_completed",
    "game_started",
    "answer_result",
    "game_completed",
    "mastery_updated",
    "training_recommended",
  ];

  if (
    supportOnlyEventTypes.includes(event.type) ||
    event.metadata?.progressionUnlockAllowed === false ||
    event.metadata?.masteryCreditAllowed === false
  ) {
    return "support-only";
  }

  if (learningEvidenceEventTypes.includes(event.type)) {
    return "learning-evidence";
  }

  return "session-context";
}

function summarizeReportEvent(event: GameProgressEvent): string {
  if (event.type === "entry_practice_completed") {
    return `Entry practice completed with ${event.metadata?.targetLanguageItemsHeard ?? 0} target-language audio item(s) heard.`;
  }

  if (event.type === "answer_result") {
    return `Answer result recorded: ${event.metadata?.correct === true ? "correct" : "review needed"}.`;
  }

  if (event.type === "game_completed" || event.type === "mastery_updated") {
    return `Progress update recorded with ${event.metadata?.earnedStarDust ?? 0} earned points.`;
  }

  if (event.type.startsWith("media_") || event.type.startsWith("background_media")) {
    return "Media engagement recorded as support-only.";
  }

  if (event.type === "audio_requested") {
    return `Learning audio request recorded as support-only: ${event.metadata?.cueText ?? "audio cue"}.`;
  }

  if (event.type === "training_recommended") {
    return `Training Academy ${event.metadata?.trainingEventType ?? "event"} recorded.`;
  }

  return "Session event recorded.";
}

function getScoreValue(event: GameProgressEvent): string {
  const earned = event.metadata?.earnedStarDust ?? event.metadata?.starDustAwarded;
  return typeof earned === "number" ? String(earned) : "0";
}

function getLearnerSlot(studentSessionId?: string): string {
  if (!studentSessionId) {
    return "session";
  }

  const parts = studentSessionId.split(":");
  return parts[parts.length - 1] || "coded learner";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ReportFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function ReportRuleCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
