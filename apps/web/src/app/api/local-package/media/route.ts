import { NextResponse } from "next/server";
import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readLocalPilotPackageMedia, type LocalPilotPackageMediaPart } from "@/server/delivery/localPilotPackageRuntimeReader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedParts = new Set<LocalPilotPackageMediaPart>(["media", "poster", "transcript"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const packageId = readBoundedQueryParam(url, "packageId");
  const version = readBoundedQueryParam(url, "version");
  const assetId = readBoundedQueryParam(url, "assetId");
  const partValue = readBoundedQueryParam(url, "part") ?? "media";
  if (tenantId === undefined || packageId === undefined || version === undefined || assetId === undefined || !tenantId || !packageId || !version || !assetId) {
    return json({ status: "rejected", errors: ["Local package media requires bounded tenantId, packageId, version, and assetId query parameters."] }, 400);
  }
  if (!allowedParts.has(partValue as LocalPilotPackageMediaPart)) {
    return json({ status: "rejected", errors: ["Local package media part must be media, poster, or transcript."] }, 400);
  }
  const result = await readLocalPilotPackageMedia(
    { tenantId, packageId, version },
    assetId,
    partValue as LocalPilotPackageMediaPart,
  );
  if (result.status !== "available") {
    return json({ ...result, learnerRecordsIncluded: false, writesAllowed: false, hostedPersistenceActivated: false }, result.status === "blocked" ? 423 : 404);
  }
  return new Response(new Blob([result.bytes.buffer as ArrayBuffer]), {
    status: 200,
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
