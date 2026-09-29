# ADR 1259: Live Publisher Readiness Binding

## Status

Accepted for the first publisher pilot.

## Decision

Expose a metadata-only API that derives the publisher readiness binding from a
real tenant-scoped quarantine submission, its optional durable package review
packet, and its optional assembly preflight. The live bridge displays those
identities beside explicit blocked checks for every downstream package layer.

## Safety boundary

The route is read-only. It returns no payload bytes, filesystem paths,
credentials, learner records, download URLs, package files, or activation
capability. It does not create a review packet, assemble a package, print QR
codes, select hosted persistence, or promote a source.

## Consequence

The first saleable pilot now has one workflow for both a sample package review
and a real submitted source. Missing downstream evidence is visible as a
blocked check instead of being silently represented as ready.
