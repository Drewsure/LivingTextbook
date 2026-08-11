# 0382. AI generated package teacher review packet

Date: 2026-08-11

## Status

Accepted

## Context

The AI generator route now has draft payload, verifier, manifest, promotion, and writer planning surfaces. Teachers still need one readable approval-prep packet that gathers the draft, target-language audio, curated activity path, deterministic rewards, media evidence, support-language boundary, and missing evidence before any package approval can be considered.

## Decision

Add a review-only AI generated package teacher review packet to the generator route for each tenant. The packet shows teacher decision lanes, ready signals, missing evidence, blocked actions, and next required records.

The packet does not capture approval. It cannot assemble packages, write routes, create playlists, assign students, write local bundles, mark student-ready state, or count support-language activity as progress evidence.

MiniStar packets must preserve English target-language audio as the approval trigger. Foundation Japanese support remains hiragana-only and support-only.

## Consequences

- Teachers get a compact review surface before package assembly planning.
- White-label tenants can use the same approval-prep pattern without hard-coding MiniStar rules globally.
- Generated packages stay blocked until approval ledger, media-rights evidence, target-language audio approval, release-control binding, and assignment rollout records exist.
- Support-language progress shortcuts remain visibly blocked.
