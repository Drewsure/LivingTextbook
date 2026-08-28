import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterLocalCompanionPackageGuardCollectionWarnings,
  validateAiGeneratedPackageWriterLocalCompanionPackageGuards,
} from "@living-textbook/content-model/src/aiPackageWriterLocalCompanionPackageGuard";

import type {
  AiGeneratedPackageWriterLocalCompanionArtifact,
  AiGeneratedPackageWriterLocalCompanionPackageGuard,
  AiGeneratedPackageWriterLocalCompanionPackageGuardStatus,
} from "@/data/sampleAiGeneratedPackageWriterLocalCompanionPackageGuard";

interface AiGeneratedPackageWriterLocalCompanionPackageGuardPanelProps {
  guards: AiGeneratedPackageWriterLocalCompanionPackageGuard[];
}

const statusTone: Record<AiGeneratedPackageWriterLocalCompanionPackageGuardStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
};

const statusLabel: Record<AiGeneratedPackageWriterLocalCompanionPackageGuardStatus, string> = {
  blocked: "Local package blocked",
  "review-only": "Review only",
};

export function AiGeneratedPackageWriterLocalCompanionPackageGuardPanel({
  guards,
}: AiGeneratedPackageWriterLocalCompanionPackageGuardPanelProps) {
  const guardBlocks = validateAiGeneratedPackageWriterLocalCompanionPackageGuards(guards);
  const guardWarnings = getAiGeneratedPackageWriterLocalCompanionPackageGuardCollectionWarnings(guards);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer local companion package guard
          </p>
          <h2 className="mt-1 text-lg font-bold">Closed local package stays locked</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This guard reviews local manifests, offline route maps, media bundle inventories, QR fallback sheets, export
            archives, and restore checkpoints before any generated package can become a closed local textbook companion.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Local companion guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No local bundle" tone="warning" />
          <StatusPill label="No offline activation" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <GuardList
          title="Local companion guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared local companion guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <GuardList
          title="Local companion guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared local companion guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {guards.map((guard) => (
          <article key={guard.guardId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{guard.packageIdPreview}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{guard.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{guard.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[guard.status]} tone={statusTone[guard.status]} />
                <StatusPill label={guard.guardState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Protected local companion artifacts</h4>
                <StatusPill label={String(guard.protectedArtifacts.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {guard.protectedArtifacts.map((artifact) => (
                  <ProtectedArtifactCard key={artifact.artifactId} artifact={artifact} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <GuardList title="Local safety checks" items={guard.localSafetyChecks} />
              <GuardList title="Offline fallback checks" items={guard.offlineFallbackChecks} />
              <GuardList title="Blocked package actions" items={guard.blockedPackageActions} tone="warning" />
              <GuardList title="Next required records" items={guard.nextRequiredRecords} />
              <GuardList title="Support-language boundary" items={guard.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ProtectedArtifactCard({ artifact }: { artifact: AiGeneratedPackageWriterLocalCompanionArtifact }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{artifact.artifactKind}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{artifact.label}</h5>
          <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{artifact.sourceRecord}</p>
        </div>
        <StatusPill label={artifact.status} tone="warning" />
      </div>
      <div className="mt-3 grid gap-3">
        <GuardList title="Required proofs" items={artifact.requiredProofs} />
        <GuardList title="Blocked actions" items={artifact.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function GuardList({
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
