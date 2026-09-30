# ADR 1366: Durable-Records Request Draft Generator

## Status

Accepted for the controlled pilot handoff.

## Decision

Provide a small local command that creates a durable-records package request
from approved identity fields. It must refuse to overwrite an existing file,
must not handle credentials or publisher payloads, and must not call the
server.

## Rationale

The package operator accepts a deliberately small draft because the server
derives delivery metadata and QR custody from exact tenant/package/version
records. Generating that draft reduces manual copying while keeping the
manifest itself inside reviewed custody.

## Boundary

The draft is not approval, release, QR authorization, package assembly,
persistence activation, or student access. It is only an input to the existing
machine-authenticated preflight and assembly gates.
