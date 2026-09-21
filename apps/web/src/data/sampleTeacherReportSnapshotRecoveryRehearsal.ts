import {
  createReviewOnlyTeacherReportPackageSnapshotAdapter,
  createTeacherReportPackageSnapshotRecoveryPacket,
  type TeacherReportPackageSnapshotAdapterResult,
  type TeacherReportPackageSnapshotDeployment,
  type TeacherReportPackageSnapshotRecoveryPacket,
} from "@living-textbook/content-model";
import type { TeacherSessionMonitorContext } from "@living-textbook/content-model";
import { resolveSampleTeacherReportPackageSnapshot } from "./sampleTeacherReportPersistenceRehearsal";

export interface TeacherReportSnapshotRecoveryRehearsal {
  deploymentMode: TeacherReportPackageSnapshotDeployment;
  packet: TeacherReportPackageSnapshotRecoveryPacket;
  result: TeacherReportPackageSnapshotAdapterResult;
}

export interface TeacherReportSnapshotRecoveryRehearsalPackage {
  snapshot: ReturnType<typeof resolveSampleTeacherReportPackageSnapshot>;
  rehearsals: TeacherReportSnapshotRecoveryRehearsal[];
}

export function resolveSampleTeacherReportSnapshotRecoveryRehearsal(
  context: TeacherSessionMonitorContext,
): TeacherReportSnapshotRecoveryRehearsalPackage {
  const snapshot = resolveSampleTeacherReportPackageSnapshot(context);
  const adapter = createReviewOnlyTeacherReportPackageSnapshotAdapter();
  const rehearsals = (["hosted-managed", "local-classroom"] as const).map((deploymentMode) => {
    const packet = createTeacherReportPackageSnapshotRecoveryPacket(
      snapshot,
      deploymentMode,
      context.launchSession.openedAt,
    );
    return {
      deploymentMode,
      packet,
      result: adapter.execute({
        snapshot,
        operation: "restore",
        expectedDeploymentMode: snapshot.deploymentMode,
        targetDeploymentMode: deploymentMode,
        recoveryPacket: packet,
      }),
    };
  });

  return { snapshot, rehearsals };
}
