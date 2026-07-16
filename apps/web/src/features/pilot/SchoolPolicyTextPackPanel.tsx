import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolPolicyTextClause,
  SchoolPolicyTextPack,
  SchoolPolicyTextPackStatus,
} from "@/data/sampleSchoolPolicyTextPack";

interface SchoolPolicyTextPackPanelProps {
  pack: SchoolPolicyTextPack;
}

const statusLabel: Record<SchoolPolicyTextPackStatus, string> = {
  blocked: "Blocked",
  "needs-review": "Needs review",
  "ready-to-draft": "Ready to draft",
};

const statusTone: Record<SchoolPolicyTextPackStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "needs-review": "warning",
  "ready-to-draft": "success",
};

export function SchoolPolicyTextPackPanel({ pack }: SchoolPolicyTextPackPanelProps) {
  const blockedClauseCount = pack.clauses.filter((clause) => clause.status === "blocked").length;
  const requiredTextCount = pack.clauses.reduce((count, clause) => count + clause.requiredText.length, 0);
  const blockedActionCount =
    pack.blockedActions.length + pack.clauses.reduce((count, clause) => count + clause.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School policy text version pack</p>
          <h2 className="mt-1 text-lg font-bold">{pack.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{pack.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={pack.policyStatus} tone="warning" />
          <StatusPill label={pack.versionLabel} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PolicyTextMetric label="Policy clauses" value={String(pack.clauses.length)} tone="neutral" />
        <PolicyTextMetric label="Blocked clauses" value={String(blockedClauseCount)} tone="warning" />
        <PolicyTextMetric label="Required text items" value={String(requiredTextCount)} tone="warning" />
        <PolicyTextMetric label="Blocked actions" value={String(blockedActionCount)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{pack.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Versioned policy text is required before acceptance can be designed. This pack cannot be accepted,
              signed, exported, or used to activate storage or launch a classroom.
            </p>
          </div>
          <StatusPill label="Versioned policy text only" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {pack.clauses.map((clause) => (
          <SchoolPolicyTextClauseCard key={clause.clauseId} clause={clause} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <PolicyTextList title="Minimum version fields" items={pack.minimumVersionFields} badge={String(pack.minimumVersionFields.length)} />
        <PolicyTextList title="Blocked actions" items={pack.blockedActions} badge="Blocked" />
        <PolicyTextList title="Review rules" items={pack.reviewRules} badge="Rules" />
      </div>
    </Card>
  );
}

function SchoolPolicyTextClauseCard({ clause }: { clause: SchoolPolicyTextClause }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {clause.owner} / {clause.source}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{clause.label}</h3>
        </div>
        <StatusPill label={statusLabel[clause.status]} tone={statusTone[clause.status]} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <PolicyTextMiniList title="Required text" items={clause.requiredText} tone="neutral" />
        <PolicyTextMiniList title="Review notes" items={clause.reviewNotes} tone="neutral" />
        <PolicyTextMiniList title="Blocked actions" items={clause.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function PolicyTextMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function PolicyTextMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <PolicyTextBullets items={items} />
    </section>
  );
}

function PolicyTextList({ title, items, badge }: { title: string; items: string[]; badge: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={badge} tone="warning" />
      </div>
      <PolicyTextBullets items={items} />
    </section>
  );
}

function PolicyTextBullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
      {items.map((item) => (
        <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
