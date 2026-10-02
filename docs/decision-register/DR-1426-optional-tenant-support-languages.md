# DR-1426: Optional Tenant Support Languages

- **Decision:** Intake kits default to no assist language and accept explicit
  bounded support-language ids when the tenant approves them.
- **Reason:** Keep the white-label platform language-neutral while preserving
  MiniStar's Japanese support path.
- **Boundary:** Support language assists only; target-language completion still
  triggers progression and all package/release gates remain unchanged.
- **Verification:** Intake-kit self-test, intake-kit verifier, typecheck, and
  foundation composition.
- **Related:** ADR 1426 and Principles and Standards 668.
