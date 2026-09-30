import { readBoundedQueryParam } from "@/server/persistence/requestBoundary";
import { readLocalPilotPackageQrPrintSheet } from "@/server/delivery/localPilotPackageRuntimeReader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = readBoundedQueryParam(url, "tenantId");
  const packageId = readBoundedQueryParam(url, "packageId");
  const version = readBoundedQueryParam(url, "version");
  if (tenantId === undefined || packageId === undefined || version === undefined || !tenantId || !packageId || !version) {
    return json({ status: "rejected", html: null, errors: ["Local package QR print requires bounded tenantId, packageId, and version query parameters."] }, 400);
  }
  const result = await readLocalPilotPackageQrPrintSheet({ tenantId, packageId, version });
  if (result.status !== "available") {
    return json({ ...result, learnerRecordsIncluded: false, writesAllowed: false, hostedPersistenceActivated: false, qrAliasesMutated: false }, result.status === "blocked" ? 423 : 404);
  }
  return new Response(result.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Disposition": "inline",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:;",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
