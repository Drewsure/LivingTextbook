# ADR 0973: Display Quality Evidence Scope

Status: Accepted

## Context

Quality evidence is now validated against the readiness tenant and package, but
the release workbench showed only the check result and source record. Reviewers
need to see the identity binding while inspecting a saleable tenant release.

## Decision

The required quality-signals section displays the evidence tenant and evidence
package alongside the seven quality checks. Missing scope is shown as missing,
not silently replaced with a parent identity.

## Consequences

- Adult reviewers can spot scope drift on the review surface itself.
- The UI remains useful for both MiniStar and future publisher tenants.
- This is evidence presentation only; no release, persistence, promotion, or
  student-launch action is introduced.

## Verification

The static readiness verifier checks the scope labels, while the shared model
and behavior verifier enforce the underlying identities.
