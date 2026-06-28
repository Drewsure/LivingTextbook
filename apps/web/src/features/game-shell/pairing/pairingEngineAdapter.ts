import { getUnitKey } from "@living-textbook/content-model";
import type { UnitPayload } from "@living-textbook/content-model";

export interface PairingItem {
  id: string;
  sourceText: string;
  targetText: string;
  termIndex: number;
}

export function createVocabularyPairingItems(unit: UnitPayload): PairingItem[] {
  const unitKey = getUnitKey(unit.unitMeta);

  return unit.pedagogicalPayload.vocabularyTerms.map((term, index) => ({
    id: `${unitKey}:pair:${index + 1}`,
    sourceText: term,
    targetText: term,
    termIndex: index,
  }));
}
