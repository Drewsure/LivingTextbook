import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidencePacketHandoffPackage,
  EvidencePacketHandoffRecipient,
  EvidencePacketHandoffSection,
  EvidencePacketHandoffStatus,
} from "@/data/sampleEvidencePacketHandoffPackage";

interface EvidencePacketHandoffPanelProps {
  handoffPackage: EvidencePacketHandoffPackage;
  validationErrors: string[];
}

const statusTone: Record<EvidencePacketHandoffStatus, "success" | "warning"> = {
  "preview-ready": "success",
  blocked: "warning",
};

export function EvidencePacketHandoffPanel({ handoffPackage, validationErrors }: EvidencePacketHandoffPanelProps) {
  const blockedSections = handoffPackage.sections.filter((section) => section.status === "blocked").length;
  const recordCount = new Set(handoffPackage.sections.flatMap((section) => section.includedRecords)).size;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence handoff preview</p>
            <h2 className="mt-1 text-2xl font-bold">{handoffPackage.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{handoffPackage.summary}</p>
          </div>
          <StatusPill label={handoffPackage.reviewStatus} tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Sections" value={String(handoffPackage.sections.length)} tone="success" />
          <Metric label="Unique records" value={String(recordCount)} tone="success" />
          <Metric label="Blocked sections" value={String(blockedSections)} tone="warning" />
          <Metric label="Storage record" value={handoffPackage.storageRecord} tone="warning" />
        </div>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Canonical package binding</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Evidence handoff identity is scoped to the pilot package</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This handoff uses the same package identity as the pilot release evidence. It remains a review packet and cannot export, sign, publish, or promote content.
              </p>
            </div>
            <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Package" value={handoffPackage.packageId} />
            <Fact label="Route key" value={handoffPackage.routeKey} />
            <Fact label="Tenant" value={handoffPackage.tenantId} />
            <Fact label="Export" value="Blocked" />
          </dl>
          {validationErrors.length > 0 ? (
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {validationErrors.map((error, index) => (
                <li key={`evidence-handoff-validation-${index}-${error}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <a
          href={handoffPackage.sourceIndexRoute}
          className="mt-5 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
        >
          Source index: {handoffPackage.sourceIndexRoute}
        </a>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Attachment-to-storage reconciliation</p>
            <h3 className="mt-1 text-lg font-bold">Every attachment has a storage policy gate, not a storage destination</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This review-only reconciliation joins asset packets to the hosted, closed-local, and hybrid candidates without selecting a provider or creating a file location.
            </p>
          </div>
          <StatusPill label={handoffPackage.storageReconciliation.status} tone="warning" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Asset packets" value={String(handoffPackage.storageReconciliation.assetPacketIds.length)} />
          <Fact label="Attachments" value={String(handoffPackage.storageReconciliation.attachmentIds.length)} />
          <Fact label="Storage candidates" value={String(handoffPackage.storageReconciliation.candidateIds.length)} />
          <Fact label="Upload" value="Blocked" />
        </dl>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <ListBlock title="Unresolved policy gates" items={handoffPackage.storageReconciliation.unresolvedGates} />
          <ListBlock title="Blocked reconciliation actions" items={handoffPackage.storageReconciliation.blockedActions} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Storage selection review packet</p>
            <h3 className="mt-1 text-lg font-bold">Compare deployment options before any provider is selected</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This reuses the provider-neutral persistence preflight for the exact evidence package. It compares cost, deployment fit, tenant policy, backup, retention, and rollback evidence while keeping selection and file operations blocked.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="Blocked review" tone="warning" />
            <StatusPill label="No provider selected" tone="warning" />
          </div>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Preflight" value={handoffPackage.storageSelectionPreflight.preflightId} />
          <Fact label="Candidates" value={String(handoffPackage.storageSelectionPreflight.candidates.length)} />
          <Fact label="Open criteria" value={String(handoffPackage.storageSelectionPreflight.selectionEvidence.openCriterionCount)} />
          <Fact label="Selection" value="Human policy review required" />
        </dl>
        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review status</p>
              <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">No provider selected</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                A recommendation is comparison evidence only. It cannot create a bucket, folder, archive, signed URL, upload path, download path, migration, retention clock, or release mutation.
              </p>
            </div>
            <StatusPill label={`${handoffPackage.storageSelectionPreflight.selectionEvidence.sourceRecords.length} source records`} tone="success" />
          </div>
          <div className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-3">
            <p><strong>Backend matrix:</strong> {handoffPackage.storageSelectionPreflight.backendMatrixId}</p>
            <p><strong>Storage gate:</strong> {handoffPackage.storageSelectionPreflight.evidenceStorageGateId}</p>
            <p><strong>Implementation readiness:</strong> {handoffPackage.storageSelectionPreflight.implementationReadinessId}</p>
          </div>
        </section>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {handoffPackage.storageSelectionPreflight.candidates.map((candidate) => (
            <article key={candidate.candidateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{candidate.deploymentFit} / {candidate.costPosture}</p>
                  <h4 className="mt-1 text-base font-bold">{candidate.label}</h4>
                </div>
                {candidate.candidateId === handoffPackage.storageSelectionPreflight.recommendedCandidateId ? (
                  <StatusPill label="Comparison recommendation" tone="success" />
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{candidate.whiteLabelFit}</p>
              <ListBlock title="Required evidence" items={candidate.requiredEvidence} />
              <ListBlock title="Unresolved risks" items={candidate.unresolvedRisks} />
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <ListBlock title="Open selection criteria" items={handoffPackage.storageSelectionPreflight.selectionEvidence.criteria.filter((criterion) => criterion.status !== "passed").map((criterion) => `${criterion.criterionId} · ${criterion.owner}`)} />
          <ListBlock title="Blocked selection actions" items={handoffPackage.storageSelectionPreflight.blockedActions} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Asset evidence lineage</p>
            <h3 className="mt-1 text-lg font-bold">Every image, audio, and video candidate keeps its own evidence packet</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The handoff carries metadata-only attachment packets for reviewed assets. Checksums and source lineage remain visible to reviewers while raw bytes, URLs, downloads, promotion, and student use stay blocked.
            </p>
          </div>
          <StatusPill label={`${handoffPackage.assetEvidencePackets.length} packet(s)`} tone="warning" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {handoffPackage.assetEvidencePackets.map((packet) => (
            <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="break-words text-sm font-bold text-[var(--tenant-text)]">{packet.packetId}</p>
                <StatusPill label={packet.reviewStatus} tone="warning" />
              </div>
              <dl className="mt-4 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-2">
                <Fact label="Tenant" value={packet.tenantId} />
                <Fact label="Package" value={packet.packageId} />
                <Fact label="Attachments" value={String(packet.attachments.length)} />
                <Fact label="Student use" value="Blocked" />
              </dl>
              <ul className="mt-4 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
                {packet.attachments.map((attachment) => (
                  <li key={attachment.attachmentId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                    <span className="font-semibold text-[var(--tenant-text)]">{attachment.assetId}</span>
                    <span className="ml-2">{attachment.file.kind} · {attachment.file.mimeType} · checksum captured</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Attachment storage readiness lineage</p>
            <h3 className="mt-1 text-lg font-bold">Storage candidates travel with the handoff, not the files</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Hosted, closed-local, and hybrid candidates remain provider-neutral readiness evidence. No provider, bucket, folder, signed URL, retention clock, or release mutation is created here.
            </p>
          </div>
          <StatusPill label={handoffPackage.storageReadinessBinding.status} tone="warning" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Tenant" value={handoffPackage.storageReadinessBinding.tenantId} />
          <Fact label="Package" value={handoffPackage.storageReadinessBinding.packageId} />
          <Fact label="Readiness plan" value={handoffPackage.storageReadinessBinding.planId} />
          <Fact label="Selection gate" value={handoffPackage.storageReadinessBinding.selectionGateId} />
        </dl>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <ListBlock title="Storage candidates" items={handoffPackage.storageReadinessBinding.candidateIds} />
          <ListBlock title="Policy gates" items={handoffPackage.storageReadinessBinding.policyGates} />
          <ListBlock title="Blocked storage actions" items={handoffPackage.storageReadinessBinding.blockedActions} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Upload admission lineage</p>
            <h3 className="mt-1 text-lg font-bold">Quarantine evidence bindings carried into handoff</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These bindings preserve the exact tenant, package, quarantine, admission, and evidence-packet identities. They are evidence references only and cannot promote the source.
            </p>
          </div>
          <StatusPill label="Promotion blocked" tone="warning" />
        </div>
        <div className="mt-5 grid gap-4">
          {handoffPackage.admissionBindings.map((binding) => (
            <article key={binding.bindingId} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{binding.bindingId}</p>
                <StatusPill label={binding.decision} tone={binding.decision === "evidence-ready" ? "success" : "warning"} />
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Fact label="Tenant" value={binding.tenantId} />
                <Fact label="Package" value={binding.packageId} />
                <Fact label="Quarantine" value={binding.quarantineId} />
                <Fact label="Admission" value={binding.admissionId} />
                <Fact label="Evidence packet" value={binding.evidencePacketId} />
                <Fact label="Student use" value="Blocked" />
              </dl>
              <ListBlock title="Admission blockers" items={binding.blockers} />
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Handoff sections</p>
            <h3 className="mt-1 text-lg font-bold">Evidence that would enter an export packet</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These sections define the shape of a future handoff packet while export and signing stay blocked.
            </p>
          </div>
          <StatusPill label="Export blocked" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4">
          {handoffPackage.sections.map((section) => (
            <HandoffSectionCard key={section.sectionId} section={section} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Recipient duties</p>
              <h3 className="mt-1 text-lg font-bold">Who must confirm what</h3>
            </div>
            <StatusPill label={`${handoffPackage.recipients.length} parties`} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {handoffPackage.recipients.map((recipient) => (
              <RecipientCard key={recipient.recipientId} recipient={recipient} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Live actions blocked</p>
              <h3 className="mt-1 text-lg font-bold">No export or approval workflow yet</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <ListBlock title="Blocked actions" items={handoffPackage.exportBlockedActions} />
          <ListBlock title="Next gate" items={handoffPackage.nextGate} />
        </Card>
      </div>
    </div>
  );
}

function HandoffSectionCard({ section }: { section: EvidencePacketHandoffSection }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{section.sectionId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{section.label}</h4>
          <a
            href={section.sourceRoute}
            className="mt-2 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            {section.sourceRoute}
          </a>
        </div>
        <StatusPill label={section.status} tone={statusTone[section.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ListBlock title="Included records" items={section.includedRecords} />
        <ListBlock title="Missing before export" items={section.missingBeforeExport} />
      </div>
    </article>
  );
}

function RecipientCard({ recipient }: { recipient: EvidencePacketHandoffRecipient }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-sm font-bold text-[var(--tenant-text)]">{recipient.label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{recipient.responsibility}</p>
      <ListBlock title="Blocked until" items={recipient.blockedUntil} />
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone="warning" />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "Ready" : "Gate"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
