# DR-1407: Bound Next Production Build Resources

- **Decision:** Cap Next production worker scheduling at two CPUs and enable
  memory-aware worker selection.
- **Reason:** Make local and white-label builds predictable and cost-conscious
  on modest machines while avoiding unnecessary peak process pressure.
- **Boundary:** This does not claim the current build is fixed, does not clear
  stale processes, and does not replace production-build or browser-rehearsal
  evidence.
- **Verification:** Web typecheck, production build on a clean process state,
  and the active foundation composition checks.
