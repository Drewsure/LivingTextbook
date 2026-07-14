# ADR 0208: Draft Profile Binding Preview

Date: 2026-07-14

## Status

Accepted

## Context

The teacher draft content-entry workbench shows future template, font, and rendering controls. After adding template/font profile readiness to teacher intake, the draft route also needs to show that those controls depend on reviewed profile records before student-facing rendering.

## Decision

Add a compact profile binding preview to `TeacherDraftContentEntryWorkbenchPreview`.

The preview names the `template_rendering_profile` and `font_accessibility_profile` sample ids and keeps student-facing rendering/font blocks visible on the draft route.

## Consequences

Teacher draft authoring stays aligned with the upload/profile foundation. Future live authoring cannot treat font controls, printable rendering, or template switching as local UI-only state; reviewed profile records and release gates remain required.

