import {
  createControlledPilotHumanReviewNextGateHandoff,
  validateControlledPilotHumanReviewNextGateHandoff,
  type ControlledPilotHumanReviewAdjudication,
  type ControlledPilotHumanReviewNextGateHandoff,
} from "@living-textbook/content-model";

export function buildSampleControlledPilotHumanReviewNextGateHandoff(
  adjudication: ControlledPilotHumanReviewAdjudication,
): ControlledPilotHumanReviewNextGateHandoff {
  return createControlledPilotHumanReviewNextGateHandoff(adjudication, { recipientRole: "publisher-admin" });
}

export function validateSampleControlledPilotHumanReviewNextGateHandoff(
  handoff: ControlledPilotHumanReviewNextGateHandoff,
  adjudication: ControlledPilotHumanReviewAdjudication,
): string[] {
  return validateControlledPilotHumanReviewNextGateHandoff(handoff, adjudication);
}
