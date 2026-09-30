const DELIVERY_TOKEN_ENV = "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN";
const DELIVERY_TENANTS_ENV = "LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS";

/** The delivery credential is useful for operators, but never universal tenant authority. */
export function hasPilotDeliveryApiToken(request: Request, tenantId: string): boolean {
  const configuredToken = process.env[DELIVERY_TOKEN_ENV]?.trim();
  if (!configuredToken || request.headers.get("authorization") !== `Bearer ${configuredToken}`) return false;
  return readAllowedTenants().includes(tenantId);
}

/** Only bypasses browser-origin checks for an already authenticated machine call. */
export function hasPilotDeliveryApiCredential(request: Request): boolean {
  const configuredToken = process.env[DELIVERY_TOKEN_ENV]?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function readAllowedTenants(): string[] {
  return (process.env[DELIVERY_TENANTS_ENV] ?? "")
    .split(",")
    .map((tenantId) => tenantId.trim())
    .filter(Boolean);
}
