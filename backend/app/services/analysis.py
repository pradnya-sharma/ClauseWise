import asyncio
import json
import time
import uuid

from google import genai
from google.genai import types

from app.config import get_settings
from app.models.responses import AnalysisResponse
from app.services.prompts import ANALYSIS_SYSTEM_PROMPT, ANALYSIS_USER_PROMPT
from app.services.verification import verify_all_findings


def _call_gemini(client: genai.Client, model: str, prompt: str) -> str:
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=ANALYSIS_SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=8192,
            response_mime_type="application/json",
        ),
    )
    return response.text


async def analyze_agreement(text: str) -> AnalysisResponse:
    settings = get_settings()
    client = genai.Client(api_key=settings.gemini_api_key)

    start_time = time.time()

    prompt = ANALYSIS_USER_PROMPT.format(agreement_text=text)

    raw_text = await asyncio.to_thread(
        _call_gemini, client, settings.gemini_model, prompt
    )

    parsed = json.loads(raw_text)

    for finding in parsed.get("findings", []):
        finding["id"] = str(uuid.uuid4())
    for obligation in parsed.get("obligations", []):
        obligation["id"] = str(uuid.uuid4())
    for action in parsed.get("action_items", []):
        action["id"] = str(uuid.uuid4())

    verified_findings, verified_obligations = verify_all_findings(
        source_text=text,
        findings=parsed.get("findings", []),
        obligations=parsed.get("obligations", []),
        threshold=settings.fuzzy_match_threshold,
    )
    parsed["findings"] = verified_findings
    parsed["obligations"] = verified_obligations

    elapsed_ms = int((time.time() - start_time) * 1000)

    verified_count = sum(
        1 for f in verified_findings if f.get("verification") == "verified"
    )
    partial_count = sum(
        1 for f in verified_findings if f.get("verification") == "partial_match"
    )
    unverified_count = sum(
        1 for f in verified_findings if f.get("verification") == "unverified"
    )

    parsed["metadata"] = {
        "processing_time_ms": elapsed_ms,
        "text_length": len(text),
        "model_used": settings.gemini_model,
        "verification_stats": {
            "verified": verified_count,
            "partial_match": partial_count,
            "unverified": unverified_count,
            "total": len(verified_findings),
        },
    }
    parsed["success"] = True

    return AnalysisResponse(**parsed)
