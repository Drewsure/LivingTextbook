"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { QuarantineEvidenceReviewCapture } from "@/features/content-intake/QuarantineEvidenceReviewCapture";
import { DeliveryModeDecisionCapture } from "@/features/content-intake/DeliveryModeDecisionCapture";
import { PackageEvidenceReviewCapture } from "@/features/content-intake/PackageEvidenceReviewCapture";
import type {
  UploadQuarantinePackageAssemblyPreflight,
  UploadQuarantinePackageHandoffPreview,
  UploadQuarantinePackageReviewPacket,
  UploadQuarantineDeliveryManifestPreview,
  UploadQuarantineDeliveryModeDecision,
  UploadQuarantinePackageEvidenceReview,
  UploadQuarantineReleaseReceiptPreview,
  PublisherPilotPackageReadinessBinding,
} from "@living-textbook/content-model";

interface PublisherQuarantineHandoffBridgePanelProps {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  packageReviewPacketsEnabled?: boolean;
  evidenceReviewsEnabled?: boolean;
  deliveryModeDecisionsEnabled?: boolean;
  packageEvidenceReviewsEnabled?: boolean;
}

type HandoffResponse = {
  status?: string;
  tenantId?: string;
  quarantineId?: string;
  handoff?: UploadQuarantinePackageHandoffPreview | null;
  packet?: UploadQuarantinePackageReviewPacket | null;
  preflight?: UploadQuarantinePackageAssemblyPreflight | null;
  binding?: PublisherPilotPackageReadinessBinding | null;
  deliveryManifestPreview?: UploadQuarantineDeliveryManifestPreview | null;
  deliveryModeDecision?: UploadQuarantineDeliveryModeDecision | null;
  packageEvidenceReview?: UploadQuarantinePackageEvidenceReview | null;
  releaseReceiptPreview?: UploadQuarantineReleaseReceiptPreview | null;
  errors?: string[];
  privacy?: string;
};

