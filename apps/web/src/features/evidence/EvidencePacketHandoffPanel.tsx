import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidencePacketHandoffPackage,
  EvidencePacketHandoffRecipient,
  EvidencePacketHandoffSection,
  EvidencePacketHandoffStatus,
} from "@/data/sampleEvidencePacketHandoffPackage";

interface EvidencePacketHandoffPanelProps {
  handoffPackage: EvidencePacketHandoffPackage;
}

const statusTone: Record<EvidencePacketHandoffStatus, "success" | "warning"> = {
  "preview-ready": "success",
  blocked: "warning",
};

export function EvidencePacketHandoffPanel({ handoffPackage }: EvidencePacketHandoffPanelProps) {
  const blockedSections = handoffPackage.sections.filter((section) => section.status === "blocked").length;
  const recordCount = new Set(handoffPackage.sections.flatMap((section) => section.includedRecords)).size;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence handoff preview</p>
            <h2 className="mt-1 text-2xl font-bold">{handoffPackage.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{handoffPackage.summary}</p>
          </div>
          <StatusPill label={handoffPackage.reviewStatus} tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Sections" value={String(handoffPackage.sections.length)} tone="success" />
          <Metric label="Unique records" value={String(recordCount)} tone="success" />
          <Metric label="Blocked sections" value={String(blockedSections)} tone="warning" />
          <Metric label="Storage record" value={handoffPackage.storageRecord} tone="warning" />
        </div>

        <a
          href={handoffPackage.sourceIndexRoute}
          className="mt-5 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
        >
          Source index: {handoffPackage.sourceIndexRoute}
        </a>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Handoff sections</p>
            <h3 className="mt-1 text-lg font-bold">Evidence that would enter an export packet</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These sections define the shape of a future handoff packet while export and signing stay blocked.
            </p>
          </div>
          <StatusPill label="Export blocked" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4">
          {handoffPackage.sections.map((section) => (
            <HandoffSectionCard key={section.sectionId} section={section} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Recipient duties</p>
              <h3 className="mt-1 text-lg font-bold">Who must confirm what</h3>
            </div>
            <StatusPill label={`${handoffPackage.recipients.length} parties`} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {handoffPackage.recipients.map((recipient) => (
              <RecipientCard key={recipient.recipientId} recipient={recipient} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Live actions blocked</p>
              <h3 className="mt-1 text-lg font-bold">No export or approval workflow yet</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <ListBlock title="Blocked actions" items={handoffPackage.exportBlockedActions} />
          <ListBlock title="Next gate" items={handoffPackage.nextGate} />
        </Card>
      </div>
    </div>
  );
}

function HandoffSectionCard({ section }: { section: EvidencePacketHandoffSection }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{section.sectionId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{section.label}</h4>
          <a
            href={section.sourceRoute}
            className="mt-2 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            {section.sourceRoute}
          </a>
        </div>
        <StatusPill label={section.status} tone={statusTone[section.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ListBlock title="Included records" items={section.includedRecords} />
        <ListBlock title="Missing before export" items={section.missingBeforeExport} />
      </div>
    </article>
  );
}

function RecipientCard({ recipient }: { recipient: EvidencePacketHandoffRecipient }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-sm font-bold text-[var(--tenant-text)]">{recipient.label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{recipient.responsibility}</p>
      <ListBlock title="Blocked until" items={recipient.blockedUntil} />
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone="warning" />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "Ready" : "Gate"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
