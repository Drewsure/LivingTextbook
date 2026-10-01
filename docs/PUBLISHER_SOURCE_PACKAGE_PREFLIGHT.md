# Publisher Source Package Preflight

This is the first handoff step for a white-label publisher. It accepts a
local source folder and proves that the folder contains the declared textbook
and multimedia inputs before any quarantine or package operation.

## Required folder shape

The source folder must contain `publisher-source-manifest.json`. Paths in the
manifest are relative to that folder and use `/` separators.

```json
{
  "recordVersion": 1,
  "manifestId": "publisher-edition-source-v1",
  "tenantId": "publisher-tenant",
  "packageId": "publisher-level-1-unit-1",
  "version": "2026.10.01",
  "entries": [
    {
      "assetId": "unit-1-source",
      "kind": "textbook-source",
      "relativePath": "unit-1/source.pdf",
      "unitKey": "publisher:series:L1:U1",
      "acceptedTypes": ["application/pdf"],
      "required": true
    }
  ],
  "reviewOnly": true,
  "quarantineWriteAllowed": false,
  "packageAssemblyAllowed": false,
  "studentFacingUseAllowed": false
}
```

Supported asset kinds are `textbook-source`, `image`, `audio`, `video`,
`transcript`, `font`, and `background-media`. A single manifest can declare
multiple units and all of the multimedia lanes required by the publisher's
edition.

## Run the preflight

In PowerShell:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
$env:LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY = "D:\PublisherPackage"
$env:LIVING_TEXTBOOOK_PUBLISHER_PREFLIGHT_OUTPUT = "D:\PublisherPackage\review\source-preflight.json"
npm run preflight:publisher-source
```

The command calculates SHA-256 checksums and reports the declared inventory.
It exits successfully only when required files are present, paths are safe,
types are accepted, sizes are bounded, checksums are valid, and no unlisted
files are present. Optional missing files are warnings; they still need human
review before release.

### Create the manifest first

For a new publisher folder, create only the declaration file with the bounded
template command below. It never creates, copies, uploads, or guesses any
publisher content files, and it refuses to overwrite an existing manifest:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
node scripts/create-publisher-source-manifest.mjs `
  --root "D:\PublisherPackage" `
  --tenant-id "publisher-tenant" `
  --package-id "publisher-level-1-unit-1" `
  --version "2026.10.01" `
  --unit-key "publisher:series:L1:U1" `
  --source "unit-1/source.pdf" `
  --asset "image=unit-1/diagram.png" `
  --asset "audio=unit-1/greetings.mp3" `
  --asset "video=unit-1/lesson.mp4" `
  --asset "transcript=unit-1/lesson.vtt"
```

Place the publisher-owned files at the declared relative paths, add any
remaining approved media/font/background entries, then run the preflight above.
The generated declaration remains review-only: it cannot promote files,
assemble a package, print QR codes, activate persistence, or start students.
Its `acceptedTypes` values are MIME types, so the declaration and the
preflight's detected file types remain aligned for PDF, DOCX, TXT, Markdown,
CSV, SVG/image, MP3/WAV/M4A/OGG audio, MP4/WEBM/MOV video, transcript, font,
and background-media lanes.

The report includes two chain-of-custody fingerprints: a checksum of the
manifest file as supplied and a deterministic checksum of the sorted observed
file inventory. Preserve both values with the later source-review evidence.
If either value changes, treat the source folder as a new submission and rerun
the preflight; do not reconcile it by filename alone.

The output is evidence only. It does not upload, quarantine, promote,
assemble, print QR codes, activate hosted persistence, create learner records,
or start students. Follow the existing tenant-scoped source review and
publisher evidence gates after the preflight passes.

## Attach to quarantine review

After a complete report is reviewed, an authorized teacher or service may
submit the report to the tenant-scoped source preflight evidence route. The
route reconciles the report's verified `textbook-source` entry with the exact
quarantined intake checksum, then writes only a metadata sidecar named
`source-preflight-evidence.json`. The sidecar preserves the report, manifest,
version, unit, and aggregate fingerprints needed by later review.

This write path is controlled by the explicit local environment gate
`LIVING_TEXTBOOOK_SOURCE_PREFLIGHT_EVIDENCE_ENABLED=true` and is disabled by
default. It is idempotent for the same evidence and rejects conflicting
evidence. Attaching the report is not approval: package assembly, asset
promotion, QR printing, hosted persistence, and student use remain blocked by
their own later gates.

The teacher upload workspace also provides a controlled capture panel for this
JSON report. It previews report identity and counts locally, then submits only
the evidence object to the tenant-scoped route. It does not send the source
folder or its textbook, image, audio, video, font, or background-media files.

## Required before package review

The durable source preflight sidecar is now a required input to the package
review packet. The handoff bridge shows a visible `Preflight lineage` status
and keeps the packet action unavailable until the report is attached to the
matching tenant, quarantine, package, and source checksum. This prevents a
package review snapshot from appearing complete when the publisher's source
inventory has not yet been reconciled.

The sidecar remains metadata-only and review-only. Attaching it does not
approve the source, promote assets, assemble a package, print QR codes, enable
hosted persistence, create learner records, or start students.

The same evidence identity must remain attached through later delivery
release, QR registration, and local-package metadata. A packet or release
record with no matching `sourcePreflightEvidenceId` is stale and must fail
closed rather than becoming a pilot package.

## Intake kit sidecars

When the source root is also a completed publisher pilot intake kit, the
preflight intentionally ignores only these operator sidecars:
`publisher-pilot-intake.json`, the kit `README.md`, and files under
`evidence/`. Those records are reviewed by the intake preflight and evidence
workflow. Every other file remains an unlisted source asset and blocks the
inventory, so this exception cannot hide undeclared content.

