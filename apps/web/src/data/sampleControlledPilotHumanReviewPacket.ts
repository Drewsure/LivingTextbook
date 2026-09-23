import {
  createControlledPilotHumanReviewPacket,
  validateControlledPilotHumanReviewPacket,
  type ControlledPilotHumanReviewPacket,
} from "@living-textbook/content-model";
import { sampleControlledPilotApprovalReadiness } from "@/data/sampleControlledPilotApprovalReadiness";

export const sampleControlledPilotHumanReviewPacket: ControlledPilotHumanReviewPacket =
  createControlledPilotHumanReviewPacket(sampleControlledPilotApprovalReadiness);

export const sampleControlledPilotHumanReviewPacketErrors = validateControlledPilotHumanReviewPacket(
  sampleControlledPilotHumanReviewPacket,
);
