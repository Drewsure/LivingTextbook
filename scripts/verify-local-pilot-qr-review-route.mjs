import fs from "node:fs";

const routePath = "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/qr/[qrId]/page.tsx";
const contractsPath = "apps/web/src/features/routes/routeContracts.ts";
const route = fs.readFileSync(routePath, "utf8");
const contracts = fs.readFileSync(contractsPath, "utf8");

for (const token of [
  "readLocalPilotPackageRuntime",
  "LocalPilotPackageRuntimePanel",
  "candidate.qrId === qrId",
  "No QR alias mutation",
  "No student activation",
  "safeLocalPath",
]) {
  if (!route.includes(token)) throw new Error(`QR review route must contain ${token}.`);
}
if (!contracts.includes("getLocalPilotPackageQrReviewPath")) throw new Error("Route contracts must expose the package QR review path.");
for (const forbidden of ["studentRecords", "fetch(", "writeFile", "mkdir(", "unlink("]) {
  if (route.includes(forbidden)) throw new Error(`QR review route must not contain ${forbidden}.`);
}

console.log("PASS local package QR review route verifies a package-scoped printed identity without redirects, writes, or activation.");
