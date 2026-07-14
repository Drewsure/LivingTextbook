# ADR 0203: Content Entry Option Scaffold

Date: 2026-07-14

## Status

Accepted

## Context

Teacher authoring and upload workflows need practical content-entry controls: template flow, title, instructions, single/double sided rows, row-level audio and image attachment, formatting, reorder, duplicate, delete, item limits, AI draft help, flip-tile behavior, and a Done action.

The platform is not ready for live file pickers, AI publish, template switching, draft persistence, or student-facing upload promotion. Those need durable storage, rights review, media review, compatibility checks, audio coverage, and release-control gates.

## Decision

Add a read-only `Content entry option scaffold` to `/teacher/intake`.

The scaffold documents the expected teacher-facing controls while keeping them draft-only and review-gated. `Done` is explicitly blocked from routing content to students. `Generate With AI`, image upload, media upload, and template switching are shown as future controls that must pass verifier and release gates first.

## Consequences

The foundation now preserves the authoring/upload panel detail before live implementation. Future authoring work must extend this scaffold into a real workbench only after draft storage, upload records, rights review, audio coverage, compatibility snapshots, and package release control remain verified.
