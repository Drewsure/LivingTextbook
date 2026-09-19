export const PHASER_CANDIDATE_SOURCE_REPOSITORY = "Drewsure/ministar-lab" as const;
export const PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID = "frozen-2026-09-12-aaa-stable" as const;
export const PHASER_CANDIDATE_SOURCE_COMMIT_SHA = "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55" as const;

export interface PhaserCandidateSourceIdentity {
  sourceRepository: string;
  sourceSnapshotId: string;
  sourceCommitSha: string;
}

export function validatePhaserCandidateSourceIdentity(identity: PhaserCandidateSourceIdentity): string[] {
  const errors: string[] = [];

  if (identity?.sourceRepository !== PHASER_CANDIDATE_SOURCE_REPOSITORY) {
    errors.push(`Phaser candidate source repository must be ${PHASER_CANDIDATE_SOURCE_REPOSITORY}.`);
  }
  if (identity?.sourceSnapshotId !== PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID) {
    errors.push(`Phaser candidate source snapshot must be ${PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID}.`);
  }
  if (identity?.sourceCommitSha !== PHASER_CANDIDATE_SOURCE_COMMIT_SHA) {
    errors.push(`Phaser candidate source commit must be ${PHASER_CANDIDATE_SOURCE_COMMIT_SHA}.`);
  }

  return errors;
}
