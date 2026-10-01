# DR-1375: Publisher Submission Format Alignment

- Decision: Align the publisher-facing submission manifest with the upload
  policy and executable source preflight.
- Scope: White-label publisher intake and review-only package preparation.
- Date: 2026-10-01
- Status: Accepted

The manifest now declares the complete supported v1 source, image, audio,
video, transcript, font, and background-media lanes. Poster images are kept in
the image lane rather than being represented as video files. A regression
check guards the format lists. This is a compatibility and review contract,
not permission to upload, promote, release, print QR codes, activate hosted
persistence, or assign content to students.
