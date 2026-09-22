import {
  validateTeacherDraftPersistenceAdmissionBinding,
  validateTeacherDraftPersistenceAdmissionPreflight,
  type TeacherDraftPersistenceAdmissionPreflight,
} from "@living-textbook/content-model";
import { sampleSourceDraftImportPreviews } from "./sampleSourceDraftImport";
import { sampleTeacherDraftPackages } from "./sampleTeacherDraftPackage";

const draft = sampleTeacherDraftPackages.find((candidate) => candidate.draftId === "draft-sample-publisher-l1-u1");
const sourceDraftImportPreview = sampleSourceDraftImportPreviews[0];

export const sampleTeacherDraftPersistencePreflight: TeacherDraftPersistenceAdmissionPreflight = {
  preflightId: "teacher-draft-persistence-admission-sample-publisher-l1-u1",
  tenantId: "sample-publisher",
  draftId: "draft-sample-publisher-l1-u1",
  sourcePackageId: "sample-publisher-l1-u1-routines-package",
  unitKey: "sample-publisher:partner-textbook-companion:L1:U1",
  sourceDraftImportPreviewId: sourceDraftImportPreview?.importPreviewId ?? "source-draft-import-sample-publisher-l1-u1-v1",
  mode: "review-only",
  status: "blocked",
  visibility: "private-tenant",
  ownerIdentityRequired: true,
  ownerIdentityBound: false,
  sourceLineageBound: true,
  providerNeutral: true,
  writeAllowed: false,
  assignmentAllowed: false,
  promotionAllowed: false,
  rawSourceBinaryStorageAllowed: false,
  rawAudioStorageAllowed: false,
  learnerAudioStorageAllowed: false,
  transcriptStorageAllowed: false,
  requiredRecords: ["teacher-draft-package", "teacher-draft-review-handoff", "source-extraction-review-packet", "upload-review"],
  requiredEvidence: [
    "Tenant-scoped teacher owner identity and private visibility policy",
    "Exact source package, source checksum, extraction preview, and unit lineage",
    "Media rights and target-language audio review evidence",
    "Provider selection, retention, export, and rollback policy evidence",
  ],
  blockers: [
    "Teacher owner identity and tenant-scoped authorization are not yet bound to a durable draft record.",
    "Persistence provider and school retention policy remain unselected and unaccepted.",
    "The source draft import preview still blocks every storage and assignment side effect.",
  ],
  blockedActions: [
    "No teacher draft persistence write",
    "No direct student assignment",
    "No package promotion",
    "No raw source binary storage in the draft record",
    "No learner audio or transcript storage",
  ],
  nextSteps: [
    "Bind a tenant-scoped teacher owner identity in the future provider-specific implementation plan.",
    "Accept retention, export, deletion, and rollback policy for the named tenant and package.",
    "Reconcile rights, audio, source lineage, and draft review evidence before any write work order.",
  ],
};

export const sampleTeacherDraftPersistencePreflightErrors = [
  ...validateTeacherDraftPersistenceAdmissionPreflight(sampleTeacherDraftPersistencePreflight),
  ...validateTeacherDraftPersistenceAdmissionBinding(sampleTeacherDraftPersistencePreflight, draft, sourceDraftImportPreview),
];
