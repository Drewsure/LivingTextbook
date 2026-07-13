import { sampleTeacherDraftPackages } from "./sampleTeacherDraftPackage";
import type { TeacherDraftPackagePreview } from "./sampleTeacherDraftPackage";

export type TeacherDraftReviewQueueStatus = "handoff-preview" | "blocked" | "ready-for-verifier" | "returned";

export interface TeacherDraftReviewQueueItem {
  queueItemId: string;
  draft: TeacherDraftPackagePreview;
  status: TeacherDraftReviewQueueStatus;
  reviewerLane: string;
  packetSections: string[];
  blockedBy: string[];
  allowedActions: string[];
  notAllowedYet: string[];
  nextStep: string;
}

export interface TeacherDraftReviewQueue {
  queueId: string;
  label: string;
  summary: string;
  items: TeacherDraftReviewQueueItem[];
  hardRules: string[];
}

const draft = sampleTeacherDraftPackages[0];

export const sampleTeacherDraftReviewQueue: TeacherDraftReviewQueue = {
  queueId: "teacher-draft-review-queue-sample-publisher",
  label: "Sample publisher draft review queue",
  summary:
    "A read-only workbench preview for draft review handoff packets. It shows how teacher drafts will reach verifier and human review later without enabling live approval, direct publish, or student assignment.",
  items: draft
    ? [
        {
          queueItemId: "queue-draft-sample-publisher-l1-u1",
          draft,
          status: "handoff-preview",
          reviewerLane: "content-and-audio-review",
          packetSections: [
            "Schema validation packet",
            "Source lineage packet",
            "Audio coverage packet",
            "Rights and version packet",
            "Route and activity packet",
            "Approval packet",
          ],
          blockedBy: [
            "Durable handoff storage required",
            "Verifier workflow required",
            "Teacher ownership required",
            "Audio regeneration required",
            "Package approval blocked",
          ],
          allowedActions: ["Preview packet", "Review blockers", "Inspect source lineage"],
          notAllowedYet: ["Submit to verifier", "Approve package", "Assign to students", "Direct AI publish"],
          nextStep:
            "Connect this queue to persisted teacher draft review handoff records after authentication, verifier workflow, and package approval policy exist.",
        },
      ]
    : [],
  hardRules: [
    "Verifier submission blocked until handoff packets are durable.",
    "Package approval blocked until evidence, approver identity, and release-control policy exist.",
    "Student assignment blocked until a reviewed package release is created.",
    "No direct AI publish from teacher drafts or review queue items.",
  ],
};
