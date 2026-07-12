import { samplePartnerContentPackage, samplePartnerUnitOne } from "./samplePartnerPackage";
import { sampleTeacherDraftPackages } from "./sampleTeacherDraftPackage";
import { sampleTenantLibraryPlan } from "./sampleTenantLibraryPlan";

export type TeacherLibraryItemStatus = "draft-only" | "reviewed" | "planned" | "blocked";
export type TeacherLibraryItemKind = "teacher-draft" | "tenant-approved-package" | "school-share-plan" | "public-community-block";

export interface TeacherLibraryItem {
  itemId: string;
  kind: TeacherLibraryItemKind;
  label: string;
  status: TeacherLibraryItemStatus;
  owner: string;
  visibility: string;
  sourceLineage: string[];
  includedOutputs: string[];
  allowedActions: string[];
  blockedActions: string[];
  routePath?: string;
}

export interface TeacherPrivateLibraryPreview {
  libraryId: string;
  tenantId: string;
  label: string;
  summary: string;
  publicCommunityDecision: string;
  items: TeacherLibraryItem[];
  governanceWarnings: string[];
}

const draftItems: TeacherLibraryItem[] = sampleTeacherDraftPackages.map((draft) => ({
  itemId: draft.draftId,
  kind: "teacher-draft",
  label: draft.label,
  status: "draft-only",
  owner: "Teacher private workspace",
  visibility: "Private teacher draft",
  sourceLineage: draft.sourceLineage,
  includedOutputs: ["Draft vocabulary", "Draft target sentences", "Requested activity path", "Audio plan"],
  allowedActions: ["Open draft preview", "Edit after live authoring exists", "Submit for review"],
  blockedActions: draft.blockedActions,
  routePath: `/teacher/authoring/${encodeURIComponent(draft.draftId)}`,
}));

const partnerSourceName = samplePartnerContentPackage.meta.sourceDocumentName ?? "Reviewed sample publisher source";
const partnerEdition = samplePartnerContentPackage.meta.textbookReference?.edition ?? "pilot-2026";
const partnerVersion = samplePartnerContentPackage.meta.textbookReference?.version ?? "0.1";

export const sampleTeacherPrivateLibraryPreview: TeacherPrivateLibraryPreview = {
  libraryId: "sample-publisher-teacher-private-library",
  tenantId: "sample-publisher",
  label: "Sample Publisher Teacher Library",
  summary:
    "This read-only scaffold shows the private-first library model: teacher drafts, reviewed tenant packages, planned school sharing, and blocked public community publishing.",
  publicCommunityDecision: sampleTenantLibraryPlan.publicLibraryDecision,
  items: [
    ...draftItems,
    {
      itemId: samplePartnerContentPackage.meta.packageId,
      kind: "tenant-approved-package",
      label: "Reviewed daily routines package",
      status: "reviewed",
      owner: "Sample publisher tenant",
      visibility: "Tenant-approved package library",
      sourceLineage: [
        partnerSourceName,
        `Edition ${partnerEdition}`,
        `Version ${partnerVersion}`,
      ],
      includedOutputs: [
        `${samplePartnerUnitOne.pedagogicalPayload.vocabularyTerms.length} vocabulary terms`,
        "2 target sentence structures",
        "Reviewed audio coverage",
        "Curated activity pathway",
        "Unit media playlist",
      ],
      allowedActions: ["Review package", "Assign after rollout gates", "Copy as private draft", "Print worksheet preview"],
      blockedActions: ["Overwrite source package", "Publish publicly", "Copy student reports", "Skip release gates"],
      routePath: "/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1",
    },
    {
      itemId: "sample-publisher-school-share-plan",
      kind: "school-share-plan",
      label: "School shared library",
      status: "planned",
      owner: "School or tenant admin",
      visibility: "Same-tenant school sharing",
      sourceLineage: ["Requires teacher roles", "Requires roster boundaries", "Requires copy/edit lineage"],
      includedOutputs: ["Shared reviewed packages", "Teacher copies", "Versioned package records"],
      allowedActions: ["Plan role model", "Plan school sharing policy"],
      blockedActions: ["Cross-tenant sharing", "Copy student data", "Unreviewed assignment"],
    },
    {
      itemId: "sample-publisher-public-community-block",
      kind: "public-community-block",
      label: "Public community library",
      status: "blocked",
      owner: "Platform governance",
      visibility: "Public community blocked for v1",
      sourceLineage: ["No moderation workflow", "No copyright workflow", "No abuse reporting workflow"],
      includedOutputs: ["Not enabled in v1"],
      allowedActions: ["Document future governance requirements"],
      blockedActions: ["Public community publishing", "Unmoderated remixing", "Cross-tenant public discovery"],
    },
  ],
  governanceWarnings: [
    "Private drafts cannot be assigned directly to students.",
    "Library sharing must not copy student data, report exports, recordings, or identities.",
    "Copied resources must preserve source package, edition, version, media rights, and owner lineage.",
    "Public community library remains blocked until moderation, copyright, privacy, tenant isolation, quality review, and abuse reporting exist.",
  ],
};

export function findTeacherPrivateLibraryPreview(tenantId: string): TeacherPrivateLibraryPreview | undefined {
  return tenantId === sampleTeacherPrivateLibraryPreview.tenantId ? sampleTeacherPrivateLibraryPreview : undefined;
}
