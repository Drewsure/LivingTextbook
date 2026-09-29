import { createPilotDeliveryManifest } from "../packages/content-model/src/pilotDeliveryManifest.ts";

const checksum = `sha256:${"a".repeat(64)}`;
const preview = {
  tenantId: "behavior-tenant",
  packageId: "behavior-package",
  version: "1.0.0",
  readinessBinding: { sourceAssemblyChecksum: checksum },
  artifacts: [],
  gameModes: ["memory-match"],
  mediaKinds: ["audio"],
  qrPreviews: [{ aliasPath: "/q/behavior", fallbackPath: "/local/behavior" }],
};
const reconciliation = {
  tenantId: "behavior-tenant",
  packageId: "behavior-package",
  sourceAssemblyChecksum: checksum,
  mode: "review-only",
  promotionAllowed: false,
  studentFacingActivationAllowed: false,
  lanes: [],
};
const gates = {
  sourceReview: true,
  packageReadiness: true,
  multimediaRights: true,
  gameAudio: true,
  qrRegistry: true,
  qrPrintAuthorization: true,
  localBundle: true,
  hostedPersistence: true,
  teacherPolicy: true,
  releaseApproval: true,
};

const missingHostedPacket = createPilotDeliveryManifest({ preview, reconciliation, mode: "hybrid", gates });
if (
  missingHostedPacket.status !== "blocked" ||
  !missingHostedPacket.unresolvedRequirements.some((item) => item.includes("hosted persistence opt-in decision packet"))
) {
  throw new Error("Hybrid delivery must remain blocked when its hosted persistence decision packet is missing.");
}

const closedLocal = createPilotDeliveryManifest({ preview, reconciliation, mode: "closed-local", gates });
if (
  closedLocal.status !== "ready-for-manual-release" ||
  !closedLocal.deliveryAllowed ||
  closedLocal.hostedPersistenceDecisionPacketId !== null
) {
  throw new Error("Closed-local delivery should be ready without a hosted persistence packet.");
}

const hosted = createPilotDeliveryManifest({
  preview,
  reconciliation,
  mode: "hosted-pwa",
  gates,
  hostedPersistenceDecisionPacketId: "behavior-package:hosted-opt-in",
});
if (
  hosted.status !== "ready-for-manual-release" ||
  !hosted.deliveryAllowed ||
  hosted.hostedPersistenceDecisionPacketId !== "behavior-package:hosted-opt-in"
) {
  throw new Error("Hosted delivery should preserve its package-scoped opt-in packet when all gates are ready.");
}

console.log("PASS pilot delivery manifest fails closed for missing hosted packet identity and preserves closed-local/hosted readiness boundaries.");
