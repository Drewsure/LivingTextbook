import {
  createPendingBrowserPrivacyTenantEvidencePacket,
  validateBrowserPrivacyTenantEvidencePacket,
  type BrowserPrivacyTenantEvidencePacket,
} from "@living-textbook/content-model";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";

const launch = resolveSampleLaunchContext("partner-demo-unit-1");

export const sampleBrowserPrivacyTenantEvidencePacket: BrowserPrivacyTenantEvidencePacket =
  createPendingBrowserPrivacyTenantEvidencePacket({
    packetId: "sample-publisher-browser-privacy-tenant-packet-v1",
    tenantId: launch.tenant.id,
    packageId: launch.contentPackage.meta.packageId,
    launchCode: launch.launchSession.launchCode,
    unitKey: launch.launchSession.unitKey,
    studentSessionId: launch.progression.studentSessionId,
    observationId: "pending-human-observation",
    verificationRunId: "foundation-verification-run-pending-browser-rehearsal",
    verificationRevision: "legacy-source-import:pending-browser-rehearsal",
    verificationReferenceAt: "2026-09-24T00:00:00.000Z",
  });

export const sampleBrowserPrivacyTenantEvidencePacketErrors =
  validateBrowserPrivacyTenantEvidencePacket(sampleBrowserPrivacyTenantEvidencePacket);
