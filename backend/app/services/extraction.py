import re

import fitz


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        if text.strip():
            pages.append(text)
    doc.close()

    if not pages:
        raise ValueError(
            "No extractable text found in this PDF. "
            "It may be a scanned document. Please paste the text instead."
        )

    full_text = "\n\n".join(pages)
    return clean_text(full_text)


def clean_text(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"-\n(\w)", r"\1", text)
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    return text.strip()
