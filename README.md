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

### Assumptions
- Emission factors are based on global averages from IPCC/EPA data
- Carbon calculations are approximate and designed for awareness, not regulatory reporting
- The platform operates as a client-side-first application with an API backend for AI features

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
│   │   └── __tests__/         # Vitest test suites (70+ tests)
│   └── index.html             # Entry point with security headers & Google Analytics
├── backend/                   # FastAPI + Google Gemini Pro
│   ├── main.py                # API server with rate limiting, caching & CORS
│   └── test_main.py           # Backend pytest suite (12 tests)
└── .gitignore
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with lazy-loaded routes and `React.memo` optimization
- **Tailwind CSS 4** with custom eco-themed glassmorphism design system
- **Framer Motion** for micro-animations and page transitions
- **Recharts** for interactive carbon data visualizations
- **Vite 8** with ES2020 build target and manual chunk splitting
- **Vitest** — 70+ passing tests across 9 test files

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
| `helpers.test.js` | 22 | Utility functions: sanitize, debounce, calendar, clamp, carbon calc, formatCO2 |
| `constants.test.js` | 25 | Data integrity: nav items, categories, challenges, timeline, quiz, tips |
| `performance.test.js` | 7 | Web Vitals: LCP, CLS, FCP, TTFB measurement functions |
| `useChat.test.js` | 12 | Hook: message management, API calls, error handling, abort control |
| `useCarbon.test.js` | 13 | Hook: state management, localStorage, calculations, history |
| `Calculator.test.jsx` | 10 | Component: rendering, step navigation, inputs, accessibility |
| `Challenges.test.jsx` | 12 | Component: completion tracking, filtering, points, ARIA |
| `App.test.jsx` | 8 | Integration: routing, landmarks, skip links, navigation |
| `Dashboard.test.jsx` | 10 | Component: chart sections, data display, empty states |
| `test_main.py` | 12 | API: endpoints, security headers, caching, CORS, rate limiting |

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
