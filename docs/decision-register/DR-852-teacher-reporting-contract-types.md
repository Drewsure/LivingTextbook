# DR-852: Teacher Reporting Contract Types

Reusable teacher reporting panels import their contracts from the
feature-owned teacher monitor type module. The sample monitor is a demo
provider only and constructs records against those contracts. This keeps
white-label reporting providers interchangeable and prevents fixture modules
from becoming domain APIs. See ADR 0775.
