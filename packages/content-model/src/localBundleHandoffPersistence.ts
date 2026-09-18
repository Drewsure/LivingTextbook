import {
  validateLocalBundleHandoffPacket,
  type LocalBundleHandoffPacket,
} from "./localBundleHandoff";
import {
  validatePersistenceHandoffPacket,
  type PersistenceHandoffPacket,
} from "./persistenceHandoff";

export interface LocalBundleHandoffPersistencePreview {
  previewId: string;
  packetId: string;
  tenantId: string;
  bundleId: string;
  recordCategory: "local-companion-handoff";
  mode: "review-only";
  selectedProvider: null;
  durableWriteAllowed: false;
  packageWriteAllowed: false;
  offlineActivationAllowed: false;
  studentPromotionAllowed: false;
  hostedRedirectMutationAllowed: false;
}

const REQUIRED_BLOCKED_ACTIONS = [
  "package-write",
  "offline-activation",
  "student-promotion",
  "hosted-redirect-mutation",
] as const;

export function validateLocalBundleHandoffPersistencePreview(
  preview: LocalBundleHandoffPersistencePreview,
  handoffPacket: LocalBundleHandoffPacket,
  persistencePacket: PersistenceHandoffPacket,
): string[] {
  const errors = [
    ...validateLocalBundleHandoffPacket(handoffPacket),
    ...validatePersistenceHandoffPacket(persistencePacket),
  ];

  if (!preview.previewId.trim()) errors.push("Local bundle handoff persistence preview requires previewId.");
  if (preview.mode !== "review-only") errors.push("Local bundle handoff persistence preview must remain review-only.");
  if (preview.selectedProvider !== null) errors.push("Local bundle handoff persistence preview must not select a provider.");
  if (preview.recordCategory !== "local-companion-handoff") errors.push("Local bundle handoff persistence preview must use the local-companion-handoff category.");
  if (preview.packetId !== handoffPacket.packetId) errors.push("Local bundle handoff persistence preview packet identity does not match the source packet.");
  if (preview.tenantId !== handoffPacket.tenantId) errors.push("Local bundle handoff persistence preview tenant identity does not match the source packet.");
  if (preview.bundleId !== handoffPacket.bundleId) errors.push("Local bundle handoff persistence preview bundle identity does not match the source packet.");

  for (const [field, value] of Object.entries({
    durableWriteAllowed: preview.durableWriteAllowed,
    packageWriteAllowed: preview.packageWriteAllowed,
    offlineActivationAllowed: preview.offlineActivationAllowed,
    studentPromotionAllowed: preview.studentPromotionAllowed,
    hostedRedirectMutationAllowed: preview.hostedRedirectMutationAllowed,
  })) {
    if (value !== false) errors.push(`Local bundle handoff persistence preview must keep ${field}: false.`);
  }

  const blockedActions = new Set(handoffPacket.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Local bundle handoff persistence preview must preserve blocked action ${action}.`);
  }

  const coverage = persistencePacket.categoryCoverage.find((item) => item.category === "local-companion-handoff");
  if (!coverage) {
    errors.push("Local bundle handoff persistence preview requires local-companion-handoff persistence coverage.");
  } else {
    if (!coverage.durableRecord) errors.push("Local bundle handoff persistence preview requires a durable record contract.");
    if (!coverage.hostedIntent) errors.push("Local bundle handoff persistence preview requires a hosted adapter intent.");
    if (!coverage.localIntent) errors.push("Local bundle handoff persistence preview requires a local adapter intent.");
  }

  return [...new Set(errors)];
}
