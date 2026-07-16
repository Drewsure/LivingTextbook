import { sampleSchoolLaunchPolicyGate, type SchoolLaunchPolicyGate } from "@/data/sampleSchoolLaunchPolicyGate";

export type SchoolPolicyHandoffPacketStatus = "ready-to-discuss" | "needs-owner" | "blocked";
export type SchoolPolicyHandoffPacketAudience = "school-admin" | "teacher" | "publisher" | "platform" | "shared";

export interface SchoolPolicyHandoffPacketSection {
  sectionId: string;
  label: string;
  status: SchoolPolicyHandoffPacketStatus;
  audience: SchoolPolicyHandoffPacketAudience;
  sourceLane: string;
  discussionPrompt: string;
  evidenceNeeded: string[];
  decisionsDeferred: string[];
  blockedActions: string[];
}

export interface SchoolPolicyHandoffPacket {
  packetId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  packetStatus: string;
  summary: string;
  sections: SchoolPolicyHandoffPacketSection[];
  operatingRules: string[];
}

export const sampleSchoolPolicyHandoffPacket = createSchoolPolicyHandoffPacket({
  gate: sampleSchoolLaunchPolicyGate,
});

export function createSchoolPolicyHandoffPacket({ gate }: { gate: SchoolLaunchPolicyGate }): SchoolPolicyHandoffPacket {
  const laneById = new Map(gate.lanes.map((lane) => [lane.laneId, lane]));

  return {
    packetId: `${gate.gateId}-handoff-packet`,
    label: "School policy handoff packet preview",
    tenantId: gate.tenantId,
    packageId: gate.packageId,
    releaseCandidate: gate.releaseCandidate,
    sourceOfTruth: "Source of truth: school launch policy gate",
    packetStatus: "Handoff draft only",
    summary:
      "This packet turns the school launch policy gate into a school-facing discussion guide. It helps a school, publisher, and platform team prepare the decisions that would later be needed for a real launch, without accepting policy, collecting signatures, exporting evidence, or changing package status.",
    sections: [
      {
        sectionId: "privacy-retention-brief",
        label: "Privacy, retention, and learner data",
        status: laneById.get("school-privacy-retention")?.status === "blocked" ? "blocked" : "needs-owner",
        audience: "school-admin",
        sourceLane: "school-privacy-retention",
        discussionPrompt:
          "Which school policy owner can confirm what learner data may be stored, how long it is retained, and who can view or request reports?",
        evidenceNeeded: [
          "Named school policy owner",
          "Student progress retention rule",
          "Teacher report visibility rule",
          "Delete/export request procedure",
        ],
        decisionsDeferred: [
          "Formal policy acceptance workflow",
          "Reviewer identity capture",
          "Signed approval evidence",
          "Production retention clock",
        ],
        blockedActions: [
          "No real learner data collection",
          "No durable learner record",
          "No teacher report export",
          "No signed approval capture",
        ],
      },
      {
        sectionId: "classroom-operating-mode-brief",
        label: "Teacher-led QR and student progression rules",
        status: "blocked",
        audience: "teacher",
        sourceLane: "school-classroom-operating-mode",
        discussionPrompt:
          "How will teachers introduce the first QR or entry code, and which student self-progression limits must remain visible before launch?",
        evidenceNeeded: [
          "Teacher-led QR or front-door entry expectation",
          "Target-language-only progress trigger rule",
          "Support-language support-only rule",
          "Microphone, AI Tutor, and background media policy choices",
        ],
        decisionsDeferred: [
          "Live classroom launch workflow",
          "Private assignment promotion",
          "Production student account creation",
          "AI Tutor package enablement",
        ],
        blockedActions: [
          "No launch button",
          "No support-language-only progression",
          "No microphone scoring by default",
          "No AI Tutor activation",
        ],
      },
      {
        sectionId: "publisher-media-local-package-brief",
        label: "Publisher media, music, video, and local package",
        status: "needs-owner",
        audience: "publisher",
        sourceLane: "publisher-media-and-local-package",
        discussionPrompt:
          "Which media assets, playlists, background music rules, captions, and local bundle responsibilities belong to the publisher before a school pilot?",
        evidenceNeeded: [
          "Music and video rights proof",
          "Caption or transcript coverage",
          "Optional game background media policy",
          "Local package update and replacement owner",
        ],
        decisionsDeferred: [
          "Live media upload",
          "Playlist promotion",
          "Local folder activation",
          "Offline media update process",
        ],
        blockedActions: [
          "No media-only mastery",
          "No background media overriding learning audio",
          "No live media upload",
          "No local deployment activation",
        ],
      },
      {
        sectionId: "teacher-dry-run-evidence-brief",
        label: "Teacher dry-run and evidence packet",
        status: "needs-owner",
        audience: "shared",
        sourceLane: "teacher-dry-run-evidence",
        discussionPrompt:
          "Which teacher-only rehearsal evidence should be reviewed before the school sees this as classroom-ready?",
        evidenceNeeded: [
          "Entry route rehearsal result",
          "Game and tap-to-speak audio check",
          "Media and support-language check",
          "Report preview and fallback check",
        ],
        decisionsDeferred: [
          "Evidence export packet",
          "Reviewer summary PDF",
          "Machine-readable JSON handoff",
          "Local companion evidence manifest",
        ],
        blockedActions: [
          "No evidence packet export",
          "No JSON export",
          "No downloadable ZIP",
          "No dry-run-as-approval shortcut",
        ],
      },
      {
        sectionId: "platform-storage-release-brief",
        label: "Platform storage, release, and rollback controls",
        status: "blocked",
        audience: "platform",
        sourceLane: "platform-release-and-storage",
        discussionPrompt:
          "Which hosted, local, or hybrid storage path will be selected before release-state mutation, launch-ready status, report export, or rollback controls exist?",
        evidenceNeeded: [
          "Backend adapter selection",
          "Evidence storage adapter selection",
          "Release-control mutation rule",
          "Rollback and route promotion rule",
        ],
        decisionsDeferred: [
          "Storage adapter activation",
          "Release-state mutation",
          "Launch-ready status",
          "Production QR promise",
        ],
        blockedActions: [
          "No storage adapter selected",
          "No release-state mutation",
          "No launch-ready status",
          "No production QR promise",
        ],
      },
    ],
    operatingRules: [
      "The handoff packet is a discussion guide, not a policy acceptance workflow.",
      "A school can review the packet without creating a class, student account, report export, or production QR.",
      "Every future acceptance action must have reviewer identity, timestamp, tenant, package, version, and evidence source.",
      "Support language can be discussed in the packet, but only target-language activity can unlock progression.",
      "Optional premium features such as AI Tutor, speech scoring, and microphone analysis must remain school/tenant opt-in and cost-visible.",
      "The packet must stay white-label: MiniStar can use it, but no school policy language may depend on MiniStar-only mascots or curriculum.",
    ],
  };
}
