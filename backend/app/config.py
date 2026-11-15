from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str
    gemini_model: str = "gemini-3.8-flash"
    max_pdf_size_mb: int = 10
    max_text_length: int = 500_000
    allowed_origins: str = "http://localhost:5173"
    fuzzy_match_threshold: int = 80

    @property
    def cors_origins(self) -> list[str]:
        return [s.strip() for s in self.allowed_origins.split(",") if s.strip()]

    model_config = {"env_file": ".env"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
