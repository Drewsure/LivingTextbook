# ADR 1445: Teacher Answer-Key Source Lane

## Decision

Publisher intake must support a distinct teacher-only answer-key source lane.
Teacher versions may be used for authoring, answer verification, teacher
reports, and controlled teacher review, but they must never be treated as
student source content.

## Current External Evidence

The MiniStar Foundation Unit 1 Teacher PDF is held outside the repository at:

`D:\PublisherPilotInput\teacher\answers\unit-1-answers.pdf`

SHA-256:

`sha256:3cf1e6ad766a0f8ffb1a35e8e7662083b8d21cb964fea4597f411f3b2c22f0e9`

The student source remains separately held at `source/unit-1.pdf` with its own
checksum. The answer key is not yet admitted to a publisher manifest or local
student bundle.

## Contract Boundary

The intake brief, source manifest, preflight, and submission review manifest now
represent `teacher-answer-key` as a teacher-only asset kind. Student routes, QR
launches, learner payloads, and student print outputs must reject or omit that
asset. The lane requires its own rights, scan, and access-control evidence.

The remaining release gate is to prove that the final student bundle assembler
omits teacher-only entries and that the teacher review route can read them only
under tenant-scoped teacher authorization. Adapter regression coverage now
proves the teacher-only manifest mapping and path rejection; it does not grant
runtime access or promotion.

## Status

External evidence captured; review-contract implementation verified. No answer
content has been promoted, assigned, uploaded, or exposed to students.
