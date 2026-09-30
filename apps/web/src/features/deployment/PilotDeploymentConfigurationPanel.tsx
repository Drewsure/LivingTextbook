import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotDeploymentConfigurationCheckStatus,
  PilotDeploymentConfigurationSnapshot,
} from "@/server/delivery/pilotDeploymentConfiguration";

const statusTone: Record<PilotDeploymentConfigurationCheckStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  blocked: "warning",
  manual: "warning",
  optional: "neutral",
};

export function PilotDeploymentConfigurationPanel({
  snapshots,
}: {
  snapshots: PilotDeploymentConfigurationSnapshot[];
}) {
  const blockedCount = snapshots.reduce((total, snapshot) => total + snapshot.blockers.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Operator configuration preflight</p>
          <h2 className="mt-1 text-lg font-bold">Server configuration for the named publisher</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This read-only check tells the operator whether the server is shaped for each delivery path. It never returns
            secret values, enables a write gate, assembles a package, changes a QR route, or activates students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${blockedCount} open blocker${blockedCount === 1 ? "" : "s"}`} tone={blockedCount > 0 ? "warning" : "success"} />
          <StatusPill label="No secret values" tone="success" />
          <StatusPill label="No side effects" tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {snapshots.map((snapshot) => (
          <section key={`${snapshot.tenantId}-${snapshot.mode}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{snapshot.tenantId}</p>
                <h3 className="mt-1 text-base font-bold">{labelForMode(snapshot.mode)}</h3>
              </div>
              <StatusPill label={snapshot.status} tone={snapshot.ready ? "success" : "warning"} />
            </div>

            <dl className="mt-4 grid gap-2 text-sm">
              <Fact label="Checks" value={String(snapshot.checks.length)} />
              <Fact label="Configured secrets" value={String(snapshot.configuredSecretNames.length)} />
              <Fact label="Writes enabled" value={snapshot.writesEnabled ? "Yes" : "No"} />
              <Fact label="Student activation" value={snapshot.studentActivationAllowed ? "Yes" : "No"} />
            </dl>

            <div className="mt-4 grid gap-2">
              {snapshot.checks.map((check) => (
                <article key={check.checkId} className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-bold">{check.label}</h4>
                    <StatusPill label={check.status} tone={statusTone[check.status]} />
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{check.evidence}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--tenant-text)]">Next: {check.nextAction}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}

function labelForMode(mode: string): string {
  if (mode === "hosted-pwa") return "Hosted PWA";
  if (mode === "closed-local") return "Closed local companion";
  return "Hybrid hosted + local";
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}
