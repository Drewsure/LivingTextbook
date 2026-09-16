import { NextResponse } from "next/server";
import { getDurableOperationsPolicySnapshot } from "@/server/persistence/sqliteProgressionOperations";
import { getDurableProgressionStore } from "@/server/persistence/sqliteProgressionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const provider = process.env.LIVING_TEXTBOOK_PERSISTENCE_PROVIDER === "sqlite" ? "sqlite" : "process-memory";
  if (provider !== "sqlite") {
    return json({ status: "rehearsal", provider, records: [], errors: ["Operation evidence is unavailable while durable storage is disabled."], privacy: safePrivacyMessage() });
  }

  const limitValue = Number.parseInt(new URL(request.url).searchParams.get("limit") ?? "50", 10);
  const limit = Number.isFinite(limitValue) ? limitValue : 50;
  try {
    return json({
      status: "available",
      provider,
      records: getDurableProgressionStore().listOperationEvidence(limit),
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
