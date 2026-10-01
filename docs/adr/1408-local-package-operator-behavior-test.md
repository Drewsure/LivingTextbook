# ADR 1408: Behavior-Test The Closed-Local Operator Handoff

## Status

Accepted for the pilot delivery foundation.

## Context

The closed-local package operator already had a bounded command and static
contract checks. A saleable pilot needs stronger evidence that the command's
real preflight and assembly requests are routed, authenticated, and gated as
documented.

## Decision

Add a local HTTP self-test that executes the operator command against a stub
endpoint. It tests rejected assembly without the exact one-shot confirmation,
successful preflight, successful explicitly confirmed assembly, route choice,
tenant credential use, request identity, and credential non-disclosure.

## Consequences

The operator handoff is now behavior-tested without touching publisher files,
package custody, QR records, hosted persistence, or learner data. The test is
part of foundation composition and remains compatible with a future
authenticated production operator console.
