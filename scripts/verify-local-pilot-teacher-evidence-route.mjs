import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/teacher/[unitId]/page.tsx"), "utf8");
const contracts = readFileSync(resolve(root, "apps/web/src/features/routes/routeContracts.ts"), "utf8");
const frontDoor = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/front-door/[unitId]/page.tsx"), "utf8");
const memory = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/memory/[unitId]/page.tsx"), "utf8");
const media = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/media/[playlistId]/page.tsx"), "utf8");

for (const marker of [
  "readLocalPilotPackageContent",
  "TeacherSessionLocalEvidencePanel",
  "createLaunchSession",
  "getInitialStudentProgression",
  "getLocalPilotPackageLaunchCode",
  "expectedPackageId={packageId}",
  "expectedStudentSessionId={progression.studentSessionId}",
]) {
  if (!page.includes(marker)) throw new Error(`Local package teacher evidence route is missing: ${marker}`);
}
for (const marker of ["getLocalPilotPackageTeacherEvidencePath", "/teacher/"]) {
  if (!contracts.includes(marker)) throw new Error(`Local package teacher evidence contract is missing: ${marker}`);
}
for (const route of [frontDoor, memory, media]) {
  if (!route.includes("getLocalPilotPackageLaunchCode")) throw new Error("Local package student routes must share one package/unit launch identity.");
}
for (const forbidden of ["resolveSampleLaunchContext", "studentRecords", "fetch(", "writeFile", "mkdir", "unlink"]) {
  if (page.includes(forbidden)) throw new Error(`Local package teacher evidence route must not use forbidden path or side effect: ${forbidden}`);
}

console.log("PASS local package teacher evidence route observes the shared package/unit browser session without sample data or hosted writes.");