export function PublisherQuarantineHandoffBridgePanel({
  tenantId,
  quarantineId,
  packageId,
  packageReviewPacketsEnabled = false,
  evidenceReviewsEnabled = false,
  deliveryModeDecisionsEnabled = false,
  packageEvidenceReviewsEnabled = false,
}: PublisherQuarantineHandoffBridgePanelProps) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [payload, setPayload] = useState<HandoffResponse | null>(null);
  const [packetState, setPacketState] = useState<"idle" | "submitting" | "recorded" | "blocked" | "error">("idle");
  const [packetMessage, setPacketMessage] = useState("");
  const [preflightState, setPreflightState] = useState<"waiting" | "loading" | "ready" | "missing" | "error">("waiting");
  const [preflight, setPreflight] = useState<UploadQuarantinePackageAssemblyPreflight | null>(null);
  const [readinessBinding, setReadinessBinding] = useState<PublisherPilotPackageReadinessBinding | null>(null);
  const [deliveryManifestPreview, setDeliveryManifestPreview] = useState<UploadQuarantineDeliveryManifestPreview | null>(null);
  const [deliveryModeDecision, setDeliveryModeDecision] = useState<UploadQuarantineDeliveryModeDecision | null>(null);
  const [packageEvidenceReview, setPackageEvidenceReview] = useState<UploadQuarantinePackageEvidenceReview | null>(null);
  const [releaseReceiptPreview, setReleaseReceiptPreview] = useState<UploadQuarantineReleaseReceiptPreview | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  async function loadPreflight(signal?: AbortSignal) {
    const query = new URLSearchParams({ tenantId, quarantineId });
    if (packageId) query.set("packageId", packageId);

    setPreflightState("loading");
    try {
      const response = await fetch(`/api/teacher/uploads/package-assembly-preflight?${query.toString()}`, {
        credentials: "same-origin",
        cache: "no-store",
        signal,
      });
      const next = (await response.json()) as { preflight?: UploadQuarantinePackageAssemblyPreflight | null };
      setPreflight(next.preflight ?? null);
      setPreflightState(response.ok ? "ready" : response.status === 404 ? "missing" : "error");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setPreflightState("error");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ tenantId, quarantineId });
    if (packageId) query.set("packageId", packageId);

    fetch(`/api/teacher/uploads/package-handoff-preview?${query.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const next = (await response.json()) as HandoffResponse;
        setPayload(next);
        setState(response.ok ? "ready" : "error");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPayload({ errors: ["The quarantine handoff preview could not be loaded."] });
        setState("error");
      });

    void loadPreflight(controller.signal);

    fetch(`/api/teacher/uploads/package-readiness-binding?${query.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const next = (await response.json()) as { binding?: PublisherPilotPackageReadinessBinding | null; deliveryManifestPreview?: UploadQuarantineDeliveryManifestPreview | null; deliveryModeDecision?: UploadQuarantineDeliveryModeDecision | null; packageEvidenceReview?: UploadQuarantinePackageEvidenceReview | null; releaseReceiptPreview?: UploadQuarantineReleaseReceiptPreview | null };
        setReadinessBinding(next.binding ?? null);
        setDeliveryManifestPreview(next.deliveryManifestPreview ?? null);
        setDeliveryModeDecision(next.deliveryModeDecision ?? null);
        setPackageEvidenceReview(next.packageEvidenceReview ?? null);
        setReleaseReceiptPreview(next.releaseReceiptPreview ?? null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setReadinessBinding(null);
        setDeliveryManifestPreview(null);
        setDeliveryModeDecision(null);
        setPackageEvidenceReview(null);
        setReleaseReceiptPreview(null);
      });

    return () => controller.abort();
  }, [packageId, quarantineId, refreshToken, tenantId]);

  const handoff = payload?.handoff;

  async function recordReviewPacket() {
    setPacketState("submitting");
    setPacketMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/package-review-packet", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, quarantineId, packageId }),
      });
      const next = (await response.json()) as { packet?: UploadQuarantinePackageReviewPacket | null; errors?: string[]; status?: string };
      if (!response.ok) {
        setPacketState(next.status === "blocked" ? "blocked" : "error");
        setPacketMessage(next.errors?.[0] ?? "The package review packet could not be recorded.");
        return;
      }
      setPacketState("recorded");
      setPacketMessage(next.packet?.status === "blocked" ? "Review packet recorded; next gate remains blocked." : "Review packet recorded for the next gate.");
      setRefreshToken((current) => current + 1);
    } catch {
      setPacketState("error");
      setPacketMessage("The package review packet could not be recorded.");
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Live quarantine handoff bridge</p>
          <h2 className="mt-1 text-lg font-bold">Review one publisher submission in package context</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This bridge reads the existing authorized metadata-only API and places one quarantined source beside the package preview. It never returns file bytes, filesystem paths, download links, or student-facing content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setRefreshToken((current) => current + 1)} disabled={state === "loading"} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-bold text-[var(--tenant-text)] disabled:cursor-not-allowed disabled:opacity-60">
            Refresh live readiness
          </button>
          <StatusPill label={state === "ready" ? "Metadata loaded" : state === "loading" ? "Loading" : "Review blocked"} tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={tenantId} />
        <Fact label="Quarantine" value={quarantineId} />
        <Fact label="Package request" value={packageId ?? "Derived by server"} />
        <Fact label="Student use" value="Blocked" />
      </dl>

      {handoff ? (
        <>
          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Safe handoff identity</p>
                <h3 className="mt-1 text-base font-bold">Source is bound to a candidate package, not released</h3>
              </div>
              <StatusPill label={handoff.admissionDecision} tone="warning" />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Fact label="Source" value={handoff.sourceId} />
              <Fact label="Package" value={handoff.packageId} />
              <Fact label="Unit" value={handoff.unitKey ?? "Unassigned"} />
              <Fact label="Admission" value={handoff.admissionId} />
              <Fact label="Evidence packet" value={handoff.evidencePacketId} />
              <Fact label="Checksum" value={handoff.checksumSha256} />
            </dl>
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="File metadata" value={`${handoff.fileName} · ${handoff.mimeType}`} />
            <Fact label="Payload present" value={handoff.payloadPresent ? "Yes, still quarantined" : "No"} />
            <Fact label="Evidence write" value={handoff.writeAllowed ? "Unexpected" : "Blocked"} />
            <Fact label="Side effect" value={handoff.sideEffect} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ListBlock title="Required review" items={handoff.requiredReview} />
            <ListBlock title="Current blockers" items={handoff.blockers} tone="warning" />
          </div>
          <p className="mt-4 rounded-lg border border-[var(--tenant-border)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
            This screen is a bridge into review evidence only. It does not create a package, write evidence, print production QR codes, activate persistence, or promote the quarantined payload.
          </p>
          <div className="mt-4">
            <QuarantineEvidenceReviewCapture
              tenantId={tenantId}
              quarantineId={quarantineId}
              packageId={handoff.packageId}
              enabled={evidenceReviewsEnabled}
              onRecorded={() => setRefreshToken((current) => current + 1)}
            />
          </div>
          <DeliveryModeDecisionCapture
            tenantId={tenantId}
            quarantineId={quarantineId}
            packageId={handoff.packageId}
            enabled={deliveryModeDecisionsEnabled}
            decision={deliveryModeDecision}
            onRecorded={() => setRefreshToken((current) => current + 1)}
          />
          <PackageEvidenceReviewCapture
            tenantId={tenantId}
            quarantineId={quarantineId}
            packageId={handoff.packageId}
            enabled={packageEvidenceReviewsEnabled}
            review={packageEvidenceReview}
            onRecorded={() => setRefreshToken((current) => current + 1)}
          />
          <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review packet snapshot</p>
                <h3 className="mt-1 text-base font-bold">Preserve this handoff for package review</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                  This records bounded metadata and the current blockers only. It never authorizes assembly or student use.
                </p>
              </div>
              <StatusPill label={packetState === "recorded" ? "Recorded" : packageReviewPacketsEnabled ? "Operator gate" : "Disabled"} tone={packetState === "recorded" ? "success" : "warning"} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={recordReviewPacket} disabled={!packageReviewPacketsEnabled || packetState === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                {packetState === "submitting" ? "Recording packet..." : "Record review packet snapshot"}
              </button>
              <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">
                {packetMessage || (packageReviewPacketsEnabled ? "Explicit local packet gate is enabled." : "Enable LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED=true to record this local metadata snapshot.")}
              </span>
            </div>
          </div>
          <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Assembly preflight</p>
                <h3 className="mt-1 text-base font-bold">Check the handoff before a package writer can run</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                  This read-only check joins the durable review packet to the package writer&apos;s required manifest, release, QR, deployment, and policy inputs.
                </p>
              </div>
              <StatusPill label={preflightState === "ready" ? preflight?.status ?? "Loaded" : preflightState === "missing" ? "Packet required" : preflightState === "loading" ? "Loading" : "Review gate"} tone="warning" />
            </div>
            {preflight ? (
              <>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Fact label="Preflight" value={preflight.preflightId} />
                  <Fact label="Packet" value={preflight.packetId} />
                  <Fact label="Assembly write" value={preflight.assemblyWriteAllowed ? "Unexpected" : "Blocked"} />
                  <Fact label="Student use" value={preflight.studentFacingUseAllowed ? "Unexpected" : "Blocked"} />
                </dl>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <ListBlock title="Required package inputs" items={preflight.requiredInputs} />
                  <ListBlock title="Assembly blockers" items={preflight.blockers} tone="warning" />
                </div>
              </>
            ) : (
              <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
                Record the review packet snapshot before assembly preflight can be evaluated.
              </p>
            )}
          </section>
          {readinessBinding ? <LiveReadinessSummary binding={readinessBinding} /> : null}
          {deliveryManifestPreview ? <LiveDeliveryManifestPreview preview={deliveryManifestPreview} /> : null}
          {releaseReceiptPreview ? <LiveReleaseReceiptPreview preview={releaseReceiptPreview} /> : null}
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-sm font-semibold">The handoff preview is not available.</p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {(payload?.errors ?? ["An authorized teacher or service session is required."]).map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}
          </ul>
        </div>
      )}

      {payload?.privacy ? <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">{payload.privacy}</p> : null}
    </Card>
  );
}

