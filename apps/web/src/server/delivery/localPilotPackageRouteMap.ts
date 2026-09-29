import {
  getLocalPilotPackageFrontDoorPath,
  getLocalPilotPackageLaunchCode,
  getLocalPilotPackageMemoryMatchPath,
  getLocalPilotPackageMediaRoutePath,
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
  mediaPaths: string[];
  localFallbackPath: string;
}

export type LocalPilotPackageRouteMapResult =
  | { status: "blocked"; routeMap: null; errors: string[] }
  | { status: "available"; routeMap: LocalPilotPackageRouteMap; errors: [] };

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
      mediaPaths: summary.mediaKinds.map((playlistId) => getLocalPilotPackageMediaRoutePath(summary.tenantId, summary.packageId, summary.version, playlistId)),
      localFallbackPath: packageRoute.localFallbackPath,
    },
    errors: [],
  };
}

function isSafeSegment(value: string): boolean {
  return value.length > 0 && value !== "." && value !== ".." && !value.includes("/") && !value.includes("\\") && !value.includes("\0");
}
