# Source Review Queue Contract

Document type: implementation contract

Status: active scaffold

## Purpose

The source review queue is the handoff lane between raw partner files and reviewed Living Textbook package data.

It exists so PDF, DOCX, audio, video, and teacher-note inputs do not become student-facing content automatically.

## Standing Rules

- Preserve original source files.
- Do not overwrite source files with generated package data.
- Do not trust AI extraction without human review.
- Do not publish media assets without rights/ownership notes.
- Do not let support-language text unlock progression.
- Do not assign a source item to students until it maps to a reviewed package, media manifest, route alias, or teacher-only note.

## Source Item Requirements

Each source item should identify:

- Tenant.
- Source kind.
- Source reference.
- Target package.
- Owner.
- Status.
- Extraction plan.
- Review needs.
- Blockers.
- Output candidate.

## Current Sample Queue

The scaffold currently includes:

- MiniStar master curriculum DOCX.
- Sample publisher textbook PDF.
- Sample publisher audio folder.
- Sample publisher video folder.

## Acceptance Criteria

- `/teacher/intake` shows a source review queue before package release gates.
- The queue separates raw sources from reviewed package releases.
- Rights review is visible for partner audio/video.
- The MiniStar DOCX is ready for extraction but still requires teacher review.
- The sample publisher PDF is triage-only until a real production source exists.
