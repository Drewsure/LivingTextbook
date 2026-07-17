# Source Review Queue Checks

Run these checks when source review queue behavior changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- The source review queue appears before the reviewed package pipeline.
- MiniStar DOCX, sample publisher PDF, sample publisher audio, and sample publisher video items are visible.
- Audio and video items show rights-review ownership.
- Blockers are visible for missing production PDF/media/rights inputs.
- Hard rules mention preservation, human review, rights, support-language limits, and package mapping.
- Required records include `source_extraction_review_packet`, `upload_file_policy_profile`, and `teacher_draft_review_handoff`.
- Blocked extraction shortcuts include `No raw PDF as student payload`, `No unreviewed OCR assignment`, and `No AI extraction direct assignment`.

## Product Checks

- The queue does not claim raw PDF extraction is automated or production-ready.
- The queue does not publish media without rights review.
- The queue does not make support language a progression trigger.
- Source files remain separate from canonical package releases.
- Extraction review packets remain review evidence and cannot create routes, games, playlists, package releases, or assignments by themselves.
