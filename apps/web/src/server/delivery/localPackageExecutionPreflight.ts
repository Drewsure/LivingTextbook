import {
  validateLocalBundleManifest,
  type LocalBundleManifest,
  type PilotDeliveryManifest,
  type PilotDeliveryPackageIndex,
  type PilotDeliveryReleaseReceipt,
  type PilotQrAliasRegistryRecord,
} from "@living-textbook/content-model";
import { readQuarantinePackageEvidenceReview, readQuarantinePackageReviewPacket } from "../uploads/quarantineUploadStore";
import { hasCompleteCanonicalGameEvidenceRecordIds } from "@living-textbook/content-model";
import { readPilotDeliveryReleaseLineage } from "./pilotDeliveryReleaseLineage";
import { readPilotDeliveryMetadata } from "./pilotDeliveryMetadataWriter";
import { readPilotQrAliasRegistry } from "./pilotQrAliasRegistryWriter";
import { readLocalBundleManifestReview } from "./localBundleManifestReviewWriter";
import { preflightLocalPilotPackageAssembly, type LocalPilotPackageAssemblyInput, type LocalPilotPackageAssemblyPreflightResult, type LocalPilotPackageReviewBinding } from "./localPilotPackageAssembler";

export type LocalPackageRequest = Omit<LocalPilotPackageAssemblyInput, "reviewPacketBinding"> & {
  quarantineId: string;
  reviewPacketId: string;
};

export interface LocalPackageRequestDraft {
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  version?: string;
  bundleManifest?: LocalBundleManifest;
  bundleManifestReviewId?: string;
  operatorId: string;
  writtenAt: string;
}

export interface LocalPackageExecutionPreflight {
  status: "ready-for-assembly" | "blocked";
  executionReady: boolean;
  tenantId: string;
  packageId: string;
  version: string;
  quarantineId: string;
  reviewPacketId: string;
  lineageBound: boolean;
  reviewPacketBound: boolean;
  custodyBound: boolean;
  assembly: LocalPilotPackageAssemblyPreflightResult | null;
  errors: string[];
  packageAssemblyAllowed: false;
  qrPrintArtifactIncluded: false;
  studentFacingActivationAllowed: false;
  hostedPersistenceActivated: false;
  qrAliasesMutated: false;
  learnerRecordsIncluded: false;
  performedWrite: false;
  sideEffect: "none";
  privacy: string;
}

export interface LocalPackageExecutionPreflightEnvelope {
  preflight: LocalPackageExecutionPreflight;
  assemblyInput?: LocalPilotPackageAssemblyInput;
}

export function isLocalPackageRequest(value: unknown): value is LocalPackageRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.manifest && typeof candidate.manifest === "object" && candidate.receipt && typeof candidate.receipt === "object" && candidate.qrRegistryRecord && typeof candidate.qrRegistryRecord === "object" && candidate.packageIndex && typeof candidate.packageIndex === "object" && candidate.bundleManifest && typeof candidate.bundleManifest === "object")
    && typeof candidate.operatorId === "string"
    && typeof candidate.writtenAt === "string"
    && typeof candidate.quarantineId === "string"
    && typeof candidate.reviewPacketId === "string"
    && validateLocalBundleManifest(candidate.bundleManifest).errors.length === 0;
}

export function isLocalPackageRequestDraft(value: unknown): value is LocalPackageRequestDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  const hasInlineManifest = Boolean(candidate.bundleManifest && typeof candidate.bundleManifest === "object") && validateLocalBundleManifest(candidate.bundleManifest).errors.length === 0;
  const hasReviewedManifestId = typeof candidate.bundleManifestReviewId === "string" && typeof candidate.version === "string" && Boolean(candidate.bundleManifestReviewId.trim()) && Boolean(candidate.version.trim());
  return typeof candidate.tenantId === "string"
    && typeof candidate.packageId === "string"
    && typeof candidate.quarantineId === "string"
    && typeof candidate.reviewPacketId === "string"
    && typeof candidate.operatorId === "string"
    && typeof candidate.writtenAt === "string"
    && (hasInlineManifest !== hasReviewedManifestId);
}

