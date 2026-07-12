import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherLibraryItem,
  TeacherLibraryItemStatus,
  TeacherPrivateLibraryPreview,
} from "@/data/sampleTeacherPrivateLibrary";

interface TeacherPrivateLibraryPanelProps {
  library: TeacherPrivateLibraryPreview;
}

const statusTone: Record<TeacherLibraryItemStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "draft-only": "warning",
  planned: "neutral",
  reviewed: "success",
};

export function TeacherPrivateLibraryPanel({ library }: TeacherPrivateLibraryPanelProps) {
  const draftCount = library.items.filter((item) => item.kind === "teacher-draft").length;
  const reviewedCount = library.items.filter((item) => item.kind === "tenant-approved-package").length;
  const blockedCount = library.items.filter((item) => item.status === "blocked").length;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher private library</p>
            <h2 className="mt-1 text-2xl font-bold">{library.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{library.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="Private-first" tone="success" />
            <StatusPill label="Public blocked" tone="warning" />
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <LibraryMetric label="Teacher private drafts" value={String(draftCount)} />
          <LibraryMetric label="Tenant-approved packages" value={String(reviewedCount)} />
          <LibraryMetric label="Blocked public lanes" value={String(blockedCount)} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Public community decision</p>
            <h3 className="mt-1 text-lg font-bold">Public community library blocked for v1</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              {library.publicCommunityDecision}
            </p>
          </div>
          <StatusPill label="Governance required" tone="warning" />
        </div>
      </Card>

      <div className="grid gap-4">
        {library.items.map((item) => (
          <LibraryItemCard key={item.itemId} item={item} />
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Governance guardrails</p>
            <h3 className="mt-1 text-lg font-bold">No student data copied</h3>
          </div>
          <StatusPill label={`${library.governanceWarnings.length} rules`} tone="neutral" />
        </div>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {library.governanceWarnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function LibraryItemCard({ item }: { item: TeacherLibraryItem }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.visibility}</p>
          <h3 className="mt-1 text-lg font-bold">{item.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            <span className="font-semibold text-[var(--tenant-text)]">Owner:</span> {item.owner}
          </p>
        </div>
        <StatusPill label={item.status} tone={statusTone[item.status]} />
      </div>

      {item.routePath ? (
        <a
          href={item.routePath}
          className="mt-4 block break-all text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
        >
          {item.routePath}
        </a>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <LibraryList title="Source lineage preserved" items={item.sourceLineage} />
        <LibraryList title="Library contents" items={item.includedOutputs} />
        <LibraryList title="Blocked actions" items={item.blockedActions} />
      </div>

      <div className="mt-3">
        <LibraryList title="Allowed actions" items={item.allowedActions} />
      </div>
    </Card>
  );
}

function LibraryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function LibraryList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
