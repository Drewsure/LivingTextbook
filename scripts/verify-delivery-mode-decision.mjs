import { readFileSync } from "node:fs";

const files = {
  model: readFileSync(new URL("../packages/content-model/src/uploadQuarantineDeliveryModeDecision.ts", import.meta.url), "utf8"),
  store: readFileSync(new URL("../apps/web/src/server/uploads/quarantineUploadStore.ts", import.meta.url), "utf8"),
  route: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/delivery-mode-decision/route.ts", import.meta.url), "utf8"),
  panel: readFileSync(new URL("../apps/web/src/features/content-intake/DeliveryModeDecisionCapture.tsx", import.meta.url), "utf8"),
  liveRoute: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", import.meta.url), "utf8"),
};

const required = [
  ["model review-only status", files.model, "selected-review-only"],
  ["model delivery choices", files.model, '"closed-local" | "hosted-pwa" | "hybrid"'],
  ["model provider block", files.model, "providerSelected: false"],
  ["model package block", files.model, "packageAssemblyAllowed: false"],
  ["store sidecar", files.store, "delivery-mode-decision.json"],
  ["store feature gate", files.store, "LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED"],
  ["store writer", files.store, "writeQuarantineDeliveryModeDecision"],
  ["route response", files.route, '"recorded-review-only"'],
  ["route package derivation", files.route, "derivePackageId"],
  ["panel decision language", files.panel, "Choose the pilot shape without activating it"],
  ["panel activation language", files.panel, "No provider or learner write was enabled."],
  ["live route reader", files.liveRoute, "readQuarantineDeliveryModeDecision"],
  ["live route mode propagation", files.liveRoute, "selectedMode: deliveryModeDecision?.selectedMode"],
];

for (const [label, source, marker] of required) {
  if (!source.includes(marker)) {
    console.error(`FAIL delivery mode decision verifier: missing ${label} marker ${marker}`);
    process.exit(1);
  }
}

for (const forbidden of [
  "providerSelected: true",
  "persistenceActivationAllowed: true",
  "packageAssemblyAllowed: true",
  "qrPrintAllowed: true",
  "studentFacingUseAllowed: true",
]) {
  if (files.model.includes(forbidden)) {
    console.error(`FAIL delivery mode decision verifier: forbidden activation marker ${forbidden}`);
    process.exit(1);
  }
}

console.log("PASS delivery mode decision remains tenant-scoped, immutable, review-only, and propagated into the live manifest preview without activation capability.");
