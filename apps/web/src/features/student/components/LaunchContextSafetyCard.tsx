import { Card, StatusPill } from "@living-textbook/ui";

interface LaunchContextSafetyCardProps {
  title: string;
  accessLabel: string;
  reportLabel: string;
}

export function LaunchContextSafetyCard({ title, accessLabel, reportLabel }: LaunchContextSafetyCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Launch context</p>
          <h2 className="mt-1 text-lg font-bold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            This route is controlled practice. Target language unlocks progress; support language and media help practice but do not replace English activity completion.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No live classroom launch" tone="warning" />
          <StatusPill label="Target language unlocks progress" tone="success" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <LaunchContextItem label="Access" value={accessLabel} />
        <LaunchContextItem label="Reports" value={reportLabel} />
        <LaunchContextItem label="Live data" value="No production student accounts" />
      </div>
    </Card>
  );
}

function LaunchContextItem({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
