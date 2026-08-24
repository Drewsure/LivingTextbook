import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiVerifierSubmissionPacketCollectionWarnings,
  validateAiVerifierSubmissionPackets,
} from "@living-textbook/content-model/src/aiVerifierSubmissionPacket";
import type { AiVerifierCheckStatus, AiVerifierSubmissionPacket } from "@/data/sampleAiVerifierSubmissionPacket";

interface AiVerifierSubmissionPacketPanelProps {
  packets: AiVerifierSubmissionPacket[];
}

const checkTone: Record<AiVerifierCheckStatus, "neutral" | "success" | "warning"> = {
  "ready-for-review": "success",
  blocked: "warning",
  "draft-only": "neutral",
};

export function AiVerifierSubmissionPacketPanel({ packets }: AiVerifierSubmissionPacketPanelProps) {
  const guardBlocks = validateAiVerifierSubmissionPackets(packets);
  const guardWarnings = getAiVerifierSubmissionPacketCollectionWarnings(packets);
  const blockedCheckCount = packets.reduce(
    (total, packet) => total + packet.checks.filter((check) => check.status === "blocked").length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI verifier submission packet</p>
          <h2 className="mt-1 text-lg font-bold">Vision/reasoning preflight</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The verifier packet shows the checks required before a generated game package can move from draft output to
            teacher approval. Submission remains blocked until durable storage and review workflows exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="AI verifier packet guard active" tone="warning" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone="warning" />
          <StatusPill label="Submit verifier packet blocked" tone="warning" />
          <StatusPill label={`${blockedCheckCount} blocked check(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <VerifierList
          title="AI verifier packet guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared verifier packet guard blocks detected."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <VerifierList
          title="AI verifier packet guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared verifier packet guard warnings detected."]}
        />
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
              <StatusPill label={packet.submissionState} tone="warning" />
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <VerifierMetric label="Verifier version" value={packet.verifierVersion} />
              <VerifierMetric label="Required packets" value={String(packet.requiredPackets.length)} />
            </dl>

            <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              <VerifierList title="Required verifier packets" items={packet.requiredPackets} />
              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--tenant-text)]">Verifier checks</h4>
                  <StatusPill label={String(packet.checks.length)} tone="warning" />
                </div>
                <div className="mt-3 grid gap-3">
                  {packet.checks.map((check) => (
                    <VerifierCheckCard key={check.checkId} check={check} />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <VerifierList title="Blocked verifier actions" items={packet.blockedActions} tone="warning" />
              <VerifierList title="Next requirements" items={packet.nextRequirements} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function VerifierCheckCard({ check }: { check: AiVerifierSubmissionPacket["checks"][number] }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h5 className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</h5>
        <StatusPill label={check.status} tone={checkTone[check.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <VerifierFact label="Evidence" value={check.evidence} />
        <VerifierFact label="Rejection rule" value={check.rejectionRule} />
      </dl>
    </article>
  );
}

function VerifierMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function VerifierFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function VerifierList({
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
