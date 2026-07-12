# Assist Language Standard

Document type: focused product and build standard

Related:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/adr/0010-reviewed-assist-language-packages.md`
- `docs/adr/0013-support-only-assist-language.md`
- `docs/ASSIST_LANGUAGE_VERIFICATION.md`
- `docs/TARGET_LANGUAGE_EXPANSION_CONTRACT.md`

## Product Rule

Assist language support is optional reviewed content-package data.

Japanese may be enabled for MiniStar, but it is not a universal platform requirement. Other tenants may choose Korean, Thai, Chinese, Spanish, Arabic, another support language, or no assist language.

This document governs assist language. It does not mean Japanese is only an assist language. A Japanese-language school could use Japanese as the target learning language in a future white-label tenant, but that is a target-language expansion, not an assist-language shortcut.

## Core Rules

- Target learning language and assist languages belong in tenant/package configuration.
- Student-facing assist text must be reviewed, verified, or approved before assignment.
- Assist language is support only. It must not complete a learning step, unlock the next game, award mastery credit, or replace the target learning language check.
- English remains the progression trigger for MiniStar English. For other tenants, the configured target learning language remains the progression trigger.
- Assist language is separate from full UI localization.
- Assist language is separate from AI Tutor.
- Live AI translation is not a default student pathway.
- Live AI fallback must be explicit, tenant-controlled, and disabled by default for the core young-learner package.
- AI may later draft assist language for teacher/admin review, but reviewed package content is the source of truth for students.
- Assist text shown to students should be tappable/listenable where it appears in learning flows.
- Recorded, partner-provided, teacher-recorded, or text-to-speech assist audio may be used depending on tenant package and rights.
- Assist language visibility is teacher-controlled for classroom launch. The current scaffold stores this as a local browser setting; future launch sessions must persist it.

## Japanese Script Rules

MiniStar Japanese assist has level-band rules:

- Foundation, Bronze, and Plus: student-visible Japanese assist must be hiragana-only.
- Silver and later: kanji and katakana may be introduced after review.
- Teacher notes, admin notes, and review metadata may use normal professional Japanese or English because they are not student-facing assist copy.
- If a future tenant uses different level names, the content package must state the equivalent script policy during review.

## Target-Language Expansion Boundary

When Japanese is the target learning language, Japanese becomes the progression trigger. Assist language then becomes English or another configured support language.

Future Japanese target-language packages should plan for:

- hiragana, katakana, kanji, and optional furigana/ruby display,
- Japanese audio cues and pronunciation models,
- kana/kanji typing support,
- phrase and particle segmentation rather than only English whitespace tokenization,
- level-aware script policy,
- teacher-reviewed Japanese curriculum rules,
- optional handwriting or stroke-order modes later.

Do not treat MiniStar Japanese assist copy as proof that the platform is already ready for Japanese-as-target-language pilots.

The current foundation gate for this is recorded in `docs/TARGET_LANGUAGE_EXPANSION_CONTRACT.md` and shown on `/teacher/intake`.

## White-Label Requirements

Tenant settings should represent:

- target learning language,
- default UI language,
- available assist languages,
- whether student assist is enabled by default,
- whether live AI assist is allowed.

Unit content packages should represent:

- target language,
- assist language,
- review status,
- source of assist content,
- student visibility,
- support-only progression role,
- script policy where the assist language requires level-aware writing rules,
- vocabulary glosses,
- sentence glosses,
- instruction glosses where needed,
- teacher notes,
- and live AI fallback permission.

## Current MiniStar Sample

MiniStar Level 1 Unit 1 includes a reviewed Japanese assist plan for greetings. It is hiragana-only student support and is a proof of the architecture, not a full localization rollout. It is off by default and can be enabled from `/teacher`.

## Not Yet Built

- Durable teacher toggle for enabling/disabling assist language per launch session.
- Full UI localization.
- Assist-language audio cue catalog with recorded files.
- Teacher/admin workflow for approving AI-drafted translations.
- Per-student language preference persistence.
- Explicit content-model fields for assist progression role and script policy.
- Durable content-model fields for target-language expansion roles, Japanese script policy, furigana, and segmentation policy.
