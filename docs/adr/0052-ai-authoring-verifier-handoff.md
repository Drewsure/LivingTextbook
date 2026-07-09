# ADR 0052: AI Authoring Verifier Handoff Before Live AI

Date: 2026-07-09

Status: accepted

## Context

The project needs AI authoring and verification eventually, but live AI should not be wired before schema, package review, audio support, rights review, and teacher approval are clear.

## Decision

Add a teacher/admin intake panel and data scaffold for the AI authoring verifier handoff.

## Implications

Live model calls remain out of scope.

Future AI generation must feed draft package data through the verifier stages instead of bypassing the source review and package release process.
