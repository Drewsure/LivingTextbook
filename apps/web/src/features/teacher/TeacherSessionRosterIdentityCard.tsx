import { Card, StatusPill } from "@living-textbook/ui";
import type { LearnerIdentityMode, RosterReadiness } from "@living-textbook/content-model/src/classRoster";
import { getClassRosterWarnings, validateClassRosterPlan } from "@living-textbook/content-model/src/classRoster";
import { findSampleClassRosterPlan } from "@/data/sampleClassRosterPlans";

interface TeacherSessionRosterIdentityCardProps {
  launchCode: string;
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

export function TeacherSessionRosterIdentityCard({ launchCode }: TeacherSessionRosterIdentityCardProps) {
  const rosterPlan = findSampleClassRosterPlan(launchCode);

  if (!rosterPlan) {
    return (
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Roster identity</p>
            <h3 className="mt-1 text-lg font-bold">No roster plan attached</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This launch code does not yet have a roster identity plan, so it should remain a preview route only.
            </p>
          </div>
          <StatusPill label="Needs roster" tone="warning" />
        </div>
      </Card>
    );
  }

  const errors = validateClassRosterPlan(rosterPlan);
  const warnings = getClassRosterWarnings(rosterPlan);
  const exportReadyCount = rosterPlan.slots.filter((slot) => slot.canExportProgress).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Roster identity</p>
          <h3 className="mt-1 text-lg font-bold">{rosterPlan.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This session uses coded learner slots for reporting. It does not imply production accounts, real learner names, stored voice recordings, or stored speech transcripts.
          </p>
        </div>
        <StatusPill label={rosterPlan.readiness} tone={readinessTone[rosterPlan.readiness]} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RosterMetric label="Identity mode" value={identityLabels[rosterPlan.identityMode]} />
        <RosterMetric label="Learner slots" value={String(rosterPlan.slots.length)} />
        <RosterMetric label="Export concepts" value={String(exportReadyCount)} />
        <RosterMetric label="Validation" value={errors.length === 0 ? "Clear" : `${errors.length} open`} />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rosterPlan.slots.map((slot) => (
          <section key={slot.slotId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">{slot.label}</h4>
                <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{slot.userCode}</p>
              </div>
              <StatusPill label={slot.canExportProgress ? "Report preview" : "Session only"} tone={slot.canExportProgress ? "success" : "neutral"} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{slot.note}</p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <RosterNotice title="Validation" items={errors} emptyLabel="Roster identity passes the shared validation contract." />
        <RosterNotice title="Policy and persistence notes" items={warnings} emptyLabel="No roster warnings are open." />
      </div>
    </Card>
  );
}

function RosterMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function RosterNotice({ title, items, emptyLabel }: { title: string; items: string[]; emptyLabel: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-[var(--tenant-text)]">{title}</p>
        <StatusPill label={items.length > 0 ? `${items.length} open` : "Clear"} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">{emptyLabel}</p>
      )}
    </section>
  );
}
