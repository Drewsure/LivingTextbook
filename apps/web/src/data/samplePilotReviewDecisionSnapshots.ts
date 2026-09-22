import {
  createPilotReviewDecisionPersistenceSnapshot,
  createReviewOnlyPilotReviewDecisionPersistenceAdapter,
  validatePilotReviewDecisionPersistenceSnapshot,
  type PilotReviewDecisionPersistenceMode,
  type PilotReviewDecisionPersistenceSnapshot,
} from "@living-textbook/content-model";
import { samplePilotReviewDecision } from "./samplePilotReviewDecision";

export const samplePilotReviewDecisionSnapshots: PilotReviewDecisionPersistenceSnapshot[] = (
  ["hosted-managed", "local-classroom"] as PilotReviewDecisionPersistenceMode[]
).map((persistenceMode) =>
  createPilotReviewDecisionPersistenceSnapshot(
    samplePilotReviewDecision,
    persistenceMode,
    "2026-09-22T12:00:00.000Z",
  ),
);

export const samplePilotReviewDecisionSnapshotErrors = samplePilotReviewDecisionSnapshots.flatMap(
  validatePilotReviewDecisionPersistenceSnapshot,
);

const samplePilotReviewDecisionSnapshotAdapter = createReviewOnlyPilotReviewDecisionPersistenceAdapter();

export const samplePilotReviewDecisionSnapshotAdapterResults = samplePilotReviewDecisionSnapshots.map((snapshot) =>
  samplePilotReviewDecisionSnapshotAdapter.execute({
    snapshot,
    operation: "restore",
    expectedTenantId: snapshot.tenantId,
    expectedPackageId: snapshot.packageId,
    expectedPersistenceMode: snapshot.persistenceMode,
  }),
);
