# DR-858: UI Package Export Map

The UI package exposes one canonical root export targeting its public
component index and does not expose internal primitive subpaths. The shared
package-boundary verifier checks this alongside content-model exports. This
does not enable live services or external game promotion. See ADR 0781.
