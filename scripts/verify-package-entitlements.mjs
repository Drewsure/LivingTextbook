import { readFileSync } from "node:fs";

const catalog = readSource("../apps/web/src/data/sampleWhiteLabelPackageCatalog.ts");
const adoptionRecordPreview = readSource("../apps/web/src/data/samplePackageAdoptionRecordPreview.ts");
const adoptionRecordPanel = readSource("../apps/web/src/features/entitlements/PackageAdoptionRecordPreviewPanel.tsx");
const adoptionStorageGuard = readSource("../apps/web/src/data/samplePackageAdoptionStorageGuard.ts");
const adoptionStorageGuardPanel = readSource("../apps/web/src/features/entitlements/PackageAdoptionStorageGuardPanel.tsx");
const adoptionReadiness = readSource("../apps/web/src/data/samplePackageAdoptionReadiness.ts");
const adoptionPanel = readSource("../apps/web/src/features/entitlements/PackageAdoptionReadinessPanel.tsx");
const catalogPanel = readSource("../apps/web/src/features/entitlements/PackageTierCatalogPanel.tsx");
const entitlementPage = readSource("../apps/web/src/app/teacher/entitlements/page.tsx");
const aiCostGate = readSource("../apps/web/src/data/sampleAiGeneratorCostEntitlementGate.ts");
const aiCostPanel = readSource("../apps/web/src/features/content-intake/AiGeneratorCostEntitlementGatePanel.tsx");
const voiceTutorPanel = readSource("../apps/web/src/features/ai-tutor/VoiceTutorPackagePanel.tsx");
const ministarTenant = readSource("../apps/web/src/features/tenant/ministarTenant.ts");
const sampleTenant = readSource("../apps/web/src/features/tenant/samplePublisherTenant.ts");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const backendStorageVerifier = readSource("./verify-backend-storage-readiness.mjs");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const decisionRegister = readSource("../docs/decision-register/DR-488-package-entitlement-workbench-route.md");
const adoptionDecisionRegister = readSource("../docs/decision-register/DR-489-package-adoption-readiness-flow.md");
const adoptionStorageDecisionRegister = readSource(
  "../docs/decision-register/DR-491-package-adoption-record-preview-storage-contract.md",
);
const adoptionStorageGuardDecisionRegister = readSource(
  "../docs/decision-register/DR-492-package-adoption-storage-guard-panel.md",
);
const adr = readSource("../docs/adr/0417-package-entitlement-workbench-route.md");
const adoptionAdr = readSource("../docs/adr/0418-package-adoption-readiness-flow.md");
const adoptionStorageAdr = readSource("../docs/adr/0420-package-adoption-record-preview-storage-contract.md");
const adoptionStorageGuardAdr = readSource("../docs/adr/0421-package-adoption-storage-guard-panel.md");
const routeChecks = readSource("../docs/verification/PACKAGE_ENTITLEMENT_WORKBENCH_ROUTE_CHECKS.md");
const verifierChecks = readSource("../docs/verification/PACKAGE_ENTITLEMENT_VERIFIER_CHECKS.md");
const failures = [];

const packageIds = [
  "core-classroom-pwa",
  "premium-ai-authoring",
  "premium-voice-tutor",
  "enterprise-storage-and-local",
];

const requiredCatalogText = [
  "Core classroom PWA",
  "Premium AI authoring",
  "Premium Voice Tutor",
  "Enterprise storage and local companion",
  "Teacher QR/front-door launch",
  "Target-language tap-to-speak audio",
  "No model calls",
  "No speech API calls",
  "No premium prompt",
  "No child-triggered generation",
  "No microphone prompt before teacher approval",
  "No real learner data until launch gate",
  "No local package activation from review",
];

const requiredBoundaryText = [
  "No live model billing",
  "No child-facing upsell",
  "No package activation",
  "No speech API billing",
  "No microphone permission prompt",
  "No raw audio storage",
  "No transcript storage",
  "No report export from this route",
  "No object storage write",
  "No local folder write",
  "No release-state mutation",
];

const adoptionIds = [
  "adoption-ministar-core-classroom-pwa",
  "adoption-sample-publisher-premium-ai-authoring",
  "adoption-ministar-premium-voice-tutor",
  "adoption-sample-publisher-enterprise-storage-local",
];

const adoptionRecordIds = [
  "record-preview-premium-ai-authoring-sample-publisher",
  "record-preview-premium-voice-tutor-ministar",
  "record-preview-enterprise-storage-local-sample-publisher",
];

