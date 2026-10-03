"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { isTeacherOperationsSessionChangeForTenant, TEACHER_OPERATIONS_SESSION_CHANGED } from "./teacherOperationsSessionEvents";

type ReviewStatus = "not-checked" | "review-only" | "unauthorized" | "blocked" | "error";

interface ReviewResult {
  status: ReviewStatus;
  provider?: string | null;
  record?: {
    recordId: string;
    relativePath: string;
    checksumSha256: string;
    teacherOnly: boolean;
    contentIncluded: false;
    status: "review-only";
  } | null;
  errors: string[];
  studentFacing?: false;
  contentIncluded?: false;
}

interface TeacherAnswerKeyReviewStatusPanelProps {
  tenantId: string;
  packageId: string;
  version: string;
  assetId: string;
}

export function TeacherAnswerKeyReviewStatusPanel({
  tenantId,
  packageId,
  version,
  assetId,
}: TeacherAnswerKeyReviewStatusPanelProps) {
  const [result, setResult] = useState<ReviewResult>();
  const [checking, setChecking] = useState(false);

  const checkStatus = useCallback(async () => {
    setChecking(true);
    try {
      const params = new URLSearchParams({ tenantId, packageId, version, assetId, accessMode: "teacher-review" });
      const response = await fetch(`/api/teacher/answer-key-review?${params.toString()}`, { cache: "no-store" });
      const body = await response.json() as Partial<ReviewResult>;
      setResult({
        status: body.status ?? (response.ok ? "review-only" : "error"),
        provider: body.provider,
        record: body.record ?? null,
        errors: body.errors ?? [],
        studentFacing: false,
        contentIncluded: false,
      });
    } catch {
      setResult({ status: "error", record: null, errors: ["The teacher answer-key review endpoint could not be reached."], studentFacing: false, contentIncluded: false });
    } finally {
      setChecking(false);
    }
  }, [assetId, packageId, tenantId, version]);

  useEffect(() => {
    function handleSessionChange(event: Event) {
      if (isTeacherOperationsSessionChangeForTenant(event, tenantId)) void checkStatus();
    }
    window.addEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
    return () => window.removeEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
  }, [checkStatus, tenantId]);

  const label = checking
    ? "Checking"
    : result?.status === "review-only"
      ? "Metadata available"
      : result?.status === "unauthorized"
        ? "Protected"
        : result?.status === "blocked"
          ? "Not configured"
          : result?.status === "error"
            ? "Unavailable"
            : "Not checked";
  const tone = result?.status === "review-only" ? "success" : result?.status ? "warning" : "neutral";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-only source lane</p>
          <h2 className="mt-1 text-lg font-bold">Answer-key review status</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Confirms the exact tenant, package, version, and answer-key asset scope. This foundation check returns metadata only; it never returns answer text, PDF bytes, or student-facing content.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={tenantId} />
        <Fact label="Package" value={packageId} />
        <Fact label="Version" value={version} />
        <Fact label="Asset" value={assetId} />
        <Fact label="Student access" value="Blocked" />
        <Fact label="Answer content" value="Never returned" />
        <Fact label="Provider" value={result?.provider ?? "Not checked"} />
        <Fact label="Checksum binding" value={result?.record ? "Verified" : "Pending provider"} />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={checkStatus}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking answer-key status" : "Check answer-key status"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">Teacher review metadata only</span>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm" aria-live="polite">
          <p className="font-bold">
            {result.status === "review-only"
              ? "The answer-key record is available for teacher review metadata."
              : result.status === "unauthorized"
                ? "Tenant-scoped teacher authorization is required."
                : "The answer-key provider is intentionally blocked until storage and rights evidence are configured."}
          </p>
          {result.errors[0] ? <p className="mt-1 text-[var(--tenant-muted)]">{result.errors[0]}</p> : null}
          {result.record ? <p className="mt-1 text-[var(--tenant-muted)]">Bound to {result.record.relativePath}; checksum {result.record.checksumSha256.slice(0, 19)}…</p> : null}
          <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">No answer content was returned. Student bundle exclusion remains enforced.</p>
        </div>
      ) : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
