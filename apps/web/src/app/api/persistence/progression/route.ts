import { NextResponse } from "next/server";
import {
  createHostedProgressionPersistenceRecord,
  validateHostedProgressionPersistenceRead,
  validateHostedProgressionPersistenceWrite,
  type HostedProgressionPersistenceRecord,
  type HostedProgressionPersistenceWriteRequest,
} from "@living-textbook/content-model";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";
import { readStudentSessionClaims } from "@/server/persistence/studentSessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersistenceProvider = "process-memory" | "sqlite";

const globalStore = globalThis as typeof globalThis & {
  __livingTextbookHostedProgressionRehearsal?: Map<string, HostedProgressionPersistenceRecord>;
};
const rehearsalStore = globalStore.__livingTextbookHostedProgressionRehearsal ??= new Map();

export async function POST(request: Request) {
  let body: HostedProgressionPersistenceWriteRequest;
  try {
    body = await request.json() as HostedProgressionPersistenceWriteRequest;
  } catch {
    return json({ status: "rejected", errors: ["Hosted progression request must be valid JSON."] }, 400);
  }

  const validation = validateHostedProgressionPersistenceWrite(body);
  if (!validation.valid) {
    return json({ status: "blocked", durability: body?.policy?.mode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal", errors: validation.errors }, 423);
  }

  if (body.policy.mode === "durable-managed") {
    if (getConfiguredProvider() !== "sqlite") {
      return json({ status: "blocked", provider: "process-memory", durability: "durable-managed", errors: ["Durable progression storage is not enabled for this deployment."] }, 423);
    }
    if (process.env.LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES !== "true") {
      return json({ status: "blocked", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression writes require the explicit deployment write gate."] }, 423);
    }
    const deploymentPolicyErrors = getDurableDeploymentPolicyErrors();
    if (deploymentPolicyErrors.length > 0) {
      return json({ status: "blocked", provider: "sqlite", durability: "durable-managed", errors: deploymentPolicyErrors }, 423);
    }
    if (!hasPersistenceWriteAuthorization(request, body)) {
      return json({ status: "unauthorized", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression writes require a matching signed student session or server-side persistence authorization."] }, 401);
    }

    try {
      const record = createHostedProgressionPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
      const result = getDurableProgressionStore().write(record);
      if (result.status === "conflict") return json({ status: "conflict", provider: "sqlite", durability: "durable-managed", errors: result.errors }, 409);
      return json({ status: "accepted", provider: "sqlite", durability: "durable-managed", idempotent: result.idempotent, record: result.record });
    } catch {
      return json({ status: "unavailable", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression storage could not be opened or written."] }, 503);
    }
  }

  if (process.env.LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL !== "true") {
    return json({ status: "blocked", provider: "process-memory", durability: "non-durable-rehearsal", errors: ["Hosted progression rehearsal writes are disabled by default. Enable the explicit development policy gate before writing."] }, 423);
  }

  const record = createHostedProgressionPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
  const existing = rehearsalStore.get(record.idempotencyKey);
  if (existing) return json({ status: "accepted", provider: "process-memory", durability: "non-durable-rehearsal", idempotent: true, record: existing });
  rehearsalStore.set(record.idempotencyKey, record);
  return json({ status: "accepted", provider: "process-memory", durability: "non-durable-rehearsal", idempotent: false, record });
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const lookup = {
    tenantId: url.searchParams.get("tenantId") ?? "",
    packageId: url.searchParams.get("packageId") ?? "",
    launchCode: url.searchParams.get("launchCode") ?? "",
    studentSessionId: url.searchParams.get("studentSessionId") ?? "",
  };
  const provider = getConfiguredProvider();

  if (provider === "sqlite") {
    try {
      if (!hasPersistenceReadAuthorization(request, lookup)) return json({ status: "unauthorized", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression reads require a matching signed student session or server-side persistence authorization."] }, 401);
      const record = getDurableProgressionStore().read(lookup);
      if (!record) return json({ status: "not-found", provider: "sqlite", durability: "durable-managed", errors: ["No durable progression record was found for this coded identity."] }, 404);
      return validateAndRespond(lookup, record, "sqlite", "durable-managed");
    } catch {
      return json({ status: "unavailable", provider: "sqlite", durability: "durable-managed", errors: ["Durable progression storage could not be opened or read."] }, 503);
    }
  }

  const record = [...rehearsalStore.values()].find((candidate) =>
    candidate.tenantId === lookup.tenantId
      && candidate.packageId === lookup.packageId
      && candidate.launchCode === lookup.launchCode
      && candidate.studentSessionId === lookup.studentSessionId,
  );
  return validateAndRespond(lookup, record, "process-memory", "non-durable-rehearsal");
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

function getConfiguredProvider(): PersistenceProvider {
  return process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER === "sqlite" ? "sqlite" : "process-memory";
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

function getDurableDeploymentPolicyErrors(): string[] {
  const requiredGates = [
    ["LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED", "Durable progression writes require the deployment school-policy gate."] as const,
    ["LIVING_TEXTBOOK_PERSISTENCE_RETENTION_POLICY_ACCEPTED", "Durable progression writes require the deployment retention-policy gate."] as const,
    ["LIVING_TEXTBOOK_PERSISTENCE_RELEASE_APPROVED", "Durable progression writes require the deployment release-approval gate."] as const,
  ];
  return requiredGates
    .filter(([variable]) => process.env[variable] !== "true")
    .map(([, message]) => message);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
