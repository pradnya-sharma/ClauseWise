import re

from thefuzz import fuzz


def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def verify_quote(
    source_text: str, quote: str, threshold: int = 80
) -> tuple[str, float]:
    norm_source = normalize(source_text)
    norm_quote = normalize(quote)

    if not norm_quote:
        return ("unverified", 0.0)

    if norm_quote in norm_source:
        return ("verified", 100.0)

    quote_len = len(norm_quote)
    best_score = 0.0
    step = max(1, quote_len // 4)

    for window_size in [quote_len, int(quote_len * 0.8), int(quote_len * 1.2)]:
        if window_size < 10:
            continue
        for i in range(0, max(1, len(norm_source) - window_size + 1), step):
            window = norm_source[i : i + window_size]
            score = fuzz.ratio(norm_quote, window)
            if score > best_score:
                best_score = score
            if score >= 95:
                return ("verified", score)

    if best_score >= threshold:
        return ("partial_match", best_score)
    return ("unverified", best_score)


def verify_all_findings(
    source_text: str,
    findings: list[dict],
    obligations: list[dict],
    threshold: int = 80,
) -> tuple[list[dict], list[dict]]:
    for finding in findings:
        status, score = verify_quote(
            source_text, finding.get("original_text", ""), threshold
        )
        finding["verification"] = status
        finding["verification_score"] = score

    for obligation in obligations:
        status, score = verify_quote(
            source_text, obligation.get("original_text", ""), threshold
        )
        obligation["verification"] = status

    return findings, obligations
