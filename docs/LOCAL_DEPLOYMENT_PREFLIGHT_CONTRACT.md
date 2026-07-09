# Local Deployment Preflight Contract

Document type: implementation contract

Status: active scaffold

## Purpose

Local deployment preflight defines what must be true before a publisher, school, or textbook partner receives a closed local companion package.

The platform should support local/closed deployment, but the first pilot should remain hosted unless the local blockers are intentionally funded and solved.

## Current Checks

- Content bundle manifest.
- Audio/video bundle.
- Installer and yearly updates.
- Local reporting and export.
- QR and deep-link behavior.
- Offline access control.

## Required Rules

- Local deployment must not depend on raw folder paths.
- Bundles need checksums or signed package metadata.
- Audio/video files need rights and offline distribution permission.
- Local reporting needs export, backup, restore, and optional sync policy.
- Printed QR behavior must be tested for installed app, local server, and hosted fallback paths.
- Entry/user codes are not production authentication until local roster and privacy policy are accepted.

## Acceptance Criteria

- `/teacher/intake` shows local deployment preflight before local bundle manifests.
- Hosted PWA remains the recommended first pilot path.
- Local companion blockers are visible and not hidden as polish tasks.
