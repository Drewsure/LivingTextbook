import { Card, StatusPill } from "@living-textbook/ui";
import type { ClassRosterPlan, LearnerIdentityMode, RosterReadiness } from "@living-textbook/content-model/src/classRoster";

interface ClassRosterReadinessPanelProps {
  plans: ClassRosterPlan[];
  errors: string[];
  warnings: string[];
}

const readinessTone: Record<RosterReadiness, "neutral" | "success" | "warning"> = {
  "demo-only": "neutral",
  "requires-policy": "warning",
  "requires-persistence": "warning",
  "pilot-ready": "success",
};

const identityLabels: Record<LearnerIdentityMode, string> = {
  "anonymous-practice": "Anonymous practice",
  "teacher-issued-code": "Teacher-issued code",
  "school-roster-id": "School roster id",
  "family-managed": "Family-managed",
};

export function ClassRosterReadinessPanel({ plans, errors, warnings }: ClassRosterReadinessPanelProps) {
  const learnerSlots = plans.reduce((total, plan) => total + plan.slots.length, 0);
  const exportReadySlots = plans.reduce(
    (total, plan) => total + plan.slots.filter((slot) => slot.canExportProgress).length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Class roster identity boundary</p>
          <h2 className="mt-1 text-lg font-bold">Teacher reports without premature accounts</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Roster plans define how a learner is recognized for launch codes, teacher summaries, exports, and local deployments. The foundation keeps identity lightweight: codes and progress summaries are allowed, while names, family contact, raw audio, and transcripts stay outside the core roster until policy and persistence are chosen.
          </p>
        </div>
        <StatusPill label={errors.length > 0 ? "Roster review" : `${learnerSlots} learner slots`} tone={errors.length > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <RosterSummaryMetric label="Roster plans" value={String(plans.length)} />
        <RosterSummaryMetric label="Learner slots" value={String(learnerSlots)} />
        <RosterSummaryMetric label="Export-ready slots" value={String(exportReadySlots)} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <RosterNotice title="Validation" items={errors} emptyLabel="Roster contracts are structurally valid." />
        <RosterNotice title="Open warnings" items={warnings} emptyLabel="No roster warnings are open." />
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.rosterId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.tenantId} / {identityLabels[plan.identityMode]}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">
                  {plan.packageId} / {plan.launchCode}
                </p>
              </div>
              <StatusPill label={plan.readiness} tone={readinessTone[plan.readiness]} />
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">{plan.note}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {plan.slots.map((slot) => (
                <section key={slot.slotId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{slot.label}</h4>
                      <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{slot.userCode}</p>
                    </div>
                    <StatusPill label={slot.canExportProgress ? "Export concept" : "Session only"} tone={slot.canExportProgress ? "success" : "neutral"} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{slot.note}</p>
                  <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-2">
                    <RosterFlag label="Names" value={slot.storesRealName ? "Stores" : "Not stored"} />
                    <RosterFlag label="Family contact" value={slot.storesFamilyContact ? "Stores" : "Not stored"} />
                    <RosterFlag label="Raw audio" value={slot.storesRawAudio ? "Stores" : "Not stored"} />
                    <RosterFlag label="Transcript" value={slot.storesTranscript ? "Stores" : "Not stored"} />
                  </dl>
                </section>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <section className="rounded-lg border border-[var(--tenant-border)] p-3">
                <p className="text-sm font-bold text-[var(--tenant-text)]">Data boundary</p>
                <div className="mt-3 grid gap-2">
                  {plan.dataBoundaries.map((boundary) => (
                    <div key={boundary.field} className="rounded-lg bg-white/80 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[var(--tenant-text)]">{boundary.field}</p>
                        <StatusPill label={boundary.allowedInCoreDemo ? "Core demo" : "Deferred"} tone={boundary.allowedInCoreDemo ? "success" : "neutral"} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{boundary.note}</p>
                      <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                        {boundary.requiresSchoolPolicy ? "Policy required" : "No policy gate"} / {boundary.requiresPersistence ? "Persistence required" : "No persistence gate"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--tenant-border)] p-3">
                <p className="text-sm font-bold text-[var(--tenant-text)]">Required before pilot</p>
                {plan.requiredBeforePilot.length > 0 ? (
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                    {plan.requiredBeforePilot.map((requirement, index) => (
                      <li key={`${plan.rosterId}-required-${index}-${requirement}`}>{requirement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">No roster blockers remain for pilot use.</p>
                )}
              </section>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RosterNotice({ title, items, emptyLabel }: { title: string; items: string[]; emptyLabel: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-[var(--tenant-text)]">{title}</p>
        <StatusPill label={items.length > 0 ? `${items.length} open` : "Clear"} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item, index) => (
            <li key={`${title}-${index}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}

function RosterSummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function RosterFlag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
