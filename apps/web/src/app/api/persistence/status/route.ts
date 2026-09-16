import { NextResponse } from "next/server";
import { getDurableOperationsPolicySnapshot } from "@/server/persistence/sqliteProgressionOperations";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const provider = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER === "sqlite" ? "sqlite" : "process-memory";
  const durable = provider === "sqlite";
  const policy = getDurableOperationsPolicySnapshot();
  const health = durable
    ? getDurableProgressionStore().getHealth()
    : { healthy: true, schemaVersion: null, journalMode: null, synchronous: null, errors: [] as string[] };
  const studentSessionBoundaryConfigured = Boolean(process.env.LIVING_TEXTBOOK_STUDENT_SESSION_SECRET?.trim());
  const errors = [
    ...health.errors,
    ...(durable && !studentSessionBoundaryConfigured ? ["Signed student session boundary is not configured."] : []),
  ];

  return NextResponse.json({
    status: errors.length === 0 && (!durable || policy.errors.length === 0) ? "healthy" : durable ? "blocked" : "rehearsal",
    provider,
    durability: durable ? "durable-managed" : "non-durable-rehearsal",
    healthy: health.healthy && errors.length === 0,
    schemaVersion: health.schemaVersion,
    journalMode: health.journalMode,
    synchronous: health.synchronous,
    studentSessionBoundaryConfigured,
    operations: {
      enabled: policy.operationsEnabled,
      ready: durable && policy.errors.length === 0,
      retentionDays: policy.retentionDays,
      errors: policy.errors,
    },
    errors,
    privacy: "No learner records, database paths, credentials, raw audio, or transcripts are returned by this status endpoint.",
  }, { headers: { "Cache-Control": "no-store" } });
}
