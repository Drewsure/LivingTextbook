import {
  validateLocalBundleHandoffReviewRequest,
  type LocalBundleHandoffReviewProvider,
  type LocalBundleHandoffReviewRequest,
} from "@living-textbook/content-model";

const unconfiguredProvider: LocalBundleHandoffReviewProvider = {
  provider: null,
  read(request) {
    const errors = validateLocalBundleHandoffReviewRequest(request);
    if (errors.length > 0) {
      return { status: "blocked", provider: null, record: null, errors };
    }
    return {
      status: "blocked",
      provider: null,
      record: null,
      errors: ["Local handoff review storage is not configured; no package record is synthesized by this read-only adapter."],
    };
  },
};

export function getLocalBundleHandoffReviewProvider(): LocalBundleHandoffReviewProvider {
  return unconfiguredProvider;
}
