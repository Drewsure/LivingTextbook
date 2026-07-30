# DR-306: MiniStar Generated Package Manifest

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only generated package manifest for the MiniStar Level 1 greetings generator request.

White-label impact: Positive. The manifest proves generated package lineage for MiniStar while using the same shared structure that future textbook tenants can use.

Cost impact: Positive. The manifest is static review evidence and creates no live AI generation, voice generation, storage write, route, playlist, local bundle, or assignment.

Constraints:

- The manifest is not a publishable package.
- Media-rights and teacher approval remain missing.
- Audio approval, durable storage, release-control binding, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready markers remain blocked.
- This decision is recorded in `docs/adr/0306-ministar-generated-package-manifest.md`.
