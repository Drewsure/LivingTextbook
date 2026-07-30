# Teacher Authoring Readiness Checks

## Scope

Run after teacher authoring, draft, copy/edit, AI authoring, activity pathway edit, printable authoring, library, or package versioning changes.

## Checks

- Confirm `npm run verify:teacher-authoring` passes.
- Confirm `/teacher/intake` shows `Teacher authoring readiness`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Teacher draft package`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Local edit preview`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Draft content-entry workbench preview`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Activity title`, `+ Instruction`, `Single sided`, `Double sided`, and `min 2 max 50`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Generate With AI blocked`, `Flip tiles preview`, `Cross-game upload guide`, and `No Done-to-student route`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Approved learner font`, `Tenant font pack`, `Hiragana-safe font`, and `Font rendering gate`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Profile binding preview`, `template_rendering_profile: template-profile-flip-tiles-cross-game-v1`, and `font_accessibility_profile: font-profile-young-learner-ja-safe-v1`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Student-facing rendering blocked` and `Student-facing font blocked`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Audio cue required`, `Image upload blocked`, `No live file picker`, and `No template switch without compatibility check`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Draft audio coverage preview`, `Term audio`, `Sentence audio`, and `Instruction audio`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Draft review handoff preview`, `Review packet blocked`, `Schema validation packet`, `Audio coverage packet`, and `Draft persistence required`.
- Confirm `/teacher/review` shows `Teacher draft review queue`, `Review workbench preview`, `Verifier submission blocked`, `Package approval blocked`, `Student assignment blocked`, `No live approval`, and `No direct AI publish`.
- Confirm `/teacher/review` shows an AI-generated draft queue item with `AI-generated daily routines draft preview`, `Source lineage`, `AI verifier submission packet`, `AI verifier submission packet required`, `Create route from AI draft`, `Create playlist from AI draft`, and `Assign generated draft to students`.
- Confirm `/teacher/review` keeps AI-generated draft review blocked with `AI schema packet ready`, `AI audio coverage pending`, `AI engine binding ready`, `AI gamification mapping ready`, `AI media rights pending`, `AI teacher approval missing`, and `No live AI verifier workflow`.
- Confirm `/teacher/review` shows `Reviewer decision preview`, `Decision actions disabled`, `Return for edits`, `Needs audio`, `Ready for approval`, `Approval still blocked`, and `Approver identity required`.
- Confirm `/teacher/review` shows `Review evidence packet preview`, `Evidence upload blocked`, `Reviewer identity evidence`, `Evidence storage required`, and `No file upload in foundation preview`.
- Confirm the local edit preview shows `Save draft blocked`, `Submit for review blocked`, `Student assignment blocked`, and `Audio regeneration required`.
- Confirm the content-entry workbench preview shows disabled row-level audio, image, formatting, reorder, duplicate, delete, and add-item controls.
- Confirm the draft route shows `Draft only`, `Student assignment blocked`, `Review before assignment`, `Audio before students`, and `No direct publish`.
- Confirm quick draft, copy/edit, activity pathway edit, and printable authoring remain planned.
- Confirm direct AI publish remains blocked.
- Confirm fast authoring creates draft packages only.
- Confirm student assignment remains blocked until reviewed package, audio, route, rights, version, and approval gates are satisfied.
- Confirm AI handoff docs still state that AI cannot publish student-facing content by itself.

## Verification Command

```powershell
npm run verify:foundation
```
