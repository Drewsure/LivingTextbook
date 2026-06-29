# ADR 0010: Reviewed Assist Language Packages

Status: Accepted

Date: 2026-06-30

## Context

MiniStar may need Japanese support for young learners and local classrooms. Future white-label tenants may need different assist languages, no assist language, or teacher-only language support.

The platform must avoid three traps:

- hard-coding Japanese as a universal platform assumption,
- relying on live AI translation for unreviewed student-facing language,
- or waiting until the end of the build and then discovering the data model is English-only.

## Decision

Assist languages are optional, reviewed content-package data.

A tenant may configure target language, UI language, allowed assist languages, and whether live AI assist is allowed. A content package may then include unit-level assist language plans with reviewed vocabulary glosses, sentence glosses, instruction glosses, teacher notes, and student visibility rules.

Live AI assist is not a default pathway for young learners. It may later be introduced as a controlled premium or teacher/admin drafting workflow, but student-facing assist language should come from reviewed package content.

## Consequences

Positive:

- MiniStar can show Japanese support early without weakening white-label portability.
- Future tenants can use Korean, Thai, Spanish, Arabic, or no assist language through the same structure.
- Reviewed assist text can be used offline or in closed local deployments.
- The system avoids recurring live-AI translation cost for core young-learner flows.

Tradeoffs:

- Human or publisher review is required before assist text becomes student-visible.
- The first sample only proves vocabulary and sentence support; broader UI localization remains future work.
- Assist-language audio uses browser text-to-speech in the prototype and should later accept recorded or partner-provided audio cues.

## Constraints

- Japanese is MiniStar sample data, not a global platform rule.
- Assist languages must be configured per tenant and carried by content packages.
- Student-visible assist plans must be reviewed, verified, or approved.
- Live AI fallback must be explicit and disabled by default for the core package.
- Assist text shown to students should be tappable/listenable where it appears in learning flows.
- Teacher reports and package review screens should expose whether assist language is reviewed and student-visible.

## Current Prototype

The first sample is MiniStar Level 1 Unit 1 with Japanese assist:

- vocabulary glosses,
- two sentence glosses,
- selected instruction/feedback glosses,
- `student-toggle` visibility,
- reviewed status,
- and live AI fallback off.
