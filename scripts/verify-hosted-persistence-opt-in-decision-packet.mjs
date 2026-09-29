import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const model = read("packages/content-model/src/hostedPersistenceOptInDecisionPacket.ts");
const sample = read("apps/web/src/data/sampleHostedPersistenceOptInDecisionPacket.ts");
const panel = read("apps/web/src/features/persistence/HostedPersistenceOptInDecisionPacketPanel.tsx");
const page = read("apps/web/src/app/teacher/persistence/page.tsx");
const liveBinding = read("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts");

for (const [label, source, tokens] of [
  ["model", model, ["HostedPersistenceOptInDecisionPacket", "createReviewOnlyHostedPersistenceOptInDecisionPacket", "validateHostedPersistenceOptInDecisionPacket", "reviewOnly", "writesAllowed", "learnerRecordsIncluded"]],
  ["sample", sample, ["sampleHostedPersistenceOptInDecisionPacket", "status: \"blocked\"", "decision: \"not-recorded\"", "sideEffect: \"none\""]],
  ["panel", panel, ["Hosted persistence opt-in, package-scoped", "No activation control", "Human decision boundary"]],
  ["page", page, ["HostedPersistenceOptInDecisionPacketPanel", "sampleHostedPersistenceOptInDecisionPacket"]],
  ["live binding", liveBinding, ["createReviewOnlyHostedPersistenceOptInDecisionPacket", "hostedPersistenceOptInPacket", "hostedPersistenceDecisionPacketId"]],
]) for (const token of tokens) if (!source.includes(token)) throw new Error(`${label} is missing required token: ${token}`);

if (model.includes("optInRecorded: true") || model.includes("writesAllowed: true") || model.includes("activationAllowed: true")) throw new Error("Hosted persistence opt-in contract must not authorize activation or writes.");
if (liveBinding.includes("writesAllowed: true") || liveBinding.includes("activationAllowed: true") || liveBinding.includes("studentFacingUseAllowed: true")) throw new Error("Live hosted opt-in preview must not authorize activation or writes.");
if (!sample.includes("deliveryMode: \"hosted-managed\"")) throw new Error("Sample must demonstrate a hosted delivery candidate.");
console.log("PASS hosted persistence opt-in decision packet contract");
