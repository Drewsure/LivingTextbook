const UPLOAD_TOKEN_ENV = "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN";
const UPLOAD_TENANTS_ENV = "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS";

/**
 * The service credential is intentionally not tenant authority by itself.
 * Deployments must bind it to an explicit comma-separated tenant allowlist.
 */
export function hasUploadQuarantineApiToken(request: Request, tenantId: string): boolean {
  const configuredToken = process.env[UPLOAD_TOKEN_ENV]?.trim();
  if (!configuredToken || request.headers.get("authorization") !== `Bearer ${configuredToken}`) return false;
  return readAllowedTenants().includes(tenantId);
}

/**
 * This is only a CSRF/origin bypass for machine-to-machine calls. Every
 * tenant-scoped review authorization must call hasUploadQuarantineApiToken.
 */
export function hasUploadQuarantineApiCredential(request: Request): boolean {
  const configuredToken = process.env[UPLOAD_TOKEN_ENV]?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

export function uploadQuarantineTenantAllowlistConfigured(): boolean {
  return readAllowedTenants().length > 0;
}

function readAllowedTenants(): string[] {
  return (process.env[UPLOAD_TENANTS_ENV] ?? "")
    .split(",")
    .map((tenantId) => tenantId.trim())
    .filter(Boolean);
}
