# Khayubdi Roadmap

## Milestones

### Milestone 5.2 - AI Program Generator

Completed: personalized draft program generation, program validation, editable preview, explanations, explicit accept/regenerate/discard flow, per-user persistence, and Dashboard draft visibility.

### Milestone 5.3 - AI Nutrition Planner

Completed: structured nutrition requests, TDEE and macro strategies, personalized draft meals, serving sizes, substitutions, allergy and diet validation, editing, explicit approval, version metadata, persistence, and Coach Chat conversion without modifying food history or health profiles.

### Milestone 5.4 - Recovery & Readiness Engine

Completed: structured recovery profile, Recovery Score, readiness categories, recommendation-only training guidance, nutrition adjustment recommendations, recovery dashboard card, alerts, 7-day trend, and Coach Chat readiness answers without modifying workout history, programs, or nutrition plans.

### Milestone 5.5 - Habit & Adherence Engine

Completed: structured habit profile, Adherence Score, behavior analysis, coaching recommendations, dashboard habit card, alerts, 7/30/90-day trends, and Coach Chat adherence answers without modifying workout history, nutrition logs, programs, or meal plans.

### Milestone 5.6 - Progress Prediction Engine

Completed: structured prediction profile, probability-based 4/8/12-week ranges, body-fat/muscle/strength trend estimates, goal probability, risk analysis, recommendations, dashboard prediction card, and Coach Chat timeline answers without modifying workout history, programs, meal plans, or health profile.

### Milestone 5.7 - Smart Notifications Engine

Completed: notification center, smart triggers, priority system, categories, action buttons, weekly summary, dashboard section, and Coach Chat notification responses without modifying workouts, nutrition, recovery, or user data automatically.

### RC-UI - Premium Release Candidate Redesign

Completed: presentation-only premium UI overhaul with global design system styling, dashboard redesign, recovery/habit/prediction/notification card polish, AI hero, workout and analytics presentation improvements, bottom navigation modernization, empty/loading states, animations, responsive treatment, accessibility polish, and v51 service worker update.

### RC Mobile Experience - Progressive Web App

Completed: PWA manifest upgrades, iOS/Android install metadata, standalone mode support, safe-area handling, mobile navigation, responsive 320px-to-tablet layout polish, mobile interaction feedback, sticky workout/chat controls, offline fallback, accessibility refinements, and v52 service worker update.

### RC Launch & Beta Operations

Completed: About page, Closed Beta status, Feedback Center, Diagnostics page, safe diagnostics JSON export, one-time beta welcome, Settings shortcuts, polished generic error state, empty-state/accessibility review, security review, and v53 service worker update for final Closed Beta release support.

### Trainer Portal Foundation

Completed: local trainer profile, client directory, client overview, trainer notes, recommendation drafts, timeline, trainer dashboard cards, and rule-based trainer queries while preserving client data ownership.

### Sprint 0 - Emergency Stabilization

Restore the app so it opens successfully, fix compile/runtime blockers, and prioritize the working app over incomplete advanced sections.

### Sprint 1 - Khayubdi v2 Foundation

Build the basic non-React foundation with landing, register, login, logout, user profile, dashboard entry, mobile navigation, localStorage, and no demo users.

### Sprint 2 - Today Dashboard Core

Create the main logged-in dashboard with greeting, goal, health score placeholder, summary cards, quick actions, and daily mission preview.

### Milestone 2.1 - Food Tracking Core

Add manual food tracking with meal type, macros, daily totals, grouped logs, delete action, and per-user persistence.

### Milestone 2.1.5 - Food UX Polish

Improve the food experience with better spacing, cards, visual hierarchy, progress bars, save feedback, delete confirmation, empty state, and responsive polish.

### Milestone 2.2 - Daily Check-in

Add morning check-in with weight, sleep, mood, energy, water goal, today's goal, dashboard completion state, 7-day history, and streak.

### Milestone 2.3 - Weight Tracking

Add production-ready weight tracking with history, edit/delete, statistics, chart, and dashboard integration.

### Milestone 2.4 - Water Tracking

Add daily hydration tracking, editable goal, progress rings, streaks, statistics, history, and dashboard integration.

### Milestone 2.5 - Sleep Tracking

Add sleep tracking with sleep/wake time, automatic hours, quality, goal, streaks, statistics, history, and dashboard integration.

