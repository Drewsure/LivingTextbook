import { Card, StatusPill } from "@living-textbook/ui";
import type {
  GameProgressEvent,
  MediaAsset,
  SessionSettingReadiness,
  TeacherReportExportReadiness,
  TeacherSessionControlReadiness,
} from "@living-textbook/content-model";
import type {
  TeacherReportPackageBoundary,
  TeacherReportPackageBoundaryStatus,
  TeacherSessionEventAcceptanceGate,
  TeacherSessionEventAcceptanceItemStatus,
  TeacherSessionEventAcceptanceStatus,
  TeacherSessionMonitorContext,
  TeacherSessionPilotReadinessSnapshot,
  TeacherSessionPilotReadinessStatus,
} from "@/data/sampleTeacherSessionMonitor";
import { FrontDoorTeacherReportPreview } from "@/features/access/FrontDoorTeacherReportPreview";
import { formatMode } from "@/lib/formatLabels";

interface TeacherSessionMonitorPanelProps {
  context: TeacherSessionMonitorContext;
}

const settingTone: Record<SessionSettingReadiness, "neutral" | "success" | "warning"> = {
  enabled: "success",
  disabled: "neutral",
  "requires-persistence": "warning",
  "premium-disabled": "neutral",
};

const controlTone: Record<TeacherSessionControlReadiness, "neutral" | "success" | "warning"> = {
  ready: "success",
  "requires-persistence": "warning",
  "requires-policy": "warning",
  disabled: "neutral",
};

const exportTone: Record<TeacherReportExportReadiness, "neutral" | "success" | "warning"> = {
  ready: "success",
  "demo-preview": "warning",
  "blocked-persistence": "warning",
  "blocked-policy": "warning",
};

const pilotReadinessTone: Record<TeacherSessionPilotReadinessStatus, "neutral" | "success" | "warning"> = {
  "demo-safe": "neutral",
  "pilot-blocked": "warning",
  "pilot-ready": "success",
};

const reportPackageBoundaryTone: Record<TeacherReportPackageBoundaryStatus, "neutral" | "success" | "warning"> = {
  "demo-preview": "neutral",
  "export-blocked": "warning",
  "export-ready": "success",
};

const eventAcceptanceTone: Record<TeacherSessionEventAcceptanceStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "demo-only": "neutral",
  ready: "success",
};

const eventAcceptanceItemTone: Record<TeacherSessionEventAcceptanceItemStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  pass: "success",
  warning: "warning",
};