const requiredAdoptionText = [
  "Package adoption readiness",
  "School and tenant approval before premium activation",
  "adoption review packet, not a purchase flow",
  "Required approvals",
  "Required records",
  "Cost review",
  "Policy review",
  "Blocked actions",
  "School AI usage policy approval",
  "Microphone policy acceptance",
  "Speech API cost acceptance",
  "Persistence vendor selection",
  "School privacy and retention approval",
  "No live model call",
  "No microphone permission prompt",
  "No object storage write",
  "No local package activation",
];

const requiredAdoptionRecordText = [
  "Future package adoption record preview",
  "Minimum accepted-record fields before premium enablement",
  "No accepted records",
  "Minimum fields",
  "Required evidence",
  "Acceptance scopes",
  "Blocked writes",
  "Rollback hooks",
  "school_policy_acceptance_id",
  "usage_budget_ceiling_id",
  "microphone_policy_acceptance_id",
  "transcript_retention_policy_id",
  "backend_selection_gate_id",
  "report_export_plan_id",
  "No accepted premium AI adoption record",
  "No accepted Voice Tutor adoption record",
  "No accepted enterprise adoption record",
  "No model-call enablement write",
  "No microphone scoring enablement write",
  "No local bundle activation write",
];

const requiredAdoptionStorageText = [
  "Package adoption storage guard",
  "Storage contract before premium activation",
  "No activation writes",
  "Storage contracts",
  "Visible storage fields",
  "Required before activation",
  "Blocked activations",
  "package_adoption_record_preview",
  "package-adoption-record-preview",
  "package-adoption-storage-contract-core",
  "package_adoption_record_preview_id",
  "school_policy_acceptance_id",
  "tenant_package_selection_id",
  "usage_budget_ceiling_id",
  "model_rate_card_snapshot_id",
  "microphone_policy_acceptance_id",
  "transcript_retention_policy_id",
  "report_export_plan_id",
  "billing_entitlement_write_allowed",
  "premium_feature_activation_allowed",
  "model_call_enablement_allowed",
  "microphone_scoring_enablement_allowed",
  "report_export_enablement_allowed",
  "local_companion_activation_allowed",
  "hosted-package-adoption-record-preview-write",
  "local-package-adoption-record-preview-write",
];

const requiredAdoptionStorageContractFlags = [
  "blocksBillingEntitlementWrite",
  "blocksPremiumFeatureActivation",
  "blocksLocalCompanionActivation",
];

for (const packageId of packageIds) {
  requireText(catalog, `packageId: "${packageId}"`, `Package catalog missing package id: ${packageId}.`);
}

for (const adoptionId of adoptionIds) {
  requireText(adoptionReadiness, `adoptionId: "${adoptionId}"`, `Package adoption readiness missing item: ${adoptionId}.`);
}

for (const recordId of adoptionRecordIds) {
  requireText(
    adoptionRecordPreview,
    `previewId: "${recordId}"`,
    `Package adoption record preview missing item: ${recordId}.`,
  );
}

for (const text of requiredCatalogText) {
  requireText(catalog, text, `Package catalog missing required boundary text: ${text}.`);
  requireText(routeVerifier, text, `Active route verifier must check entitlement package text: ${text}.`);
}

for (const text of requiredBoundaryText) {
  requireText(entitlementPage, text, `Entitlement page missing required boundary text: ${text}.`);
  requireText(routeVerifier, text, `Active route verifier must check entitlement boundary text: ${text}.`);
}

for (const text of requiredAdoptionText) {
  requireText(adoptionReadiness + adoptionPanel + entitlementPage, text, `Package adoption readiness missing required text: ${text}.`);
  requireText(routeVerifier, text, `Active route verifier must check adoption readiness text: ${text}.`);
}

for (const text of requiredAdoptionRecordText) {
  requireText(
    adoptionRecordPreview + adoptionRecordPanel + entitlementPage,
    text,
    `Package adoption record preview missing required text: ${text}.`,
  );
  requireText(routeVerifier, text, `Active route verifier must check adoption record preview text: ${text}.`);
}

for (const text of requiredAdoptionStorageText) {
  requireText(
    backendStorageVerifier + adoptionStorageGuard + adoptionStorageGuardPanel,
    text,
    `Package adoption storage guard must protect package adoption storage text: ${text}.`,
  );
  requireText(routeVerifier, text, `Active route verifier must check package adoption storage text: ${text}.`);
}

for (const text of requiredAdoptionStorageContractFlags) {
  requireText(backendStorageVerifier, text, `Backend storage verifier must protect package adoption contract flag: ${text}.`);
}

