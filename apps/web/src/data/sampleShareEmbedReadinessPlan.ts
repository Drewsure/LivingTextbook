export type ShareEmbedStatus = "ready" | "planned" | "blocked" | "optional";
export type ShareEmbedOwner = "teacher" | "tenant-admin" | "platform" | "publisher";

export interface ShareEmbedLane {
  laneId: string;
  label: string;
  owner: ShareEmbedOwner;
  status: ShareEmbedStatus;
  purpose: string;
  allowedUse: string[];
  blockedUse: string[];
  nextStep: string;
}

export interface ShareEmbedGate {
  gateId: string;
  label: string;
  status: ShareEmbedStatus;
  protects: string;
  evidence: string;
  blocksPublicRelease: boolean;
  nextStep: string;
}

export interface ShareEmbedReadinessPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  releaseRule: string;
  lanes: ShareEmbedLane[];
  gates: ShareEmbedGate[];
}

export const sampleShareEmbedReadinessPlan: ShareEmbedReadinessPlan = {
  planId: "sample-publisher-share-embed-readiness",
  tenantId: "sample-publisher",
  label: "Share and embed readiness",
  summary:
    "Sharing must start with focused private assignment links and stable QR routes. Public links, public community discovery, and website embeds are valuable later, but only after tenant access, reporting, rights, and privacy boundaries are enforceable.",
  releaseRule:
    "Private assignment links are the first share path. Public sharing and iframe embeds stay blocked for v1 until access control, student reporting, origin policy, rights visibility, and tenant approval gates are durable.",
  lanes: [
    {
      laneId: "private-assignment-link",
      label: "Private assignment links",
      owner: "teacher",
      status: "planned",
      purpose: "Let a teacher share one reviewed activity or curated pathway with students without exposing authoring controls.",
      allowedUse: ["QR classroom launch", "Entry-code launch", "Reviewed package route", "Teacher-visible reporting"],
      blockedUse: ["Public discovery", "Unreviewed draft assignment", "Student access to teacher options"],
      nextStep: "Promote current demo routes into persisted assignment records after auth and storage decisions.",
    },
    {
      laneId: "teacher-colleague-share",
      label: "Teacher colleague sharing",
      owner: "tenant-admin",
      status: "planned",
      purpose: "Allow teachers inside one tenant or school to copy reviewed packages without overwriting source content.",
      allowedUse: ["Private tenant library", "Copy as draft", "Preserve source lineage", "Submit copy for review"],
      blockedUse: ["Cross-tenant leakage", "Public marketplace sharing", "Lost rights metadata"],
      nextStep: "Connect to tenant library ownership, versioning, and approval ledger records.",
    },
    {
      laneId: "public-share-link",
      label: "Public share links",
      owner: "tenant-admin",
      status: "blocked",
      purpose: "Keep public activity URLs unavailable until visibility, rights, moderation, and student-data rules exist.",
      allowedUse: ["None for v1"],
      blockedUse: ["Public student result collection", "Public teacher resource discovery", "Search-indexed tenant packages"],
      nextStep: "Revisit after private sharing, access control, moderation, and rights review are production-ready.",
    },
    {
      laneId: "website-embed",
      label: "Website iframe embeds",
      owner: "publisher",
      status: "optional",
      purpose: "Support future publisher or school website embedding without breaking assignment reporting or tenant security.",
      allowedUse: ["Future reviewed iframe", "Future thumbnail link", "Future icon link"],
      blockedUse: ["IFrame embed blocked for v1", "Embedding unreviewed drafts", "Embedding routes that expose teacher/admin controls"],
      nextStep: "Define allowed origins, embed token rules, reporting mode, and fallback links before implementation.",
    },
    {
      laneId: "public-community-discovery",
      label: "Public community discovery",
      owner: "platform",
      status: "blocked",
      purpose: "Avoid moderation, copyright, privacy, and quality-control burden before the private library is reliable.",
      allowedUse: ["None for v1"],
      blockedUse: ["Public community library", "Unmoderated teacher uploads", "Cross-tenant remixing"],
      nextStep: "Consider only after tenant libraries, rights workflow, abuse handling, and quality scoring exist.",
    },
  ],
  gates: [
    {
      gateId: "focused-assignment-surface",
      label: "Focused assignment surface",
      status: "ready",
      protects: "Students see the assigned activity or pathway without teacher authoring distractions.",
      evidence: "Current launch, quiz, sentence, speak, media, and training routes are student-facing and separate from teacher intake.",
      blocksPublicRelease: false,
      nextStep: "Keep assignment routes narrow as persistence is added.",
    },
    {
      gateId: "tenant-access-control",
      label: "Tenant access control",
      status: "blocked",
      protects: "Private packages, student reports, and teacher drafts cannot leak outside the tenant.",
      evidence: "Auth, teacher identity, tenant roles, and durable permissions are not implemented yet.",
      blocksPublicRelease: true,
      nextStep: "Define teacher, student, publisher, and tenant-admin permissions before live sharing.",
    },
    {
      gateId: "reporting-boundary",
      label: "Assignment reporting boundary",
      status: "planned",
      protects: "Embedded or shared assignments preserve teacher reports without exposing private student data.",
      evidence: "Teacher report package previews exist, but live export and durable storage remain blocked.",
      blocksPublicRelease: true,
      nextStep: "Connect sharing records to launch sessions, event acceptance, and report package boundaries.",
    },
    {
      gateId: "embed-origin-policy",
      label: "Embed origin policy",
      status: "blocked",
      protects: "Publisher websites can embed activities only from approved origins and without route spoofing.",
      evidence: "No embed token, origin allowlist, or iframe sandbox policy exists yet.",
      blocksPublicRelease: true,
      nextStep: "Specify origin allowlist, sandbox attributes, token expiry, and fallback route behavior.",
    },
    {
      gateId: "rights-visibility",
      label: "Rights and visibility",
      status: "planned",
      protects: "Media, printable, and package rights are checked before public or embedded sharing.",
      evidence: "Media rights and package approval gates exist as scaffolds, not durable approval records.",
      blocksPublicRelease: true,
      nextStep: "Require approval ledger and rights snapshot before any public link or embed is enabled.",
    },
  ],
};
