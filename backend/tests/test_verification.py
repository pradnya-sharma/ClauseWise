import pytest

from app.services.verification import normalize, verify_quote, verify_all_findings


class TestNormalize:
    def test_lowercases(self):
        assert normalize("HELLO World") == "hello world"

    def test_collapses_whitespace(self):
        assert normalize("hello   world\n\tfoo") == "hello world foo"

    def test_strips(self):
        assert normalize("  hello  ") == "hello"

    def test_empty(self):
        assert normalize("") == ""


class TestVerifyQuote:
    SOURCE = (
        "Your subscription will automatically renew at the end of each billing "
        "cycle unless you cancel at least 30 days before the renewal date. No "
        "refunds will be issued for partial periods."
    )

    def test_exact_match(self):
        quote = "No refunds will be issued for partial periods."
        status, score = verify_quote(self.SOURCE, quote)
        assert status == "verified"
        assert score == 100.0

    def test_case_insensitive_match(self):
        quote = "NO REFUNDS WILL BE ISSUED FOR PARTIAL PERIODS."
        status, score = verify_quote(self.SOURCE, quote)
        assert status == "verified"
        assert score == 100.0

    def test_extra_whitespace_match(self):
        quote = "No  refunds  will  be  issued  for  partial  periods."
        status, score = verify_quote(self.SOURCE, quote)
        assert status == "verified"
        assert score == 100.0

    def test_partial_match_with_minor_difference(self):
        quote = "No refunds will be issued for partial period."
        status, score = verify_quote(self.SOURCE, quote, threshold=80)
        assert status in ("partial_match", "verified")
        assert score >= 80

    def test_hallucinated_quote_is_unverified(self):
        quote = "The company reserves the right to sell your personal data to third-party advertisers."
        status, score = verify_quote(self.SOURCE, quote)
        assert status == "unverified"
        assert score < 80

    def test_empty_quote(self):
        status, score = verify_quote(self.SOURCE, "")
        assert status == "unverified"
        assert score == 0.0

    def test_quote_longer_than_source(self):
        quote = self.SOURCE + " Additional fabricated text that does not exist."
        status, score = verify_quote("Short source.", quote)
        assert status == "unverified"

    def test_threshold_boundary(self):
        quote = "No refunds will be issued for partial periods."
        status, _ = verify_quote(self.SOURCE, quote, threshold=100)
        assert status == "verified"


class TestVerifyAllFindings:
    SOURCE = (
        "The Company may terminate your account at any time, with or without "
        "cause, and with or without notice."
    )

    def test_findings_get_verification_fields(self):
        findings = [
            {
                "original_text": "The Company may terminate your account at any time",
                "title": "Termination",
            }
        ]
        obligations = [
            {
                "original_text": "This quote is completely fabricated and does not appear anywhere.",
                "description": "Fake",
            }
        ]
        verified_findings, verified_obligations = verify_all_findings(
            self.SOURCE, findings, obligations
        )
        assert verified_findings[0]["verification"] == "verified"
        assert verified_findings[0]["verification_score"] == 100.0
        assert verified_obligations[0]["verification"] == "unverified"

    def test_empty_lists(self):
        findings, obligations = verify_all_findings(self.SOURCE, [], [])
        assert findings == []
        assert obligations == []

    def test_missing_original_text_field(self):
        findings = [{"title": "No quote"}]
        result, _ = verify_all_findings(self.SOURCE, findings, [])
        assert result[0]["verification"] == "unverified"
        assert result[0]["verification_score"] == 0.0
