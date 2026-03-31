# Product Requirements Document
## SpeakUp – Daily Speaking Coach Web App

**Version:** 1.1 (Draft)
**Author:** Tinsay
**Last Updated:** March 2026
**Status:** In Progress

---

## 1. Overview

### 1.1 Product Summary
SpeakUp is a solo web application that helps anyone improve their speaking and communication skills through daily video uploads, rule-based audio analysis, and progress tracking over time. Users upload a 1–2 minute video each day, receive structured feedback on 5 core speaking metrics, and track their improvement through charts, streaks, and weekly summaries.

### 1.2 Problem Statement
Most people know they want to speak better — more clearly, more confidently, more fluently — but have no objective way to measure or track their progress. Traditional solutions like hiring a speech coach are expensive and inaccessible. Existing apps are either too niche or too enterprise-focused. There is no simple, personal, data-driven tool that lets an individual practice daily and watch themselves improve over time.

### 1.3 Goals
- Give users a daily habit loop for speaking practice
- Provide objective, rule-based feedback on 5 core speech metrics
- Track improvement trends over time with charts and summaries
- Support multiple speaking contexts: casual conversation, interviews, presentations, pitching

### 1.4 Out of Scope (v1)
- AI-powered coaching tips or LLM feedback
- Video analysis (facial expressions, body language, eye contact)
- Social/community features (sharing, leaderboards, peer feedback)
- Mobile native app (web-first)
- Real-time live recording analysis
- OAuth / third-party login (Google, GitHub, etc.)

---

## 2. Target Users

### 2.1 Primary Persona: The Self-Improver
Anyone who wants to become a more effective communicator — students, professionals, job seekers, entrepreneurs, and anyone preparing for high-stakes speaking situations. No specific background assumed.

### 2.2 Speaking Contexts Supported
- **Casual conversation** – natural flow, coherence, filler word reduction
- **Job interviews** – clarity, structured answers, confident pacing
- **Public speaking / presentations** – delivery, structure, vocal variety
- **Pitching / persuasion** – conciseness, conviction, logical flow

---

## 3. Speaking Metrics (v1 Core Set)

All 5 metrics are derived from audio extraction and transcription only — no AI/LLM required.

| Metric | How It's Measured | Rule-Based Flag Triggers |
|---|---|---|
| **Speaking Pace (WPM)** | Words per minute from transcript + audio duration | Flag if <120 WPM ("too slow") or >180 WPM ("too fast") |
| **Filler Word Rate** | Count of "um," "uh," "like," "you know," "so," "basically" per minute | Flag if >5/min ("high filler usage detected") |
| **Clarity Score** | Avg. sentence length + vocabulary variety + readability index (Flesch-Kincaid) | Flag if score <5/10 ("message may be hard to follow") |
| **Vocal Tone** | Sentiment polarity of transcript (positive / neutral / hesitant) | Flag if consistently hesitant ("low confidence tone detected") |
| **Talk Structure** | Detects presence of intro, body, close via NLP segmentation | Flag if structure is missing ("no clear opening or close detected") |

### 3.1 SpeakUp Score
Each session generates an overall **SpeakUp Score (0–100)** — a weighted composite of the 5 metrics above, calibrated by the selected speaking context for that session.

Suggested default weights:
- Speaking Pace: 20%
- Filler Word Rate: 25%
- Clarity Score: 25%
- Vocal Tone: 15%
- Talk Structure: 15%

---

## 4. Features & Functional Requirements

### 4.1 Authentication

#### F0 – Auth System
- **Landing page** is publicly accessible; all other routes are protected
- **Sign Up:** email + password + display name
- **Log In:** email + password
- **Session management:** JWT-based auth with secure httpOnly cookies
- **Password requirements:** min 8 characters
- Basic form validation and error messaging (e.g., "Email already in use")
- No password reset in v1 (post-v1 backlog)

### 4.2 Landing Page

#### F1 – Public Landing Page
A sleek, modern marketing page that communicates the product's value and drives sign-ups. Sections:
- **Hero** – headline, subheadline, and primary CTA ("Start Improving Today" → Sign Up)
- **How It Works** – 3-step visual: Upload → Analyze → Improve
- **Metrics Preview** – showcase the 5 metrics with icons and brief descriptions
- **Progress Preview** – mockup/screenshot of the charts and streak tracker
- **CTA Footer** – secondary sign-up prompt

### 4.3 Core App Features

#### F2 – Daily Video Upload
- User uploads a 1–2 minute video (MP4, MOV, WebM; max 200MB)
- User selects speaking context before submitting
- Optional: type in a brief topic/prompt for the recording
- Submit triggers audio extraction and analysis pipeline
- Upload limited to once per day (additional uploads overwrite the daily entry)

#### F3 – Analysis Engine (Rule-Based)
- Audio extracted from video server-side
- Transcription via OpenAI Whisper
- Metric computation:
  - WPM calculated from word count ÷ audio duration
  - Filler words detected via keyword matching on transcript
  - Clarity Score computed via readability formulas (Flesch-Kincaid) + vocabulary range
  - Vocal Tone via lightweight sentiment analysis on transcript text
  - Talk Structure via NLP sentence segmentation (intro/body/close detection)
