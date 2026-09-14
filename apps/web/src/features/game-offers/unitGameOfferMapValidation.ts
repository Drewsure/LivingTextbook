import { validateCuratedGameOfferMap } from "@living-textbook/content-model";
import type { UnitGameOfferMap } from "./unitGameOfferMapTypes";

export function validateUnitGameOfferMap(map: UnitGameOfferMap): string[] {
  return validateCuratedGameOfferMap(map);
}
