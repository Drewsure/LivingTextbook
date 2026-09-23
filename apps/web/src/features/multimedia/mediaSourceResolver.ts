import type { MediaAsset } from "@living-textbook/content-model";

export type MediaResolutionMode = "hosted-first" | "local-first";
export type MediaSourceKind = "hosted" | "local-bundle" | "missing";

export interface ResolvedMediaSource {
  sourceUri?: string;
  sourceKind: MediaSourceKind;
  available: boolean;
}

export function resolveMediaSource(asset: MediaAsset, mode: MediaResolutionMode = "hosted-first"): ResolvedMediaSource {
  const hostedSource = normalizeHostedSource(asset.sourceUri);
  const localSource = normalizeLocalBundlePath(asset.localBundlePath);
  const preferredSource = mode === "local-first" ? localSource : hostedSource;
  const fallbackSource = mode === "local-first" ? hostedSource : undefined;

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

function normalizeHostedSource(source: string | undefined): string | undefined {
  const normalized = normalizeSource(source);
  if (!normalized || normalized.startsWith("//") || normalized.startsWith("\\")) return undefined;
  if (normalized.startsWith("/")) return normalized;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" && parsed.username === "" && parsed.password === ""
      ? parsed.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeLocalBundlePath(source: string | undefined): string | undefined {
  const normalized = normalizeSource(source);
  if (!normalized || normalized.startsWith("/") || normalized.startsWith("\\") || normalized.includes("\\")) return undefined;
  if (normalized.split("/").some((segment) => segment === "..")) return undefined;
  if (/^[a-z][a-z\d+.-]*:/i.test(normalized)) return undefined;
  return normalized;
}

function normalizeSource(source: string | undefined): string | undefined {
  const normalized = source?.trim();
  if (!normalized || normalized.length > 2048) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return undefined;
  return normalized;
}
