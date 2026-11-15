import pytest

from app.services.extraction import clean_text


class TestCleanText:
    def test_collapses_multiple_newlines(self):
        assert clean_text("hello\n\n\n\nworld") == "hello\n\nworld"

    def test_collapses_spaces(self):
        assert clean_text("hello    world") == "hello world"

    def test_rejoins_hyphenated_words(self):
        assert clean_text("termi-\nnation") == "termination"

    def test_joins_single_newlines(self):
        assert clean_text("hello\nworld") == "hello world"

    def test_preserves_paragraph_breaks(self):
        result = clean_text("paragraph one\n\nparagraph two")
        assert "\n\n" in result
        assert "paragraph one" in result
        assert "paragraph two" in result

    def test_strips_surrounding_whitespace(self):
        assert clean_text("  hello  ") == "hello"

    def test_empty_string(self):
        assert clean_text("") == ""

    def test_real_pdf_artifact(self):
        text = "This  Agreement\nis  entered\n\ninto  between\nthe  parties."
        result = clean_text(text)
        assert "Agreement is entered" in result
        assert "\n\n" in result
