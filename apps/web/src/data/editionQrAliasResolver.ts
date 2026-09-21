import type { EditionQrAlias } from "./sampleEditionQrAliasPlan";

export interface ParsedQrPath {
  tenantId: string;
  seriesId: string;
  bookId: string;
  unitId: string;
  activityId: string;
  language?: string;
  edition?: string;
  version?: string;
}

const requiredKeys = ["tenant", "series", "book", "unit", "activity"] as const;
const optionalKeys = ["language", "edition", "version"] as const;

export function parseEditionQrPath(segments: string[]): ParsedQrPath | undefined {
  const keys = [...requiredKeys, ...optionalKeys];
  if (keys.some((key) => countKey(segments, key) > 1)) return undefined;

  const parsed = {
    tenantId: getSegmentValue(segments, "tenant"),
    seriesId: getSegmentValue(segments, "series"),
    bookId: getSegmentValue(segments, "book"),
    unitId: getSegmentValue(segments, "unit"),
    activityId: getSegmentValue(segments, "activity"),
    language: getOptionalSegmentValue(segments, "language"),
    edition: getOptionalSegmentValue(segments, "edition"),
    version: getOptionalSegmentValue(segments, "version"),
  };

  if (!requiredKeys.every((key) => parsed[`${key}Id` as keyof ParsedQrPath])) {
    return undefined;
  }

  return parsed;
}

export function findEditionQrAlias(
  parsed: ParsedQrPath | undefined,
  aliases: readonly EditionQrAlias[],
): EditionQrAlias | undefined {
  if (!parsed) return undefined;

  return aliases.find((alias) => {
    const requiredMatch = alias.tenantId === parsed.tenantId
      && alias.seriesId === parsed.seriesId
      && alias.bookId === parsed.bookId
      && alias.unitId === parsed.unitId
      && alias.activityId === parsed.activityId;
    const languageMatch = !parsed.language || alias.language === parsed.language;
    const editionMatch = !parsed.edition || alias.edition === parsed.edition;
    const versionMatch = !parsed.version || alias.version === parsed.version;

    return requiredMatch && languageMatch && editionMatch && versionMatch;
  });
}

function countKey(segments: string[], key: string): number {
  return segments.filter((segment) => segment === key).length;
}

function getSegmentValue(segments: string[], key: string): string {
  return getOptionalSegmentValue(segments, key) ?? "";
}

function getOptionalSegmentValue(segments: string[], key: string): string | undefined {
  const index = segments.indexOf(key);
  const value = index >= 0 ? segments[index + 1] : undefined;
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}
