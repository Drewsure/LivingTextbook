"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import {
  createBrowserPrivacyTenantEvidencePacketFromObservation,
  createBrowserPrivacyTenantEvidencePilotBinding,
  createBrowserPrivacyTenantEvidenceReleaseBinding,
  type BrowserPrivacyTenantEvidenceAdjudication,
  type BrowserPrivacyTenantEvidencePacket,
  type BrowserPrivacyTenantEvidenceReleaseBinding,
  type BrowserRehearsalObservation,
  type PilotReviewDecision,
  type WhiteLabelReleaseReadiness,
} from "@living-textbook/content-model";
import { readBrowserRehearsalObservation, subscribeToBrowserRehearsalObservation } from "@/features/persistence/browserRehearsalObservationStore";
import { readBrowserPrivacyTenantEvidencePacket, subscribeToBrowserPrivacyTenantEvidencePacket } from "@/features/persistence/browserPrivacyTenantEvidencePacketStore";
import { readBrowserPrivacyTenantEvidenceAdjudication, subscribeToBrowserPrivacyTenantEvidenceAdjudication } from "@/features/persistence/browserPrivacyTenantEvidenceAdjudicationStore";

export function BrowserPrivacyTenantEvidenceReleaseBindingPanel({
  readiness,
  pilotDecision,
  tenantId,
  packageId,
  launchCode,
  unitKey,
  studentSessionId,
}: {
  readiness: Pick<WhiteLabelReleaseReadiness, "readinessId" | "tenantId" | "packageId" | "status" | "nextAction">;
  pilotDecision: PilotReviewDecision;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
}) {
  const [observation, setObservation] = useState<BrowserRehearsalObservation>();
  const [packet, setPacket] = useState<BrowserPrivacyTenantEvidencePacket>();
  const [adjudication, setAdjudication] = useState<BrowserPrivacyTenantEvidenceAdjudication>();

  useEffect(() => {
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId };
    setObservation(readBrowserRehearsalObservation(lookup));
    return subscribeToBrowserRehearsalObservation(lookup, setObservation);
  }, [launchCode, packageId, studentSessionId, tenantId, unitKey]);

  useEffect(() => {
    if (!observation) {
      setPacket(undefined);
      return;
    }
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId, observationId: observation.observationId };
    const derived = createBrowserPrivacyTenantEvidencePacketFromObservation(observation, {
      verificationRunId: `teacher-observation:${observation.observationId}`,
      verificationRevision: `local-observation:${observation.observedAt}`,
    });
    setPacket(readBrowserPrivacyTenantEvidencePacket(lookup) ?? derived);
    return subscribeToBrowserPrivacyTenantEvidencePacket(lookup, (nextPacket) => setPacket(nextPacket ?? derived));
  }, [launchCode, observation?.observationId, observation?.observedAt, packageId, studentSessionId, tenantId, unitKey]);

  useEffect(() => {
    if (!packet) {
      setAdjudication(undefined);
      return;
    }
    const lookup = { tenantId: packet.tenantId, packageId: packet.packageId, launchCode: packet.launchCode, unitKey: packet.unitKey, studentSessionId: packet.studentSessionId, packetId: packet.packetId, observationId: packet.observationId };
    setAdjudication(readBrowserPrivacyTenantEvidenceAdjudication(lookup, packet));
    return subscribeToBrowserPrivacyTenantEvidenceAdjudication(lookup, packet, setAdjudication);
  }, [packet?.packetId, packet?.observationId, packet?.tenantId, packet?.packageId, packet?.launchCode, packet?.unitKey, packet?.studentSessionId]);

  const pilotBinding = createBrowserPrivacyTenantEvidencePilotBinding(packet, pilotDecision, adjudication);
  const binding: BrowserPrivacyTenantEvidenceReleaseBinding = createBrowserPrivacyTenantEvidenceReleaseBinding(readiness, pilotBinding);
  const tone = binding.status === "accepted-for-release-review" ? "success" : "warning";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Composite evidence release binding</p>
          <h2 className="mt-1 text-lg font-bold">Pilot evidence is reconciled into release review</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">This provider-neutral bridge carries the exact packet and adjudication lineage into white-label release readiness. It is evidence, not production approval.</p>
        </div>
        <StatusPill label={binding.status} tone={tone} />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Readiness" value={binding.readinessId} />
        <Fact label="Evidence packet" value={binding.packetId} />
        <Fact label="Adjudication" value={binding.adjudicationId} />
        <Fact label="Production approval" value={binding.productionApprovalAllowed ? "Allowed" : "Blocked"} />
      </dl>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <List title="Release binding blockers" values={binding.blockedReasons} />
        <List title="Next release gate" values={binding.nextGate} />
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>; }
function List({ title, values }: { title: string; values: string[] }) { return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>; }