### Milestone 2.6 - Health Score Engine

Replace the placeholder score with a deterministic 0-100 Health Score using nutrition, water, sleep, daily check-in, and weight consistency.

### Milestone 2.7 - Progress Dashboard

Add a real-data Progress Dashboard with health score, body, nutrition, hydration, sleep trends, weekly/monthly summaries, and achievements.

### Milestone 3.1 - Workout Intelligence Foundation

Add rule-based weekly workout program generation with goals, experience, training days, equipment, duration, weekly calendar, details, and persistence.

### Milestone 3.2 - Exercise Library + Smart Program Builder

Add a centralized exercise catalog, Exercise Library search/filter/detail view, and catalog-powered workout program generation.

### Milestone 3.2.5 - Premium UI/UX Polish

Polish the existing app shell with grouped Dashboard sections, bottom navigation, Workout internal tabs, consistent cards, feedback states, accessibility touches, and mobile spacing improvements without changing feature logic.

### Milestone 3.4 - Progressive Overload Engine

Add previous performance, personal records, estimated 1RM, exercise trends, rule-based overload suggestions, workout summary enhancements, weekly/monthly training statistics, streak tracking, and Dashboard training cards from existing local workout history.

### Milestone 3.5 - Program Management System

Add multiple workout program management with create, duplicate, rename, archive/restore, favorite, delete, weekly schedule assignment, notes, versioning, auto-save, unsaved-change warning, and workout/exercise ordering.

### Milestone 3.6 - Advanced Training Analytics

Add rule-based training analytics for muscle volume, weekly/monthly dashboards, push/pull/legs and upper/lower balance, left/right estimate, exercise frequency, density, recovery, fatigue, heatmap, volume landmarks, weak points, and Dashboard analytics cards.

### Milestone 4.1 - AI Coach Foundation

Add the first AI coaching layer as a read-only rule-based interpretation engine that reuses existing health, nutrition, workout, Progressive Overload, Program Management, and Training Analytics data for Dashboard coaching, daily summaries, reminders, weekly review, and goal-aware recommendations.

### Milestone 4.2 - Conversational AI Coach

Add a local Coach Chat screen with conversation memory, intent detection, suggested questions, personas, smart quick replies, and context-aware answers that reuse the existing Coach Engine without external AI APIs.

### Docs 1.0 - Project Documentation

Create project, product, roadmap, UI, coding standard, and sprint report documentation without changing app behavior.

## Sprint List

- Sprint 000: Stabilization
- Sprint 001: App foundation
- Sprint 002: Dashboard core
- Sprint 003: Health tracking foundation, including food tracking, food UX polish, and daily check-in
- Sprint 004: Weight, water, sleep, Health Score, and Progress Dashboard
- Sprint 005: Workout Intelligence foundation
- Sprint 006: Exercise Library and Smart Program Builder
- Sprint 006.5: Premium UI/UX Polish
- Sprint 007: Progressive Overload Engine
- Sprint 008: Program Management System
- Sprint 009: Advanced Training Analytics
- Sprint 010: AI Coach Foundation
- Sprint 011: Conversational AI Coach

## MVP Checklist

- [x] App opens from local server
- [x] Landing page
- [x] Register
- [x] Login
- [x] Logout
- [x] Local user profile
- [x] Dashboard
- [x] Manual food tracking
- [x] Per-user food logs
- [x] Daily check-in
- [x] Per-user health logs
- [x] Weight tracking
- [x] Water tracking
- [x] Sleep tracking
- [x] Health Score Engine
- [x] Progress charts
- [x] Workout program
- [x] Exercise Library
- [x] Progressive Overload Engine
- [x] Program Management System
- [x] Advanced Training Analytics
- [x] AI Coach Foundation
- [x] Conversational AI Coach local foundation
- [x] Mobile-first navigation
- [x] Black/neon green theme
- [ ] AI nutrition
- [ ] Backend auth
- [ ] Cloud sync
- [ ] Subscription payments
- [ ] App Store / Google Play packaging

## Release Readiness Priorities

1. Keep login, dashboard, food, and check-in stable.
2. Add automated smoke checks for core flows.
3. Add real backend auth and cloud persistence.
4. Add privacy policy and terms screens.
5. Prepare native wrapper or PWA release route.
