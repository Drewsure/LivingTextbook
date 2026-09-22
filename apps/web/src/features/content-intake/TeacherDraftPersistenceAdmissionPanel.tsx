import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPersistenceAdmissionPreflight } from "@living-textbook/content-model";

export function TeacherDraftPersistenceAdmissionPanel({ preflight, errors = [] }: { preflight: TeacherDraftPersistenceAdmissionPreflight; errors?: string[] }) {
  return <Card>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft persistence admission</p><h2 className="mt-1 text-lg font-bold">Tenant-owned storage preflight</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This proves what a future provider-specific draft record must bind. It is review-only and deliberately has no save, upload, assignment, or promotion control.</p></div>
      <div className="flex flex-wrap gap-2"><StatusPill label={preflight.status} tone="warning" /><StatusPill label="Provider-neutral" tone="neutral" /><StatusPill label="Writes blocked" tone="warning" /></div>
    </div>
    <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Tenant" value={preflight.tenantId} /><Metric label="Draft" value={preflight.draftId} /><Metric label="Visibility" value={preflight.visibility} /><Metric label="Owner bound" value={preflight.ownerIdentityBound ? "Yes" : "Not yet"} /></dl>
    {errors.length > 0 ? <ul className="mt-5 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{errors.map((error, index) => <li key={`teacher-draft-persistence-error-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">{error}</li>)}</ul> : null}
    <div className="mt-5 grid gap-4 lg:grid-cols-3"><List title="Required records" items={preflight.requiredRecords} /><List title="Required evidence" items={preflight.requiredEvidence} /><List title="Blocked actions" items={preflight.blockedActions} /></div>
    <div className="mt-5 grid gap-4 lg:grid-cols-2"><List title="Current blockers" items={preflight.blockers} warning /><List title="Future admission steps" items={preflight.nextSteps} /></div>
  </Card>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>; }
function List({ title, items, warning = false }: { title: string; items: string[]; warning?: boolean }) { return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className={`mt-3 grid gap-2 text-sm leading-6 ${warning ? "text-[var(--tenant-text)]" : "text-[var(--tenant-muted)]"}`}>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul></section>; }
