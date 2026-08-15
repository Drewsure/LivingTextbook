import {
  completeEntryPractice,
  createLaunchSession,
  getInitialStudentProgression,
  getUnitKey,
} from "@living-textbook/content-model";
import type { LaunchSession } from "@living-textbook/content-model";
import { levelOneUnitOne } from "./levelOneUnitOne";

const sampleUnitKey = getUnitKey(levelOneUnitOne.unitMeta);

export function getSampleLaunchSession(launchCode = "demo-unit-1") {
  return createLaunchSession({
    launchCode,
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    curriculumId: levelOneUnitOne.unitMeta.curriculumId,
    unitKey: sampleUnitKey,
    entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match", "balloon-pop", "quiz", "true-false", "sentence-builder", "speak-it"],
    openedAt: "2026-06-28T00:00:00.000Z",
  });
}

export function getSampleFrontDoorLaunchSession(launchCode = "front-door-demo-unit-1"): LaunchSession {
  return createLaunchSession({
    launchCode,
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    curriculumId: levelOneUnitOne.unitMeta.curriculumId,
    unitKey: sampleUnitKey,
    entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match", "balloon-pop", "quiz", "true-false", "sentence-builder", "speak-it"],
    openedAt: "2026-06-28T00:00:00.000Z",
    accessMode: "front-door-code",
  });
}

export function getSampleStudentProgression(launchCode = "demo-unit-1") {
  const launchSession = getSampleLaunchSession(launchCode);

  return getInitialStudentProgression({
    studentSessionId: `${launchCode}:demo-student`,
    launchSession,
  });
}

export function getSampleFrontDoorStudentProgression(launchCode = "front-door-demo-unit-1", userCode = "student-04") {
  const launchSession = getSampleFrontDoorLaunchSession(launchCode);

  return getInitialStudentProgression({
    studentSessionId: `${launchCode}:${userCode}`,
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
export const sampleFrontDoorLaunchSession = getSampleFrontDoorLaunchSession();
export const sampleFrontDoorStudentProgression = getSampleFrontDoorStudentProgression();
