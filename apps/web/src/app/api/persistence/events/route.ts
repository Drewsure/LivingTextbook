import { NextResponse } from "next/server";
import {
  createProgressEventStreamPersistenceRecord,
  createServerOwnedProgressEventStreamWriteRequest,
  validateProgressEventStreamPersistenceClientWrite,
  validateProgressEventStreamPersistenceRead,
  validateProgressEventStreamPersistenceWrite,
} from "@living-textbook/content-model";
import { sampleProgressEventTaxonomyRegistry } from "@/data/sampleProgressEventTaxonomy";
import {
  getConfiguredPersistenceProvider,
  getPersistenceProviderConfiguration,
  getProgressEventStreamPersistenceAdapter,
} from "@/server/persistence/progressionPersistenceAdapter";
import { readStudentSessionClaims } from "@/server/persistence/studentSessionCookie";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const providerConfiguration = getPersistenceProviderConfiguration();
  if (!providerConfiguration.valid) return json({ status: "blocked", provider: providerConfiguration.provider, errors: providerConfiguration.errors }, 423);

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ status: "rejected", errors: ["Progress event stream request must be valid JSON."] }, 400);
  }

  const clientValidation = validateProgressEventStreamPersistenceClientWrite(rawBody, sampleProgressEventTaxonomyRegistry);
  const requestedMode = isClientWriteRequest(rawBody) ? rawBody.requestedMode : "rehearsal-only";
  if (!clientValidation.valid || !clientValidation.request) {
    return json({ status: "blocked", durability: requestedMode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal", errors: clientValidation.errors }, 423);
  }

  const body = createServerOwnedProgressEventStreamWriteRequest(
    clientValidation.request,
    sampleProgressEventTaxonomyRegistry,
    getServerOwnedPolicy(clientValidation.request.requestedMode),
  );
  const validation = validateProgressEventStreamPersistenceWrite(body);
  if (!validation.valid) return json({ status: "blocked", errors: validation.errors }, 423);

  if (body.policy.mode === "durable-managed") {
    if (getConfiguredPersistenceProvider() !== "sqlite") return json({ status: "blocked", provider: "process-memory", durability: "durable-managed", errors: ["Durable event stream storage is not enabled for this deployment."] }, 423);
    if (process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES !== "true") return json({ status: "blocked", provider: "sqlite", durability: "durable-managed", errors: ["Durable event stream writes require the explicit deployment write gate."] }, 423);
    if (!hasPersistenceWriteAuthorization(request, body.expectedTenantId, body.expectedPackageId, body.expectedLaunchCode, body.expectedStudentSessionId)) {
      return json({ status: "unauthorized", provider: "sqlite", durability: "durable-managed", errors: ["Durable event stream writes require a matching signed student session or server-side persistence authorization."] }, 401);
    }
  }

  if (body.policy.mode === "rehearsal-only" && process.env.LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL !== "true") {
    return json({ status: "blocked", provider: "process-memory", durability: "non-durable-rehearsal", errors: ["Hosted event stream rehearsal writes are disabled by default."] }, 423);
  }

  try {
    const adapter = getProgressEventStreamPersistenceAdapter();
    const record = createProgressEventStreamPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
    const result = adapter.writeEventStream(record);
    if (result.status === "conflict") return json({ status: "conflict", provider: adapter.provider, durability: adapter.durability, errors: result.errors }, 409);
    return json({ status: "accepted", provider: adapter.provider, durability: adapter.durability, idempotent: result.idempotent, record: result.record });
  } catch {
    return json({ status: "unavailable", provider: getConfiguredPersistenceProvider(), errors: ["Progress event stream storage could not be opened or written."] }, 503);
  }
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const lookup = {
    tenantId: url.searchParams.get("tenantId") ?? "",
    packageId: url.searchParams.get("packageId") ?? "",
    launchCode: url.searchParams.get("launchCode") ?? "",
    studentSessionId: url.searchParams.get("studentSessionId") ?? "",
  };
  const accessMode = url.searchParams.get("accessMode");
  if (accessMode !== "student-continuity" && accessMode !== "teacher-review-probe") {
    return json({ status: "unauthorized", errors: ["Progress event stream reads require an explicit access purpose."] }, 401);
  }
  if (accessMode === "teacher-review-probe" && !hasTeacherOperationsReadAuthorization(request, lookup.tenantId)) {
    return json({ status: "unauthorized", errors: ["Teacher-scoped authorization is required for event stream review."] }, 401);
  }
  if (accessMode === "student-continuity" && !hasPersistenceReadAuthorization(request, lookup)) {
    return json({ status: "unauthorized", errors: ["A matching signed student session or server-side persistence authorization is required for this event stream read."] }, 401);
  }

  const providerConfiguration = getPersistenceProviderConfiguration();
  if (!providerConfiguration.valid) return json({ status: "blocked", provider: providerConfiguration.provider, errors: providerConfiguration.errors }, 423);
  try {
    const adapter = getProgressEventStreamPersistenceAdapter();
    const record = adapter.readEventStream(lookup);
    const validation = validateProgressEventStreamPersistenceRead(lookup, record, sampleProgressEventTaxonomyRegistry);
    if (!validation.valid) return json({ status: "not-found", provider: adapter.provider, durability: adapter.durability, errors: validation.errors }, 404);
    return json({ status: "available", provider: adapter.provider, durability: adapter.durability, record });
  } catch {
    return json({ status: "unavailable", provider: getConfiguredPersistenceProvider(), errors: ["Progress event stream storage could not be opened or read."] }, 503);
  }
}

function isClientWriteRequest(value: unknown): value is { requestedMode: "rehearsal-only" | "durable-managed" } {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && "requestedMode" in value);
}

function getServerOwnedPolicy(mode: "rehearsal-only" | "durable-managed") {
  if (mode === "durable-managed") {
    return {
      mode,
      allowDurableWrite: process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES === "true",
      schoolPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED === "true",
      retentionPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RETENTION_POLICY_ACCEPTED === "true",
      releaseApprovalAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_RELEASE_APPROVED === "true",
    } as const;
  }
  return {
    mode,
    allowNonDurableWrite: process.env.LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL === "true",
    schoolPolicyAccepted: process.env.LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED === "true",
  } as const;
}

function hasApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function hasPersistenceWriteAuthorization(request: Request, tenantId: string, packageId: string, launchCode: string, studentSessionId: string): boolean {
  if (hasApiToken(request)) return true;
  const claims = readStudentSessionClaims(request);
  return Boolean(claims && claims.tenantId === tenantId && claims.packageId === packageId && claims.launchCode === launchCode && claims.studentSessionId === studentSessionId);
}

function hasPersistenceReadAuthorization(request: Request, lookup: { tenantId: string; packageId: string; launchCode: string; studentSessionId: string }): boolean {
  if (hasApiToken(request)) return true;
  const claims = readStudentSessionClaims(request);
  return Boolean(claims && claims.tenantId === lookup.tenantId && claims.packageId === lookup.packageId && claims.launchCode === lookup.launchCode && claims.studentSessionId === lookup.studentSessionId);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
