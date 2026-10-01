# ADR 1375: Align Publisher Submission Format Lanes

- Status: Accepted
- Date: 2026-10-01

## Context

The publisher submission manifest was narrower than the established upload
policy and source preflight. It also listed poster image formats inside the
video lane, which made the review contract ambiguous.

## Decision

The publisher submission manifest will use the same v1 format sets as the
upload policy and executable preflight. Textbook sources support PDF, DOCX,
TXT, Markdown, and CSV; images support PNG, JPG, JPEG, WEBP, and SVG; audio
supports MP3, WAV, M4A, and OGG; video supports MP4, WEBM, and MOV; and
background media supports the approved audio and video set. Video posters are
declared as images.

## Consequences

Publisher operators receive one coherent compatibility promise across the
intake layers. The manifest verifier now guards the lane declarations. This
does not enable uploads, content promotion, release, QR printing, persistence,
or student use; rights and accessibility evidence remain required.
