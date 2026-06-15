# 🌿 EcoTrack — Carbon Footprint Awareness Platform

> **Built with AI | Prompt Wars Virtual Hackathon**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-blue?style=for-the-badge&logo=google-cloud)](https://ecotrack-frontend-q64fufwmwa-uc.a.run.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Pro-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Analytics-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

EcoTrack is an AI-powered carbon footprint awareness platform that helps individuals understand, track, and reduce their carbon footprint through personalized insights, interactive calculators, eco challenges, and a Gemini-powered AI assistant.

## 🎯 Chosen Vertical

**Challenge 3 — Carbon Footprint Awareness Platform**: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## ✨ Key Features

| Feature | Description | Google Service |
|---------|-------------|----------------|
| **🤖 AI Carbon Assistant** | Gemini Pro-powered chatbot for carbon footprint queries | Google Gemini API |
| **📊 Carbon Dashboard** | Interactive charts showing emissions breakdown & trends | Firebase Firestore |
| **🧮 Smart Calculator** | Multi-step carbon calculator across 4 categories | — |
| **🏆 Eco Challenges** | Gamified challenges with points, streaks & tracking | — |
| **📅 Green Timeline** | Environmental milestones with Google Calendar sync | Google Calendar |
| **📈 Analytics Dashboard** | User engagement tracking & Web Vitals monitoring | Firebase Analytics |
| **🔒 Security Hardened** | CSP, XSS protection, input sanitization, rate limiting | — |

## 💡 Approach and Logic

EcoTrack takes a **holistic approach** to carbon awareness:

1. **Understand** — The Calculator breaks down emissions into 4 categories (Transport, Energy, Food, Shopping) using real EPA/IPCC emission factors
2. **Track** — The Dashboard visualizes personal emissions with Recharts, compares against global averages, and persists history in localStorage
3. **Reduce** — Personalized AI tips (via Gemini Pro), actionable Eco Challenges with CO₂ savings estimates, and a Google Calendar-synced timeline of environmental events
4. **Learn** — An AI Assistant answers any sustainability question, with fallback responses when API is unavailable

### How It Solves the Problem Statement

> *"Design a solution that helps individuals **understand**, **track**, and **reduce** their carbon footprint through **simple actions** and **personalized insights**."*

| Challenge Criteria | EcoTrack Feature | Implementation |
|-------------------|-----------------|----------------|
| **Understand** | Carbon Calculator + Dashboard | Multi-step wizard with preset quick-fill buttons; donut/bar/line charts showing per-category breakdown and trends |
| **Track** | History System + Firebase Analytics | localStorage persistence with history entries; timeline of environmental milestones |
| **Reduce** | AI Assistant + Eco Challenges | Gemini Pro chatbot with user's actual carbon data injected for personalized tips; gamified challenges with CO₂ savings estimates |
| **Simple Actions** | Preset Buttons + Quick Questions + Calendar Sync | One-click preset values ("Low/Avg/High"); quick question chips in chatbot; one-click Google Calendar event creation |
| **Personalized Insights** | Context-Aware AI + Tailored Tips | User's transport/energy/food/shopping breakdown sent to Gemini for hyper-personalized advice; dashboard tips filtered by highest-emission category |

### Assumptions
- Emission factors are based on global averages from IPCC AR6 (2023) and US EPA GHG Equivalencies Calculator
- Carbon calculations are approximate and designed for awareness, not regulatory reporting
- The platform operates as a client-side-first application with an API backend for AI features

### Design Decisions
- **Modular Backend**: FastAPI app split into `schemas.py`, `services.py`, `routes.py`, `middleware.py` for separation of concerns and testability
- **Single-Source-of-Truth**: All constants (emission factors, presets, colors, challenges) centralized in `constants/index.js`
- **LRU Cache**: Memoizes AI responses (128 entries) to reduce Gemini API costs and latency
- **Fallback System**: Keyword-matched local responses when Gemini is unavailable, ensuring 100% uptime
- **Code-Split Routes**: Lazy-loaded pages with manual Rollup chunk strategy for optimal initial load

## 🏗️ Architecture

```
Ecotrack/
├── frontend/                  # React 19 + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── constants/         # Centralized app data & configuration
│   │   ├── hooks/             # Custom React hooks (useChat, useCarbon)
│   │   ├── utils/             # Shared utilities (sanitize, debounce, Web Vitals)
│   │   ├── components/        # Reusable UI components (ErrorBoundary)
│   │   ├── pages/             # Route-level page components (6 pages)
│   │   └── __tests__/         # Vitest test suites (153 tests across 12 files)
│   └── index.html             # Entry point with CSP, security headers & Analytics
├── backend/
│   ├── app/                   # Modular FastAPI package
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── services.py        # Business logic, LRU cache, emission factors
│   │   ├── routes.py          # API route handlers (APIRouter)
│   │   └── middleware.py      # Security headers & CORS configuration
│   ├── main.py                # Application assembly & startup
│   └── test_main.py           # Backend pytest suite (25 tests across 5 classes)
└── .gitignore
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with lazy-loaded routes and `React.memo` optimization
- **Tailwind CSS 4** with custom eco-themed glassmorphism design system
- **Framer Motion** for micro-animations and page transitions
- **Recharts** for interactive carbon data visualizations
- **Vite 8** with ES2020 build target and manual chunk splitting
- **Vitest** — 153 passing tests across 12 test files

### Backend
- **FastAPI** with async request handling
- **Google Gemini Pro** for AI responses with system prompt engineering
- **SlowAPI** rate limiting (20 req/min)
- **GZip middleware** for response compression
- **LRU Cache** (128 entries) for memoizing AI responses
- **Pydantic** input validation with strict constraints

### Google Services
- **Google Gemini API** — AI carbon assistant backend
- **Firebase Analytics** — User engagement tracking
- **Firebase Auth** — Authentication infrastructure
- **Firebase Firestore** — Data persistence layer
- **Google Calendar API** — One-click environmental event scheduling
- **Google Analytics** — Page-level tracking via gtag.js
- **Google Cloud Run** — Serverless deployment

## 🧪 Testing Strategy

```bash
# Run all frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && pytest test_main.py -v
```

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| `helpers.test.js` | 30 | Utility functions: sanitize, debounce, calendar, clamp, carbon calc, formatCO2 |
| `constants.test.js` | 27 | Data integrity: nav items, categories, challenges, timeline, quiz, tips |
| `performance.test.js` | 7 | Web Vitals: LCP, CLS, FCP, TTFB measurement functions |
| `useChat.test.js` | 12 | Hook: message management, API calls, error handling, abort control |
| `useCarbon.test.js` | 13 | Hook: state management, localStorage, calculations, history |
| `Calculator.test.jsx` | 12 | Component: rendering, step navigation, inputs, presets, accessibility |
| `Challenges.test.jsx` | 11 | Component: completion tracking, filtering, points, ARIA |
| `App.test.jsx` | 8 | Integration: routing, landmarks, skip links, navigation |
| `Dashboard.test.jsx` | 10 | Component: chart sections, data display, empty states |
| `Landing.test.jsx` | 12 | Component: hero, CTAs, features, stats, footer, ARIA landmarks |
| `Timeline.test.jsx` | 5 | Component: events rendering, Google Calendar sync |
| `Assistant.test.jsx` | 6 | Component: chat UI, quick questions, send, typing indicator |
| `test_main.py` | 25 | API: endpoints, security, caching, CORS, rate limiting, services |

## 🔒 Security

- **Content Security Policy** (CSP) via `<meta>` tags and server headers
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Camera, mic, geolocation disabled
- **HSTS**: 1-year max-age with includeSubDomains
- **DOMPurify** sanitization on all user inputs
- **Rate limiting** on API endpoints (20/min)
- **CORS** restricted to allowed origins
- **Pydantic** input validation with length constraints

## ♿ Accessibility

- **Skip-to-content** link for keyboard navigation
- **ARIA landmarks**: `role="navigation"`, `role="log"`, `role="progressbar"`, `role="tablist"`
- **`aria-current="step"`** on active calculator steps
- **`aria-checked`** on challenge completion checkboxes
- **`aria-live="polite"`** on chat message area
- **`aria-label`** on all interactive elements and icons
- **Semantic HTML**: `<article>`, `<time>`, `<nav>`, `<section>`, `<main>`, `<header>`, `<footer>`
- **`loading="lazy"`** on non-critical images
- **Focus-visible** rings on all interactive elements
- **Mobile-responsive** navigation with bottom nav bar

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/Meowz-18/EcoTrack.git
cd EcoTrack

# Frontend
cd frontend
npm install
npm run dev          # → http://localhost:5173

# Backend (separate terminal)
cd backend
pip install fastapi uvicorn google-generativeai python-dotenv slowapi pydantic
uvicorn main:app --reload  # → http://localhost:8000
```

## 📄 License

Built for the **Prompt Wars Virtual Hackathon** by [Google for Developers](https://developers.google.com/) × [Hack2Skill](https://hack2skill.com/).

---

<p align="center">
  <b>#BuildwithAI #PromptWarsVirtual</b><br/>
  <i>Empowering carbon awareness through AI.</i>
</p>
