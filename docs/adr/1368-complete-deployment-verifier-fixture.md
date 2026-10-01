# ADR 1368: Keep Deployment Readiness Verification Faithful To Runtime Inputs

- Status: accepted
- Date: 2026-10-01

## Context

The pilot deployment matrix evaluates upload custody, delivery custody, QR
registry custody, reviewed manifest custody, local package custody, approved
asset custody, hosted activation custody, and the print origin. Its verifier
must exercise the same shape or a green/blocked result is misleading.

## Decision

Add every required production root to the verifier's environment reset list,
temporary directory fixture, and configured environment. Document each root in
the operator configuration guide.

## Consequences

The full foundation command now provides reliable evidence for the deployment
gate. The fix changes no runtime write, activation, persistence, or student
behavior; it only removes a false-negative test fixture.
