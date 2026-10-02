# DR-1431: Respect Optional Publisher Media During Intake

Publisher intake preflight now honors each media request's `required` flag.
Required source/audio/evidence gaps remain blocking, while missing optional
image, video, transcript, font, and background-media lanes are reported as
omitted optional files. The distinction is review metadata only and cannot
authorize delivery or student use.

See ADR 1431 and `docs/PUBLISHER_PILOT_INPUT_KIT.md`.
