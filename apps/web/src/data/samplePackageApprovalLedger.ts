export type PackageApprovalStatus = "signed" | "needs-signoff" | "blocked";
export type PackageApprovalRole =
  | "content"
  | "media"
  | "games"
  | "qr"
  | "policy"
  | "deployment"
  | "platform";

export interface PackageApprovalSignoff {
  signoffId: string;
  label: string;
  role: PackageApprovalRole;
  status: PackageApprovalStatus;
  owner: string;
  requiredBeforePilot: boolean;
  evidence: string;
  nextStep: string;
  cannotApproveWhile: string[];
}

export interface PackageApprovalLedger {
  ledgerId: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  label: string;
  summary: string;
  approvalRule: string;
  signoffs: PackageApprovalSignoff[];
  auditRules: string[];
}

export const samplePackageApprovalLedger: PackageApprovalLedger = {
  ledgerId: "sample-publisher-approval-ledger",
  tenantId: "sample-publisher",
  packageId: "starter-english-level-1-unit-1",
  releaseCandidate: "2026.1 pilot candidate",
  label: "Sample publisher pilot approval ledger",
  summary:
    "This ledger is the backend-agnostic sign-off record that will eventually sit behind the package publish gate. It shows which human approvals are required before a package can move from demo to live pilot.",
  approvalRule:
    "A release candidate can be approved only when every required sign-off is signed and no required sign-off is blocked by media rights, report policy, QR stability, deployment, or persistence gaps.",
  signoffs: [
    {
      signoffId: "content-review",
      label: "Content review approval",
      role: "content",
      status: "signed",
      owner: "Platform content reviewer",
      requiredBeforePilot: true,
      evidence: "Sample publisher Unit 1 has a reviewed learning payload and tenant-specific route.",
      nextStep: "Repeat review with real partner PDF-derived units before pilot.",
      cannotApproveWhile: ["Any learner-facing text is unreviewed", "Support language can unlock progress"],
    },
    {
      signoffId: "media-rights",
      label: "Media rights approval",
      role: "media",
      status: "needs-signoff",
      owner: "Publisher media owner",
      requiredBeforePilot: true,
      evidence: "Media package fields exist, but real audio/video files and rights metadata are not attached.",
      nextStep: "Attach owned files, rights notes, durations, posters, and local/hosted delivery paths.",
      cannotApproveWhile: ["A file has unknown ownership", "A video or song lacks license metadata"],
    },
    {
      signoffId: "game-quality",
      label: "Game quality approval",
      role: "games",
      status: "needs-signoff",
      owner: "Platform game lead",
      requiredBeforePilot: true,
      evidence: "Foundation games exist, but the pilot game set still needs per-mode QA and mobile review.",
      nextStep: "Approve two to four pilot modes and reject prototypes that lack events, audio, or mobile stability.",
      cannotApproveWhile: ["A game lacks standard progress events", "A text prompt lacks tap-to-speak support"],
    },
    {
      signoffId: "qr-route-stability",
      label: "QR and route stability approval",
      role: "qr",
      status: "signed",
      owner: "Platform operator",
      requiredBeforePilot: true,
      evidence: "Edition-aware alias scaffolds route to stable package identifiers instead of raw files.",
      nextStep: "Bind real printed QR codes to stable registry rows before printing.",
      cannotApproveWhile: ["A QR route points to localhost", "A QR route points directly to a media file"],
    },
    {
      signoffId: "privacy-report-policy",
      label: "Privacy, reports, and retention approval",
      role: "policy",
      status: "blocked",
      owner: "School or publisher admin",
      requiredBeforePilot: true,
      evidence: "Teacher report preview exists, but no production retention/export policy is accepted.",
      nextStep: "Accept privacy, retention, export fields, access control, and guardian/school policy before real data storage.",
      cannotApproveWhile: ["Report export remains policy-blocked", "Persistence adapter is not selected"],
    },
    {
      signoffId: "deployment-support",
      label: "Deployment and support approval",
      role: "deployment",
      status: "needs-signoff",
      owner: "Shared platform and tenant owner",
      requiredBeforePilot: true,
      evidence: "Hosted PWA is recommended, but first pilot deployment path and support expectations need acceptance.",
      nextStep: "Confirm hosted PWA first pilot or explicitly scope closed local deployment cost and support.",
      cannotApproveWhile: ["No deployment owner is named", "Local/offline support is promised without update and backup procedures"],
    },
    {
      signoffId: "platform-release",
      label: "Platform release approval",
      role: "platform",
      status: "needs-signoff",
      owner: "Codex / platform lead",
      requiredBeforePilot: true,
      evidence: "Typecheck/build can pass locally, but the release candidate still needs full route and mobile verification.",
      nextStep: "Run focused verification checklists and record any unresolved browser or mobile issues.",
      cannotApproveWhile: ["Typecheck or build fails", "Teacher intake shows unresolved release blockers as ready"],
    },
  ],
  auditRules: [
    "The ledger records approval intent only; it does not create production persistence yet.",
    "Every signed item must link to review evidence when persistence exists.",
    "No sign-off can override a release-blocking safety rule.",
    "A future backend should store approver identity, timestamp, release candidate, package version, and evidence links.",
    "MiniStar and partner packages use the same approval shape with tenant-specific owners.",
  ],
};
