"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { clearTeacherOperationsSession, createTeacherOperationsSession, readTeacherOperationsSession, type TeacherOperationsSessionResult } from "./teacherOperationsAccessClient";
import { notifyTeacherOperationsSessionChanged } from "./teacherOperationsSessionEvents";

export function TeacherOperationsAccessPanel({ tenantId }: { tenantId: string }) {
  const [reviewCode, setReviewCode] = useState("");
  const [result, setResult] = useState<TeacherOperationsSessionResult>();
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    void readTeacherOperationsSession().then((session) => {
      if (active && session.status === "authenticated" && session.tenantId === tenantId) setResult(session);
    });
    return () => {
      active = false;
    };
  }, [tenantId]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    const nextResult = await createTeacherOperationsSession(tenantId, reviewCode);
    setResult(nextResult);
    if (nextResult.status === "authenticated") notifyTeacherOperationsSessionChanged(tenantId);
    setReviewCode("");
    setWorking(false);
  }

  async function handleSignOut() {
    setWorking(true);
    const nextResult = await clearTeacherOperationsSession();
    setResult(nextResult);
    notifyTeacherOperationsSessionChanged(tenantId);
    setWorking(false);
  }

  const authenticated = result?.status === "authenticated";
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher access boundary</p>
          <h2 className="mt-1 text-lg font-bold">Tenant-scoped operations review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Sign in with the school-approved review code to view this tenant&apos;s metadata and bounded launch-scoped event review. This session cannot access student gameplay, raw learner audio, or transcripts, and cannot change persistence.
          </p>
        </div>
        <StatusPill label={authenticated ? "Authenticated" : "Protected"} tone={authenticated ? "success" : "warning"} />
      </div>

      <form className="mt-5 flex flex-wrap items-end gap-3" onSubmit={handleSignIn}>
        <label className="grid min-w-64 flex-1 gap-1 text-sm font-semibold">
          <span>Teacher review code</span>
          <input
            className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 text-[var(--tenant-text)]"
            type="password"
            value={reviewCode}
            onChange={(event) => setReviewCode(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter school-approved code"
            disabled={working || authenticated}
          />
        </label>
        <button type="submit" disabled={working || authenticated || !reviewCode} className="min-h-11 rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {working ? "Checking access" : "Sign in for review"}
        </button>
        {authenticated ? <button type="button" onClick={handleSignOut} disabled={working} className="min-h-11 rounded-lg border border-[var(--tenant-border)] px-4 py-2 text-sm font-bold text-[var(--tenant-text)] disabled:opacity-50">Sign out</button> : null}
      </form>
      {result && !authenticated ? <p className="mt-3 text-sm font-semibold text-[var(--tenant-muted)]" aria-live="polite">{result.errors[0] ?? "Teacher review access is not available."}</p> : null}
      {authenticated ? <p className="mt-3 text-sm font-semibold text-[var(--tenant-muted)]" aria-live="polite">Tenant review access is active until {new Date(result.expiresAt ?? "").toLocaleTimeString()}.</p> : null}
    </Card>
  );
}
