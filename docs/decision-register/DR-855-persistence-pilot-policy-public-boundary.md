# DR-855: Persistence And Pilot Policy Public Boundary

Persistence record categories and pilot-policy requirements used by web
surfaces are neutral content-model contracts consumed through the package
root. This keeps tenant providers and reusable panels replaceable while
preserving the no-side-effect, privacy, reporting, deployment, and pilot
policy gates. It does not create live database writes or authorize Phaser
promotion. See ADR 0778.
