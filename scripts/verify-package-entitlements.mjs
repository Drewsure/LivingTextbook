import { readFileSync } from "node:fs";

const catalog = readSource("../apps/web/src/data/sampleWhiteLabelPackageCatalog.ts");
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
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const buildSessions = readSource("../docs/BUILD_SESSIONS.md");
const decisionRegister = readSource("../docs/decision-register/DR-488-package-entitlement-workbench-route.md");
const adoptionDecisionRegister = readSource("../docs/decision-register/DR-489-package-adoption-readiness-flow.md");
const adr = readSource("../docs/adr/0417-package-entitlement-workbench-route.md");
const adoptionAdr = readSource("../docs/adr/0418-package-adoption-readiness-flow.md");
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

for (const packageId of packageIds) {
  requireText(catalog, `packageId: "${packageId}"`, `Package catalog missing package id: ${packageId}.`);
}

for (const adoptionId of adoptionIds) {
  requireText(adoptionReadiness, `adoptionId: "${adoptionId}"`, `Package adoption readiness missing item: ${adoptionId}.`);
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

requireText(catalogPanel, "White-label package catalog", "Catalog panel must expose its heading.");
requireText(catalogPanel, "Base platform first, optional packages second", "Catalog panel must preserve base-first package rule.");
requireText(catalogPanel, "Included capabilities", "Catalog panel must show included capabilities.");
requireText(catalogPanel, "Adoption requirements", "Catalog panel must show adoption requirements.");
requireText(catalogPanel, "Cost controls", "Catalog panel must show cost controls.");
requireText(catalogPanel, "Child safety rules", "Catalog panel must show child safety rules.");
requireText(entitlementPage, "PackageTierCatalogPanel", "Entitlement route must render the package catalog panel.");
requireText(entitlementPage, "PackageAdoptionReadinessPanel", "Entitlement route must render package adoption readiness.");
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
requireText(adr, "ADR 0417", "ADR must exist.");
requireText(adoptionAdr, "ADR 0418", "Package adoption ADR must exist.");
requireText(routeChecks, "Package Entitlement Workbench Route Checks", "Route checklist must exist.");
requireText(verifierChecks, "Package Entitlement Verifier Checks", "Verifier checklist must exist.");
requireText(routeChecks, "The active route verifier must expect 82 active routes.", "Route checklist must preserve active route count.");

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
  `PASS package entitlements protect ${packageIds.length} package option(s), ${adoptionIds.length} adoption review(s), and ${requiredBoundaryText.length} cost boundary rule(s).`,
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
