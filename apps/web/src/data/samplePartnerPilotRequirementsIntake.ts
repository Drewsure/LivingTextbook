export type PartnerPilotRequirementStatus =
  | "demo-supplied"
  | "needed"
  | "policy-required"
  | "needs-decision"
  | "premium-optional"
  | "blocked";

export type PartnerPilotEvidenceTraceStatus =
  | "demo-evidence-visible"
  | "publisher-input-needed"
  | "school-policy-needed"
  | "school-decision-needed"
  | "premium-decision"
  | "blocked";

export type PartnerPilotRequirementCategory =
  | "source"
  | "media"
  | "games"
  | "entry"
  | "learner-data"
  | "reports"
  | "deployment"
  | "commercial"
  | "premium-ai"
  | "outside-prototypes";

export interface PartnerPilotRequirement {
  requirementId: string;
  category: PartnerPilotRequirementCategory;
  label: string;
  status: PartnerPilotRequirementStatus;
  owner: "publisher" | "school" | "platform" | "shared";
  requiredBeforeClassroomPilot: boolean;
  evidenceNeeded: string;
  currentFoundationEvidence: string;
  nextAction: string;
  sourceRoute: string;
}

export interface PartnerPilotEvidenceTraceItem {
  traceId: string;
  requirementId: string;
  label: string;
  status: PartnerPilotEvidenceTraceStatus;
  evidenceRoute: string;
  currentSignal: string;
  blockedUntil: string;
  pilotDependency: string;
}

export interface PartnerPilotMeetingAgendaSection {
  sectionId: string;
  label: string;
  owner: "publisher" | "school" | "platform" | "shared";
  routeToReview: string;
  questionsToAsk: string[];
  evidenceToRequest: string[];
  decisionsNotMadeHere: string[];
}

export interface PartnerPilotMeetingAgenda {
  agendaId: string;
  label: string;
  purpose: string;
  meetingOutcome: string;
  sections: PartnerPilotMeetingAgendaSection[];
  blockedMeetingActions: string[];
}

export interface PartnerPilotFollowUpPacketItem {
  itemId: string;
  label: string;
  owner: "publisher" | "school" | "platform" | "shared";
  routeToReview: string;
  reason: string;
}

export interface PartnerPilotFollowUpPacket {
  packetId: string;
  label: string;
  purpose: string;
  sendWhen: string;
  requestedEvidence: PartnerPilotFollowUpPacketItem[];
  schoolDecisions: PartnerPilotFollowUpPacketItem[];
  demoLinks: PartnerPilotFollowUpPacketItem[];
  blockers: string[];
  nextGate: string;
}

export interface PartnerPilotRequirementsIntake {
  intakeId: string;
  tenantId: string;
  label: string;
  statusStatement: string;
  summary: string;
  pilotPosition: string;
  recommendedFirstPilotPath: string;
  requirements: PartnerPilotRequirement[];
  evidenceTrace: PartnerPilotEvidenceTraceItem[];
  meetingAgenda: PartnerPilotMeetingAgenda;
  followUpPacket: PartnerPilotFollowUpPacket;
  blockedActions: string[];
  noLiveCaptureStatement: string;
}

