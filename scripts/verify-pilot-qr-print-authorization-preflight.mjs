import fs from "node:fs";

const model = fs.readFileSync("packages/content-model/src/pilotQrPrintAuthorizationPreflight.ts", "utf8");
const sample = fs.readFileSync("apps/web/src/data/samplePilotQrPrintAuthorizationPreflight.ts", "utf8");
const panel = fs.readFileSync("apps/web/src/features/evidence/PilotQrPrintAuthorizationPreflightPanel.tsx", "utf8");
const route = fs.readFileSync("apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx", "utf8");

for (const [source, checks] of [
  [model, ["PilotQrPrintAuthorizationPreflight", "ready-for-authorization", "authorizationStatus: \"pending\"", "printArtifactAllowed: false", "Durable QR alias registry persistence must be selected"]],
  [sample, ["samplePilotQrPrintAuthorizationPreflight", "samplePilotQrPrintAuthorizationPreflightErrors"]],
  [panel, ["QR print authorization preflight", "Ready for authorization", "Print remains disabled", "Pending human decision", "Remaining gates"]],
  [route, ["PilotQrPrintAuthorizationPreflightPanel", "samplePilotQrPrintAuthorizationPreflight"]],
]) {
  for (const check of checks) {
    if (!source.includes(check)) throw new Error(`QR print authorization preflight is missing: ${check}`);
  }
}

if (/window\.print|window\.location|fetch\(|POST|PUT|DELETE/.test(panel)) {
  throw new Error("QR print authorization preflight panel must remain review-only without print controls or writes.");
}

console.log("PASS QR print authorization preflight remains tenant-bound, side-effect-free, and blocked pending durable registry and human authorization.");
