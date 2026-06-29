import type { MediaAsset } from "@living-textbook/content-model";

export type MediaResolutionMode = "hosted-first" | "local-first";
export type MediaSourceKind = "hosted" | "local-bundle" | "missing";

export interface ResolvedMediaSource {
  sourceUri?: string;
  sourceKind: MediaSourceKind;
  available: boolean;
}

export function resolveMediaSource(asset: MediaAsset, mode: MediaResolutionMode = "hosted-first"): ResolvedMediaSource {
  const hostedSource = normalizeSource(asset.sourceUri);
  const localSource = normalizeSource(asset.localBundlePath);
  const preferredSource = mode === "local-first" ? localSource : hostedSource;
  const fallbackSource = mode === "local-first" ? hostedSource : localSource;

  if (preferredSource) {
    return {
      sourceUri: preferredSource,
      sourceKind: mode === "local-first" ? "local-bundle" : "hosted",
      available: true,
    };
  }

  if (fallbackSource) {
    return {
      sourceUri: fallbackSource,
      sourceKind: mode === "local-first" ? "hosted" : "local-bundle",
      available: true,
    };
  }

  return {
    sourceKind: "missing",
    available: false,
  };
}

function normalizeSource(source: string | undefined): string | undefined {
  const normalized = source?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}