export const samplePartnerPilotRequirementsIntakes: PartnerPilotRequirementsIntake[] = [
  {
    intakeId: "sample-publisher-first-pilot-requirements-v2026-09-05",
    tenantId: "sample-publisher",
    label: "Partner pilot requirements intake",
    statusStatement: "Demo-ready, not classroom-ready",
    summary:
      "A review-only supply and decision checklist for a textbook publisher or school before a real Living Textbook classroom pilot.",
    pilotPosition:
      "We can demonstrate the white-label package flow now, but a real pilot needs reviewed source files, media rights, teacher entry rules, school policy, persistence, reports, and deployment choices first.",
    recommendedFirstPilotPath:
      "Start with a hosted PWA pilot for the lowest support cost, then keep local classroom server or packaged companion delivery as policy-gated paid options.",
    requirements: [
      {
        requirementId: "publisher-source-pdf-units",
        category: "source",
        label: "Source PDF or text units",
        status: "needed",
        owner: "publisher",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Final PDF or text source files, unit boundaries, page references, edition/version labels, and permission to extract teacher-reviewed learning payloads.",
        currentFoundationEvidence:
          "Source review workspaces exist, but real partner files and extraction evidence are not loaded.",
        nextAction: "Ask the publisher for the first pilot unit source files and edition/version notes.",
        sourceRoute: "/teacher/sources/sample-publisher",
      },
      {
        requirementId: "publisher-media-rights",
        category: "media",
        label: "Audio, music, video, poster, and image rights",
        status: "needed",
        owner: "publisher",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Owned/licensed file list, rights notes, intended unit bindings, replacement rules, background-media permissions, and local-bundle approval if needed.",
        currentFoundationEvidence:
          "Media library, media asset workspace, and bundle integrity gates show the required review shape.",
        nextAction: "Collect the media inventory before any upload, playlist, background music, or local package promise.",
        sourceRoute: "/teacher/media/sample-publisher",
      },
      {
        requirementId: "game-pathway-scope",
        category: "games",
        label: "Pilot activity pathway scope",
        status: "demo-supplied",
        owner: "platform",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Teacher-approved sequence of flashcards, memory, matching, Label It, quiz, sentence, spelling, fill, type answer, and speaking routes for the pilot unit.",
        currentFoundationEvidence:
          "Curated game routes and activity hubs are active local scaffolds with target-language audio and deterministic progress events.",
        nextAction: "Keep the first pilot pathway curated; do not offer a switch-to-anything panel.",
        sourceRoute: "/activities/partner-demo-unit-1",
      },
      {
        requirementId: "teacher-entry-mode",
        category: "entry",
        label: "QR, entry code, and learner code rules",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Decision on printed QR, front-door entry code, optional user code, classroom display flow, and fallback link policy.",
        currentFoundationEvidence:
          "Front-door, private assignment, and stable QR alias routes are visible as scaffolds.",
        nextAction: "Confirm whether the pilot starts from printed QR, teacher-shared entry code, or both.",
        sourceRoute: "/enter/sample-publisher",
      },
      {
        requirementId: "school-learner-data-policy",
        category: "learner-data",
        label: "Learner data and roster policy",
        status: "policy-required",
        owner: "school",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "School acceptance for coded learner slots, retention period, deletion/export behavior, and real learner data boundaries.",
        currentFoundationEvidence:
          "Class roster and school policy gates show coded identity rules while real learner data remains blocked.",
        nextAction: "Use the policy handoff route before any real classroom launch.",
        sourceRoute:
          "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
      },
      {
        requirementId: "teacher-report-policy",
        category: "reports",
        label: "Teacher report and export expectations",
        status: "policy-required",
        owner: "school",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Which progress fields teachers may view, whether exports are allowed, who receives them, and whether family-facing summaries are permitted.",
        currentFoundationEvidence:
          "Teacher report package routes show report structure, but export remains blocked.",
        nextAction: "Confirm report export policy before persistent progress is enabled.",
        sourceRoute: "/teacher/reporting",
      },
      {
        requirementId: "deployment-channel-choice",
        category: "deployment",
        label: "Deployment channel",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Choose hosted PWA first, local classroom server, or packaged companion; define offline, QR fallback, support, update, and rollback expectations.",
        currentFoundationEvidence:
          "Deployment workbench recommends hosted PWA first while local and packaged options stay gated.",
        nextAction: "Keep hosted PWA as the default pilot recommendation unless closed local operation is required.",
        sourceRoute: "/teacher/deployment",
      },
      {
        requirementId: "commercial-package-boundary",
        category: "commercial",
        label: "Package tier and support boundary",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Decide whether the partner needs core classroom PWA only, premium AI authoring, premium speech/AI Tutor, hosted storage, or local companion support.",
        currentFoundationEvidence:
          "Entitlement workbench separates core and paid package behavior without billing or child-facing upsell.",
        nextAction: "Discuss paid options with adults only after core pilot requirements are understood.",
        sourceRoute: "/teacher/entitlements",
      },
      {
        requirementId: "ai-tutor-speech-policy",
        category: "premium-ai",
        label: "AI Tutor and speech scoring option",
        status: "premium-optional",
        owner: "school",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Teacher/school decision, budget ceiling, privacy policy, raw-audio exclusion, transcript rules, and level/mode eligibility.",
        currentFoundationEvidence:
          "AI Tutor and microphone scoring are disabled premium options; local record/replay has no API cost.",
        nextAction: "Do not include AI Tutor in the first core pilot unless the school explicitly adopts the paid package.",
        sourceRoute: "/teacher/entitlements",
      },
      {
        requirementId: "zai-prototype-intake",
        category: "outside-prototypes",
        label: "Z.ai or outside prototype intake",
        status: "blocked",
        owner: "platform",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Codex integration alert, fixture replay, event replay, target-language audio coverage, scoring replay, mobile evidence, and wrapper-boundary proof.",
        currentFoundationEvidence:
          "Prototype review workbenches exist, but Codex has not requested outside source handoff yet.",
        nextAction: "Keep Z.ai work isolated until the intake alert changes to ready-for-review.",
        sourceRoute: "/teacher/game-readiness",
      },
    ],
    evidenceTrace: [
      {
        traceId: "source-extraction-evidence-trace",
        requirementId: "publisher-source-pdf-units",
        label: "Source extraction evidence",
        status: "publisher-input-needed",
        evidenceRoute: "/teacher/sources/sample-publisher",
        currentSignal: "Review workspace exists; real source files and extraction packet are not present.",
        blockedUntil: "Publisher supplies the pilot PDF/text unit, page boundaries, edition label, and extraction permission.",
        pilotDependency: "Required before AI authoring, route promotion, printable output, or classroom assignment.",
      },
      {
        traceId: "media-rights-playlist-evidence-trace",
        requirementId: "publisher-media-rights",
        label: "Media rights and playlist evidence",
        status: "publisher-input-needed",
        evidenceRoute: "/teacher/media/sample-publisher",
        currentSignal: "Media catalog, playlist, background policy, and bundle checks are visible as review-only scaffolds.",
        blockedUntil: "Publisher provides owned or licensed audio, music, video, poster, image, replacement, and local-bundle rights.",
        pilotDependency: "Required before uploaded media, playlist writes, background music, local packages, or student media playback.",
      },
      {
        traceId: "curated-activity-pathway-evidence-trace",
        requirementId: "game-pathway-scope",
        label: "Curated activity pathway evidence",
        status: "demo-evidence-visible",
        evidenceRoute: "/activities/partner-demo-unit-1",
        currentSignal: "Flashcards, memory, matching, Label It, quiz, spelling, sentence, fill, type, speak, and media routes exist.",
        blockedUntil: "Teacher approves the first pilot pathway and compatibility gates stay green.",
        pilotDependency: "Required before a teacher-facing assignment pathway can be considered pilot-ready.",
      },
      {
        traceId: "qr-front-door-evidence-trace",
        requirementId: "teacher-entry-mode",
        label: "QR and front-door entry evidence",
        status: "school-decision-needed",
        evidenceRoute: "/enter/sample-publisher",
        currentSignal: "Front-door route shows controlled entry practice and target-language progression boundaries.",
        blockedUntil: "School chooses printed QR, entry code, learner code, classroom display flow, and fallback link policy.",
        pilotDependency: "Required before permanent QR aliases or private assignment links are printed or distributed.",
      },
      {
        traceId: "learner-data-policy-evidence-trace",
        requirementId: "school-learner-data-policy",
        label: "Learner data policy evidence",
        status: "school-policy-needed",
        evidenceRoute:
          "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
        currentSignal: "School policy handoff packet exists; coded learner data and retention rules are not accepted.",
        blockedUntil: "School accepts roster identity, retention, deletion, export, and no-real-learner-data boundaries.",
        pilotDependency: "Required before progress persistence, roster binding, teacher reports, or classroom launch.",
      },
      {
        traceId: "report-export-evidence-trace",
        requirementId: "teacher-report-policy",
        label: "Teacher report and export evidence",
        status: "school-policy-needed",
        evidenceRoute: "/teacher/reporting",
        currentSignal: "Teacher report surfaces show structure and support-only audio lanes; export remains blocked.",
        blockedUntil: "School confirms visible fields, recipient roles, export permissions, and family-summary policy.",
        pilotDependency: "Required before durable reports, exports, or partner-facing progress handoff packages.",
      },
      {
        traceId: "deployment-choice-evidence-trace",
        requirementId: "deployment-channel-choice",
        label: "Deployment decision evidence",
        status: "school-decision-needed",
        evidenceRoute: "/teacher/deployment",
        currentSignal: "Hosted PWA is recommended for first pilot; local and packaged paths remain visible but gated.",
        blockedUntil: "Partner chooses hosted PWA, local classroom server, or packaged companion with support and rollback terms.",
        pilotDependency: "Required before school rollout, local package promises, offline claims, or QR fallback commitments.",
      },
      {
        traceId: "premium-ai-tutor-evidence-trace",
        requirementId: "ai-tutor-speech-policy",
        label: "Premium AI Tutor and speech evidence",
        status: "premium-decision",
        evidenceRoute: "/teacher/entitlements",
        currentSignal: "AI Tutor and speech scoring are visible as disabled adult-controlled package options.",
        blockedUntil: "Teacher or school adopts the premium package, budget ceiling, privacy rule, and microphone approval policy.",
        pilotDependency: "Optional for first pilot; cannot be child-triggered or hidden inside the core classroom package.",
      },
      {
        traceId: "outside-prototype-evidence-trace",
        requirementId: "zai-prototype-intake",
        label: "Z.ai and outside prototype evidence",
        status: "blocked",
        evidenceRoute: "/teacher/game-readiness",
        currentSignal: "Prototype workbenches exist; Codex has not opened the handoff signal for outside source review.",
        blockedUntil: "Fixture replay, event replay, scoring replay, audio coverage, mobile evidence, and wrapper notes exist.",
        pilotDependency: "Not required for first pilot; required before any outside Phaser or DOM prototype can enter app review.",
      },
    ],
    meetingAgenda: {
      agendaId: "sample-publisher-first-pilot-meeting-agenda-v2026-09-05",
      label: "First partner pilot meeting agenda",
      purpose:
        "Give a publisher or school a clear, confidence-building first meeting path without creating live upload, policy, storage, report, premium AI, prototype, or launch workflows.",
      meetingOutcome:
        "By the end of the meeting, adults should know the first hosted PWA demo path, the evidence they must supply, the school decisions still required, and why classroom launch remains blocked.",
      sections: [
        {
          sectionId: "meeting-source-package",
          label: "Confirm the first source package",
          owner: "publisher",
          routeToReview: "/teacher/sources/sample-publisher",
          questionsToAsk: [
            "Which exact PDF or text unit should become the first pilot unit?",
            "What edition, year, page range, and unit boundary should be treated as canonical?",
            "Who can approve extracted vocabulary, sentence structures, teacher notes, and printable outputs?",
          ],
          evidenceToRequest: [
            "Pilot PDF or text file",
            "Edition and version note",
            "Extraction permission and review owner",
          ],
          decisionsNotMadeHere: [
            "No automatic PDF-to-game publishing",
            "No unreviewed OCR assignment",
            "No route creation from source files",
          ],
        },
        {
          sectionId: "meeting-media-rights",
          label: "Confirm multimedia and rights",
          owner: "publisher",
          routeToReview: "/teacher/media/sample-publisher",
          questionsToAsk: [
            "Which audio, music, video, poster, and image files belong to the first pilot unit?",
            "Can any music play behind games, and must learning audio always pause or override it?",
            "Are local-package copies allowed, or must media remain streamed from hosted storage?",
          ],
          evidenceToRequest: [
            "Media inventory",
            "Rights proof",
            "Background media permission",
            "Replacement and yearly update rules",
          ],
          decisionsNotMadeHere: [
            "No live media upload",
            "No playlist write",
            "No background music override of learning audio",
          ],
        },
        {
          sectionId: "meeting-activity-pathway",
          label: "Choose the curated activity pathway",
          owner: "shared",
          routeToReview: "/activities/partner-demo-unit-1",
          questionsToAsk: [
            "Should the first pilot start with flashcards, then memory, matching, Label It, quiz, sentence, fill, type, and speak?",
            "Which games are teacher-led, student self-play, or Training Academy recovery only?",
            "Which activity choices should be hidden from younger learners to preserve a calm progression path?",
          ],
          evidenceToRequest: [
            "Teacher-approved first pathway",
            "Mode suitability notes",
            "Target-language audio coverage notes",
          ],
          decisionsNotMadeHere: [
            "No switch-to-anything panel promise",
            "No game unlock without target-language progress",
            "No Z.ai prototype integration",
          ],
        },
        {
          sectionId: "meeting-entry-policy",
          label: "Set QR, entry, and learner-code expectations",
          owner: "school",
          routeToReview: "/enter/sample-publisher",
          questionsToAsk: [
            "Will students enter by printed QR, teacher front-door code, learner code, or a hybrid path?",
            "Should the pilot avoid named accounts and use coded learner slots only?",
            "What fallback link should be used if a printed QR target needs to move?",
          ],
          evidenceToRequest: [
            "Classroom entry plan",
            "Learner-code rule",
            "QR fallback and expiry policy",
          ],
          decisionsNotMadeHere: [
            "No production student accounts",
            "No permanent QR alias mutation",
            "No real learner data collection",
          ],
        },
        {
          sectionId: "meeting-policy-reporting-deployment",
          label: "Review policy, reporting, and deployment gates",
          owner: "school",
          routeToReview: "/teacher/deployment",
          questionsToAsk: [
            "Who can see progress reports, and are exports allowed?",
            "Is hosted PWA acceptable for the first pilot, or is a closed local classroom option required?",
            "What retention, deletion, rollback, and support expectations must be accepted before launch?",
          ],
          evidenceToRequest: [
            "School policy owner",
            "Report/export rule",
            "Deployment preference",
            "Rollback contact",
          ],
          decisionsNotMadeHere: [
            "No policy acceptance",
            "No report export",
            "No offline-ready or local package promise",
          ],
        },
        {
          sectionId: "meeting-premium-ai-and-prototypes",
          label: "Separate optional premium and outside prototype paths",
          owner: "platform",
          routeToReview: "/teacher/entitlements",
          questionsToAsk: [
            "Should AI Tutor or microphone speech scoring be excluded from the first core pilot?",
            "Is there an adult-approved budget and privacy policy for any premium AI package later?",
            "Should Z.ai prototype work remain isolated until Codex opens the review signal?",
          ],
          evidenceToRequest: [
            "Premium package interest only",
            "Adult budget owner",
            "Prototype source inventory kept outside the app",
          ],
          decisionsNotMadeHere: [
            "No model billing",
            "No microphone prompt",
            "No source handoff request",
          ],
        },
      ],
      blockedMeetingActions: [
        "No file collection during the meeting route",
        "No signed policy acceptance from meeting notes",
        "No storage vendor selection from verbal agreement",
        "No report export promise before school policy",
        "No local app promise before media bundle integrity",
        "No premium AI Tutor adoption without adult package approval",
        "No Z.ai source review until the Codex handoff signal changes",
      ],
    },
    followUpPacket: {
      packetId: "sample-publisher-first-pilot-follow-up-v2026-09-05",
      label: "First partner pilot follow-up packet preview",
      purpose:
        "Show the concise packet that an adult partner would review after the first meeting: requested evidence, school decisions, demo links, blockers, and the next gate.",
      sendWhen:
        "Only after an adult reviews the meeting notes; this preview does not send, export, store, or accept anything.",
      requestedEvidence: [
        {
          itemId: "follow-up-source-package",
          label: "Pilot source PDF or text unit",
          owner: "publisher",
          routeToReview: "/teacher/sources/sample-publisher",
          reason: "Needed to create a reviewed unit payload with stable edition, page, and unit boundaries.",
        },
        {
          itemId: "follow-up-media-inventory",
          label: "Audio, music, video, poster, and image inventory",
          owner: "publisher",
          routeToReview: "/teacher/media/sample-publisher",
          reason: "Needed to verify rights, learning-audio priority, playlist bindings, and any local package claim.",
        },
        {
          itemId: "follow-up-pathway-notes",
          label: "Teacher-approved activity pathway notes",
          owner: "shared",
          routeToReview: "/activities/partner-demo-unit-1",
          reason: "Needed to confirm the curated sequence and target-language audio coverage for the first pilot unit.",
        },
        {
          itemId: "follow-up-dry-run-evidence",
          label: "Teacher dry-run evidence summary",
          owner: "school",
          routeToReview: "/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run",
          reason: "Needed to show that entry, games, audio, media, support language, and reporting boundaries were rehearsed.",
        },
      ],
      schoolDecisions: [
        {
          itemId: "follow-up-entry-decision",
          label: "QR, front-door, and learner-code entry choice",
          owner: "school",
          routeToReview: "/enter/sample-publisher",
          reason: "Determines the classroom access path without creating production student accounts.",
        },
        {
          itemId: "follow-up-data-decision",
          label: "Learner data, retention, deletion, and report policy",
          owner: "school",
          routeToReview:
            "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
          reason: "Required before persistent progress, roster binding, report export, or classroom launch.",
        },
        {
          itemId: "follow-up-deployment-decision",
          label: "Hosted PWA versus closed local companion decision",
          owner: "shared",
          routeToReview: "/teacher/deployment",
          reason: "Sets support, update, rollback, media delivery, and QR fallback expectations.",
        },
      ],
      demoLinks: [
        {
          itemId: "follow-up-entry-demo",
          label: "Front-door and student progression demo",
          owner: "platform",
          routeToReview: "/enter/sample-publisher",
          reason: "Shows teacher-directed entry followed by target-language progression.",
        },
        {
          itemId: "follow-up-games-demo",
          label: "Curated games and audio demo",
          owner: "platform",
          routeToReview: "/activities/partner-demo-unit-1",
          reason: "Shows the reviewed activity path without exposing arbitrary template switching.",
        },
        {
          itemId: "follow-up-teacher-demo",
          label: "Teacher review and report boundary demo",
          owner: "platform",
          routeToReview: "/teacher/sessions/partner-demo-unit-1",
          reason: "Shows teacher-facing evidence while real learner data and report export remain blocked.",
        },
      ],
      blockers: [
        "No follow-up email or downloadable packet",
        "No file upload or attachment storage",
        "No signed school policy acceptance",
        "No classroom launch or persistent learner roster",
        "No premium AI Tutor activation",
        "No Z.ai source handoff request",
      ],
      nextGate:
        "Open the source and media review workspaces only after the partner supplies the evidence packet and the school names its policy owner.",
    },
    blockedActions: [
      "No upload button",
      "No file picker writes",
      "No policy acceptance",
      "No live storage write",
      "No report export",
      "No classroom launch",
      "No local package activation",
      "No premium AI Tutor activation",
      "No Z.ai source handoff request",
    ],
    noLiveCaptureStatement:
      "This intake is a requirements map only. It does not upload files, save partner answers, accept policy, select storage, bill premium services, or launch student sessions.",
  },
];

export function getPartnerPilotRequirementsIntake(
  tenantId: string,
): PartnerPilotRequirementsIntake | undefined {
  return samplePartnerPilotRequirementsIntakes.find((intake) => intake.tenantId === tenantId);
}

export function countPartnerPilotRequirements(
  intake: PartnerPilotRequirementsIntake,
  status: PartnerPilotRequirementStatus,
): number {
  return intake.requirements.filter((requirement) => requirement.status === status).length;
}
