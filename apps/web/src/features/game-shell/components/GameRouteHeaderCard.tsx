import { Card, StatusPill } from "@living-textbook/ui";

interface GameRouteHeaderCardProps {
  eyebrow: string;
  title: string;
  summary: string;
  statusLabel: string;
  statusTone?: "neutral" | "success" | "warning";
  earnedStarDust?: number;
  rewardName?: string;
}

export function GameRouteHeaderCard({
  eyebrow,
  title,
  summary,
  statusLabel,
  statusTone = "success",
  earnedStarDust = 0,
  rewardName,
}: GameRouteHeaderCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-bold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">{summary}</p>
        </div>
        <StatusPill label={statusLabel} tone={statusTone} />
      </div>
      {earnedStarDust > 0 && rewardName && (
        <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">
          +{earnedStarDust} {rewardName}
        </p>
      )}
    </Card>
  );
}
