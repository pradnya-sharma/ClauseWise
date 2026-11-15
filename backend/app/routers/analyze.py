import json
import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import get_settings
from app.models.requests import TextAnalysisRequest
from app.models.responses import AnalysisResponse
from app.services.analysis import analyze_agreement
from app.services.extraction import extract_text_from_pdf

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["analysis"])


@router.post("/pdf", response_model=AnalysisResponse)
async def analyze_pdf(file: UploadFile = File(...)):
    settings = get_settings()

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()
    if len(contents) > settings.max_pdf_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"PDF exceeds the {settings.max_pdf_size_mb}MB size limit.",
        )

    try:
        text = extract_text_from_pdf(contents)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if len(text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="The extracted text is too short to analyze meaningfully.",
        )

    try:
        return await analyze_agreement(text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid response. Please try again.",
        )
    except Exception as e:
        logger.exception("PDF analysis failed")
        raise HTTPException(
            status_code=500, detail=f"Analysis failed: {e}"
        )


@router.post("/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    try:
        return await analyze_agreement(request.text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid response. Please try again.",
        )
    except Exception as e:
        logger.exception("Text analysis failed")
        raise HTTPException(
            status_code=500, detail=f"Analysis failed: {e}"
        )
