import {
  createSampleFrontDoorContext,
  getSampleFrontDoorRouteByTenantId,
  type SampleFrontDoorContext,
} from "./sampleTenantRouteRegistry";

export type { SampleFrontDoorContext };

export function resolveSampleFrontDoorContext(tenantId: string): SampleFrontDoorContext | undefined {
  const route = getSampleFrontDoorRouteByTenantId(tenantId);

  return route ? createSampleFrontDoorContext(route) : undefined;
}
