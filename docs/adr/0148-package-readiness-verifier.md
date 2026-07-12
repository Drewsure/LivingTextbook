# ADR 0148: Package Readiness Verifier

## Status

Accepted

## Context

The platform now has two sample tenants, active game routes, media playlists, report package previews, assist-language policy, local companion planning, and optional premium AI Tutor policy. Browser route checks prove pages respond, but they do not prove the underlying package contracts still preserve pilot-critical rules.

## Decision

Add `npm run verify:package-readiness` and include it in `npm run verify:foundation`.

## Consequences

- The verifier fails if either sample tenant is removed from package readiness summaries.
- The verifier fails if active package modes lose explicit audio cue coverage.
- The verifier fails if media assets lose audio/video, rights, playlist, or local-bundle expectations.
- The verifier fails if background media stops being teacher-gated and default-off.
- The verifier fails if front-door QR/access policies stop requiring entry code, learner code, and teacher-report support.
- The verifier fails if AI Tutor stops being explicit, optional, premium, and upper-level by default.
- Package readiness becomes a command-line hard gate, not only a teacher/admin panel concept.
