import {
  validateLocalBundleHandoffPersistencePreview,
  type LocalBundleHandoffPersistencePreview,
  type LocalBundleHandoffPacket,
  type PersistenceHandoffPacket,
} from "@living-textbook/content-model";

export function buildLocalBundleHandoffPersistencePreview({
  handoffPacket,
  persistencePacket,
}: {
  handoffPacket: LocalBundleHandoffPacket;
  persistencePacket: PersistenceHandoffPacket;
}): { preview: LocalBundleHandoffPersistencePreview; errors: string[] } {
  const preview: LocalBundleHandoffPersistencePreview = {
    previewId: `${handoffPacket.packetId}-persistence-review`,
    packetId: handoffPacket.packetId,
    tenantId: handoffPacket.tenantId,
    bundleId: handoffPacket.bundleId,
    recordCategory: "local-companion-handoff",
    mode: "review-only",
    selectedProvider: null,
    durableWriteAllowed: false,
    packageWriteAllowed: false,
    offlineActivationAllowed: false,
    studentPromotionAllowed: false,
    hostedRedirectMutationAllowed: false,
  };

  return {
    preview,
    errors: validateLocalBundleHandoffPersistencePreview(preview, handoffPacket, persistencePacket),
  };
}
