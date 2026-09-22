import { validateSourcePackageAssemblyPacket, type SourcePackageAssemblyPacket, type SourcePackageAssemblyStatus } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface SourcePackageAssemblyPanelProps {
  packets: SourcePackageAssemblyPacket[];
  evidenceFindings?: string[];
}

const statusTone: Record<SourcePackageAssemblyStatus, "neutral" | "success" | "warning"> = {
  "evidence-only": "neutral",
  "draft-candidate": "success",
  blocked: "warning",
};

export function SourcePackageAssemblyPanel({ packets, evidenceFindings = [] }: SourcePackageAssemblyPanelProps) {
  const findings = [
    ...evidenceFindings,
    ...packets.flatMap((packet) => validateSourcePackageAssemblyPacket(packet).map((error) => `${packet.packetId}: ${error}`)),
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source-to-package assembly</p>
          <h2 className="mt-1 text-lg font-bold">Canonical package draft bridge</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review-only bridge connects extraction evidence to candidate unit packages. It records lineage, media, and required handoff records without creating a draft, publishing a package, or assigning students.
          </p>
        </div>
        <StatusPill label={findings.length === 0 ? "Contract valid" : `${findings.length} finding(s)`} tone={findings.length === 0 ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AssemblyMetric label="Packets" value={String(packets.length)} />
        <AssemblyMetric label="Draft candidates" value={String(packets.filter((packet) => packet.status === "draft-candidate").length)} tone="success" />
        <AssemblyMetric label="Blocked" value={String(packets.filter((packet) => packet.status === "blocked").length)} tone="warning" />
        <AssemblyMetric label="Promotion" value="blocked" tone="warning" />
      </div>

      {findings.length > 0 ? (
        <ul className="mt-5 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {findings.map((finding, index) => (
            <li key={`source-package-assembly-finding-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">{finding}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.tenantId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{packet.sourceId} -&gt; {packet.targetPackageId}</p>
              </div>
              <StatusPill label={packet.status} tone={statusTone[packet.status]} />
            </div>

            <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <AssemblyFact label="Extraction packet" value={packet.extractionPacketId} />
              <AssemblyFact label="Candidate units" value={String(packet.candidateUnitKeys.length)} />
              <AssemblyFact label="Candidate media" value={String(packet.candidateMediaAssetIds.length)} />
              <AssemblyFact label="Approval ledger linked" value={packet.approvalLedgerLinked ? packet.approvalLedgerId : "Missing"} />
              <AssemblyFact label="Teacher handoff" value={packet.teacherReviewHandoffPresent ? "Present" : "Missing"} />
            </dl>

            <div className="mt-4 grid gap-2">
              <AssemblyFlag label="Draft creation" value="Blocked" />
              <AssemblyFlag label="Approval capture" value="Blocked" />
              <AssemblyFlag label="Student-facing payload" value="Blocked" />
              <AssemblyFlag label="Package promotion" value="Blocked" />
            </div>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Open blockers</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
                {packet.blockers.map((blocker, index) => <li key={`${packet.packetId}-blocker-${index}`}>{blocker}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AssemblyMetric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AssemblyFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-2"><dt className="font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words font-semibold text-[var(--tenant-text)]">{value}</dd></div>;
}

function AssemblyFlag({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--tenant-border)] px-3 py-2 text-sm"><span className="text-[var(--tenant-muted)]">{label}</span><span className="font-semibold text-[var(--tenant-text)]">{value}</span></div>;
}
