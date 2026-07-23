# Khayubdi Roadmap

## Completed Milestones

### Foundation and Health Tracking

- Sprint 0: Emergency Stabilization
- Sprint 1: Khayubdi v2 Foundation
- Sprint 2: Today Dashboard Core
- Milestone 2.1: Food Tracking Core
- Milestone 2.1.5: Food UX Polish
- Milestone 2.2: Daily Check-in
- Milestone 2.3: Weight Tracking
- Milestone 2.4: Water Tracking
- Milestone 2.5: Sleep Tracking
- Milestone 2.6: Health Score Engine
- Milestone 2.7: Progress Dashboard

### Workout Intelligence

- Milestone 3.1: Workout Intelligence Foundation
- Milestone 3.2: Exercise Library and Smart Program Builder
- Milestone 3.2.5: Premium UI/UX Polish
- Milestone 3.4: Progressive Overload Engine
- Milestone 3.5: Program Management System
- Milestone 3.6: Advanced Training Analytics

### AI Coaching and Planning

- Milestone 4.1: AI Coach Foundation
- Milestone 4.2: Conversational AI Coach
- Milestone 4.3: Adaptive Training Intelligence
- Milestone 4.4: AI Coach Integration
- Milestone 5.1: AI Nutrition Planner
- Milestone 5.2: AI Program Generator
- Milestone 5.3: AI Nutrition Planner
- Milestone 5.4: Recovery & Readiness Engine
- Milestone 5.5: Habit & Adherence Engine
- Milestone 5.6: Progress Prediction Engine
- Milestone 5.7: Smart Notifications Engine
- RC-UI: Premium Release Candidate Redesign
- RC Mobile Experience: Progressive Web App
- RC Launch & Beta Operations
- Trainer Portal Foundation

## Approved Milestone Details

### Milestone 4.3 - Adaptive Training Intelligence

Completed: plateau detection, missed-workout and training-frequency analysis, recovery and fatigue interpretation, rule-based program-change recommendations, before/after explanations, and explicit Accept, Dismiss, and Remind Later controls. Recommendations do not silently rewrite the active program.

### Milestone 4.4 - AI Coach Integration

Completed: structured coaching context assembled from existing health, nutrition, workout, analytics, and adaptive-training data; configurable AI provider settings; timeout and error handling; and safe local coaching fallback when an external provider is unavailable or not configured.

### Milestone 5.1 - AI Nutrition Planner

Completed: personalized nutrition-plan drafts based on goal, body data, activity, training schedule, diet, budget, meal frequency, and exclusions; calculated targets, meal planning, shopping guidance, validation, explanations, and Accept, Edit, Regenerate, and Discard controls. Drafts remain separate until accepted.

### Milestone 5.2 - AI Program Generator

Completed: personalized workout-program drafts, validation, explanations, editable preview, regeneration/discard flow, explicit acceptance, per-user persistence, and Dashboard draft visibility.

### Milestone 5.3 - AI Nutrition Planner

Completed: structured nutrition requests, TDEE and macro strategies, personalized draft meals with serving sizes and substitutions, allergy/diet validation, editing, explicit approval, version metadata, persistence, and Coach Chat conversion without modifying food history or health profiles.

### Milestone 5.4 - Recovery & Readiness Engine

Completed: structured recovery profile, Recovery Score, readiness categories, training recommendations, nutrition adjustment recommendations, dashboard recovery card, alerts, 7-day trend, and Coach Chat readiness answers while preserving workout history, programs, and nutrition plans as read-only inputs.

### Milestone 5.5 - Habit & Adherence Engine

Completed: structured habit profile, Adherence Score, behavioral insights, coaching recommendations, dashboard habit card, 7/30/90-day trends, alerts, and Coach Chat adherence answers while preserving workout history, nutrition logs, programs, and meal plans as read-only inputs.

### Milestone 5.6 - Progress Prediction Engine

Completed: structured prediction profile, 4/8/12-week progress ranges, goal probability, risk analysis, recommendations, dashboard prediction card, and Coach Chat timeline answers while preserving workout history, programs, meal plans, and health profile as read-only inputs.

### Milestone 5.7 - Smart Notifications Engine

Completed: centralized notification center, smart triggers, priority sorting, categories, action buttons, weekly summary, dashboard notification card, and Coach Chat notification-aware answers while preserving workouts, nutrition, recovery, and user data as recommendation-only inputs.

### RC-UI - Premium Release Candidate Redesign

Completed: presentation-only premium dark UI overhaul, reusable visual system treatment, upgraded Dashboard/AI Coach/Recovery/Habit/Prediction/Notification presentation, modern workout and analytics styling, responsive/accessibility polish, empty/loading states, animations, and v51 service worker update without changing business logic or data models.

### RC Mobile Experience - Progressive Web App

Completed: PWA metadata, standalone/install support, safe-area layout, thumb-optimized bottom navigation, mobile form and interaction polish, sticky workout/chat controls, offline fallback, responsive device coverage, accessibility refinements, and v52 service worker update without changing business logic, AI, analytics, or storage.

### RC Launch & Beta Operations

Completed: About screen, Feedback Center, Diagnostics screen, safe diagnostics JSON export, one-time beta welcome, Settings shortcuts, generic error presentation, accessibility polish, security review, and v53 service worker update without changing business logic, AI, analytics, nutrition, workouts, notifications, or storage structures.

### Trainer Portal Foundation

Completed: local trainer profile, client directory and overview, trainer notes, recommendation drafts, timeline, dashboard status cards, and rule-based trainer queries while preserving client ownership of tracking data.

## Next Release Priorities

1. Preserve stability across login, dashboard, tracking, workout, and coaching flows.
2. Add automated smoke checks for core user journeys.
3. Add production backend authentication and cloud persistence.
4. Add privacy policy, terms, export, and account deletion workflows.
5. Prepare a supported PWA or native-store release path.
