# ClauseWise

**Know what you're agreeing to.**

ClauseWise is an AI-powered agreement analysis tool that helps people understand contracts, terms of service, privacy policies, and other legal documents before signing or accepting them.

**Live App:** [clause-wise-delta.vercel.app](https://clause-wise-delta.vercel.app)

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

**Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide React

**Backend:** Python, FastAPI, PyMuPDF, Pydantic, Google Gemini API (google-genai SDK, Gemini 3.8 Flash)

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
| `GEMINI_MODEL` | Backend `.env` | Model name (default: `gemini-3.8-flash`) |
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

## Testing

### Unit Tests (33 tests)

```bash
cd backend
pytest tests/ -v
```

Tests cover three areas:

- **Verification engine** (`test_verification.py`) — Exact match, case-insensitive match, whitespace normalization, partial match detection, hallucination rejection, empty input handling, threshold boundary behavior
- **Text extraction** (`test_extraction.py`) — Whitespace collapsing, hyphenated word rejoining, paragraph break preservation, real PDF artifact handling
- **Request/response models** (`test_models.py`) — Input validation (min/max length, empty input), enum values, default field behavior, minimal valid responses

### Edge Cases Handled in Code

- **Scanned PDFs** — Detected (no extractable text) and surfaced as a clear error message
- **Text too short** — Both frontend (50-char minimum) and backend validation
- **File too large** — 10MB limit enforced on both client and server
- **Non-PDF uploads** — Rejected by file extension check
- **Malformed AI output** — `json.JSONDecodeError` caught and returned as a 502 with a user-friendly message
- **Gemini API blocking the event loop** — Synchronous SDK call offloaded to a thread via `asyncio.to_thread()`
- **Missing API key** — App fails at startup with a clear settings validation error, not on first request

### Manual Test Plan

| Test Case | Input | Expected Result |
|---|---|---|
| Text analysis (happy path) | Paste a SaaS agreement (~500 words) | Categorized findings with verification badges, obligations, action items |
| PDF upload (happy path) | Upload a digital PDF contract | Same structured results as text |
| Scanned PDF | Upload an image-only PDF | Error: "No extractable text found... paste the text instead" |
| Short text | Paste < 50 characters | Button disabled; backend returns 422 if bypassed |
| Empty file | Upload a 0-byte PDF | Error: extracted text too short |
| Large file | Upload > 10MB PDF | Rejected client-side with alert |
| Navigate to /results directly | No analysis state | Redirected to upload page |
| Health check | GET /health | `{"status": "ok"}` |

## Limitations

- **Scanned PDFs are not supported.** The tool extracts text from digital PDFs only. Scanned/image-based PDFs will show an error asking users to paste the text instead.
- **Not legal advice.** ClauseWise provides informational analysis only. It does not replace a qualified attorney.
- **AI accuracy.** While findings are evidence-verified, the AI may miss nuances or context that a legal professional would catch.
- **English only.** The analysis is optimized for English-language agreements.
- **No document storage.** Analysis is stateless — documents are not saved or stored anywhere.
- **Rate limits.** The Gemini API free tier has rate limits that may affect availability under heavy use.
- **Cold starts.** The Render free tier sleeps after inactivity; the first request may take 30-60 seconds. The frontend pings /health on page load to pre-warm the server.

## What's Not Included (and Why)

- **URL scraping** — Web scraping is unreliable across sites; PDF upload and text paste cover the use case
- **User accounts / history** — Adds database dependency and auth complexity; stateless design keeps it simple and privacy-friendly
- **OCR for scanned PDFs** — Adds Tesseract dependency (~100MB), slows cold starts, inaccurate on dense legal formatting
- **Version comparison** — Requires storing previous analyses; most interesting v2 feature
- **Streaming progress** — Would need SSE/WebSocket; Gemini's JSON mode doesn't support streaming partial structured output

---

## Product Write-Up

### What problem does ClauseWise solve, and who is the user?
Most people accept legal agreements without reading them. The consequences can be significant: unexpected auto-renewals, broad data collection rights, IP ownership transfers, or one-sided termination clauses.
The problem is that legal language is difficult to understand without legal training. ClauseWise targets students and young professionals encountering employment contracts, rental agreements, and SaaS subscriptions — people who need to understand what they're agreeing to but may not know which clauses deserve attention.

### What were the most important product decisions, and why?
1.	Evidence verification over raw summarization.
A summary is only useful if users can trust it. LLMs can confidently generate inaccurate explanations or cite clauses that don't exist. ClauseWise independently checks AI-generated quotes against the original document using Levenshtein-distance fuzzy matching. Findings are labelled as verified, partially verified, or unverified, so users can distinguish source-backed information from uncertain results.
This makes the analysis more transparent: users can see the original clause behind an explanation rather than having to take the AI's word for it.

2.	Structured categories over free-form summaries.
A wall of text doesn't help someone who simply wants to know, "What does this cost me?" ClauseWise organises findings into seven categories — payment, auto-renewal, liability, termination, data privacy, IP, and other obligations — with attention levels that help users prioritise what to review.

3.	Stateless design instead of user accounts.
Accounts, authentication, and document history would add considerable implementation scope without improving the core analysis experience. ClauseWise therefore doesn't require sign-up or permanently store uploaded documents. This keeps the product simpler while also avoiding unnecessary retention of potentially sensitive agreements. Document history and saved analyses can be considered later if users need them.

### What was cut from scope, and what would you build next?
I cut URL scraping because of its reliability challenges, OCR for scanned PDFs because of the additional complexity, version comparison because it would require document persistence, and streaming progress to keep the initial implementation focused.
Next, I'd build version comparison — showing users what changed between two versions of an agreement, which clauses were added or removed, and whether any obligations became more restrictive. This would extend ClauseWise from a one-time analysis tool into something useful throughout the agreement lifecycle.

### What broke or surprised during development?
The Gemini model version was an unexpected issue: gemini-2.0-flash was retired for new API keys during development, so I had to switch to gemini-3.8-flash.
I also encountered an issue with pydantic-settings: environment variables typed as list[str] were JSON-parsed by its dotenv source before my custom validator could process them. I resolved this by storing the value as a plain string and exposing a property that splits it on commas.
Finally, the synchronous Gemini SDK was blocking FastAPI's asynchronous event loop and causing request timeouts. I fixed this by offloading the API call to a thread using asyncio.to_thread().

