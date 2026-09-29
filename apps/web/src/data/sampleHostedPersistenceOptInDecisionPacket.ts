import { validateHostedPersistenceOptInDecisionPacket, type HostedPersistenceOptInDecisionPacket } from "@living-textbook/content-model";

export const sampleHostedPersistenceOptInDecisionPacket: HostedPersistenceOptInDecisionPacket = {
  recordVersion: 1,
  packetId: "sample-publisher-hosted-persistence-opt-in-decision",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  quarantineId: "q-00000000-0000-4000-8000-000000000001",
  reviewPacketId: "sample-publisher-l1-u1-routines-package:q-00000000-0000-4000-8000-000000000001:package-review-packet",
  sourceChecksumSha256: "a".repeat(64),
  providerSelectionPreflightId: "sample-publisher-storage-selection-preflight",
  persistenceActivationPreflightId: "sample-publisher-durable-write-activation-preflight",
  policyRecordId: "sample-publisher-pilot-retention-policy-not-recorded",
  releaseDecisionId: "sample-publisher-release-decision-not-recorded",
  rollbackRehearsalId: "sample-publisher-hosted-local-rollback-rehearsal-pending",
  deliveryMode: "hosted-managed",
  providerCandidateId: "hosted-managed-first-pilot",
  status: "blocked",
  summary: "A package-scoped, review-only decision packet for a future hosted persistence opt-in. It makes the commercial choice explicit without selecting a provider or enabling writes.",
  decision: "not-recorded",
  reviewOnly: true,
  providerSelected: false,
  optInRecorded: false,
  writesAllowed: false,
  activationAllowed: false,
  learnerRecordsIncluded: false,
  checks: [
    { checkId: "package-review-lineage", label: "Reviewed package lineage", owner: "platform", status: "passed", evidence: "The closed-local package contract preserves tenant, package, quarantine, review-packet, and source-checksum identities.", nextAction: "Carry the same binding into any hosted release record." },
    { checkId: "provider-selection", label: "Provider and deployment choice", owner: "joint", status: "blocked", evidence: "The provider selection preflight compares hosted, local, and hybrid candidates, but no provider is selected.", nextAction: "Record a named provider and deployment mode after capability and cost review." },
    { checkId: "policy-retention", label: "School policy, retention, and deletion", owner: "tenant", status: "open", evidence: "The policy and retention workbench is available, but publisher acceptance and deletion ownership are not recorded.", nextAction: "Approve data scope, retention duration, export path, and deletion owner." },
    { checkId: "release-deployment", label: "Release and deployment approval", owner: "joint", status: "blocked", evidence: "Package release and deployment continuity remain review-only and are not an activation capability.", nextAction: "Complete release, environment, QR, and deployment rollback evidence." },
    { checkId: "cost-usage", label: "Provider cost and usage limits", owner: "joint", status: "open", evidence: "The recommended hosted candidate has a controlled cost posture, but tenant limits and budget ownership are not accepted.", nextAction: "Set an approved pilot budget, usage ceiling, and escalation owner." },
    { checkId: "rollback-export", label: "Hosted/local export and rollback", owner: "platform", status: "open", evidence: "Local recovery and export rehearsals exist; a named hosted provider has not completed the matching rehearsal.", nextAction: "Rehearse export, deletion, provider loss, and return-to-local recovery." },
    { checkId: "write-boundary", label: "Learner-write boundary", owner: "platform", status: "passed", evidence: "This packet has no activation control, no provider credential, no learner record, and no write capability.", nextAction: "Keep writes disabled until the human opt-in decision is separately recorded and verified." },
  ],
  blockedReasons: [
    "Human hosted-persistence opt-in has not been recorded for this tenant and package.",
    "No provider-specific implementation or credential is permitted at this review stage.",
    "School policy, cost limits, release approval, and hosted rollback evidence remain incomplete.",
  ],
  requiredDecisions: [
    "Select hosted-managed or hybrid delivery for this exact package.",
    "Accept the school data, retention, deletion, and export policy.",
    "Approve provider capability, cost ceiling, release owner, and rollback rehearsal.",
  ],
  nextSteps: [
    "Complete the publisher and school decision packet without enabling writes.",
    "Create a provider-specific implementation work order only after all checks pass.",
    "Run a controlled teacher/student rehearsal before any learner record is retained.",
  ],
  sideEffect: "none",
};

export const sampleHostedPersistenceOptInDecisionPacketErrors = validateHostedPersistenceOptInDecisionPacket(sampleHostedPersistenceOptInDecisionPacket);
