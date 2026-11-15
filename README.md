# ClauseWise

**Know what you're agreeing to.**

ClauseWise is an AI-powered agreement analysis tool that helps people understand contracts, terms of service, privacy policies, and other legal documents before signing or accepting them.

## The Problem

People routinely accept lengthy agreements without reading or understanding them. Important conditions involving payments, auto-renewals, data collection, liability, and termination are buried in complex legal language. ClauseWise translates these into plain English with practical consequences — and backs every finding with verified evidence from the document.

## Target Users

- Students and fresh graduates reviewing employment agreements
- Young professionals signing rental or service agreements
- Consumers evaluating subscription terms and privacy policies
- Anyone who wants to understand what they're agreeing to before they sign

## Features

- **PDF Upload & Text Paste** — Upload a PDF or paste agreement text directly
- **Clause Classification** — Findings organized across 7 categories: payment, auto-renewal, liability, termination, data privacy, IP ownership, and other obligations
- **Plain-English Explanations** — Each finding includes the original clause, a clear explanation, practical implications, and questions to ask
- **Evidence Verification** — Every AI finding is independently verified against the source document using fuzzy text matching. Unverified findings are flagged
- **Attention Levels** — Findings rated as High Attention, Review, or Informational so you know where to focus
- **Obligations Extraction** — Separately identifies what you must do, what the other party can do, payment terms, deadlines, and trigger conditions
- **Action Checklist** — Interactive checklist of things to verify before signing

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React

**Backend:** Python, FastAPI, PyMuPDF, Pydantic, Google Gemini API (google-genai SDK)

**Deployment:** Vercel (frontend), Render (backend)

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Health check: `GET /health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | Backend `.env` | Your Gemini API key (required) |
| `GEMINI_MODEL` | Backend `.env` | Model name (default: `gemini-2.0-flash`) |
| `ALLOWED_ORIGINS` | Backend `.env` | Comma-separated CORS origins |
| `VITE_API_URL` | Frontend `.env` | Backend API URL (default: `http://localhost:8000`) |

## Architecture

```
User → Frontend (React/Vercel)
         ↓ POST /analyze/pdf or /analyze/text
       Backend (FastAPI/Render)
         ↓ Extract text (PyMuPDF)
         ↓ Analyze (Gemini API)
         ↓ Verify findings (fuzzy matching)
         ↓ Return structured response
       Frontend renders categorized results
```

The backend:
1. Extracts text from uploaded PDFs using PyMuPDF
2. Sends the full text to Gemini with a structured prompt requesting categorized findings with exact quotes
3. Independently verifies every AI-generated quote against the source text using normalized fuzzy matching (Levenshtein distance)
4. Returns findings with verification status: verified, partially verified, or unverified

## Limitations

- **Scanned PDFs are not supported.** The tool extracts text from digital PDFs only. Scanned/image-based PDFs will show an error asking users to paste the text instead.
- **Not legal advice.** ClauseWise provides informational analysis only. It does not replace a qualified attorney.
- **AI accuracy.** While findings are evidence-verified, the AI may miss nuances or context that a legal professional would catch.
- **English only.** The analysis is optimized for English-language agreements.
- **No document storage.** Analysis is stateless — documents are not saved or stored anywhere.
- **Rate limits.** The Gemini API free tier has rate limits that may affect availability under heavy use.

## What's Not Included (and Why)

- **URL scraping** — Web scraping is unreliable; PDF upload and text paste cover the use case
- **User accounts / history** — Adds database dependency; stateless design keeps it simple and privacy-friendly
- **OCR for scanned PDFs** — Adds significant complexity and slows cold starts
- **Version comparison** — Interesting feature but requires storing previous analyses; planned for v2

## License

MIT
