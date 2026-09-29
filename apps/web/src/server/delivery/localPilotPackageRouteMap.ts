import {
  getLocalPilotPackageFrontDoorPath,
  getLocalPilotPackageLaunchCode,
  getLocalPilotPackageMemoryMatchPath,
  getLocalPilotPackageTeacherEvidencePath,
} from "../../features/routes/routeContracts";
import type { LocalPilotPackageRuntimeSummary } from "./localPilotPackageRuntimeReader";

export interface LocalPilotPackageRouteMap {
  tenantId: string;
  packageId: string;
  version: string;
  unitId: string;
  launchCode: string;
  frontDoorPath: string;
  memoryMatchPath: string;
  teacherEvidencePath: string;
  localFallbackPath: string;
}

export interface LocalPilotPackageRouteDeclaration {
  qrId: string;
  unitId: string;
  targetType: string;
  localFallbackPath: string;
}

export type LocalPilotPackageRouteMapResult =
  | { status: "blocked"; routeMap: null; errors: string[] }
  | { status: "available"; routeMap: LocalPilotPackageRouteMap; errors: [] };

/**
 * Validates the route that will be printed into a closed-local package.
 * The writer only supports the unit-launch resolver until additional
 * package-scoped target resolvers have their own route contracts.
 */
export function validateLocalPilotPackageRouteFallbacks(input: {
  tenantId: string;
  packageId: string;
  version: string;
  routes: LocalPilotPackageRouteDeclaration[];
  printedFallbackPaths: string[];
}): string[] {
  const errors: string[] = [];
  if (input.routes.length !== input.printedFallbackPaths.length) {
    errors.push("Local package route declarations and printed QR fallback paths must remain aligned.");
  }

  input.routes.forEach((route, index) => {
    if (route.targetType !== "unit-launch") {
      errors.push(`Local package route ${route.qrId || index + 1} uses unsupported target type ${route.targetType}; no package-scoped resolver is approved.`);
      return;
    }
    if (!isSafeSegment(route.unitId)) {
      errors.push(`Local package route ${route.qrId || index + 1} requires a safe unit id for package-scoped resolution.`);
      return;
    }
    const expectedPath = getLocalPilotPackageFrontDoorPath(input.tenantId, input.packageId, input.version, route.unitId);
    if (route.localFallbackPath !== expectedPath) {
      errors.push(`Local package route ${route.qrId || index + 1} must fall back to ${expectedPath}.`);
    }
    if (input.printedFallbackPaths[index] !== route.localFallbackPath) {
      errors.push(`Printed QR fallback ${index + 1} must exactly match local package route ${route.qrId || index + 1}.`);
    }
  });

  return [...new Set(errors)];
}

/**
 * Derives every local companion handoff from the approved runtime identity.
 * Route pages should consume this map rather than reconstructing package paths.
 */
export function createLocalPilotPackageRouteMap(
  summary: LocalPilotPackageRuntimeSummary,
  unitId: string,
): LocalPilotPackageRouteMapResult {
  const errors: string[] = [];
  if (!isSafeSegment(unitId)) errors.push("Local package route map requires a safe unit id.");
  if (summary.tenantId.length === 0 || summary.packageId.length === 0 || summary.version.length === 0) {
    errors.push("Local package route map requires a complete package identity.");
  }

  const packageRoute = summary.routes.find((route) => route.unitId === unitId && route.targetType === "unit-launch");
  if (!packageRoute) errors.push(`Approved local package has no unit-launch route for ${unitId}.`);
  if (packageRoute && (!packageRoute.localFallbackPath.startsWith("/") || packageRoute.localFallbackPath.includes("\\"))) {
    errors.push(`Local fallback for ${unitId} is not a safe internal path.`);
  }

  if (errors.length > 0 || !packageRoute) return { status: "blocked", routeMap: null, errors };

  const identity = {
    tenantId: summary.tenantId,
    packageId: summary.packageId,
    version: summary.version,
  };
  return {
    status: "available",
    routeMap: {
      ...identity,
      unitId,
      launchCode: getLocalPilotPackageLaunchCode(summary.tenantId, summary.packageId, summary.version, unitId),
      frontDoorPath: getLocalPilotPackageFrontDoorPath(summary.tenantId, summary.packageId, summary.version, unitId),
      memoryMatchPath: getLocalPilotPackageMemoryMatchPath(summary.tenantId, summary.packageId, summary.version, unitId),
      teacherEvidencePath: getLocalPilotPackageTeacherEvidencePath(summary.tenantId, summary.packageId, summary.version, unitId),
      localFallbackPath: packageRoute.localFallbackPath,
    },
    errors: [],
  };
}

function isSafeSegment(value: string): boolean {
  return value.length > 0 && value !== "." && value !== ".." && !value.includes("/") && !value.includes("\\") && !value.includes("\0");
}
