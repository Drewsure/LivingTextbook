import type { ClassRosterPlan, RosterDataBoundary } from "@living-textbook/content-model/src/classRoster";
import { getClassRosterWarnings, validateClassRosterPlan } from "@living-textbook/content-model/src/classRoster";

const coreRosterBoundaries: RosterDataBoundary[] = [
  {
    field: "teacher-issued-code",
    allowedInCoreDemo: true,
    requiresSchoolPolicy: false,
    requiresPersistence: false,
    note: "Short classroom codes can group events during a demo or teacher-led session without storing real learner names.",
  },
  {
    field: "progress-summary",
    allowedInCoreDemo: true,
    requiresSchoolPolicy: false,
    requiresPersistence: true,
    note: "Demo summaries can be generated in the browser; durable year-on-year reporting requires the selected persistence adapter.",
  },
  {
    field: "display-name",
    allowedInCoreDemo: false,
    requiresSchoolPolicy: true,
    requiresPersistence: true,
    note: "Real names are not needed for the foundation slice and must wait for school policy and storage decisions.",
  },
  {
    field: "raw-audio",
    allowedInCoreDemo: false,
    requiresSchoolPolicy: true,
    requiresPersistence: true,
    note: "Microphone practice may replay locally, but raw audio is not a roster field.",
  },
  {
    field: "transcript",
    allowedInCoreDemo: false,
    requiresSchoolPolicy: true,
    requiresPersistence: true,
    note: "Speech transcripts belong to an optional premium tutor/reporting package, not the core roster.",
  },
];

export const sampleClassRosterPlans: ClassRosterPlan[] = [
  {
    rosterId: "ministar-demo-classroom-roster",
    tenantId: "ministar",
    packageId: "ministar-l1-u1-demo-package",
    launchCode: "demo-unit-1",
    label: "MiniStar demo classroom roster",
    readiness: "demo-only",
    identityMode: "teacher-issued-code",
    slots: [
      {
        slotId: "ministar-demo-slot-01",
        label: "Learner 01",
        userCode: "STAR-01",
        identityMode: "teacher-issued-code",
        storesRealName: false,
        storesFamilyContact: false,
        storesRawAudio: false,
        storesTranscript: false,
        canExportProgress: false,
        note: "Safe for teacher-led classroom testing without storing names.",
      },
      {
        slotId: "ministar-demo-slot-02",
        label: "Learner 02",
        userCode: "STAR-02",
        identityMode: "teacher-issued-code",
        storesRealName: false,
        storesFamilyContact: false,
        storesRawAudio: false,
        storesTranscript: false,
        canExportProgress: false,
        note: "Progress can be previewed during the session, but not retained as a durable school record yet.",
      },
    ],
    dataBoundaries: coreRosterBoundaries,
    requiredBeforePilot: [
      "Choose the persistence adapter for durable class history.",
      "Approve the teacher report export and retention policy.",
      "Decide whether learner display names are ever needed for this tenant.",
    ],
    note: "This keeps the first classroom slice fast and safe: teacher-issued codes group progress without requiring accounts or personal data.",
  },
  {
    rosterId: "sample-publisher-front-door-roster",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-companion-package",
    launchCode: "partner-demo-unit-1",
    label: "Sample publisher front-door roster",
    readiness: "requires-policy",
    identityMode: "teacher-issued-code",
    slots: [
      {
        slotId: "sample-publisher-slot-07",
        label: "Book user 07",
        userCode: "BOOK-07",
        identityMode: "teacher-issued-code",
        storesRealName: false,
        storesFamilyContact: false,
        storesRawAudio: false,
        storesTranscript: false,
        canExportProgress: true,
        note: "A textbook partner can print or distribute user codes without exposing names in the digital companion.",
      },
      {
        slotId: "sample-publisher-slot-08",
        label: "Book user 08",
        userCode: "BOOK-08",
        identityMode: "teacher-issued-code",
        storesRealName: false,
        storesFamilyContact: false,
        storesRawAudio: false,
        storesTranscript: false,
        canExportProgress: true,
        note: "Export is conceptually allowed, but durable retention still needs tenant policy acceptance.",
      },
    ],
    dataBoundaries: coreRosterBoundaries,
    requiredBeforePilot: [
      "Confirm who owns progress exports for the publisher pilot.",
      "Choose hosted or closed/local storage before retaining year-on-year progress.",
      "Confirm that video, audio, game, and report records use the same launch-code registry.",
    ],
    note: "This is the white-label path: stable entry and user codes can support a textbook series without hard-coding MiniStar identity assumptions.",
  },
  {
    rosterId: "closed-local-classroom-roster",
    tenantId: "sample-publisher",
    packageId: "sample-publisher-local-bundle",
    launchCode: "partner-demo-unit-1",
    label: "Closed local classroom roster",
    readiness: "requires-persistence",
    identityMode: "teacher-issued-code",
    slots: [
      {
        slotId: "local-classroom-slot-a",
        label: "Local learner A",
        userCode: "LOCAL-A",
        identityMode: "teacher-issued-code",
        storesRealName: false,
        storesFamilyContact: false,
        storesRawAudio: false,
        storesTranscript: false,
        canExportProgress: true,
        note: "Local-only use still needs backup, export, and update procedures before a partner can rely on it.",
      },
    ],
    dataBoundaries: coreRosterBoundaries,
    requiredBeforePilot: [
      "Define local backup and restore procedure.",
      "Define how teacher exports leave the closed app safely.",
      "Define update behavior for future textbook units and multimedia bundles.",
    ],
    note: "Closed deployments remain part of the core Living Textbook offer, but local storage must be treated as a product requirement rather than a workaround.",
  },
];

export const sampleClassRosterErrors = sampleClassRosterPlans.flatMap(validateClassRosterPlan);
export const sampleClassRosterWarnings = sampleClassRosterPlans.flatMap(getClassRosterWarnings);

export function findSampleClassRosterPlan(launchCode: string, rosterId?: string): ClassRosterPlan | undefined {
  if (rosterId) {
    return sampleClassRosterPlans.find((plan) => plan.rosterId === rosterId && plan.launchCode === launchCode);
  }

  return sampleClassRosterPlans.find((plan) => plan.launchCode === launchCode);
}