requireText(catalogPanel, "White-label package catalog", "Catalog panel must expose its heading.");
requireText(catalogPanel, "Base platform first, optional packages second", "Catalog panel must preserve base-first package rule.");
requireText(catalogPanel, "Included capabilities", "Catalog panel must show included capabilities.");
requireText(catalogPanel, "Adoption requirements", "Catalog panel must show adoption requirements.");
requireText(catalogPanel, "Cost controls", "Catalog panel must show cost controls.");
requireText(catalogPanel, "Child safety rules", "Catalog panel must show child safety rules.");
requireText(entitlementPage, "PackageTierCatalogPanel", "Entitlement route must render the package catalog panel.");
requireText(entitlementPage, "PackageAdoptionReadinessPanel", "Entitlement route must render package adoption readiness.");
requireText(entitlementPage, "PackageAdoptionRecordPreviewPanel", "Entitlement route must render package adoption record previews.");
requireText(entitlementPage, "PackageAdoptionStorageGuardPanel", "Entitlement route must render package adoption storage guards.");
requireText(entitlementPage, "AiGeneratorCostEntitlementGatePanel", "Entitlement route must render AI cost gates.");
requireText(entitlementPage, "VoiceTutorPackagePanel", "Entitlement route must render Voice Tutor package readiness.");
requireText(aiCostGate, "Show premium upsell to children blocked", "AI cost gate must block child-facing upsell.");
requireText(aiCostGate, "student-facing-cost-cap", "AI cost gate must define student-facing cost cap.");
requireText(aiCostGate, "Zero in foundation", "AI cost gate must keep student-triggered cost at zero in foundation.");
requireText(aiCostPanel, "Enable AI generation blocked", "AI cost panel must keep enable action disabled.");
requireText(aiCostPanel, "Estimate API cost blocked", "AI cost panel must keep live estimate action disabled.");
requireText(voiceTutorPanel, "Premium speech layer", "Voice Tutor panel must preserve premium speech layer framing.");
requireText(ministarTenant, "aiSpeechScoringEnabled: false", "MiniStar tenant must keep AI speech scoring disabled.");
requireText(sampleTenant, "aiSpeechScoringEnabled: false", "Sample publisher tenant must keep AI speech scoring disabled.");
requireText(ministarTenant, "enabled: false", "MiniStar tenant must keep AI Tutor entitlement disabled.");
requireText(sampleTenant, "enabled: false", "Sample publisher tenant must keep AI Tutor entitlement disabled.");
requireText(routeContracts, "teacher-package-entitlements", "Route contracts must include the entitlement workbench.");
requireText(activeRouteList, "http://127.0.0.1:3000/teacher/entitlements", "Active route list must include entitlement route.");
requireText(buildSessions, "/teacher/entitlements", "Build sessions must name the entitlement route.");
requireText(decisionRegister, "DR-488", "Decision register record must exist.");
requireText(adoptionDecisionRegister, "DR-489", "Package adoption decision register record must exist.");
requireText(adoptionStorageDecisionRegister, "DR-491", "Package adoption storage decision register record must exist.");
requireText(adoptionStorageGuardDecisionRegister, "DR-492", "Package adoption storage guard decision register record must exist.");
requireText(adr, "ADR 0417", "ADR must exist.");
requireText(adoptionAdr, "ADR 0418", "Package adoption ADR must exist.");
requireText(adoptionStorageAdr, "ADR 0420", "Package adoption storage ADR must exist.");
requireText(adoptionStorageGuardAdr, "ADR 0421", "Package adoption storage guard ADR must exist.");
requireText(routeChecks, "Package Entitlement Workbench Route Checks", "Route checklist must exist.");
requireText(verifierChecks, "Package Entitlement Verifier Checks", "Verifier checklist must exist.");
requireText(routeChecks, "The active route verifier must expect 88 active routes.", "Route checklist must preserve active route count.");

forbidText(entitlementPage, "input type=\"file\"", "Entitlement route must not introduce live upload inputs.");
forbidText(entitlementPage, "navigator.mediaDevices.getUserMedia", "Entitlement route must not request microphone access.");
forbidText(entitlementPage, "fetch(", "Entitlement route must not make live billing or model requests.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS package entitlements protect ${packageIds.length} package option(s), ${adoptionIds.length} adoption review(s), ${adoptionRecordIds.length} adoption record preview(s), and ${requiredBoundaryText.length} cost boundary rule(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function forbidText(source, text, message) {
  if (source.includes(text)) {
    failures.push(message);
  }
}
