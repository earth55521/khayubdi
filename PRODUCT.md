# Khayubdi Product

## Product Summary

Khayubdi is a mobile-first health and training application for Thai users. It combines daily health tracking, nutrition, workout planning, progress analytics, AI-assisted coaching, and trainer support while keeping users in control of changes to their plans.

## Current Product Scope

- Local registration, login, profile, and per-user data persistence
- Today Dashboard and deterministic Health Score
- Food, weight, water, sleep, mood, and daily check-in tracking
- Progress charts, summaries, streaks, and achievements
- Exercise Library and rule-based workout program generation
- Progressive Overload, Program Management, and Advanced Training Analytics
- AI Coach Foundation and conversational Coach Chat
- Adaptive Training recommendations with explicit accept, dismiss, and remind-later actions
- Configurable AI Coach integration with a safe local fallback
- AI Nutrition Planner with draft validation and review-before-save controls
- AI Nutrition Planner with health/program/analytics-aware calorie strategies, serving sizes, substitutions, allergy and diet validation, chat conversion, and explicit draft approval
- Recovery & Readiness Engine with a read-only training-today score, readiness category, training recommendation, nutrition adjustment suggestions, alerts, trend, Dashboard card, and Coach Chat responses
- Habit & Adherence Engine with read-only consistency scoring, workout and nutrition adherence, streaks, behavioral insights, recommendations, alerts, trends, Dashboard card, and Coach Chat support
- Progress Prediction Engine with read-only 4/8/12-week projection ranges, goal probability, risk analysis, recommendations, Dashboard card, and Coach Chat support
- Smart Notifications Engine with read-only contextual coach notifications, priorities, action buttons, unread/dismiss states, weekly summaries, Dashboard card, and Coach Chat support
- Release Candidate premium UI with a cohesive dark design system, upgraded dashboard hierarchy, modern bottom navigation, improved empty/loading states, responsive polish, and accessible touch/focus presentation
- Release Candidate mobile PWA experience with install metadata, standalone display support, safe-area-aware layout, thumb navigation, mobile form polish, sticky workout controls, offline fallback, and responsive device coverage
- Release Candidate beta operations with About, Feedback, Diagnostics, safe diagnostics export, one-time beta welcome, Settings shortcuts, and polished generic error presentation
- AI Program Generator with draft validation and explicit acceptance
- Trainer Portal with local client monitoring, notes, and recommendation drafts

## Product Principles

- Stability first.
- Mobile-first experience with a premium black and neon-green identity.
- No fabricated user or analytics data.
- Tracking history remains user-owned and is never silently overwritten.
- AI-generated programs, nutrition plans, and recommendations remain drafts until accepted.
- Recovery and readiness guidance is recommendation-only and never changes programs, workout history, nutrition plans, or profile data automatically.
- Habit and adherence coaching is behavior guidance only and never changes workouts, nutrition logs, programs, or meal plans automatically.
- Progress predictions are informational estimates only, never guarantees, and never modify workout history, programs, meal plans, or health profile data automatically.
- Smart notifications are supportive recommendations only and never modify workouts, nutrition plans, workout history, recovery, or user data automatically.
- Release Candidate UI work is presentation-only and must not alter business logic, calculations, storage, API contracts, or user data.
- Mobile PWA release work is presentation and platform-shell only; it must not alter business logic, AI behavior, analytics calculations, or storage.
- Beta operations utilities must exclude personal user data from diagnostics exports and must not expose API keys, secrets, or localStorage values.
- Local behavior remains available when external AI services are not configured.
- Health guidance is informational and does not replace professional medical advice.

## Data and Privacy

The current MVP stores health, nutrition, workout, coaching, and trainer data locally per user. External coaching review is opt-in. Backend accounts, cloud synchronization, subscription payments, and production AI operations remain future release work.

## Future Direction

- Backend authentication and cloud persistence
- Production-grade AI service integration and monitoring
- Advanced nutrition intelligence and food-photo analysis
- Health platform integrations
- Privacy policy, terms, and account lifecycle controls
- App Store and Google Play release preparation
