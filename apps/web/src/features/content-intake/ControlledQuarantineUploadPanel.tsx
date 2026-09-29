"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type { UploadChannel, UploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";

interface ControlledQuarantineUploadPanelProps {
  tenantId: string;
  channelPlan: UploadChannelReadinessPlan;
  enabled: boolean;
  reviewDecisionsEnabled: boolean;
}

interface IntakeResponse {
  status?: string;
  quarantineId?: string;
  record?: {
    fileName?: string;
    channelId?: string;
    unitKey?: string;
    scanStatus?: string;
    rightsStatus?: string;
    sourceReviewStatus?: string;
    promotionAllowed?: boolean;
    studentFacingUseAllowed?: boolean;
    nextGate?: string;
  };
  errors?: string[];
}

export function ControlledQuarantineUploadPanel({
  tenantId,
  channelPlan,
  enabled,
  reviewDecisionsEnabled,
}: ControlledQuarantineUploadPanelProps) {
  const [channelId, setChannelId] = useState(channelPlan.channels[0]?.channelId ?? "");
  const [unitKey, setUnitKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "accepted" | "error">("idle");
  const [response, setResponse] = useState<IntakeResponse | null>(null);

  const selectedChannel = useMemo(
    () => channelPlan.channels.find((channel) => channel.channelId === channelId) ?? channelPlan.channels[0],
    [channelId, channelPlan.channels],
  );

  if (!enabled) {
    return (
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled publisher intake</p>
            <h2 className="mt-1 text-lg font-bold">Quarantine upload is disabled by default</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The pilot can reveal a tenant-scoped file picker only after the operator explicitly enables quarantine intake and provisions its storage root. The default route remains input-free and review-only.
            </p>
          </div>
          <StatusPill label="Disabled by default" tone="warning" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Boundary label="Storage" value="Quarantine only" />
          <Boundary label="Promotion" value="Blocked" />
          <Boundary label="Student use" value="Blocked" />
        </div>
        <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          Operator gate: <code>LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED=true</code>. This does not approve a file or create a student-facing route.
        </p>
      </Card>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !selectedChannel) {
      setState("error");
      setResponse({ errors: ["Choose a supported channel and one file before submitting quarantine intake."] });
      return;
    }

    setState("submitting");
    setResponse(null);
    const formData = new FormData();
    formData.set("tenantId", tenantId);
    formData.set("channelId", selectedChannel.channelId);
    if (unitKey.trim()) formData.set("unitKey", unitKey.trim());
    formData.set("file", file);

    try {
      const result = await fetch("/api/teacher/uploads/intake", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const payload = (await result.json()) as IntakeResponse;
      setResponse(payload);
      setState(result.ok ? "accepted" : "error");
    } catch {
      setResponse({ errors: ["The quarantine intake request could not be completed."] });
      setState("error");
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled publisher intake</p>
          <h2 className="mt-1 text-lg font-bold">Send one source or media file to quarantine review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This opt-in control records metadata and an isolated quarantine payload. No extraction or publication occurs here: it does not create a game, activate a playlist, mutate QR routes, or make the file visible to students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Opt-in intake" tone="success" />
          <StatusPill label="Quarantine only" tone="warning" />
          <StatusPill label="Promotion blocked" tone="warning" />
        </div>
      </div>

      <form className="mt-5 grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
            Upload channel
            <select
              className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
            >
              {channelPlan.channels.map((channel) => (
                <option key={channel.channelId} value={channel.channelId}>{channel.label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
            Optional unit key
            <input
              className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal"
              value={unitKey}
              onChange={(event) => setUnitKey(event.target.value)}
              maxLength={240}
              placeholder="tenant:series:L1:U1"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
          File
          <input
            className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal"
            type="file"
            accept={extensionAccept(selectedChannel)}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <span className="text-xs font-normal text-[var(--tenant-muted)]">
            Accepted here: {selectedChannel?.acceptedTypes.join(", ") ?? "configured channel types"}. Maximum 256 MiB quarantine limit.
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "submitting" ? "Recording quarantine intake..." : "Record quarantine intake"}
          </button>
          <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">
            {file ? `${file.name} selected` : "No file selected"}
          </span>
        </div>
      </form>

      {response ? <IntakeResult tenantId={tenantId} state={state} response={response} reviewDecisionsEnabled={reviewDecisionsEnabled} /> : null}
    </Card>
  );
}

function IntakeResult({
  tenantId,
  state,
  response,
  reviewDecisionsEnabled,
}: {
  tenantId: string;
  state: "accepted" | "error" | "idle" | "submitting";
  response: IntakeResponse;
  reviewDecisionsEnabled: boolean;
}) {
  const accepted = state === "accepted" && response.status === "accepted-quarantine";
  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold">{accepted ? "Quarantine intake recorded" : "Quarantine intake not recorded"}</h3>
        <StatusPill label={accepted ? "Review required" : "No intake"} tone={accepted ? "warning" : "warning"} />
      </div>
      {accepted ? (
        <>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Boundary label="Quarantine ID" value={response.quarantineId ?? "Recorded"} />
            <Boundary label="Scan" value={response.record?.scanStatus ?? "Pending"} />
            <Boundary label="Rights" value={response.record?.rightsStatus ?? "Unknown"} />
            <Boundary label="Student use" value={response.record?.studentFacingUseAllowed ? "Blocked error" : "Blocked"} />
          </dl>
          {response.quarantineId ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
                href={`/api/teacher/uploads/review?tenantId=${encodeURIComponent(tenantId)}&quarantineId=${encodeURIComponent(response.quarantineId)}`}
              >
                Open metadata review
              </a>
              <a
                className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
                href={`/api/teacher/uploads/evidence-preview?tenantId=${encodeURIComponent(tenantId)}&quarantineId=${encodeURIComponent(response.quarantineId)}`}
              >
                Open evidence packet preview
              </a>
              <a
                className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
                href={`/teacher/evidence/${encodeURIComponent(tenantId)}/handoff?quarantineId=${encodeURIComponent(response.quarantineId)}`}
              >
                Open package handoff workspace
              </a>
            </div>
          ) : null}
          {response.quarantineId ? (
            reviewDecisionsEnabled ? (
              <ReviewDecisionCapture
                tenantId={tenantId}
                quarantineId={response.quarantineId}
                unitKey={response.record?.unitKey}
              />
            ) : (
              <p className="mt-4 rounded-lg border border-[var(--tenant-border)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
                Teacher review decision capture remains disabled until the operator explicitly enables <code>LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED=true</code>.
              </p>
            )
          ) : null}
        </>
      ) : null}
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {(response.errors ?? ["Promotion, route creation, and student-facing use remain blocked."]).map((error, index) => (
          <li key={`${index}-${error}`}>{error}</li>
        ))}
      </ul>
    </section>
  );
}

const reviewFieldOptions = [
  "Tenant and publisher source identity",
  "Candidate textbook unit and package mapping",
  "Filename, MIME type, size, and checksum",
  "Intended asset channel and classroom use",
] as const;

function ReviewDecisionCapture({
  tenantId,
  quarantineId,
  unitKey,
}: {
  tenantId: string;
  quarantineId: string;
  unitKey?: string;
}) {
  const [reviewerId, setReviewerId] = useState("");
  const [decision, setDecision] = useState<"accepted-for-package-review" | "changes-required">("accepted-for-package-review");
  const [reviewerNote, setReviewerNote] = useState("");
  const [reviewedFields, setReviewedFields] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleField(field: string) {
    setReviewedFields((current) => current.includes(field) ? current.filter((item) => item !== field) : [...current, field]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const packageId = `${(unitKey || `${tenantId}:unassigned`).replace(/[^A-Za-z0-9._:-]+/g, "-").slice(0, 120)}-package`;
    try {
      const result = await fetch("/api/teacher/uploads/review-decision", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          quarantineId,
          packageId,
          reviewerId,
          decision,
          reviewerNote,
          reviewedFields,
          unresolvedBlockers: [
            "Security scan, rights, source approval, accessibility, and release-control remain separate gates.",
            "Evidence attachment storage and package assembly remain blocked.",
          ],
        }),
      });
      const payload = (await result.json()) as { errors?: string[] };
      if (!result.ok) throw new Error(payload.errors?.[0] ?? "The review decision could not be recorded.");
      setState("recorded");
      setMessage("Immutable review decision recorded. Package release remains blocked.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The review decision could not be recorded.");
    }
  }

  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher review decision</p>
          <h3 className="mt-1 text-base font-bold">Record review for package review</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This creates one immutable local metadata record. It is not release approval, evidence attachment storage, package assembly, or student activation.
          </p>
        </div>
        <StatusPill label={state === "recorded" ? "Recorded" : "Human action"} tone={state === "recorded" ? "success" : "warning"} />
      </div>
      <form className="mt-4 grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
            Reviewer ID
            <input className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} maxLength={160} required placeholder="teacher-or-operator-id" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
            Review outcome
            <select className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" value={decision} onChange={(event) => setDecision(event.target.value as typeof decision)}>
              <option value="accepted-for-package-review">Accept for package review</option>
              <option value="changes-required">Changes required</option>
            </select>
          </label>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold text-[var(--tenant-text)]">Fields reviewed</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {reviewFieldOptions.map((field) => (
              <label key={field} className="flex items-start gap-2 rounded-lg border border-[var(--tenant-border)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
                <input type="checkbox" checked={reviewedFields.includes(field)} onChange={() => toggleField(field)} className="mt-1" />
                <span>{field}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
          Reviewer note
          <textarea className="min-h-24 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} maxLength={2000} required placeholder="Record what the next reviewer must know." />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={state === "submitting" || reviewedFields.length !== reviewFieldOptions.length} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {state === "submitting" ? "Recording review decision..." : "Record review decision"}
          </button>
          <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || `Review identity: ${quarantineId}`}</span>
        </div>
      </form>
    </section>
  );
}

function extensionAccept(channel: UploadChannel | undefined): string {
  return channel ? channel.acceptedTypes.map((type) => `.${type}`).join(",") : "";
}

function Boundary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
