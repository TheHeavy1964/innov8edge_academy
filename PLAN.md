# 🏗️ Innov8Edge Academy — Master Plan

> "The fastest way for ordinary people to become AI builders."

A hands-on AI automation learning platform that teaches complete beginners how modern AI systems work — then immediately lets them practice inside an interactive sandbox.

---

## 🗺️ Master Roadmap

> [!IMPORTANT]
> **Core Directive:** All systems must **Show Value** (demonstrate utility/ROI) and **Identify How It Works** (reveal the underlying logic/process). No purely cosmetic animations.

| # | Milestone | Description | Status |
|---|-----------|-------------|--------|
| 1 | **Foundation & Landing** | Next.js scaffold, design system, premium landing page | ✅ Complete |
| 2 | **Learning Paths UI** | Interactive career trees, course catalog, lesson viewer | ✅ Complete |
| 3 | **Prompt Playground** | Live prompt testing sandbox with model comparison | ✅ Complete |
| 4 | **Workflow Builder** | Drag-and-drop visual automation builder (React Flow) | ✅ Complete |
| 5 | **MCP Playground** | Interactive MCP visualization & tool discovery | ✅ Complete |
| 6 | **Agent Simulator** | Multi-agent creation, reasoning trees, live execution | ✅ Complete |
| 7 | **AI Tutor Integration** | Personalized AI teacher with "Explain Like I'm Human" | ✅ Complete |
| 8 | **"See Inside the AI" Layer** | Decision visualization, context inspection, tool tracing | ✅ Complete |
| 9 | **Auth & User Profiles** | Supabase auth, progress tracking, user dashboard | ✅ Complete |
| 10 | **Marketplace & Sharing** | Workflow templates, agent sharing, "Remix" feature | ✅ Complete |
| 11 | **Business Model & Billing** | Freemium tiers, Stripe integration, team plans | ✅ Complete |
| 12 | **SEO & Content Funnel** | Blog, video embeds, marketing layer, CTA loops | ✅ Complete |
| 13 | **V1 Launch Readiness** | Analytics, performance, sitemap, final polish | 🚀 Active |

---

## 🚀 Current Trajectory

- [x] **Milestone 9: Final Settings Implementation**
    - [x] Implement Security Settings (Password change, Active sessions)
    - [x] Implement Notification Preferences (Email, Platform alerts)
    - [x] Remove placeholders from `/settings` page
- [x] **Video System Overhaul (V1 Critical Fix)**
    - [x] Fix Knowledge Library video player — replaced broken MP4s with YouTube iframes
    - [x] Rebuilt video player modal (no blocking overlays, controls fully accessible)
    - [x] Added URL auto-detection (YouTube / Vimeo / direct MP4 all supported)
    - [x] Admin: Library video edit via "Library Admin" → "Edit Info" modal
    - [x] Admin: Per-lesson video edit via inline ✏ edit button on lesson page
    - [x] `lesson_videos` Supabase table — admin URL changes persist for all users
    - [x] API route `/api/lesson-videos` (GET + POST with upsert)
    - [x] All 41 lessons in `curriculum.ts` seeded with working YouTube video URLs
    - [x] Fixed auth logout loop when navigating to `/library`
    - [x] Fixed `isAdmin` detection for demo mode users
- [ ] **Milestone 13: Final Polish & Launch**
    - [x] Fix broken Navbar/Footer links on marketing pages
    - [x] Correct signup routing (/signup -> /auth)
    - [ ] Final UI Pass: Mobile responsiveness
    - [ ] Performance Audit & Image Optimization

---

## ✏️ Squad Status

| Agent | Task | Status |
|-------|------|--------|
| **Antigravity** | Video System + Supabase Integration | ✅ Done |
| **User** | Run `LESSON_VIDEOS_MIGRATION.sql` in Supabase, add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` | 📋 Pending |

---

## 🎨 Design Decisions

### Color Palette (Innov8Edge Brand)
- **Celadon:** `#A1CCA5` — primary light, gradient text
- **Hunter Green:** `#415D43` — buttons, deep accents
- **Carbon Black:** `#111D13` — surface backgrounds
- **Background:** `#0A120B` — page background
- **Accent:** `#4CBB17` — Kelly Green for energy/CTAs

---

## 🏛️ Architecture
- **Tech Stack:** Next.js App Router, Supabase Auth, Framer Motion, Lucide React
- **Styling:** Vanilla CSS (CSS Variables)
- **Icons:** Lucide React

### Supabase Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User account data, tier, XP |
| `lesson_progress` | Per-user lesson completion state |
| `marketplace_listings` | Community-shared agent/workflow templates |
| `lesson_videos` | Admin-overridden per-lesson video URLs (YouTube/Vimeo/MP4) |

### Video System
- **Library Page** (`/library`): YouTube iframe embed, admin edits via "Library Admin" modal
- **Lesson Pages** (`/learn/[track]/[lesson]`): Reads `lesson_videos` from Supabase on load; falls back to `curriculum.ts` default URL
- **URL Detection:** `getEmbedInfo()` / `toEmbedUrl()` auto-detect YouTube, Vimeo, or direct MP4

---

## 📝 Notes
- **Target Audience:** Non-developers who want to understand AI automation.
- **Differentiator:** Visual, interactive, simulation-driven learning.
- **Milestone 9 Note:** The Notifications and Security tabs are currently gated with placeholders. Finishing these is required for production readiness.
