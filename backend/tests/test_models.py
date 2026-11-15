import pytest
from pydantic import ValidationError

from app.models.requests import TextAnalysisRequest
from app.models.responses import (
    AnalysisResponse,
    AnalysisSummary,
    AttentionLevel,
    ClauseCategory,
    ClauseFinding,
    VerificationStatus,
)


class TestTextAnalysisRequest:
    def test_valid_text(self):
        req = TextAnalysisRequest(text="x" * 100)
        assert len(req.text) == 100

    def test_too_short(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="short")

    def test_empty(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="")

    def test_max_length(self):
        req = TextAnalysisRequest(text="x" * 500_000)
        assert len(req.text) == 500_000

    def test_over_max_length(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="x" * 500_001)


class TestResponseModels:
    def test_attention_level_values(self):
        assert AttentionLevel.HIGH == "high"
        assert AttentionLevel.REVIEW == "review"
        assert AttentionLevel.INFO == "informational"

    def test_clause_category_values(self):
        assert ClauseCategory.PAYMENT == "payment_financial"
        assert len(ClauseCategory) == 7

    def test_verification_status_values(self):
        assert VerificationStatus.VERIFIED == "verified"
        assert VerificationStatus.PARTIAL == "partial_match"
        assert VerificationStatus.UNVERIFIED == "unverified"

    def test_clause_finding_defaults(self):
        finding = ClauseFinding(
            id="1",
            category=ClauseCategory.PAYMENT,
            title="Test",
            original_text="quote",
            explanation="explained",
            implications="impact",
            why_it_matters="matters",
            attention_level=AttentionLevel.HIGH,
        )
        assert finding.verification == VerificationStatus.UNVERIFIED
        assert finding.verification_score is None
        assert finding.questions_to_ask == []

    def test_analysis_response_minimal(self):
        resp = AnalysisResponse(
            success=True,
            summary=AnalysisSummary(
                document_type="ToS",
                overall_risk_summary="Summary",
            ),
        )
        assert resp.findings == []
        assert resp.obligations == []
        assert resp.action_items == []