export async function hydrateLocalPackageRequestDraft(draft: LocalPackageRequestDraft): Promise<{ input: LocalPackageRequest | null; errors: string[] }> {
  const packageId = draft.packageId;
  const reviewId = draft.bundleManifestReviewId?.trim();
  let bundleManifest = draft.bundleManifest;
  if (reviewId) {
    const version = draft.version?.trim() ?? "";
    const reviewed = await readLocalBundleManifestReview({ tenantId: draft.tenantId, packageId, version });
    if (reviewed.status !== "available") return { input: null, errors: ["The requested reviewed local bundle manifest could not be derived from durable custody.", ...reviewed.errors] };
    if (reviewed.record.recordId !== reviewId) return { input: null, errors: ["The reviewed local bundle manifest id does not match the exact durable custody record."] };
    if (reviewed.record.quarantineId !== draft.quarantineId || reviewed.record.reviewPacketId !== draft.reviewPacketId) return { input: null, errors: ["The reviewed local bundle manifest is bound to a different quarantine or review packet."] };
    bundleManifest = reviewed.record.manifest;
  }
  if (!bundleManifest) return { input: null, errors: ["The local package request draft must provide either an inline bundle manifest or a reviewed bundle manifest id."] };
  const version = bundleManifest.version;
  if (!packageId) return { input: null, errors: ["The local package request draft must provide a bounded package identity before delivery records can be derived."] };
  const [delivery, qrRegistry] = await Promise.all([
    readPilotDeliveryMetadata({ tenantId: draft.tenantId, packageId, version }),
    readPilotQrAliasRegistry({ tenantId: draft.tenantId, packageId, version }),
  ]);
  const errors = [
    ...(delivery.status === "available" ? [] : ["Approved delivery metadata could not be derived from durable custody.", ...delivery.errors]),
    ...(qrRegistry.status === "available" ? [] : ["Approved QR alias registry metadata could not be derived from durable custody.", ...qrRegistry.errors]),
  ];
  if (errors.length > 0 || delivery.status !== "available" || qrRegistry.status !== "available") return { input: null, errors: unique(errors) };
  return {
    input: {
      manifest: delivery.manifest,
      receipt: delivery.receipt,
      packageIndex: delivery.packageIndex,
      qrRegistryRecord: qrRegistry.record,
      bundleManifest,
      operatorId: draft.operatorId,
      writtenAt: draft.writtenAt,
      quarantineId: draft.quarantineId,
      reviewPacketId: draft.reviewPacketId,
    },
    errors: [],
  };
}

