# DR-852: Teacher Reporting Contract Types

Reusable teacher reporting panels and demo providers import their contracts from
the neutral `packages/content-model` public module. Tenant
configuration is also owned by the content model, with the web tenant type file
remaining only as a compatibility re-export. This keeps white-label reporting
providers interchangeable and prevents fixture or UI modules from becoming
domain APIs. See ADR 0775.
