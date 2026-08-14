import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiExternalPrototypeTaskPacketCollectionWarnings,
  validateAiExternalPrototypeTaskPackets,
} from "@living-textbook/content-model/src/aiExternalPrototypeTaskPacket";
import type {
  AiExternalPrototypeTask,
  AiExternalPrototypeTaskPacket,
  AiExternalPrototypeTaskPacketStatus,
  AiExternalPrototypeTaskStatus,
  AiExternalPrototypeTaskSurface,
} from "@/data/sampleAiExternalPrototypeTaskPacket";

interface AiExternalPrototypeTaskPacketPanelProps {
  packets: AiExternalPrototypeTaskPacket[];
}

const packetStatusTone: Record<AiExternalPrototypeTaskPacketStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const taskStatusTone: Record<AiExternalPrototypeTaskStatus, "neutral" | "success" | "warning"> = {
  "copy-ready-preview": "success",
  "needs-contract": "warning",
  deferred: "neutral",
};

const taskStatusLabel: Record<AiExternalPrototypeTaskStatus, string> = {
  "copy-ready-preview": "Copy-ready preview",
  "needs-contract": "Needs contract",
  deferred: "Deferred",
};

const surfaceTone: Record<AiExternalPrototypeTaskSurface, "neutral" | "success" | "warning"> = {
  "dom-reference": "success",
  "phaser-wrapper": "warning",
  "hybrid-wrapper": "neutral",
  defer: "neutral",
};

const surfaceLabel: Record<AiExternalPrototypeTaskSurface, string> = {
  "dom-reference": "DOM reference required",
  "phaser-wrapper": "Phaser wrapper candidate",
  "hybrid-wrapper": "Hybrid wrapper candidate",
  defer: "Deferred",
};

export function AiExternalPrototypeTaskPacketPanel({ packets }: AiExternalPrototypeTaskPacketPanelProps) {
  const guardBlocks = validateAiExternalPrototypeTaskPackets(packets);
  const guardWarnings = getAiExternalPrototypeTaskPacketCollectionWarnings(packets);
  const taskCount = packets.reduce((total, packet) => total + packet.tasks.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI external prototype task packet</p>
          <h2 className="mt-1 text-lg font-bold">Copy-ready task brief preview</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel prepares strict instructions for outside prototype builders such as Z.ai. It is a review-only
            packet: no live handoff, app file writes, route creation, scoring authority, package assembly, or student
            assignment is available from here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="External task guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${taskCount} task(s)`} tone="success" />
          <StatusPill label="No live handoff" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <TaskList
          title="External task guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared external task packet guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <TaskList
          title="External task guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared external task packet guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.buildBriefPacketId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={packetStatusTone[packet.status]} />
                <StatusPill label={packet.targetBuilder} tone="neutral" />
                <StatusPill label={packet.handoffState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <TaskList title="Source records" items={packet.sourceRecords} />
              <TaskList title="Permitted handoff contents" items={packet.permittedHandoffContents} />
              <TaskList title="Required before handoff" items={packet.requiredBeforeHandoff} />
              <TaskList title="Blocked handoff actions" items={packet.blockedHandoffActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">External builder task handoff</h4>
                <StatusPill label="Drewsure/ministar-lab only" tone="warning" />
              </div>
              <div className="mt-3 grid gap-3">
                {packet.tasks.map((task) => (
                  <ExternalPrototypeTaskCard key={`${packet.packetId}-${task.taskId}`} task={task} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ExternalPrototypeTaskCard({ task }: { task: AiExternalPrototypeTask }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {task.modeId} / {task.parentEngine}
          </p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{task.title}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{task.builderCommandSummary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={surfaceLabel[task.recommendedSurface]} tone={surfaceTone[task.recommendedSurface]} />
          <StatusPill label={taskStatusLabel[task.status]} tone={taskStatusTone[task.status]} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <TaskFact label="Repository scope" value={task.repositoryScope} />
        <TaskFact label="Output folder rule" value={task.outputFolderRule} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <TaskList title="Fixture requirements" items={task.fixtureRequirements} />
        <TaskList title="Event requirements" items={task.eventRequirements} />
        <TaskList title="Audio requirements" items={task.audioRequirements} />
        <TaskList title="Scoring requirements" items={task.scoringRequirements} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <TaskList title="Deliverables" items={task.deliverables} />
        <TaskList title="Return evidence" items={task.returnEvidence} />
        <TaskList title="Blocked task actions" items={task.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function TaskFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function TaskList({
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
