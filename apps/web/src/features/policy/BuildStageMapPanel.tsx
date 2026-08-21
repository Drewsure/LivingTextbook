import { Card, StatusPill } from "@living-textbook/ui";
import type { BuildStageMap, BuildStageStatus } from "@/data/sampleBuildStageMap";

interface BuildStageMapPanelProps {
  map: BuildStageMap;
}

const statusTone: Record<BuildStageStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
  ready: "success",
};

export function BuildStageMapPanel({ map }: BuildStageMapPanelProps) {
  const readyCount = map.lanes.filter((lane) => lane.status === "ready").length;
  const blockedCount = map.lanes.filter((lane) => lane.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Build stage map</p>
          <h3 className="mt-1 text-lg font-bold">{map.currentBuildPoint}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{map.summary}</p>
        </div>
        <StatusPill label={`${readyCount} ready / ${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Outside prototype timing</p>
        <p className="mt-1 text-sm leading-6 text-[var(--tenant-text)]">{map.zaiIntakeRule}</p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {map.lanes.map((lane) => (
          <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
              <StatusPill label={lane.status} tone={statusTone[lane.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.summary}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {lane.evidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {lane.nextStep}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}
