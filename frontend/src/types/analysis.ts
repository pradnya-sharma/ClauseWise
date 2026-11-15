export type AttentionLevel = "high" | "review" | "informational";
export type VerificationStatus = "verified" | "unverified" | "partial_match";
export type ClauseCategoryType =
  | "payment_financial"
  | "auto_renewal_cancellation"
  | "liability_indemnity"
  | "termination_restrictions"
  | "data_privacy"
  | "ip_content_ownership"
  | "other_obligations";

export interface ClauseFinding {
  id: string;
  category: ClauseCategoryType;
  title: string;
  original_text: string;
  explanation: string;
  implications: string;
  why_it_matters: string;
  questions_to_ask: string[];
  attention_level: AttentionLevel;
  verification: VerificationStatus;
  verification_score: number | null;
}

export interface Obligation {
  id: string;
  description: string;
  obligation_type: string;
  original_text: string;
  verification: VerificationStatus;
  attention_level: AttentionLevel;
}

export interface ActionItem {
  id: string;
  text: string;
  category: string;
  priority: AttentionLevel;
}

export interface AnalysisSummary {
  document_type: string;
  parties_identified: string[];
  overall_risk_summary: string;
  high_attention_count: number;
  review_attention_count: number;
  info_attention_count: number;
  total_clauses_analyzed: number;
}

export interface AnalysisResponse {
  success: boolean;
  summary: AnalysisSummary;
  findings: ClauseFinding[];
  obligations: Obligation[];
  action_items: ActionItem[];
  metadata: Record<string, unknown>;
}

export const CATEGORY_LABELS: Record<ClauseCategoryType, string> = {
  payment_financial: "Payment & Financial",
  auto_renewal_cancellation: "Auto-Renewal & Cancellation",
  liability_indemnity: "Liability & Indemnity",
  termination_restrictions: "Termination & Restrictions",
  data_privacy: "Data & Privacy",
  ip_content_ownership: "Content & IP Ownership",
  other_obligations: "Other Obligations",
};

export const OBLIGATION_TYPE_LABELS: Record<string, string> = {
  user_obligation: "Your Obligations",
  other_party_permission: "What They Can Do",
  payment: "Payment Terms",
  deadline: "Deadlines",
  notice_period: "Notice Periods",
  trigger_condition: "Trigger Conditions",
};
