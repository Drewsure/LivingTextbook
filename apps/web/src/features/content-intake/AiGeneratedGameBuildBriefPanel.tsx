import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedGameBuildBriefPacket,
  AiGeneratedGameBuildBriefStatus,
  AiGeneratedGameModeBuildBrief,
} from "@/data/sampleAiGeneratedGameBuildBrief";

interface AiGeneratedGameBuildBriefPanelProps {
  packets: AiGeneratedGameBuildBriefPacket[];
}

const statusTone: Record<AiGeneratedGameBuildBriefStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

export function AiGeneratedGameBuildBriefPanel({ packets }: AiGeneratedGameBuildBriefPanelProps) {
  const modeBriefCount = packets.reduce((total, packet) => total + packet.modeBriefs.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated game build brief packet</p>
          <h2 className="mt-1 text-lg font-bold">External prototype instructions</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These briefs translate generator records into scoped build instructions for external prototype work. They
            allow Z.ai or another builder to explore a mode while Codex keeps schema, parent-engine, audio, scoring,
            and integration authority.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Z.ai prototype brief" tone="neutral" />
          <StatusPill label={`${modeBriefCount} mode brief(s)`} tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={statusTone[packet.status]} />
                <StatusPill label={packet.targetBuilder} tone="neutral" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <BriefList title="Source records" items={packet.sourceRecords} />
              <BriefList title="Acceptance checks" items={packet.acceptanceChecks} />
              <BriefList title="Blocked build actions" items={packet.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode build briefs</h4>
                <StatusPill label={String(packet.modeBriefs.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {packet.modeBriefs.map((brief) => (
                  <ModeBuildBriefCard key={`${packet.packetId}-${brief.modeId}`} brief={brief} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeBuildBriefCard({ brief }: { brief: AiGeneratedGameModeBuildBrief }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{brief.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{brief.title}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{brief.prototypeScope}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={brief.parentEngine} tone="success" />
          <StatusPill label="No standalone promotion" tone="warning" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <BriefFact label="Implementation target" value={brief.implementationTarget} />
        <BriefFact label="JSON fixture" value={brief.jsonFixture} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <BriefList title="Event contract" items={brief.eventContract} />
        <BriefList title="Audio contract" items={brief.audioContract} />
        <BriefList title="Scoring contract" items={brief.scoringContract} />
        <BriefList title="Integration notes" items={brief.integrationNotes} />
        <BriefList title="Deliverables" items={brief.deliverables} />
      </div>
    </article>
  );
}

function BriefFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function BriefList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
