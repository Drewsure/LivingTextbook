import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const page = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/page.tsx"), "utf8");
const panel = readFileSync(resolve(root, "apps/web/src/features/deployment/LocalPilotPackageRuntimePanel.tsx"), "utf8");
const contracts = readFileSync(resolve(root, "apps/web/src/features/routes/routeContracts.ts"), "utf8");

const failures = [];
for (const [source, markers] of [
  [page, ["readLocalPilotPackageRuntime", "resolveLocalPilotPackageTenant", "runtimeResult.summary.tenantConfig", "compact", "tenantId", "packageId", "version"]],
  [panel, ["Package readable", "Printed QR route map", "Curated game map", "No learner records", "No hosted persistence activation", "safeLocalPath"]],
  [contracts, ["getLocalPilotPackageRuntimePath", "/local/package/"]],
]) {
  for (const marker of markers) if (!source.includes(marker)) failures.push(`Missing local runtime route marker: ${marker}`);
}
for (const forbidden of ["const tenants =", "ministarTenant", "samplePublisherTenant"]) {
  if (page.includes(forbidden)) failures.push(`Local runtime route must not hardcode tenant branding: ${forbidden}`);
}
for (const forbidden of ["fetch(", "fetch(", "localPackageWrites", "activateStudent", "learnerRecords.map"]) {
  if (panel.includes(forbidden)) failures.push(`Local runtime panel must not contain operational marker: ${forbidden}`);
}
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("PASS local package runtime route exposes verified navigation without writes, activation, or learner data.");
