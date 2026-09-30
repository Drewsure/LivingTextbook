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

The output is evidence only. It does not upload, quarantine, promote,
assemble, print QR codes, activate hosted persistence, create learner records,
or start students. Follow the existing tenant-scoped source review and
publisher evidence gates after the preflight passes.

