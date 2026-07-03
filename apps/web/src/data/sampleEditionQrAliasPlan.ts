export type EditionQrAliasStatus = "active" | "legacy" | "draft" | "blocked";
export type EditionQrTargetType = "front-door" | "unit-launch" | "game-mode" | "media-playlist" | "teacher-preview" | "retired-message";
export type EditionQrDeploymentTarget = "hosted-route" | "local-bundle" | "hybrid";

export interface EditionQrAlias {
  aliasId: string;
  printedQrId: string;
  tenantId: string;
  seriesId: string;
  bookId: string;
  unitId: string;
  activityId: string;
  language: string;
  edition: string;
  version: string;
  status: EditionQrAliasStatus;
  targetType: EditionQrTargetType;
  deploymentTarget: EditionQrDeploymentTarget;
  targetPath: string;
  contentPackageId: string;
  localBundleId?: string;
  stableRule: string;
  nextStep: string;
  notAllowedYet: string[];
}

export interface EditionQrAliasPlan {
  planId: string;
  label: string;
  summary: string;
  permanenceRule: string;
  aliases: EditionQrAlias[];
  redirectRules: string[];
}

export const sampleEditionQrAliasPlan: EditionQrAliasPlan = {
  planId: "sample-publisher-edition-qr-aliases",
  label: "Edition-aware QR alias registry",
  summary:
    "Printed textbook QR codes must keep working across annual editions, package updates, hosted deployments, and future local bundles.",
  permanenceRule:
    "A printed QR should resolve a stable alias first, then the alias points to the current reviewed package, legacy package, local fallback, or a safe edition message.",
  aliases: [
    {
      aliasId: "sample-publisher-hello-friends-2026-current",
      printedQrId: "qr-sample-publisher-starter-l1-u1-hello",
      tenantId: "sample-publisher",
      seriesId: "starter-english",
      bookId: "level-1",
      unitId: "unit-1",
      activityId: "hello-friends",
      language: "en",
      edition: "2026",
      version: "1.0.0",
      status: "active",
      targetType: "front-door",
      deploymentTarget: "hybrid",
      targetPath: "/enter/sample-publisher",
      contentPackageId: "sample-publisher-l1-u1-package",
      localBundleId: "starter-english-l1-u1-2026-local-bundle",
      stableRule:
        "The printed QR id stays constant while package version and deployment target may change after review.",
      nextStep: "Promote alias records into persistence once the backend path is selected.",
      notAllowedYet: ["Direct localhost target", "Direct media file target", "Unreviewed package swap"],
    },
    {
      aliasId: "sample-publisher-hello-friends-2025-legacy",
      printedQrId: "qr-sample-publisher-starter-l1-u1-hello-2025",
      tenantId: "sample-publisher",
      seriesId: "starter-english",
      bookId: "level-1",
      unitId: "unit-1",
      activityId: "hello-friends",
      language: "en",
      edition: "2025",
      version: "0.9.0",
      status: "legacy",
      targetType: "retired-message",
      deploymentTarget: "hosted-route",
      targetPath: "/enter/sample-publisher?edition=2025",
      contentPackageId: "sample-publisher-l1-u1-package-2025",
      stableRule:
        "Legacy QR codes should resolve to a safe supported message or legacy package rather than failing silently.",
      nextStep: "Add a visible legacy-edition message when the resolver route is implemented.",
      notAllowedYet: ["Broken QR destination", "Silent redirect to mismatched edition", "Deleting old edition metadata"],
    },
    {
      aliasId: "sample-publisher-hello-friends-2027-draft",
      printedQrId: "qr-sample-publisher-starter-l1-u1-hello-2027",
      tenantId: "sample-publisher",
      seriesId: "starter-english",
      bookId: "level-1",
      unitId: "unit-1",
      activityId: "hello-friends",
      language: "en",
      edition: "2027",
      version: "draft",
      status: "draft",
      targetType: "teacher-preview",
      deploymentTarget: "hosted-route",
      targetPath: "/teacher/intake",
      contentPackageId: "sample-publisher-l1-u1-package-2027-draft",
      stableRule:
        "Draft edition QR records can exist for planning, but they cannot become printed or student-facing until reviewed.",
      nextStep: "Lock the 2027 alias only after content, media, game offer, and report policy review.",
      notAllowedYet: ["Student-facing draft alias", "Printed QR before package approval", "Missing rollback record"],
    },
    {
      aliasId: "blocked-direct-file-example",
      printedQrId: "qr-blocked-direct-media-file",
      tenantId: "sample-publisher",
      seriesId: "starter-english",
      bookId: "level-1",
      unitId: "unit-1",
      activityId: "song-file",
      language: "en",
      edition: "2026",
      version: "blocked",
      status: "blocked",
      targetType: "media-playlist",
      deploymentTarget: "local-bundle",
      targetPath: "file:///D:/partner-media/hello-song.mp3",
      contentPackageId: "sample-publisher-l1-u1-package",
      localBundleId: "unreviewed-local-folder",
      stableRule:
        "Blocked example kept in the plan to prove that direct file paths are not acceptable printed QR targets.",
      nextStep: "Replace with a stable playlist alias that can resolve hosted or local bundle paths safely.",
      notAllowedYet: ["file:// QR target", "Unversioned local folder", "No rights or manifest metadata"],
    },
  ],
  redirectRules: [
    "Printed QR codes resolve aliases, not raw files or temporary development URLs.",
    "Aliases may point to hosted front doors, launch routes, teacher previews, media playlists, or local bundle entries.",
    "Edition changes require a reviewed alias update and rollback note.",
    "Legacy aliases should show a safe edition message or legacy package path.",
    "Local bundle references must use signed manifest ids, not manual folder paths.",
  ],
};
