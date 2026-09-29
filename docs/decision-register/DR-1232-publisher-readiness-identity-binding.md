# DR-1232: Publisher Readiness Identity Binding

## Decision

Store and validate the exact package-readiness reconciliation identity inside
the publisher package preview.

## Why

The saleable pilot must prove that the content, games, media, QR, and policy
preview refers to the same source revision and release evidence as intake.

## Boundary

Identity binding detects drift only. It does not approve evidence, activate
storage, promote a package, print production QR codes, or launch students.

## Next gate

Replace sample publisher records with real source and media evidence while
preserving the same identity and checksum validation.
