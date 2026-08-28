# ADR 0444: Package Writer Local Companion Package Guard

Status: Accepted

Date: 2026-08-28

## Context

The white-label platform must support closed/local textbook companion packages for publishers and schools that need stable QR paths, local media bundles, and offline fallback. That capability is valuable, but it can create risk if generated package writers can export local bundles, copy media, activate offline routes, or include learner data before storage, rights, policy, and rollback rules are reviewed.

## Decision

Add a review-only AI generated package writer local companion package guard after the route and playlist write guard.

The guard protects local manifests, media bundle inventories, offline route maps, printed QR fallback sheets, export archive previews, and restore checkpoints. It keeps local companion package work blocked while requiring local manifest review, media rights and file inventory review, offline route smoke checks, printed QR fallback review, rollback restore checkpoint review, student data exclusion, signed approval, and school policy acceptance.

## Consequences

- Closed/local delivery becomes part of the core white-label architecture.
- No generated package can package a local bundle, activate a local folder, activate offline routes, copy media, create export archives, release a local companion package, activate assignments from local companion, or rely on support-language-only approval.
- MiniStar local companion packages preserve English as the target-language trigger and keep Foundation/Bronze/Plus Japanese support hiragana-only and support-only.
- Future writer work must add a storage contract and signed approval path before any local companion artifact can be created.
