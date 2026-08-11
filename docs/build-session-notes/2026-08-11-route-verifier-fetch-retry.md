# 2026-08-11 Route Verifier Fetch Retry

## Summary

Added a retry loop to active route verification after observing transient local fetch failures during a large route sweep.

## Changes

- Added three-attempt fetch retry behavior to `scripts/verify-active-routes.mjs`.
- Documented the Windows/local-server workaround as `OW-016`.

## Boundaries

- Does not reduce expected-text checks.
- Does not ignore failed routes.
- Does not change active route count.

## Verification Target

Run route syntax check and active route verification.
