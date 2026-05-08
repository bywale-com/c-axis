/** SMS number shown after assessment submit (replace with production line). */
export const ASSESSMENT_SMS_DISPLAY_NUMBER = "(555) 010-0199";

/** Tier labels for analytics / payload */
export type AssessmentTierId = "tier1" | "tier2" | "conditional" | "not_ready";

export type AssessmentTierResult = {
  id: AssessmentTierId;
  label: string;
  message: (phone: string) => string;
};

export const ASSESSMENT_TIERS: AssessmentTierResult[] = [
  {
    id: "tier1",
    label: "Tier 1 — Strong fit",
    message: (phone) =>
      `Your practice is well positioned. There is likely significant latent revenue in your existing client base. Text your score to ${phone} to confirm your call.`,
  },
  {
    id: "tier2",
    label: "Tier 2 — Good fit",
    message: (phone) =>
      `There is real opportunity here. The call will show you exactly where. Text your score to ${phone} to confirm your slot.`,
  },
  {
    id: "conditional",
    label: "Conditional",
    message: (phone) =>
      `Your practice may not be ready for the full program yet — but the call will tell us for certain. Text your score to ${phone}.`,
  },
  {
    id: "not_ready",
    label: "Not ready",
    message: (phone) =>
      `Based on your answers, now may not be the right time. Text your score to ${phone} and we will let you know honestly.`,
  },
];

/** Raw score sum of all questions at max (used to normalize to 0–100). */
export const ASSESSMENT_RAW_MAX = 140;

export function normalizeAssessmentScore(raw: number): number {
  return Math.min(100, Math.max(0, Math.round((raw / ASSESSMENT_RAW_MAX) * 100)));
}

export function tierForNormalizedScore(score: number): AssessmentTierResult {
  if (score >= 80) return ASSESSMENT_TIERS[0];
  if (score >= 55) return ASSESSMENT_TIERS[1];
  if (score >= 30) return ASSESSMENT_TIERS[2];
  return ASSESSMENT_TIERS[3];
}
