import {
  createPublisherSourcePackagePreflightReport,
  type PublisherSourcePackageManifest,
  type PublisherSourcePackagePreflightReport,
} from "@living-textbook/content-model";

export const samplePublisherSourcePackageManifest: PublisherSourcePackageManifest = {
  recordVersion: 1,
  manifestId: "sample-publisher-starter-english-v1-source-manifest",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-starter-english-l1-u1",
  version: "2026.10.01",
  entries: [
    { assetId: "unit-1-source", kind: "textbook-source", relativePath: "unit-1/source.pdf", unitKey: "sample-publisher:starter-english:L1:U1", acceptedTypes: ["application/pdf"], required: true },
    { assetId: "unit-1-greetings-audio", kind: "audio", relativePath: "unit-1/audio/greetings.mp3", unitKey: "sample-publisher:starter-english:L1:U1", acceptedTypes: ["audio/mpeg", "audio/wav"], required: true },
    { assetId: "unit-1-classroom-image", kind: "image", relativePath: "unit-1/images/classroom.png", unitKey: "sample-publisher:starter-english:L1:U1", acceptedTypes: ["image/png", "image/jpeg"], required: false },
  ],
  reviewOnly: true,
  quarantineWriteAllowed: false,
  packageAssemblyAllowed: false,
  studentFacingUseAllowed: false,
};

export const samplePublisherSourcePackagePreflight: PublisherSourcePackagePreflightReport = createPublisherSourcePackagePreflightReport({
  manifest: samplePublisherSourcePackageManifest,
  manifestChecksumSha256: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
  inventoryChecksumSha256: "sha256:2222222222222222222222222222222222222222222222222222222222222222",
  observedFiles: [
    { assetId: "unit-1-source", relativePath: "unit-1/source.pdf", exists: true, sizeBytes: 48210, checksumSha256: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", detectedType: "application/pdf" },
    { assetId: "unit-1-greetings-audio", relativePath: "unit-1/audio/greetings.mp3", exists: true, sizeBytes: 12840, checksumSha256: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", detectedType: "audio/mpeg" },
    { assetId: "unit-1-classroom-image", relativePath: "unit-1/images/classroom.png", exists: true, sizeBytes: 7310, checksumSha256: "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", detectedType: "image/png" },
    { relativePath: "unit-1/notes.txt", exists: true, sizeBytes: 420, checksumSha256: "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", detectedType: "text/plain" },
  ],
});