- Rule-based flags applied per metric thresholds (see Section 3)
- SpeakUp Score computed from weighted metrics
- Results stored and linked to the user's session record

#### F4 – Session Report
Each upload produces a report containing:
- SpeakUp Score (large, prominent display)
- 5 metric score cards with value, benchmark, and rule-based flag (if triggered)
- Full transcript with filler words highlighted inline
- Session metadata: date, duration, context, optional topic

#### F5 – Progress Charts
- Line chart for SpeakUp Score over time (primary chart)
- Individual metric trend charts (one per metric)
- Date range filters: Last 7 days / Last 30 days / All time
- Charts update after each new session submission

#### F6 – Daily Streak Tracking
- Streak counter on dashboard showing current consecutive days with uploads
- GitHub contribution-style calendar showing recording history
- Streak resets after any missed calendar day
- Milestone markers at 7, 14, 30 days

#### F7 – Weekly Summary
- Auto-generated every Monday for the prior week
- Displayed as an in-app notification/card on the dashboard
- Contents: avg SpeakUp Score, most improved metric, streak status, most triggered flag of the week

---

## 5. User Experience & Flow

### 5.1 Key Screens

| Screen | Access | Description |
|---|---|---|
| Landing Page | Public | Marketing page with sign-up CTA |
| Sign Up / Log In | Public | Email + password auth forms |
| Dashboard | Authenticated | Streak, today's upload CTA, score trendline, quick stats |
| Upload Screen | Authenticated | Video upload, context selector, optional topic input |
| Session Report | Authenticated | Score, metric cards, flags, transcript |
| Progress Screen | Authenticated | All metric charts with date range filters |
| Weekly Summary | Authenticated | Weekly recap card |

### 5.2 Core User Flow
```
Visit Landing Page
  → Click "Get Started" → Sign Up
  → Redirected to Dashboard
  → Click "Upload Today's Video"
  → Select context + upload file
  → Wait ~60s for analysis
  → View Session Report (score + flags + transcript)
  → Return to Dashboard (streak updated, charts refreshed)
```

---

## 6. Technical Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React (Next.js) | App router, server components |
| **Backend** | Python FastAPI | Analysis pipeline + REST API |
| **Database** | Supabase (PostgreSQL) | Users, sessions, metric scores; managed Postgres via Supabase |
| **Video/Audio Storage** | AWS S3 or Cloudflare R2 | Store raw uploads + extracted audio |
| **Speech-to-Text** | OpenAI Whisper | Local or via API |
| **Audio Processing** | librosa (Python) | WPM, pace, tone features |
| **NLP (lightweight)** | spaCy + TextStat | Structure detection, readability, sentiment |
| **Charting** | Recharts | Progress charts |
| **Auth** | Custom JWT (FastAPI) | httpOnly cookies, bcrypt password hashing |
| **Hosting** | Vercel (frontend) + Railway or Render (backend) | |

> **Note:** No LLM or Claude API dependency in v1. All analysis is rule-based and deterministic.

---

## 7. Non-Functional Requirements

- **Privacy:** Videos, audio, and transcripts are private to the authenticated user only.
- **Performance:** Analysis results returned within 90 seconds of upload.
- **Security:** Passwords hashed with bcrypt; JWT tokens expire after 7 days; all routes behind auth middleware.
- **Reliability:** Graceful error handling on failed uploads or analysis errors; user notified with retry option.
- **Accessibility:** WCAG 2.1 AA compliant; keyboard navigable.

---

## 8. Success Metrics

| Metric | Target |
|---|---|
| Consistency | User uploads ≥4x per week |
| Streak | First 30-day streak achieved |
| Score Improvement | SpeakUp Score up ≥10 pts from week 1 → week 8 |
| Filler Word Reduction | ≥25% reduction over 30 days |
| Engagement | Progress charts viewed after >70% of sessions |

---

## 9. Open Questions

- Should users be able to customize flag thresholds (e.g., set their own WPM target)?
- Should missed days ever be "excused" without breaking the streak?
- What happens if a video is longer than 2 minutes — hard reject or soft warn?
- Should the weekly summary also be sent via email, or in-app only for v1?
- Should users be able to delete past sessions?

---

## 10. Milestones

| Phase | Scope | Target |
|---|---|---|
| **Phase 0** | PRD + wireframes + design system | Week 1–2 |
| **Phase 1 – Auth + Landing** | Landing page + sign up / log in | Week 3–4 |
| **Phase 2 – Upload + Analysis** | Video upload + rule-based analysis pipeline + session report | Week 5–7 |
| **Phase 3 – Tracking** | Progress charts + streak system | Week 8–9 |
| **Phase 4 – Summaries + Polish** | Weekly summary + UI refinement + QA | Week 10–12 |
