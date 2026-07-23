# Khayubdi Product

## Product Summary

Khayubdi helps users build a daily health routine by combining check-ins, nutrition tracking, and progress visibility in one mobile-first experience. The MVP focuses on reliability and habit formation before moving into AI coaching and premium subscriptions.

## Current Features

- Landing page
- Local register and login
- Logout without deleting user data
- User profile with goal, body data, and activity level
- Today Dashboard
- Deterministic Health Score engine with transparent category breakdown
- Premium Progress Dashboard with real-data health trends, summaries, charts, and achievements
- Workout Intelligence foundation with weekly rule-based program generation
- Exercise Library with searchable/filterable catalog and catalog-powered smart program builder
- Premium mobile UI shell with bottom navigation, grouped Dashboard sections, Workout sub-tabs, and save feedback
- Progressive Overload tracking with previous performance, PR badges, estimated 1RM, workout streaks, and weekly/monthly training statistics
- Program Management System with multiple programs, create/duplicate/rename/archive/favorite/delete, weekly schedule, notes, versioning, and reorder controls
- Advanced Training Analytics with muscle volume, balance, recovery, fatigue, heatmap, volume landmarks, weak point detection, density, and exercise frequency
- AI Coach Foundation with a read-only Today's Coach card, rule-based daily summary, nutrition and recovery reminders, goal-aware recommendations, weekly review, and motivation generated from existing user data
- Conversational AI Coach local foundation with chat history, intent detection, suggested questions, quick replies, personas, and context-aware replies generated from existing Khayubdi data
- AI Program Generator with personalized draft creation, validation, explanations, preview/edit/regenerate/discard controls, and explicit acceptance before saving
- AI Nutrition Planner with profile/program/analytics-aware calorie strategies, meal drafts, serving sizes, substitutions, validation, chat conversion, and explicit approval
- Recovery & Readiness Engine with read-only recovery profile scoring, readiness categories, training recommendations, nutrition adjustment suggestions, alerts, 7-day trend, Dashboard card, and Coach Chat training-today responses
- Habit & Adherence Engine with read-only adherence scoring, workout and nutrition consistency, streaks, behavioral insights, recommendations, alerts, 7/30/90-day trends, Dashboard card, and Coach Chat support
- Progress Prediction Engine with read-only prediction profile, 4/8/12-week outcome ranges, goal success probability, risk analysis, recommendations, Dashboard card, and Coach Chat timeline answers
- Smart Notifications Engine with read-only personalized notifications, priorities, categories, action buttons, weekly summaries, Dashboard card, and Coach Chat notification awareness
- Release Candidate premium UI with unified dark design language, upgraded dashboard/action hierarchy, modern workout and analytics presentation, notification center polish, responsive layout, accessibility-focused touch/focus states, empty states, skeleton loaders, and subtle animations
- Release Candidate mobile PWA experience with install-ready metadata, standalone launch support, safe-area-aware layout, native-feeling bottom navigation, mobile forms, sticky workout controls, offline fallback, and responsive device polish
- Release Candidate beta operations with About, Feedback, Diagnostics, safe diagnostics export, beta welcome, Settings shortcuts, and polished error states for Closed Beta support
- Trainer Portal Foundation with local trainer profile, client directory, client overview, notes, recommendation drafts, timeline, dashboard cards, and rule-based trainer queries
- Nutrition summary
- Manual food tracking
- Daily check-in
- Check-in streak
- Last 7 days check-in history
- Mobile navigation
- PWA-oriented files

## Health Score Rules

Daily Health Score is calculated locally from existing user data and always totals 0-100.

- Nutrition: 30 points from calories versus target, protein versus target, and food logging consistency.
- Water: 20 points from daily water intake versus the user's water goal.
- Sleep: 20 points from sleep duration versus sleep goal and sleep quality 1-5.
- Daily Check-in: 15 points from check-in completion, energy level, and mood recording.
- Weight Consistency: 15 points from weight logging consistency only; it does not reward rapid weight loss.

If profile targets or daily data are missing, Khayubdi uses safe fallback scoring and explains what the user should log next.

## User Flow

1. User opens Khayubdi.
2. User lands on the Landing page.
3. User registers or logs in.
4. If the user has not completed today's check-in, Khayubdi opens the Check-in page first.
5. After check-in, user can review the Dashboard.
6. User can log food from the Food page.
7. User can review profile and logout.
8. Logging back in restores the same local data.

## Subscription Plans

Subscription logic is not implemented yet. Planned structure:

- Free: dashboard, check-in, manual food tracking, Health Score, Progress Dashboard, Exercise Library, rule-based Workout Program, Program Management, Progressive Overload insights, Advanced Training Analytics, AI Coach Foundation, Recovery & Readiness, Habit & Adherence, Progress Prediction, Smart Notifications, local Coach Chat, Trainer Portal Foundation, Release Candidate premium mobile navigation, PWA install experience, and beta operations utilities.
- Pro: advanced nutrition score, deeper AI review, and future API-powered conversational coaching.
- Premium: AI food vision, advanced trends, future integrations, priority coaching features.

## Future Roadmap

- Workout check-in progression refinements
- Expanded exercise catalog and movement education
- Advanced progress comparisons
- AI Coach API integration
- Cloud-backed conversation history
- AI Nutrition score
- AI food photo analysis
- Weekly AI Review
- Premium upgrade screens
- Backend accounts and cloud sync
- Health app integration
- LINE OA health assistant connection
- App Store and Google Play release preparation

## Product Principles

- Stability first.
- No demo user data in production-facing flows.
- Local MVP behavior must remain predictable.
- Thai language for user-facing health flows.
- Mobile-first layout before desktop refinement.
- Premium black/neon green identity.