function LiveReadinessSummary({ binding }: { binding: PublisherPilotPackageReadinessBinding }) {
  const passed = binding.checks.filter((check) => check.status === "passed").length;
  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Live package readiness binding</p>
          <h3 className="mt-1 text-base font-bold">One status derived from this quarantine submission</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{passed}/{binding.checks.length} checks passed. This is a metadata-only view and does not create or release a package.</p>
        </div>
        <StatusPill label={binding.status} tone="warning" />
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Binding" value={binding.bindingId} />
        <Fact label="Package" value={binding.packageId} />
        <Fact label="Source checksum" value={binding.sourceChecksumSha256} />
        <Fact label="Hosted opt-in" value={binding.hostedPersistenceDecisionPacketId ?? "Not selected"} />
      </dl>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {binding.checks.map((check) => <div key={check.checkId} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3"><span className="text-sm font-semibold">{check.label}</span><StatusPill label={check.status} tone={check.status === "passed" ? "success" : "warning"} /></div>)}
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">Package assembly: blocked · promotion: blocked · student use: blocked · side effect: none</p>
    </section>
  );
}

function LiveDeliveryManifestPreview({ preview }: { preview: UploadQuarantineDeliveryManifestPreview }) {
  const passed = preview.checks.filter((check) => check.status === "passed").length;
  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Live delivery manifest preview</p>
          <h3 className="mt-1 text-base font-bold">Delivery shape is visible before release approval</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{passed}/{preview.checks.length} checks passed. This preview binds the live source to the future manifest, receipt, and package index identities without writing any of them.</p>
        </div>
        <StatusPill label="Blocked" tone="warning" />
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Preview" value={preview.previewId} />
        <Fact label="Manifest" value={preview.manifestId} />
        <Fact label="Release receipt" value={preview.releaseReceiptId} />
        <Fact label="Package index" value={preview.packageIndexId} />
        <Fact label="Mode" value={preview.selectedMode} />
        <Fact label="Source checksum" value={preview.sourceChecksumSha256} />
      </dl>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {preview.checks.map((check) => (
          <div key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{check.label}</span><StatusPill label={check.status} tone={check.status === "passed" ? "success" : "warning"} /></div>
            <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{check.evidence}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {check.nextAction}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold">Release closure order</h4>
          <StatusPill label="Review only" tone="warning" />
        </div>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          <li><span className="font-semibold">1. Evidence:</span> confirm the reviewed package lanes and source checksum.</li>
          <li><span className="font-semibold">2. Assembly:</span> create the package manifest and verify its contents.</li>
          <li><span className="font-semibold">3. Recovery:</span> record the release receipt and rollback path.</li>
          <li><span className="font-semibold">4. QR:</span> register the stable alias, then obtain human print authorization.</li>
        </ol>
        <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">These identities are previews only. A selected delivery mode and complete evidence do not authorize release, QR printing, hosted persistence, or student use.</p>
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">Delivery: blocked · package assembly: blocked · QR printing: blocked · hosted persistence: blocked · student use: blocked · side effect: none</p>
    </section>
  );
}

function LiveReleaseReceiptPreview({ preview }: { preview: UploadQuarantineReleaseReceiptPreview }) {
  const passed = preview.checks.filter((check) => check.status === "passed").length;
  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Live release receipt preview</p>
          <h3 className="mt-1 text-base font-bold">Human approval is the next independent boundary</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{passed}/{preview.checks.length} checks passed. This preview reserves the receipt identity for the real quarantine without recording reviewer approval, rollback, QR authorization, or release.</p>
        </div>
        <StatusPill label="Blocked" tone="warning" />
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Preview" value={preview.previewId} />
        <Fact label="Receipt" value={preview.releaseReceiptId} />
        <Fact label="Manifest" value={preview.manifestId} />
        <Fact label="Package index" value={preview.packageIndexId} />
      </dl>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {preview.checks.map((check) => (
          <div key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{check.label}</span><StatusPill label={check.status} tone={check.status === "passed" ? "success" : "warning"} /></div>
            <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{check.evidence}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {check.nextAction}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">Reviewer: not recorded · rollback: not recorded · release approval: pending · QR authorization: pending · delivery: blocked · student use: blocked · side effect: none</p>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
