import { validatePilotHandoffLineageBinding } from "@living-textbook/content-model";
import { samplePilotDeploymentDecision } from "@/data/samplePilotDeploymentDecision";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { sampleSchoolPolicyAcceptancePreflight } from "@/data/sampleSchoolPolicyAcceptancePreflight";
import { sampleSchoolPolicyAcceptanceRecordPreview } from "@/data/sampleSchoolPolicyAcceptanceRecordPreview";

export const samplePilotLineageValidationErrors = validatePilotHandoffLineageBinding(
  samplePilotHandoffPackage,
  {
    deploymentDecision: samplePilotDeploymentDecision,
    policyAcceptancePreflight: sampleSchoolPolicyAcceptancePreflight,
    acceptanceRecordPreview: sampleSchoolPolicyAcceptanceRecordPreview,
  },
);
