import {
  validateTeacherAnswerKeyReviewRequest,
  type TeacherAnswerKeyReviewProvider,
  type TeacherAnswerKeyReviewRequest,
} from "@living-textbook/content-model";

const unconfiguredProvider: TeacherAnswerKeyReviewProvider = {
  provider: null,
  read(request) {
    const errors = validateTeacherAnswerKeyReviewRequest(request);
    if (errors.length > 0) return { status: "blocked", provider: null, record: null, errors };
    return {
      status: "blocked",
      provider: null,
      record: null,
      errors: ["Teacher answer-key review storage is not configured; no answer content or synthetic record is returned."],
    };
  },
};

export function getTeacherAnswerKeyReviewProvider(): TeacherAnswerKeyReviewProvider {
  return unconfiguredProvider;
}
