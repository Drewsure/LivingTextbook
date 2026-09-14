import { validateCuratedGameOfferMap } from "@living-textbook/content-model";
import type { UnitGameOfferMap } from "@living-textbook/content-model";

export function validateUnitGameOfferMap(map: UnitGameOfferMap): string[] {
  return validateCuratedGameOfferMap(map);
}