export function TeacherSessionMonitorPanel({ context }: TeacherSessionMonitorPanelProps) {
  const unitTitle = context.unit?.unitMeta.theme ?? context.launchSession.unitKey;
  const settingsReady = context.sessionSettingErrors.length === 0;
  const controlsReady = context.sessionControlErrors.length === 0;
  const reportExportSafe = context.reportExportErrors.length === 0;
  const mediaAssets = context.contentPackage.mediaAssets ?? [];
  const mediaEvents = context.events.filter((event) =>
    event.type === "media_started" ||
    event.type === "media_playlist_opened" ||
    event.type === "media_paused" ||
    event.type === "media_completed" ||
    event.type === "background_media_enabled" ||
    event.type === "background_media_disabled",
  );
  const settingsSnapshot = createTeacherSessionSettingsSnapshot(context);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher session monitor</p>
            <h2 className="mt-1 text-2xl font-bold">{unitTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This sample report shows how a teacher-facing monitor can combine launch state, student progression, media engagement, Training Academy recovery, and speaking-practice readiness without adding a production backend yet.
            </p>
          </div>
          <StatusPill label={context.launchSession.status} tone="success" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session snapshot</p>
            <h3 className="mt-1 text-lg font-bold">Reportable classroom state</h3>
          </div>
          <StatusPill label="Sample data" tone="warning" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {context.metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{metric.label}</dt>
              <dd className="mt-1 text-lg font-bold">{metric.value}</dd>
              <dd className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{metric.note}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media engagement</p>
            <h3 className="mt-1 text-lg font-bold">Songs, video, and background media</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These events help teachers understand whether students used the unit media. They are report-only support signals and do not unlock games, award mastery, or replace target-language practice.
            </p>
          </div>
          <StatusPill label={`${mediaEvents.length} media events`} tone={mediaEvents.length > 0 ? "success" : "neutral"} />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Playlist route opens</h4>
                <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
                  Opening a playlist is visible to teachers, but it remains support-only until actual playback or learning events occur.
                </p>
              </div>
              <StatusPill
                label={`${mediaEvents.filter((event) => event.type === "media_playlist_opened").length} opened`}
                tone="neutral"
              />
            </div>
          </section>
          {mediaAssets.map((asset) => (
            <MediaEngagementAssetCard key={asset.mediaAssetId} asset={asset} events={mediaEvents} />
          ))}
        </div>
      </Card>

      <SessionPilotReadinessCard snapshot={context.pilotReadinessSnapshot} />

      <TeacherReportPackageBoundaryCard
        boundary={context.reportPackageBoundary}
        href={`/teacher/sessions/${context.launchSession.launchCode}/report-package`}
      />

      <TeacherSessionEventAcceptanceGateCard gate={context.eventAcceptanceGate} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Assigned game path</p>
            <h3 className="mt-1 text-lg font-bold">What this launch is allowed to include</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These modes come from the launch session entry mode and recommended game path. Production use still needs persisted teacher assignment settings.
            </p>
          </div>
          <StatusPill
            label={`${context.audioCoveredGameModes.length}/${context.assignedGameModes.length} audio-covered`}
            tone={context.assignedGameAudioGaps.length === 0 ? "success" : "warning"}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {context.assignedGameModes.map((mode) => (
            <span
              key={mode}
              className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]"
            >
              {formatMode(mode)} {context.audioCoveredGameModes.includes(mode) ? "(audio)" : "(audio review)"}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
          {context.assignedGameAudioGaps.length === 0
            ? "Every assigned mode in this launch has reviewed package audio coverage."
            : `Audio coverage still needs review for: ${context.assignedGameAudioGaps.map(formatMode).join(", ")}.`}
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session controls to persist</p>
            <h3 className="mt-1 text-lg font-bold">Teacher settings before classroom use</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These controls are shown as policy shape, not live classroom state. Production use needs persisted launch-session settings so teacher choices reliably reach student devices. Background media must stay below tap-to-speak learning audio and cannot unlock progress.
            </p>
          </div>
          <StatusPill label={settingsReady ? "Safety valid" : "Safety review"} tone={settingsReady ? "success" : "warning"} />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            {settingsReady ? (
              <p>The sample session settings pass the shared safety contract.</p>
            ) : (
              <div>
                <p className="font-semibold text-[var(--tenant-text)]">Settings needing safety review</p>
                <ul className="mt-2 grid gap-2">
                  {context.sessionSettingErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <p className="font-semibold text-[var(--tenant-text)]">Persistence warnings</p>
            <ul className="mt-2 grid gap-2">
              {context.sessionSettingWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {context.settings.map((setting) => (
            <section key={setting.settingId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="text-sm font-bold">{setting.label}</h4>
                <StatusPill label={setting.status} tone={settingTone[setting.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{setting.note}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Settings snapshot</p>
            <h3 className="mt-1 text-lg font-bold">Machine-readable launch-session settings</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This preview is the shape a future launch-session record can persist. It keeps classroom toggles separate from student progress, media events, and report exports.
            </p>
          </div>
          <StatusPill label="Preview only" tone="warning" />
        </div>
        <pre className="mt-5 max-h-96 overflow-auto rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-xs leading-5 text-[var(--tenant-text)]">
          {JSON.stringify(settingsSnapshot, null, 2)}
        </pre>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session lifecycle controls</p>
            <h3 className="mt-1 text-lg font-bold">Open, lock, end, and export state</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These are the teacher-owned commands that must eventually write to persisted launch-session records. They are listed here before backend selection so the real pilot does not bury classroom control in one-off UI state.
            </p>
          </div>
          <StatusPill label={controlsReady ? "Control map valid" : "Control review"} tone={controlsReady ? "success" : "warning"} />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <p className="font-semibold text-[var(--tenant-text)]">Control safety</p>
            {controlsReady ? (
              <p className="mt-2">All scaffolded lifecycle actions require a teacher role. Report export also requires accepted policy.</p>
            ) : (
              <ul className="mt-2 grid gap-2">
                {context.sessionControlErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <p className="font-semibold text-[var(--tenant-text)]">Control warnings</p>
            <ul className="mt-2 grid gap-2">
              {context.sessionControlWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {context.sessionControlActions.map((action) => (
            <section key={action.actionId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="text-sm font-bold">{action.label}</h4>
                <StatusPill label={action.status} tone={controlTone[action.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{action.note}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report export readiness</p>
            <h3 className="mt-1 text-lg font-bold">What a teacher report may contain</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Export is treated as a policy-bound report package, not a quick dump of classroom data. Core exports exclude raw learner audio and transcripts unless a future premium policy explicitly allows them.
            </p>
          </div>
          <StatusPill label={context.reportExportPlan.readiness} tone={exportTone[context.reportExportPlan.readiness]} />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <section className="rounded-lg border border-[var(--tenant-border)] p-3">
            <h4 className="text-sm font-bold">Allowed formats</h4>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {context.reportExportPlan.allowedFormats.map((format) => (
                <li key={format}>{format}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-[var(--tenant-border)] p-3">
            <h4 className="text-sm font-bold">Included scopes</h4>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {context.reportExportPlan.includedScopes.map((scope) => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-[var(--tenant-border)] p-3">
            <h4 className="text-sm font-bold">Excluded from core export</h4>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <li>{context.reportExportPlan.excludesRawAudio ? "Raw learner audio" : "Raw audio exclusion missing"}</li>
              <li>{context.reportExportPlan.excludesTranscripts ? "Learner transcripts" : "Transcript exclusion missing"}</li>
            </ul>
          </section>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <p className="font-semibold text-[var(--tenant-text)]">Export safety</p>
            {reportExportSafe ? (
              <p className="mt-2">The scaffolded export plan passes the shared safety contract.</p>
            ) : (
              <ul className="mt-2 grid gap-2">
                {context.reportExportErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            <p className="font-semibold text-[var(--tenant-text)]">Export blockers</p>
            <ul className="mt-2 grid gap-2">
              {context.reportExportWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">{context.reportExportPlan.note}</p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot readiness notes</p>
            <h3 className="mt-1 text-lg font-bold">Before this becomes live reporting</h3>
          </div>
          <StatusPill label="Needs persistence" tone="warning" />
        </div>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--tenant-muted)]">
          {context.readinessNotes.map((note) => (
            <li key={note} className="rounded-lg border border-[var(--tenant-border)] p-3">
              {note}
            </li>
          ))}
        </ul>
      </Card>

      <FrontDoorTeacherReportPreview tenant={context.tenant} progression={context.progression} events={context.events} />
    </div>
  );
}

function MediaEngagementAssetCard({
  asset,
  events,
}: {
  asset: MediaAsset;
  events: GameProgressEvent[];
}) {
  const assetEvents = events.filter((event) => event.metadata?.mediaAssetId === asset.mediaAssetId);
  const starts = assetEvents.filter((event) => event.type === "media_started").length;
  const pauses = assetEvents.filter((event) => event.type === "media_paused").length;
  const completions = assetEvents.filter((event) => event.type === "media_completed").length;
  const backgroundEvents = assetEvents.filter(
    (event) => event.type === "background_media_enabled" || event.type === "background_media_disabled",
  ).length;

  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} / {asset.type}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{asset.title}</h4>
        </div>
        <StatusPill label={asset.rightsStatus} tone={asset.rightsStatus === "unknown" ? "warning" : "success"} />
      </div>
      <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-4">
        <MediaFact label="Started" value={String(starts)} />
        <MediaFact label="Paused" value={String(pauses)} />
        <MediaFact label="Complete" value={String(completions)} />
        <MediaFact label="Background" value={String(backgroundEvents)} />
      </dl>
      <p className="mt-3 break-words text-xs leading-5 text-[var(--tenant-muted)]">
        Local bundle: {asset.localBundlePath ?? "Not configured"}
      </p>
    </section>
  );
}

function SessionPilotReadinessCard({ snapshot }: { snapshot: TeacherSessionPilotReadinessSnapshot }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session pilot readiness</p>
          <h3 className="mt-1 text-lg font-bold">{snapshot.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{snapshot.summary}</p>
        </div>
        <StatusPill label={snapshot.status} tone={pilotReadinessTone[snapshot.status]} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Current decision</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{snapshot.decision}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <SessionReadinessList title="Demo-safe signals" items={snapshot.demoSafeSignals} tone="success" />
        <SessionReadinessList title="Pilot blockers" items={snapshot.pilotBlockers} tone={snapshot.pilotBlockers.length > 0 ? "warning" : "success"} />
        <SessionReadinessList title="Before live use" items={snapshot.requiredBeforeLiveUse} tone="neutral" />
      </div>
    </Card>
  );
}

function TeacherReportPackageBoundaryCard({ boundary, href }: { boundary: TeacherReportPackageBoundary; href: string }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report package boundary</p>
          <h3 className="mt-1 text-lg font-bold">{boundary.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{boundary.summary}</p>
        </div>
        <StatusPill label={boundary.status} tone={reportPackageBoundaryTone[boundary.status]} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Export decision</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{boundary.decision}</p>
      </section>

      <div className="mt-4">
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)]"
          href={href}
        >
          Open report package preview
        </a>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {boundary.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{metric.label}</dt>
            <dd className="mt-1 text-lg font-bold">{metric.value}</dd>
            <dd className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{metric.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <SessionReadinessList title="Included evidence" items={boundary.includedEvidence} tone="success" />
        <SessionReadinessList title="Support-only signals" items={boundary.supportOnlySignals} tone="neutral" />
        <SessionReadinessList title="Excluded sensitive fields" items={boundary.excludedSensitiveFields} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Required before export</h4>
          <StatusPill label={String(boundary.requiredBeforeExport.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {boundary.requiredBeforeExport.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function TeacherSessionEventAcceptanceGateCard({ gate }: { gate: TeacherSessionEventAcceptanceGate }) {
  const blockedCount = gate.items.filter((item) => item.status === "blocked").length;
  const warningCount = gate.items.filter((item) => item.status === "warning").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Event acceptance gate</p>
          <h3 className="mt-1 text-lg font-bold">{gate.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill label={gate.status} tone={eventAcceptanceTone[gate.status]} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Current decision</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{gate.decision}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <MediaFact label="Gate items" value={String(gate.items.length)} />
        <MediaFact label="Warnings" value={String(warningCount)} />
        <MediaFact label="Blocked" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {gate.items.map((item) => (
          <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.owner}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
              </div>
              <StatusPill label={item.status} tone={eventAcceptanceItemTone[item.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {item.evidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function SessionReadinessList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function MediaFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function createTeacherSessionSettingsSnapshot(context: TeacherSessionMonitorContext) {
  const settings = context.sessionSettings;

  return {
    launch_code: settings.launchCode,
    tenant_id: settings.tenantId,
    unit_key: context.launchSession.unitKey,
    entry_mode: context.launchSession.entryMode,
    recommended_next_modes: context.launchSession.recommendedNextModes,
    audio_required: settings.audioRequired,
    assist_language: {
      enabled: settings.assistLanguage.enabled,
      visibility: settings.assistLanguage.visibility,
      unlock_allowed: settings.assistLanguage.unlockAllowed,
      mastery_credit_allowed: settings.assistLanguage.masteryCreditAllowed,
    },
    microphone_practice: {
      enabled: settings.microphonePractice.enabled,
      requires_teacher_approval: settings.microphonePractice.requiresTeacherApproval,
      approval_persisted: settings.microphonePractice.approvalPersisted,
      stores_raw_audio: settings.microphonePractice.storesRawAudio,
    },
    background_media: {
      allowed: settings.backgroundMedia.allowed,
      default_enabled: settings.backgroundMedia.defaultEnabled,
      requires_teacher_enablement: settings.backgroundMedia.requiresTeacherEnablement,
      pauses_for_learning_audio: settings.backgroundMedia.pausesForLearningAudio,
      unlock_allowed: settings.backgroundMedia.unlockAllowed,
      mastery_credit_allowed: settings.backgroundMedia.masteryCreditAllowed,
    },
    training_recovery: {
      enabled: settings.trainingRecovery.enabled,
      repeated_miss_threshold: settings.trainingRecovery.repeatedMissThreshold,
      low_completion_reward_threshold: settings.trainingRecovery.lowCompletionRewardThreshold,
      high_attempt_ratio_threshold: settings.trainingRecovery.highAttemptRatioThreshold,
      teacher_can_adjust: settings.trainingRecovery.teacherCanAdjust,
      settings_persisted: settings.trainingRecovery.settingsPersisted,
      rewards_are_deterministic: settings.trainingRecovery.rewardsAreDeterministic,
    },
    ai_tutor: {
      enabled: settings.aiTutor.enabled,
      package_tier: settings.aiTutor.packageTier,
      speech_scoring_enabled: settings.aiTutor.speechScoringEnabled,
      stores_transcript: settings.aiTutor.storesTranscript,
    },
    reporting: {
      report_progress_to_teacher: settings.reporting.reportProgressToTeacher,
      retention_policy: settings.reporting.retentionPolicy,
      export_allowed: settings.reporting.exportAllowed,
      stores_raw_audio: settings.reporting.storesRawAudio,
      stores_transcript: settings.reporting.storesTranscript,
    },
    validation: {
      safety_errors: context.sessionSettingErrors,
      persistence_warnings: context.sessionSettingWarnings,
      control_errors: context.sessionControlErrors,
      control_warnings: context.sessionControlWarnings,
      report_export_errors: context.reportExportErrors,
      report_export_warnings: context.reportExportWarnings,
    },
    updated_at: settings.updatedAt,
  };
}
