import { NextResponse } from "next/server";
import { getDurableOperationsPolicySnapshot } from "@/server/persistence/sqliteProgressionOperations";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const tenantId = new URL(request.url).searchParams.get("tenantId")?.trim() ?? "";
  if (!tenantId || !hasTeacherOperationsReadAuthorization(request, tenantId)) {
    return NextResponse.json({
      status: "unauthorized",
      errors: ["Teacher-scoped authorization is required to inspect persistence operations status."],
      privacy: "Provider, deployment configuration, database paths, learner records, and operation evidence are withheld until tenant-scoped teacher review authorization is present.",
    }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const provider = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER === "sqlite" ? "sqlite" : "process-memory";
  const durable = provider === "sqlite";
  const policy = getDurableOperationsPolicySnapshot();
  const health = durable
    ? getDurableProgressionStore().getHealth()
    : { healthy: true, schemaVersion: null, journalMode: null, synchronous: null, errors: [], operationEvidenceIntegrity: { healthy: true, checkedRecords: 0, errors: [] as string[] } };
  const studentSessionBoundaryConfigured = Boolean(process.env.LIVING_TEXTBOOK_STUDENT_SESSION_SECRET?.trim());
  const teacherOperationsSessionBoundaryConfigured = Boolean(
    process.env.LIVING_TEXTBOOK_TEACHER_SESSION_SECRET?.trim()
      && process.env.LIVING_TEXTBOOK_TEACHER_REVIEW_CODE?.trim(),
  );
  const errors = [
    ...health.errors,
    ...health.operationEvidenceIntegrity.errors,
    ...(durable && !studentSessionBoundaryConfigured ? ["Signed student session boundary is not configured."] : []),
  ];

  return NextResponse.json({
    status: errors.length === 0 && (!durable || policy.errors.length === 0) ? "healthy" : durable ? "blocked" : "rehearsal",
    provider,
    durability: durable ? "durable-managed" : "non-durable-rehearsal",
    healthy: health.healthy && health.operationEvidenceIntegrity.healthy && errors.length === 0,
    schemaVersion: health.schemaVersion,
    journalMode: health.journalMode,
    synchronous: health.synchronous,
    operationEvidenceIntegrity: health.operationEvidenceIntegrity,
    studentSessionBoundaryConfigured,
    teacherOperationsSessionBoundaryConfigured,
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