export async function readLocalPackageExecutionPreflight(input: LocalPackageRequest): Promise<LocalPackageExecutionPreflightEnvelope> {
  const identity = {
    tenantId: input.manifest.tenantId,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    quarantineId: input.quarantineId,
    reviewPacketId: input.reviewPacketId,
  };
  const base = (overrides: Partial<LocalPackageExecutionPreflight>): LocalPackageExecutionPreflight => ({
    status: "blocked",
    executionReady: false,
    ...identity,
    lineageBound: false,
    reviewPacketBound: false,
    custodyBound: false,
    assembly: null,
    errors: [],
    packageAssemblyAllowed: false,
    qrPrintArtifactIncluded: false,
    studentFacingActivationAllowed: false,
    hostedPersistenceActivated: false,
    qrAliasesMutated: false,
    learnerRecordsIncluded: false,
    performedWrite: false,
    sideEffect: "none",
    privacy: privacyMessage(),
    ...overrides,
  });
  const blocked = (errors: string[], flags: Partial<LocalPackageExecutionPreflight> = {}): LocalPackageExecutionPreflightEnvelope => ({
    preflight: base({ errors: unique(errors), ...flags }),
  });

  const lineageErrors = await readPilotDeliveryReleaseLineage(input.manifest, input.quarantineId);
  if (lineageErrors.length > 0) return blocked(lineageErrors);

  const packetResult = await readQuarantinePackageReviewPacket(input.manifest.tenantId, input.quarantineId);
  const packet = packetResult.record;
  if (!packet) return blocked(["The durable review packet could not be read from the configured quarantine custody boundary."], { lineageBound: true });
  const packetErrors = validateReviewPacketBinding(input, packet);
  if (packetErrors.length > 0) return blocked(packetErrors, { lineageBound: true });

  const packageEvidenceResult = await readQuarantinePackageEvidenceReview(input.manifest.tenantId, input.quarantineId);
  const packageEvidence = packageEvidenceResult.record;
  const packageEvidenceErrors = [
    ...(packageEvidence?.status === "reviewed-package-evidence" ? [] : ["The durable package evidence review is not complete for local package assembly."]),
    ...(hasCompleteCanonicalGameEvidenceRecordIds(packageEvidence?.canonicalGameDerivedEvidenceRecordIds ?? []) ? [] : ["The durable package evidence review does not carry the complete canonical game evidence set."]),
    ...packageEvidenceResult.errors,
  ];
  if (packageEvidenceErrors.length > 0) return blocked(unique(packageEvidenceErrors), { lineageBound: true, reviewPacketBound: true });

  const [storedDelivery, storedQrRegistry] = await Promise.all([
    readPilotDeliveryMetadata({ tenantId: input.manifest.tenantId, packageId: input.manifest.packageId, version: input.manifest.version }),
    readPilotQrAliasRegistry({ tenantId: input.manifest.tenantId, packageId: input.manifest.packageId, version: input.manifest.version }),
  ]);
  const custodyErrors = [
    ...(storedDelivery.status === "available" ? [] : ["Approved delivery metadata must already exist in the configured custody root before local package assembly.", ...storedDelivery.errors]),
    ...(storedQrRegistry.status === "available" ? [] : ["Approved QR alias registry metadata must already exist in the configured custody root before local package assembly.", ...storedQrRegistry.errors]),
  ];
  if (storedDelivery.status === "available" && !sameJson(storedDelivery.manifest, input.manifest)) custodyErrors.push("The supplied delivery manifest does not match the stored approved delivery metadata.");
  if (storedDelivery.status === "available" && !sameJson(storedDelivery.receipt, input.receipt)) custodyErrors.push("The supplied release receipt does not match the stored approved delivery metadata.");
  if (storedDelivery.status === "available" && !sameJson(storedDelivery.packageIndex, input.packageIndex)) custodyErrors.push("The supplied package index does not match the stored approved delivery metadata.");
  if (storedQrRegistry.status === "available" && !sameJson(storedQrRegistry.record, input.qrRegistryRecord)) custodyErrors.push("The supplied QR registry record does not match the stored approved registry metadata.");
  if (custodyErrors.length > 0) return blocked(custodyErrors, { lineageBound: true, reviewPacketBound: true });

  const reviewPacketBinding: LocalPilotPackageReviewBinding = {
    recordVersion: 1,
    tenantId: packet.tenantId,
    quarantineId: packet.quarantineId,
    packetId: packet.packetId,
    sourcePreflightEvidenceId: packet.sourcePreflightEvidenceId ?? "",
    packageId: packet.packageId,
    sourceChecksumSha256: packet.checksumSha256,
    packageEvidenceStatus: "reviewed-package-evidence",
    canonicalGameDerivedEvidenceRecordIds: packageEvidence?.canonicalGameDerivedEvidenceRecordIds ?? [],
    status: "ready-for-next-gate",
  };
  const assemblyInput: LocalPilotPackageAssemblyInput = { ...input, reviewPacketBinding };
  const assembly = await preflightLocalPilotPackageAssembly(assemblyInput);
  const errors = unique(assembly.errors);
  const executionReady = errors.length === 0;
  return {
    preflight: base({
      status: executionReady ? "ready-for-assembly" : "blocked",
      executionReady,
      lineageBound: true,
      reviewPacketBound: true,
      custodyBound: true,
      assembly,
      errors,
    }),
    assemblyInput: executionReady ? assemblyInput : undefined,
  };
}

function validateReviewPacketBinding(input: LocalPackageRequest, packet: Awaited<ReturnType<typeof readQuarantinePackageReviewPacket>>["record"]): string[] {
  const errors = [...(packet ? [] : ["Local pilot package assembly requires a durable quarantine package review packet."] )];
  if (!packet) return unique([...errors, "The review packet could not be read from the configured quarantine custody boundary."]);
  if (packet.packetId !== input.reviewPacketId) errors.push("The supplied review packet id does not match the durable quarantine review packet.");
  if (packet.tenantId !== input.manifest.tenantId || packet.packageId !== input.manifest.packageId) errors.push("The durable review packet tenant and package identities do not match the approved delivery manifest.");
  if (packet.status !== "ready-for-next-gate" || packet.reviewDecision !== "accepted-for-package-review") errors.push("The durable review packet is not accepted for package assembly.");
  if (packet.checksumSha256 !== input.manifest.sourceAssemblyChecksum.replace(/^sha256:/, "")) errors.push("The durable review packet checksum does not match the approved delivery manifest.");
  return unique(errors);
}

function privacyMessage(): string {
  return "This preflight reads only bounded review metadata and approved file evidence; it performs no local write, does not activate students, mutate QR aliases, enable hosted persistence, or store learner records.";
}

function unique(values: string[]): string[] { return [...new Set(values)]; }

function sameJson(left: unknown, right: unknown): boolean { return stableJson(left) === stableJson(right); }

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
}

