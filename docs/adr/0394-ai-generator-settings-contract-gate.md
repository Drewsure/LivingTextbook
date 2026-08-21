# ADR 0394: AI Generator Settings Contract Gate

Status: Accepted

Context: The platform has a backend-neutral game settings contract for teacher-controlled timer, difficulty, motion, attempts, background media, skin, arcade speed, scoring, and learning-audio rules. AI-generated game drafts need to preserve that same contract before they enter package review.

Decision: add a settings contract gate to the AI teaching game generator. Generator plans and request previews now name settings backend records, settings profile references, and settings backend gates before any future promotion workflow can consider the draft.

Consequences:

- Generated drafts cannot bypass reviewed game mode settings profiles.
- Generator reviewers can see whether a draft has settings profile references and backend gates.
- No live model call, package review promotion, route write, playlist write, local bundle write, assignment, settings persistence, scoring override, or support-language-only progress path is introduced.
- `npm run verify:ai-generator` and active route checks enforce the rule.
