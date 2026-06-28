import {
  completeEntryPractice,
  createLaunchSession,
  getInitialStudentProgression,
  getUnitKey,
} from "@living-textbook/content-model";
import { levelOneUnitOne } from "./levelOneUnitOne";

const sampleUnitKey = getUnitKey(levelOneUnitOne.unitMeta);

export function getSampleLaunchSession(launchCode = "demo-unit-1") {
  return createLaunchSession({
    launchCode,
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    curriculumId: levelOneUnitOne.unitMeta.curriculumId,
    unitKey: sampleUnitKey,
    entryMode: "flashcards",
    recommendedNextModes: ["memory-match"],
    openedAt: "2026-06-28T00:00:00.000Z",
  });
}

export function getSampleStudentProgression(launchCode = "demo-unit-1") {
  const launchSession = getSampleLaunchSession(launchCode);

  return getInitialStudentProgression({
    studentSessionId: `${launchCode}:demo-student`,
    launchSession,
  });
}

export function getSampleUnlockedProgression(launchCode = "demo-unit-1") {
  const launchSession = getSampleLaunchSession(launchCode);
  const progression = getSampleStudentProgression(launchCode);

  return completeEntryPractice({
    progression,
    launchSession,
    occurredAt: "2026-06-28T00:05:00.000Z",
  });
}

export const sampleLaunchSession = getSampleLaunchSession();
export const sampleStudentProgression = getSampleStudentProgression();
