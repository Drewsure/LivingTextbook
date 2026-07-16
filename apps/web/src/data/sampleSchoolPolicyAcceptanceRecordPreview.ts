import { sampleSchoolPolicyTextPack, type SchoolPolicyTextPack } from "@/data/sampleSchoolPolicyTextPack";

export type SchoolPolicyAcceptanceRecordPreviewStatus = "blocked" | "missing-policy" | "future-required";

export interface SchoolPolicyAcceptanceRecordField {
  fieldId: string;
  label: string;
  status: SchoolPolicyAcceptanceRecordPreviewStatus;
  source: string;
  requiredValue: string;
  blockedReason: string;
}

export interface SchoolPolicyAcceptanceRecordPreview {
  previewId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  statusLabel: string;
  summary: string;
  minimumAcceptedRecordFields: SchoolPolicyAcceptanceRecordField[];
  nonAcceptedMarkers: string[];
  blockedActions: string[];
  reviewRules: string[];
}

export const sampleSchoolPolicyAcceptanceRecordPreview = createSchoolPolicyAcceptanceRecordPreview({
  textPack: sampleSchoolPolicyTextPack,
});

export function createSchoolPolicyAcceptanceRecordPreview({
  textPack,
}: {
  textPack: SchoolPolicyTextPack;
}): SchoolPolicyAcceptanceRecordPreview {
  return {
    previewId: `${textPack.policyTextPackId}-acceptance-record-preview`,
    label: "Future school acceptance record preview",
    tenantId: textPack.tenantId,
    packageId: textPack.packageId,
    releaseCandidate: textPack.releaseCandidate,
    sourceOfTruth: "Source of truth: school policy text version pack",
    statusLabel: "Acceptance record blocked",
    summary:
      "This preview shows the minimum fields a future authenticated school acceptance record would need. It is not an accepted record and cannot store accepted terms, signatures, or launch approval.",
    minimumAcceptedRecordFields: [
      {
        fieldId: "authenticated-school-approver",
        label: "Authenticated school approver",
        status: "future-required",
        source: "reviewer-identity-signature-gate",
        requiredValue: "School approver id, role, school organization id, identity provider, and timestamp",
        blockedReason: "No authenticated school approver workflow exists.",
      },
      {
        fieldId: "accepted-policy-text-version",
        label: "Accepted policy text version",
        status: "missing-policy",
        source: textPack.policyTextPackId,
        requiredValue: "policy_text_pack_id, policy_text_version, clause versions, and superseded-policy link",
        blockedReason: "Policy text is still a draft version pack and cannot be accepted.",
      },
      {
        fieldId: "release-candidate-binding",
        label: "Release candidate binding",
        status: "future-required",
        source: "package-release-candidate",
        requiredValue: "tenant id, package id, release candidate id, package version, and route manifest version",
        blockedReason: "Release-control gates are still review-only.",
      },
      {
        fieldId: "evidence-packet-binding",
        label: "Evidence packet binding",
        status: "future-required",
        source: "pilot-evidence-packet",
        requiredValue: "evidence packet id, attachment readiness, reviewer identity gate, and export policy version",
        blockedReason: "Evidence export and signed approval capture remain blocked.",
      },
      {
        fieldId: "school-operating-consent",
        label: "School operating consent",
        status: "missing-policy",
        source: "school-launch-policy-gate",
        requiredValue: "learner data, teacher reports, QR/front-door use, support-language limits, and local mode terms",
        blockedReason: "School privacy, retention, reporting, and operating mode policy are not accepted.",
      },
      {
        fieldId: "premium-feature-consent",
        label: "Premium feature consent",
        status: "missing-policy",
        source: "microphone-ai-tutor-premium",
        requiredValue: "microphone, AI Tutor, speech scoring, transcript, model-call cost, usage cap, and opt-out terms",
        blockedReason: "Microphone and AI Tutor remain optional, premium, and off by default.",
      },
      {
        fieldId: "storage-and-rollback-consent",
        label: "Storage and rollback consent",
        status: "future-required",
        source: "backend-storage-and-release-control",
        requiredValue: "hosted/local adapter, retention, export, deletion, rollback owner, and revocation plan",
        blockedReason: "Storage adapter activation and rollback acceptance are still blocked.",
      },
      {
        fieldId: "acceptance-effect",
        label: "Acceptance effect",
        status: "blocked",
        source: "classroom-launch-gate",
        requiredValue: "Explicit statement of what acceptance does and does not unlock",
        blockedReason: "Acceptance cannot override missing release, storage, dry-run, child-safety, or launch gates.",
      },
    ],
    nonAcceptedMarkers: [
      "No accepted terms stored",
      "No approver signature stored",
      "No evidence export generated",
      "No storage activation token",
      "No launch-ready status",
      "No production QR promise",
    ],
    blockedActions: [
      "No accept button",
      "No accepted policy record",
      "No signature capture",
      "No evidence export",
      "No storage activation",
      "No release-state mutation",
      "No AI Tutor activation",
      "No real learner data collection",
      "No teacher report export",
      "No live classroom workflow",
    ],
    reviewRules: [
      "A future acceptance record must bind to a reviewed policy text pack version.",
      "A future acceptance record must identify the school approver and school organization.",
      "A future acceptance record must state exactly which release candidate and evidence packet are being accepted.",
      "Acceptance must not create progress, unlocks, report export, AI Tutor activation, storage activation, or production QR promises by itself.",
      "Revocation and rollback terms must exist before acceptance can affect launch readiness.",
    ],
  };
}
