# MiniStar Level 1 Unit 1 Sample Bundle

This folder contains a planning manifest for the future local/offline bundle system.

It does not include real media files yet.

## Purpose

The manifest demonstrates how a closed/local Living Textbook companion package can identify:

- tenant
- curriculum
- book/unit
- local media paths
- hosted fallback source URIs
- permanent QR route mapping
- premium feature entitlements such as AI Tutor disabled by default

## Current Status

- `manifest.json` is a planning artifact.
- `offline_ready` is intentionally `false`.
- Media checksums are placeholders.
- The current app still uses the sample package in `apps/web/src/data/sampleMultimediaPackage.ts`.

## Do Not Assume

- Do not assume media rights are production-ready.
- Do not assume local files exist.
- Do not point printed QR codes directly to these local paths.
- Do not enable AI Tutor from this manifest unless the tenant has adopted the premium package and the tutor implementation has passed privacy, safety, and cost checks.

## Next Implementation Step

After local build verification, add a small resolver helper that can map a content package media asset to:

1. local bundle path,
2. hosted source URI,
3. or a clear unavailable-source fallback.
