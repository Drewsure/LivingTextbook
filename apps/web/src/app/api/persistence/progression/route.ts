import { NextResponse } from "next/server";
import {
  createHostedProgressionPersistenceRecord,
  createServerOwnedHostedProgressionPersistenceWriteRequest,
  validateHostedProgressionPersistenceClientWrite,
  validateHostedProgressionPersistenceRead,
  validateHostedProgressionPersistenceWrite,
  type HostedProgressionPersistenceRecord,
  type HostedProgressionPersistenceClientWriteRequest,
  type HostedProgressionPersistenceWriteRequest,
} from "@living-textbook/content-model";
import {
  getConfiguredPersistenceProvider,
  getPersistenceProviderConfiguration,
  getProgressionPersistenceAdapter,
  type PersistenceProvider,
} from "@/server/persistence/progressionPersistenceAdapter";
import { readStudentSessionClaims } from "@/server/persistence/studentSessionCookie";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { getPersistenceDeploymentGateSnapshot } from "@/server/persistence/persistenceDeploymentGate";
import { PERSISTENCE_JSON_BODY_LIMIT_BYTES, readJsonRequestBody } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const providerConfiguration = getPersistenceProviderConfiguration();
  if (!providerConfiguration.valid) {
    return json({ status: "blocked", provider: providerConfiguration.provider, durability: "non-durable-rehearsal", errors: providerConfiguration.errors }, 423);
  }
  const bodyResult = await readJsonRequestBody<unknown>(request, PERSISTENCE_JSON_BODY_LIMIT_BYTES, "Hosted progression request");
  if (!bodyResult.ok) return json({ status: "rejected", errors: bodyResult.errors }, bodyResult.status);
  const rawBody = bodyResult.value;

  const clientValidation = validateHostedProgressionPersistenceClientWrite(rawBody);
  const requestedMode = isClientWriteRequest(rawBody) ? rawBody.requestedMode : "rehearsal-only";
  if (!clientValidation.valid || !clientValidation.request) {
    return json({ status: "blocked", durability: requestedMode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal", errors: clientValidation.errors }, 423);
  }

  const body = createServerOwnedHostedProgressionPersistenceWriteRequest(
    clientValidation.request,
    getServerOwnedPolicy(clientValidation.request.requestedMode),
  );
  const validation = validateHostedProgressionPersistenceWrite(body);
  if (!validation.valid) {
    return json({ status: "blocked", durability: body?.policy?.mode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal", errors: validation.errors }, 423);
  }

  if (body.policy.mode === "durable-managed") {
    const deployment = getPersistenceDeploymentGateSnapshot();
    if (!deployment.gate.ready) {
      return json({ status: "blocked", provider: deployment.provider, durability: "durable-managed", errors: deployment.gate.blockedReasons }, 423);
    }
    if (!hasPersistenceWriteAuthorization(request, body)) {
      return json({ status: "unauthorized", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression writes require a matching signed student session or server-side persistence authorization."] }, 401);
    }

    try {
      const adapter = getProgressionPersistenceAdapter();
      const record = createHostedProgressionPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
      const result = adapter.write(record);
      if (result.status === "conflict") return json({ status: "conflict", provider: "sqlite", durability: "durable-managed", errors: result.errors }, 409);
      return json({ status: "accepted", provider: "sqlite", durability: "durable-managed", idempotent: result.idempotent, record: result.record });
    } catch {
      return json({ status: "unavailable", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression storage could not be opened or written."] }, 503);
    }
  }

  if (process.env.LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL !== "true") {
    return json({ status: "blocked", provider: "process-memory", durability: "non-durable-rehearsal", errors: ["Hosted progression rehearsal writes are disabled by default. Enable the explicit development policy gate before writing."] }, 423);
  }

  const adapter = getProgressionPersistenceAdapter();
  const record = createHostedProgressionPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
  const result = adapter.write(record);
  if (result.status === "conflict") return json({ status: "conflict", provider: adapter.provider, durability: adapter.durability, errors: result.errors }, 409);
  return json({ status: "accepted", provider: adapter.provider, durability: adapter.durability, idempotent: result.idempotent, record: result.record });
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
    return json({
      status: "unauthorized",
      provider: getConfiguredPersistenceProvider(),
      durability: getConfiguredPersistenceProvider() === "sqlite" ? "durable-managed" : "non-durable-rehearsal",
      errors: ["Hosted progression reads require an explicit access purpose."],
      privacy: "No progression record is returned without a signed learner session or tenant-scoped teacher review session.",
    }, 401);
  }
  if (accessMode === "teacher-review-probe" && !hasTeacherOperationsReadAuthorization(request, lookup.tenantId)) {
    return json({
      status: "unauthorized",
      provider: getConfiguredPersistenceProvider(),
      durability: getConfiguredPersistenceProvider() === "sqlite" ? "durable-managed" : "non-durable-rehearsal",
      errors: ["Teacher-scoped authorization is required for the hosted progression review probe."],
      privacy: "No progression record is returned without a tenant-scoped teacher review session.",
    }, 401);
  }
  if (accessMode === "student-continuity" && !hasPersistenceReadAuthorization(request, lookup)) {
    return json({
      status: "unauthorized",
      provider: getConfiguredPersistenceProvider(),
      durability: getConfiguredPersistenceProvider() === "sqlite" ? "durable-managed" : "non-durable-rehearsal",
      errors: ["A matching signed student session or server-side persistence authorization is required for this progression read."],
      privacy: "No progression record is returned without a matching tenant-scoped learner session.",
    }, 401);
  }
  const providerConfiguration = getPersistenceProviderConfiguration();
  if (!providerConfiguration.valid) {
    return json({ status: "blocked", provider: providerConfiguration.provider, durability: "non-durable-rehearsal", errors: providerConfiguration.errors }, 423);
  }
  const provider = getConfiguredPersistenceProvider();

  if (provider === "sqlite") {
    try {
      // Teacher probes are already authorized against the tenant-scoped teacher session above.
      // Student continuity reads require the learner boundary.
      if (accessMode === "student-continuity" && !hasPersistenceReadAuthorization(request, lookup)) {
        return json({ status: "unauthorized", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression reads require a matching signed student session or server-side persistence authorization."] }, 401);
      }
      const adapter = getProgressionPersistenceAdapter();
      const record = adapter.read(lookup);
      if (!record) return json({ status: "not-found", provider: "sqlite", durability: "durable-managed", errors: ["No durable progression record was found for this coded identity."] }, 404);
      return validateAndRespond(lookup, record, "sqlite", "durable-managed");
    } catch {
      return json({ status: "unavailable", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression storage could not be opened or read."] }, 503);
    }
  }

  const adapter = getProgressionPersistenceAdapter();
  return validateAndRespond(lookup, adapter.read(lookup), adapter.provider, adapter.durability);
}

function validateAndRespond(
  lookup: { tenantId: string; packageId: string; launchCode: string; studentSessionId: string },
  record: HostedProgressionPersistenceRecord | undefined,
  provider: PersistenceProvider,
  durability: "non-durable-rehearsal" | "durable-managed",
) {
  const validation = validateHostedProgressionPersistenceRead(lookup, record);
  if (!validation.valid) return json({ status: "not-found", provider, durability, errors: validation.errors }, 404);
  return json({ status: "available", provider, durability, record });
}

function getServerOwnedPolicy(mode: HostedProgressionPersistenceClientWriteRequest["requestedMode"]) {
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

function isClientWriteRequest(value: unknown): value is HostedProgressionPersistenceClientWriteRequest {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && "requestedMode" in value);
}

function hasApiToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN?.trim();
  if (!configuredToken) return false;
  return request.headers.get("authorization") === `Bearer ${configuredToken}`;
}

function hasPersistenceWriteAuthorization(request: Request, body: HostedProgressionPersistenceWriteRequest): boolean {
  if (hasApiToken(request)) return true;

  const claims = readStudentSessionClaims(request);
  return Boolean(claims)
    && claims?.tenantId === body.expectedTenantId
    && claims.packageId === body.expectedPackageId
    && claims.launchCode === body.expectedLaunchCode
    && claims.studentSessionId === body.expectedStudentSessionId;
}

function hasPersistenceReadAuthorization(
  request: Request,
  lookup: { tenantId: string; packageId: string; launchCode: string; studentSessionId: string },
): boolean {
  if (hasApiToken(request)) return true;

  const claims = readStudentSessionClaims(request);
  return Boolean(claims)
    && claims?.tenantId === lookup.tenantId
    && claims.packageId === lookup.packageId
    && claims.launchCode === lookup.launchCode
    && claims.studentSessionId === lookup.studentSessionId;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
