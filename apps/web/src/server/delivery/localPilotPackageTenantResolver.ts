import type { TenantConfig } from "@living-textbook/content-model";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";

/** Prefer package-owned branding, while preserving the demo tenant registry. */
export function resolveLocalPilotPackageTenant(tenantId: string, embeddedTenant?: TenantConfig): TenantConfig | null {
  return resolveTenantConfig(tenantId, embeddedTenant);
}
