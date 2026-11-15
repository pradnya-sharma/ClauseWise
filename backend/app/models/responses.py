from enum import Enum
from typing import Optional

from pydantic import BaseModel


class AttentionLevel(str, Enum):
    HIGH = "high"
    REVIEW = "review"
    INFO = "informational"


class ClauseCategory(str, Enum):
    PAYMENT = "payment_financial"
    AUTO_RENEWAL = "auto_renewal_cancellation"
    LIABILITY = "liability_indemnity"
    TERMINATION = "termination_restrictions"
    DATA_PRIVACY = "data_privacy"
    IP_OWNERSHIP = "ip_content_ownership"
    OTHER = "other_obligations"


class VerificationStatus(str, Enum):
    VERIFIED = "verified"
    UNVERIFIED = "unverified"
    PARTIAL = "partial_match"


class ClauseFinding(BaseModel):
    id: str
    category: ClauseCategory
    title: str
    original_text: str
    explanation: str
    implications: str
    why_it_matters: str
    questions_to_ask: list[str] = []
    attention_level: AttentionLevel
    verification: VerificationStatus = VerificationStatus.UNVERIFIED
    verification_score: Optional[float] = None


class Obligation(BaseModel):
    id: str
    description: str
    obligation_type: str
    original_text: str
    verification: VerificationStatus = VerificationStatus.UNVERIFIED
    attention_level: AttentionLevel


class ActionItem(BaseModel):
    id: str
    text: str
    category: str
    priority: AttentionLevel


class AnalysisSummary(BaseModel):
    document_type: str
    parties_identified: list[str] = []
    overall_risk_summary: str
    high_attention_count: int = 0
    review_attention_count: int = 0
    info_attention_count: int = 0
    total_clauses_analyzed: int = 0


class AnalysisResponse(BaseModel):
    success: bool
    summary: AnalysisSummary
    findings: list[ClauseFinding] = []
    obligations: list[Obligation] = []
    action_items: list[ActionItem] = []
    metadata: dict = {}
