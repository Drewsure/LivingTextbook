# DR-743: Ready And Blocked Report Fixture

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Teacher reporting / canonical game integration

The sample teacher report now includes an incomplete canonical game attempt and
a complete retry. The first remains blocked while the retry can pass sequence,
identity, replay, timestamp, and completion checks, proving both report paths
without enabling export or persistence. See
`docs/adr/0671-ready-and-blocked-report-fixture.md`.
