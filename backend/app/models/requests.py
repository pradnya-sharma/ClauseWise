from pydantic import BaseModel, Field


class TextAnalysisRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=50,
        max_length=500_000,
        description="Agreement text to analyze",
    )
