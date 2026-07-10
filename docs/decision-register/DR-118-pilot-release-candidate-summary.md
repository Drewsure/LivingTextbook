# DR-118: Pilot Release Candidate Summary

## Decision

Add a pilot release candidate summary that joins the package publish gate and approval ledger into one release-control view.

## Reason

The platform needs a simple answer to a commercial question: can this package go to a real pilot? The underlying gates and approvals should remain detailed, but teachers, publishers, and future agents need a concise summary that prevents a demo scaffold from being mistaken for a live release.

## Standard

- A release candidate is not pilot-ready while any release-blocking gate is open.
- A release candidate is not pilot-ready while any required approval is unsigned.
- Demo routes may stay visible while release status remains open.
- The summary is backend-agnostic until real persistence is chosen.
- No production publish button is implied by the scaffold.

