# ADR 0446: Package Writer Assignment Shell Guard

Status: Accepted

Date: 2026-08-28

## Context

Generated package writer planning now protects routes, playlists, QR behavior, and local companion packages. The next risk is classroom activation: a generated package must not become a live assignment, private link, class roster binding, progress stream, teacher report, or launch gate without policy and review evidence.

## Decision

Add a review-only AI generated package writer assignment shell guard after the local companion package guard.

The guard protects assignment shells, private assignment links, class roster scope, progress event contracts, teacher report previews, and launch gate bindings. It requires teacher QR/front-door assignment review, target-language trigger checks, no-real-learner-data checks, school policy acceptance, teacher report privacy, progress event taxonomy, and raw microphone audio/transcript exclusion.

## Consequences

- Generated packages cannot activate assignments, private assignment links, rosters, progress streams, teacher reports, or classroom launches from preview state.
- Future assignment work must add a storage contract and school launch evidence before live assignment workflows exist.
- MiniStar assignment guard records preserve English as the target-language trigger and keep Foundation/Bronze/Plus Japanese support hiragana-only and support-only.
