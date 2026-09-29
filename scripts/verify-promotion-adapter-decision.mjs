import { readFileSync } from "node:fs";

const files = {
  model: readFileSync(new URL("../packages/content-model/src/uploadQuarantinePromotionAdapterDecision.ts", import.meta.url), "utf8"),
  admission: readFileSync(new URL("../packages/content-model/src/uploadQuarantineAdmission.ts", import.meta.url), "utf8"),
  store: readFileSync(new URL("../apps/web/src/server/uploads/quarantineUploadStore.ts", import.meta.url), "utf8"),
  route: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/promotion-adapter-decision/route.ts", import.meta.url), "utf8"),
  panel: readFileSync(new URL("../apps/web/src/features/content-intake/PromotionAdapterDecisionCapture.tsx", import.meta.url), "utf8"),
  lineage: readFileSync(new URL("../apps/web/src/server/delivery/pilotDeliveryReleaseLineage.ts", import.meta.url), "utf8"),
};

const required = [
  ["adapter choices", files.model, '"closed-local-package"'],
  ["hosted adapter choice", files.model, '"hosted-pwa-package"'],
  ["hybrid adapter choice", files.model, '"hybrid-package"'],
  ["review-only status", files.model, 'status: "selected-review-only"'],
  ["assembly block", files.model, "packageAssemblyAllowed: false"],
  ["hosted block", files.model, "hostedPersistenceActivated: false"],
  ["immutable sidecar", files.store, "promotion-adapter-decision.json"],
  ["explicit feature gate", files.store, "LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED"],
  ["live route writer", files.route, "writeQuarantinePromotionAdapterDecision"],
  ["review-only UI", files.panel, "Choose the reviewed package pathway"],
  ["lineage reader", files.lineage, "readQuarantinePromotionAdapterDecision"],
  ["mode alignment", files.lineage, "expectedAdapter"],
  ["admission integration", files.admission, "promotionAdapterDecision?.status"],
];

for (const [label, source, marker] of required) {
  if (!source.includes(marker)) {
    console.error(`FAIL promotion adapter decision verifier: missing ${label} marker ${marker}`);
    process.exit(1);
  }
}

for (const forbidden of [
  "packageAssemblyAllowed: true",
  "promotionAllowed: true",
  "qrPrintAllowed: true",
  "studentFacingUseAllowed: true",
  "hostedPersistenceActivated: true",
]) {
  if (files.model.includes(forbidden) || files.route.includes(forbidden)) {
    console.error(`FAIL promotion adapter decision verifier: forbidden activation marker ${forbidden}`);
    process.exit(1);
  }
}

console.log("PASS promotion adapter selection is tenant-bound, checksum-bound, review-only, and required by live release lineage without activation capability.");
