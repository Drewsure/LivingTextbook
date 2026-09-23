import { NextResponse } from "next/server";
import { getDurableOperationsPolicySnapshot } from "@/server/persistence/sqliteProgressionOperations";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import {
  getConfiguredPersistenceProvider,
  getPersistenceProviderConfiguration,
} from "@/server/persistence/progressionPersistenceAdapter";
import { readBoundedQueryLimit, readBoundedQueryParam } from "@/server/persistence/requestBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const limit = readBoundedQueryLimit(url, "limit");
  if (tenantId === undefined || limit === undefined) {
    return json({ status: "rejected", records: [], errors: ["Operation evidence query exceeds the bounded query limits."], privacy: safePrivacyMessage() }, 400);
  }
  if (!tenantId || !hasTeacherOperationsReadAuthorization(request, tenantId)) {
    return json({ status: "unauthorized", records: [], errors: ["Teacher-scoped authorization is required to read operation evidence."], privacy: safePrivacyMessage() }, 401);
  }
  const provider = getConfiguredPersistenceProvider();
  const providerConfiguration = getPersistenceProviderConfiguration();
  if (!providerConfiguration.valid) {
    return json({ status: "blocked", provider, records: [], errors: providerConfiguration.errors, privacy: safePrivacyMessage() }, 423);
  }
  if (provider !== "sqlite") {
    return json({ status: "rehearsal", provider, records: [], errors: ["Operation evidence is unavailable while durable storage is disabled."], privacy: safePrivacyMessage() });
  }

  try {
    return json({
      status: "available",
      provider,
      records: getDurableProgressionStore().listOperationEvidence(limit ?? 50, tenantId).map(({ tenantScopeDigest: _tenantScopeDigest, ...record }) => record),
      errors: [],
      privacy: safePrivacyMessage(),
      operations: getDurableOperationsPolicySnapshot(),
    });
  } catch {
    return json({ status: "unavailable", provider, records: [], errors: ["Operation evidence could not be read."], privacy: safePrivacyMessage() }, 503);
  }
}

function safePrivacyMessage(): string {
  return "Operation evidence contains metadata only: No learner records, student session IDs, database paths, credentials, raw audio, or transcripts.";
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
