"use client";

import { useState, type FormEvent } from "react";
import { StatusPill } from "@living-textbook/ui";
import { UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES, type UploadQuarantinePackageEvidenceLane, type UploadQuarantinePackageEvidenceReview, type UploadQuarantineReviewDecisionRecord } from "@living-textbook/content-model";

const laneLabels: Record<UploadQuarantinePackageEvidenceLane, string> = {
  content: "Textbook content and unit mapping",
  game: "Reviewed game pathways and scoring",
  audio: "Learner audio and transcript cues",
  video: "Video, poster, and caption evidence",
  image: "Images, diagrams, and alt text",
  font: "Font and rendering evidence",
  accessibility: "Accessibility and device rehearsal",
  rights: "Publisher rights and media licenses",
};

export function PackageEvidenceReviewCapture({
  tenantId,
  quarantineId,
  packageId,
  enabled,
  review,
  sourceDecision,
  onRecorded,
}: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  enabled: boolean;
  review: UploadQuarantinePackageEvidenceReview | null;
  sourceDecision: UploadQuarantineReviewDecisionRecord | null;
  onRecorded: () => void;
}) {
  const [reviewerId, setReviewerId] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [reviewedLanes, setReviewedLanes] = useState<UploadQuarantinePackageEvidenceLane[]>(review?.reviewedLanes ?? []);
  const [evidenceReferences, setEvidenceReferences] = useState<Record<UploadQuarantinePackageEvidenceLane, string>>(() => Object.fromEntries((review?.evidenceReferences ?? []).map((reference) => [reference.lane, reference.referenceId])) as Record<UploadQuarantinePackageEvidenceLane, string>);
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleLane(lane: UploadQuarantinePackageEvidenceLane) {
    setReviewedLanes((current) => current.includes(lane) ? current.filter((item) => item !== lane) : [...current, lane]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/package-evidence-review", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          quarantineId,
          packageId,
          reviewerId,
          reviewerNote,
          reviewedLanes,
          evidenceReferences: UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES
            .map((lane) => ({
              lane,
              referenceId: evidenceReferences[lane]?.trim() ?? "",
              origin: lane === "game" ? "platform-derived" as const : "publisher-asset" as const,
            }))
            .filter((reference) => reference.referenceId.length > 0),
        }),
      });
      const payload = (await response.json()) as { errors?: string[]; reviewedPackageEvidence?: boolean };
      if (!response.ok) throw new Error(payload.errors?.[0] ?? "The package evidence review could not be recorded.");
      setState("recorded");
      setMessage(payload.reviewedPackageEvidence ? "All package evidence lanes are recorded; release gates remain separate." : "Package evidence review recorded with open lanes.");
      onRecorded();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The package evidence review could not be recorded.");
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Reviewed package evidence</p>
          <h2 className="mt-1 text-lg font-bold">Confirm the multimedia and game lanes before assembly</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This is a bounded evidence attestation for the quarantined source. It records what a reviewer checked without uploading files, exposing payloads, assembling a package, printing QR codes, or activating students.</p>
        </div>
        <StatusPill label={!enabled ? "Operator gate" : sourceDecision?.decision !== "accepted-for-package-review" ? "Source gate" : review?.status ?? "Human action"} tone={review?.status === "reviewed-package-evidence" ? "success" : "warning"} />
      </div>

      {!enabled ? (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">Package evidence review is disabled by default. Enable <code>LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED=true</code> only in the controlled review environment.</p>
      ) : sourceDecision?.decision !== "accepted-for-package-review" ? (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">An accepted-for-package-review source decision is required before these multimedia and game evidence lanes can be recorded.</p>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="text-sm font-semibold text-[var(--tenant-text)]">Evidence lanes reviewed</legend>
            {UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.map((lane) => (
              <div key={lane} className="rounded-lg border border-[var(--tenant-border)] p-3">
                <label className="flex items-start gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                  <input type="checkbox" checked={reviewedLanes.includes(lane)} onChange={() => toggleLane(lane)} className="mt-1" />
                  <span>{laneLabels[lane]}</span>
                </label>
                <input
                  aria-label={`${laneLabels[lane]} evidence reference`}
                  value={evidenceReferences[lane] ?? ""}
                  onChange={(event) => setEvidenceReferences((current) => ({ ...current, [lane]: event.target.value }))}
                  maxLength={240}
                  placeholder="review-record-id"
                  className="mt-2 min-h-10 w-full rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">
                  Evidence origin: {lane === "game" ? "platform-derived canonical game record" : "publisher-asset review record"}
                </p>
              </div>
            ))}
          </fieldset>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">Reviewer ID<input required value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} maxLength={160} placeholder="publisher-or-school-reviewer" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" /></label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">Evidence note<textarea required value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} maxLength={2000} placeholder="Reference the reviewed package records and any remaining caveats." className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" /></label>
          </div>
          <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={state === "submitting" || reviewedLanes.length === 0} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{state === "submitting" ? "Recording package evidence..." : "Record package evidence review"}</button><span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || `${reviewedLanes.length}/${UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES.length} lanes selected; add a reference ID for each checked lane.`}</span></div>
        </form>
      )}
      {review ? <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">Recorded by {review.reviewerId} on {review.reviewedAt}. Assembly, promotion, QR printing, and student use remain blocked.</p> : null}
    </section>
  );
}
