import { NextResponse } from "next/server";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const packageId = readBoundedQueryParam(url, "packageId");
  const version = readBoundedQueryParam(url, "version");
  if (tenantId === undefined || packageId === undefined || version === undefined || !tenantId || !packageId || !version) {
    return json({ status: "rejected", errors: ["Local package status requires bounded tenantId, packageId, and version query parameters."] }, 400);
  }
  const result = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  return json({ ...result, writesAllowed: false, learnerRecordsIncluded: false, hostedPersistenceActivated: false, qrAliasesMutated: false }, result.status === "blocked" ? 423 : result.status === "not-found" ? 404 : 200);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
