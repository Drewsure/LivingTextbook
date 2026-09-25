import { NextResponse } from "next/server";
import { getDurableOperationsPolicySnapshot } from "@/server/persistence/sqliteProgressionOperations";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { getConfiguredPersistenceProvider } from "@/server/persistence/progressionPersistenceAdapter";
import { derivePersistenceReadiness } from "@/server/persistence/persistenceReadiness";
import { getPersistenceDeploymentGateSnapshot } from "@/server/persistence/persistenceDeploymentGate";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const tenantId = readBoundedQueryParam(new URL(request.url), "tenantId");
  if (tenantId === undefined) {
    return NextResponse.json({ status: "rejected", errors: ["Persistence status query exceeds the bounded tenant limit."] }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!tenantId || !hasTeacherOperationsReadAuthorization(request, tenantId)) {
    return NextResponse.json({
      status: "unauthorized",
      errors: ["Teacher-scoped authorization is required to inspect persistence operations status."],
      privacy: "Provider, deployment configuration, database paths, learner records, and operation evidence are withheld until tenant-scoped teacher review authorization is present.",
    }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const provider = getConfiguredPersistenceProvider();
  const deployment = getPersistenceDeploymentGateSnapshot();
  const providerConfiguration = deployment.providerConfiguration;
  const durable = provider === "sqlite";
  const policy = getDurableOperationsPolicySnapshot();
  const health = durable && deployment.gate.status !== "blocked"
    ? getDurableProgressionStore().getHealth()
    : {
      healthy: !durable,
      schemaVersion: null,
      journalMode: null,
      synchronous: null,
      errors: durable ? deployment.gate.blockedReasons : [],
      operationEvidenceIntegrity: {
        healthy: !durable,
        checkedRecords: 0,
        errors: durable ? ["SQLite health was withheld until the durable deployment gate is ready."] : [],
      },
    };
  const studentSessionBoundaryConfigured = deployment.studentSessionBoundaryConfigured;
  const teacherOperationsSessionBoundaryConfigured = deployment.teacherOperationsSessionBoundaryConfigured;
  const readiness = derivePersistenceReadiness({
    providerConfigurationValid: providerConfiguration.valid,
    providerConfigurationErrors: providerConfiguration.errors,
    durable,
    health: {
      healthy: health.healthy,
      operationEvidenceIntegrityHealthy: health.operationEvidenceIntegrity.healthy,
      errors: [...health.errors, ...health.operationEvidenceIntegrity.errors],
    },
    studentSessionBoundaryConfigured,
    policyErrors: policy.errors,
  });
  const deploymentGate = deployment.gate;

  const effectiveStatus = deploymentGate.status === "blocked"
    ? "blocked"
    : deploymentGate.status === "rehearsal"
      ? "rehearsal"
      : readiness.status;
  const effectiveHealthy = readiness.healthy && deploymentGate.ready;

  return NextResponse.json({
    status: effectiveStatus,
    tenantId,
    checkedAt: new Date().toISOString(),
    provider,
    durability: durable ? "durable-managed" : "non-durable-rehearsal",
    healthy: effectiveHealthy,
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
    deploymentGate,
    errors: readiness.errors,
    privacy: "No learner records, database paths, credentials, raw audio, or transcripts are returned by this status endpoint.",
  }, { headers: { "Cache-Control": "no-store" } });
}
