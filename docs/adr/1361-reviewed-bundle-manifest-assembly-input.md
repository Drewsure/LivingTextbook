# ADR 1361: Separate Draft and Reviewed Bundle-Manifest Inputs

## Status

Accepted for the pilot foundation.

## Decision

The publisher delivery assembly request preview must list both the offline
bundle manifest and the durable reviewed bundle-manifest custody record as
separate required inputs. The second input is present only when its exact
tenant/package/version record is bound to the quarantine, package review packet,
and source preflight evidence.

## Rationale

A valid manifest shape is not the same thing as reviewed delivery evidence.
Keeping these inputs distinct makes the operator handoff honest and prevents a
draft manifest from being mistaken for authorization.

## Guardrails

The preview remains blocked, review-only, and side-effect-free. It cannot write
the custody record, assemble a package, print QR codes, activate persistence,
create learner records, or start students.
