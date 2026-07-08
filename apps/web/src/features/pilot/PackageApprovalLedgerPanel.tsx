import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PackageApprovalLedger,
  PackageApprovalRole,
  PackageApprovalSignoff,
  PackageApprovalStatus,
} from "@/data/samplePackageApprovalLedger";

interface PackageApprovalLedgerPanelProps {
  ledger: PackageApprovalLedger;
}

const statusTone: Record<PackageApprovalStatus, "neutral" | "success" | "warning"> = {
  signed: "success",
  "needs-signoff": "warning",
  blocked: "warning",
};

const statusLabel: Record<PackageApprovalStatus, string> = {
  signed: "Signed",
  "needs-signoff": "Needs sign-off",
  blocked: "Blocked",
};

const roleLabel: Record<PackageApprovalRole, string> = {
  content: "Content",
  media: "Media",
  games: "Games",
  qr: "QR",
  policy: "Policy",
  deployment: "Deployment",
  platform: "Platform",
};

export function PackageApprovalLedgerPanel({ ledger }: PackageApprovalLedgerPanelProps) {
  const signedCount = ledger.signoffs.filter((signoff) => signoff.status === "signed").length;
  const needsSignoffCount = ledger.signoffs.filter((signoff) => signoff.status === "needs-signoff").length;
  const blockedCount = ledger.signoffs.filter((signoff) => signoff.status === "blocked").length;
  const requiredOpenCount = ledger.signoffs.filter(
    (signoff) => signoff.requiredBeforePilot && signoff.status !== "signed",
  ).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package approval ledger</p>
          <h2 className="mt-1 text-lg font-bold">{ledger.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{ledger.summary}</p>
        </div>
        <StatusPill label={requiredOpenCount > 0 ? "Approvals open" : "Approved"} tone={requiredOpenCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ApprovalMetric label="Candidate" value={ledger.releaseCandidate} tone="neutral" />
        <ApprovalMetric label="Signed" value={`${signedCount}/${ledger.signoffs.length}`} tone={signedCount === ledger.signoffs.length ? "success" : "warning"} />
        <ApprovalMetric label="Needs sign-off" value={String(needsSignoffCount)} tone={needsSignoffCount > 0 ? "warning" : "success"} />
        <ApprovalMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Approval rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{ledger.approvalRule}</p>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required sign-offs</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Who must approve before a real pilot</h3>
            </div>
            <StatusPill label={`${requiredOpenCount} open`} tone={requiredOpenCount > 0 ? "warning" : "success"} />
          </div>
          <div className="mt-3 grid gap-3">
            {ledger.signoffs.map((signoff) => (
              <ApprovalCard key={signoff.signoffId} signoff={signoff} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Audit rules</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">How this becomes durable later</h3>
            </div>
            <StatusPill label="Backend agnostic" tone="success" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {ledger.auditRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

function ApprovalMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ApprovalCard({ signoff }: { signoff: PackageApprovalSignoff }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {roleLabel[signoff.role]} / Owner: {signoff.owner}
          </p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{signoff.label}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[signoff.status]} tone={statusTone[signoff.status]} />
          <StatusPill label={signoff.requiredBeforePilot ? "Required" : "Optional"} tone={signoff.requiredBeforePilot ? "warning" : "neutral"} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{signoff.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {signoff.nextStep}
      </p>
      <div className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">Cannot approve while</h5>
          <StatusPill label={String(signoff.cannotApproveWhile.length)} tone="warning" />
        </div>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {signoff.cannotApproveWhile.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
