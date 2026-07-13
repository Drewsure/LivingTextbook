"use client";

import { useMemo, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPackagePreview } from "@/data/sampleTeacherDraftPackage";

interface TeacherDraftLocalEditPreviewProps {
  draft: TeacherDraftPackagePreview;
}

interface LocalDraftValidation {
  vocabularyTerms: string[];
  sentenceDrafts: string[];
  warnings: string[];
  canSubmitForReview: boolean;
}

export function TeacherDraftLocalEditPreview({ draft }: TeacherDraftLocalEditPreviewProps) {
  const [vocabularyText, setVocabularyText] = useState(draft.vocabularyDraft.join("\n"));
  const [sentenceOne, setSentenceOne] = useState(draft.targetSentenceDrafts[0]);
  const [sentenceTwo, setSentenceTwo] = useState(draft.targetSentenceDrafts[1]);

  const validation = useMemo(
    () => validateLocalDraft(vocabularyText, [sentenceOne, sentenceTwo]),
    [sentenceOne, sentenceTwo, vocabularyText],
  );

  const hasLocalChanges =
    vocabularyText !== draft.vocabularyDraft.join("\n") ||
    sentenceOne !== draft.targetSentenceDrafts[0] ||
    sentenceTwo !== draft.targetSentenceDrafts[1];

  function resetDraft() {
    setVocabularyText(draft.vocabularyDraft.join("\n"));
    setSentenceOne(draft.targetSentenceDrafts[0]);
    setSentenceTwo(draft.targetSentenceDrafts[1]);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local edit preview</p>
          <h3 className="mt-1 text-lg font-bold">Unsaved teacher draft edits</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview validates draft structure locally. It does not save, publish, assign, or regenerate audio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={hasLocalChanges ? "Unsaved local changes" : "Original draft"} tone={hasLocalChanges ? "warning" : "neutral"} />
          <StatusPill label={validation.canSubmitForReview ? "Shape valid" : "Review required"} tone={validation.canSubmitForReview ? "success" : "warning"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <section className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
            Vocabulary draft
            <textarea
              value={vocabularyText}
              onChange={(event) => setVocabularyText(event.target.value)}
              className="min-h-48 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium leading-6 text-[var(--tenant-text)] outline-none transition focus:border-[var(--tenant-accent)] focus:ring-2 focus:ring-[var(--tenant-accent)]/20"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
              Target sentence 1
              <input
                value={sentenceOne}
                onChange={(event) => setSentenceOne(event.target.value)}
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)] outline-none transition focus:border-[var(--tenant-accent)] focus:ring-2 focus:ring-[var(--tenant-accent)]/20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
              Target sentence 2
              <input
                value={sentenceTwo}
                onChange={(event) => setSentenceTwo(event.target.value)}
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)] outline-none transition focus:border-[var(--tenant-accent)] focus:ring-2 focus:ring-[var(--tenant-accent)]/20"
              />
            </label>
          </div>
        </section>

        <aside className="grid gap-3">
          <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Draft shape</p>
                <h4 className="mt-1 text-base font-bold">{validation.vocabularyTerms.length} terms / {validation.sentenceDrafts.length} sentences</h4>
              </div>
              <StatusPill label="Default 8-12 terms" tone={validation.vocabularyTerms.length >= 8 && validation.vocabularyTerms.length <= 12 ? "success" : "warning"} />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {validation.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review gates</p>
            <div className="mt-3 grid gap-2">
              <StatusPill label="Save draft blocked" tone="warning" />
              <StatusPill label="Submit for review blocked" tone="warning" />
              <StatusPill label="Student assignment blocked" tone="warning" />
              <StatusPill label="Audio regeneration required" tone={hasLocalChanges ? "warning" : "neutral"} />
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={resetDraft} disabled={!hasLocalChanges}>
              Reset local edits
            </Button>
            <Button type="button" disabled>
              Save draft
            </Button>
            <Button type="button" disabled>
              Submit for review
            </Button>
          </div>
        </aside>
      </div>
    </Card>
  );
}

function validateLocalDraft(vocabularyText: string, sentences: string[]): LocalDraftValidation {
  const vocabularyTerms = vocabularyText
    .split(/\r?\n|,/)
    .map((term) => term.trim())
    .filter(Boolean);
  const sentenceDrafts = sentences.map((sentence) => sentence.trim()).filter(Boolean);
  const warnings: string[] = [];

  if (vocabularyTerms.length < 8) {
    warnings.push("At least 8 vocabulary terms are required for a canonical unit.");
  }

  if (vocabularyTerms.length > 12) {
    warnings.push("More than 12 vocabulary terms requires a remedial or extension session plan.");
  }

  if (new Set(vocabularyTerms.map((term) => term.toLowerCase())).size !== vocabularyTerms.length) {
    warnings.push("Duplicate vocabulary terms need review.");
  }

  if (sentenceDrafts.length !== 2) {
    warnings.push("Exactly 2 target sentence structures are required.");
  }

  if (sentenceDrafts.some((sentence) => sentence.length < 4)) {
    warnings.push("Target sentence drafts need review.");
  }

  if (warnings.length === 0) {
    warnings.push("Draft shape is valid, but audio, rights, route, and approval gates still block student use.");
  }

  return {
    vocabularyTerms,
    sentenceDrafts,
    warnings,
    canSubmitForReview: warnings.length === 1 && warnings[0].startsWith("Draft shape is valid"),
  };
}
