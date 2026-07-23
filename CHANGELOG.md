# Changelog

## RC Launch & Beta Operations

- Added Closed Beta operations screens for About, Feedback, and Diagnostics without changing workout, recovery, habit, prediction, AI, nutrition, analytics, notification, storage, or program logic.
- Added consistent release metadata for Version 1.0.0-rc2, Build 53, Closed Beta environment, and Release Candidate channel.
- Added local-only Feedback Center with bug report, feature suggestion, general feedback, rating, message input, placeholder submit, and thank-you state.
- Added safe Diagnostics view and downloadable diagnostics JSON export that excludes personal user data and localStorage values.
- Added one-time Closed Beta welcome modal with dismissal remembered locally.
- Added Settings shortcuts for About, Feedback, Diagnostics, Privacy, Terms, and version visibility.
- Added polished generic error modal presentation with retry and Dashboard return actions.
- Bumped PWA cache assets to v53.

## RC Mobile Experience - PWA

- Improved PWA metadata with standalone display, scope, display override, portrait orientation, mobile app name, theme/background color, categories, maskable SVG icon metadata, and screenshot metadata.
- Added iOS/Android install metadata for Add to Home Screen, standalone launch, app title, translucent status bar, and mobile app capability.
- Added mobile-first safe-area presentation for Dynamic Island/notch/home indicator using viewport-fit and safe-area inset-aware app shell, topbar, bottom navigation, toast, chat input, and modals.
- Optimized mobile navigation, touch targets, button/tap feedback, form focus spacing, sticky workout controls, chat input behavior, overflow prevention, and small-phone/tablet responsive layouts.
- Improved offline navigation fallback in the service worker to prevent blank screens when cached shell assets are available.
- Bumped PWA cache assets to v52.

## RC-UI Premium Redesign

- Added a presentation-only premium dark visual system with near-black background, glass/elevated/outlined card treatment, rounded 16-20px surfaces, soft shadows, subtle borders, and neon-green accent language.
- Refined typography hierarchy, spacing rhythm, button styling, focus states, touch targets, toast/modal treatment, empty states, skeleton loader classes, and subtle sub-250ms animations.
- Redesigned the Dashboard presentation around a premium AI Coach hero, today's action CTAs, and upgraded Recovery, Habit, Prediction, and Smart Notification cards.
- Modernized workout, analytics, notification, and bottom navigation presentation without changing business logic, data models, engine calculations, storage structure, or API contracts.
- Bumped PWA cache assets to v51.

## Milestone 5.7 - Smart Notifications Engine

- Added a centralized Smart Notification Center with ID, timestamp, priority, category, title, message, contextual action, read/unread status, and dismiss state.
- Added notification categories for workout reminders, recovery readiness/warnings, habit reminders, nutrition reminders, goal progress, prediction updates, streak achievements, weekly summaries, coach recommendations, and system notices.
- Added smart triggers using existing Recovery, Habit, Prediction, Nutrition, and Training Analytics data without modifying workouts, plans, history, recovery, or profile data.
- Added Critical/High/Medium/Low priority sorting, duplicate collapse, newest-first behavior inside equal priority, and concise supportive coaching copy.
- Added Dashboard Smart Notifications card with unread count, priority badge, recent notifications, action buttons, and weekly summary.
- Added Coach Chat notification-aware responses for "What should I do today?", "Anything important?", and notification review prompts.
- Bumped PWA cache assets to v50.

## Milestone 5.6 - Progress Prediction Engine

- Added a read-only Prediction Profile using current weight, optional body fat, training frequency, workout adherence, nutrition adherence, recovery score, average weekly volume, recent progress, and current goal.
- Added Progress Prediction estimates for 4, 8, and 12 weeks with weight ranges, body-fat trend, muscle-gain trend, and strength trend.
- Added goal success probability with High, Medium, and Low labels plus reasons from adherence, recovery, training frequency, and nutrition consistency.
- Added structured risk analysis for plateau, burnout, overtraining, low adherence, and missed-goal risk.
- Added recommendation logic for adherence, recovery, protein consistency, training frequency, and maintaining the current plan.
- Added a Dashboard Progress Prediction card and Coach Chat responses for goal timeline, target-weight-change, and muscle-gain questions.
- Bumped PWA cache assets to v49.

## Milestone 5.5 - Habit & Adherence Engine

- Added a read-only Habit Profile with workout adherence, meal adherence, workout streak, nutrition streak, longest streak, missed workouts, missed meal targets, weekly/monthly consistency, preferred workout time, and preferred training days.
- Added Adherence Score 0-100 with Excellent, Good, Moderate, Poor, and Critical categories.
- Added behavioral insight detection for skipped days, late-night workouts, weekend-only training, meal inconsistency, repeated missed sessions, and long inactivity.
- Added coaching recommendations for frequency reduction, workout-time changes, shorter sessions, split workouts, scheduled recovery, and nutrition timing.
- Added a Dashboard Habit Adherence card with score, workout %, nutrition %, current streak, longest streak, top insight, recommendations, alerts, and 7/30/90-day trends.
- Added Coach Chat adherence responses for missed workouts, lack of time, motivation loss, and skipped leg-day style prompts.
- Bumped PWA cache assets to v48.

## Milestone 5.4 - Recovery & Readiness Engine

- Added a structured read-only Recovery Profile using sleep duration, optional sleep quality, soreness, fatigue, stress, mood, energy, previous workout load, rest days, optional heart rate/HRV, and optional manual readiness inputs.
- Added a central Readiness Engine that calculates Recovery Score 0-100 and classifies readiness as Excellent, Good, Moderate, Poor, or Very Poor.
- Added training recommendations for Train Normally, Reduce Volume, Reduce Intensity, Recovery Session, Mobility Session, Rest Day, and Deload Week with reasons.
- Added nutrition recommendations for protein, carbohydrates, hydration, deficit reduction, and calorie maintenance without modifying nutrition plans.
- Added a Dashboard Recovery Readiness card with score, readiness level, top factors, recommendation, alerts, and 7-day trend.
- Added Coach Chat readiness responses for training-today, soreness, short-sleep, exhaustion, fatigue, and deload questions.
- Bumped PWA cache assets to v47.

## Milestone 5.3 - AI Nutrition Planner

- Expanded the structured Nutrition Request with target weight, optional body fat, calorie strategy, current program summary, cooking skill, food preferences, exclusions, and recent progress analytics.
- Added configurable Fat Loss, Maintenance, Lean Bulk, and Aggressive Cut calorie strategies with TDEE and macro targets.
- Added estimated serving sizes and substitution chains for every generated meal.
- Added calorie, macro, meal-count, allergy, exclusion, and diet-compatibility validation.
- Added Draft, Approved, and Archived lifecycle metadata while preserving food logs, food history, and health profiles.
- Added Coach Chat conversion for nutrition goals, vegetarian preferences, peanut allergy, and meal-count requests.
- Bumped PWA cache assets to v46 and forced fresh network population during worker installation to prevent stale-code promotion.

## Milestone 5.1 - AI Nutrition Planner

- Added personalized nutrition-plan draft generation using goals, body data, activity level, training days, dietary pattern, budget, meal frequency, allergies, and exclusions.
- Added calculated calorie and macro targets, structured meal plans, shopping guidance, validation, and clear plan explanations.
- Added Accept, Edit, Regenerate, and Discard controls so generated nutrition plans remain drafts until explicitly accepted.
- Stored nutrition drafts and accepted plans per user without overwriting food logs or existing health history.
- Bumped PWA cache assets to v40.

## Milestone 4.4 - AI Coach Integration

- Added structured AI coaching context from existing health, nutrition, workout, analytics, and adaptive-training data.
- Added configurable provider, model, endpoint, temperature, token, and timeout settings for AI coach requests.
- Added request timeout and error handling with a safe local coaching fallback when an external provider is unavailable or not configured.
- Preserved existing tracking and program data as read-only coaching inputs.
- Bumped PWA cache assets to v39.

## Milestone 4.3 - Adaptive Training Intelligence

- Added rule-based adaptive training analysis using recovery, fatigue, training frequency, missed workouts, volume balance, and exercise performance trends.
- Added plateau detection and recommendations for recovery days, deloads, intensity changes, volume changes, exercise replacement, and maintaining the current program.
- Added before/after recommendation explanations with priority and reasoning.
- Added Accept, Dismiss, and Remind Later controls; recommendations never modify the active program automatically.
- Integrated adaptive context into Dashboard coaching and Coach Chat.
- Bumped PWA cache assets to v38.

## Trainer Portal Foundation

- Added a local Trainer Portal with trainer profile, client directory, client overview, trainer notes, recommendation drafts, timeline, dashboard cards, and rule-based trainer query support.
- Preserved client ownership by keeping trainer actions review-first and read-only against client tracking data.
- Bumped PWA cache assets to v43.

## Milestone 5.2 - AI Program Generator

- Added a personalized AI Program Generator that creates reviewable draft programs from goals, experience, schedule, equipment, target muscles, limitations, and exercise preferences.
- Added structured weekly schedules with warm-up, cool-down, sets, reps, rest, intensity, RPE, and progression notes.
- Added draft validation for volume, recovery, movement balance, frequency, equipment, and same-day duplicates.
- Added editable draft preview with Accept, Edit, Regenerate, and Discard actions; drafts never overwrite existing programs.
- Added per-user draft persistence and a Dashboard draft status card.
- Bumped PWA cache assets to v41.

## Milestone 4.2 - Conversational AI Coach

- Added a dedicated Coach Chat screen with local chat history, input, send action, timestamps, auto-scroll, suggested questions, and clear conversation.
- Added a local Conversation Engine with lightweight intent detection for workout, nutrition, recovery, fatigue, progress, motivation, program, and general questions.
- Added context-aware replies that reuse the existing Coach Engine, Progressive Overload, Training Analytics, nutrition, water, sleep, and workout schedule data.
- Added coach personas for Friendly, Professional, and Motivational tones without changing the underlying recommendations.
- Added smart quick replies after coach responses and an empty-state guide for first-time users.
- Added Dashboard entry points so the Today's Coach card and quick actions open Coach Chat.
- Stored conversation memory locally per user through a new isolated localStorage key.
- Bumped PWA cache assets to v37.

## Milestone 4.1 - AI Coach Foundation

- Added a Dashboard Today's Coach card as the first AI coaching experience.
- Added a read-only Coach Engine that interprets existing nutrition, water, sleep, workout schedule, Progressive Overload, and Training Analytics data.
- Added rule-based daily summary, recommendation type, priority, nutrition reminder, recovery reminder, weekly review, and dynamic motivation.
- Added goal-aware coaching language for muscle gain, fat loss, strength, general fitness, and athletic-style users.
- Added empty-data onboarding guidance without creating fake analytics.
- Reused existing analytics engines and preserved workout history, program data, and tracking data as read-only inputs.
- Bumped PWA cache assets to v36.

## Milestone 3.6 - Advanced Training Analytics

- Added a dedicated Training Intelligence analytics screen using rule-based calculations only.
- Added muscle volume analytics for weekly and monthly sets across major muscle groups.
- Added push/pull/legs balance, upper/lower ratio, estimated left/right balance, exercise frequency, and training density.
- Added rule-based Recovery Score and Fatigue Score with clear recommendations.
- Added muscle heatmap, volume landmarks, and weak point detection from real workout history.
- Added Dashboard analytics cards for recovery, fatigue, weekly muscle volume, and training balance.
- Preserved workout history, sessions, program history, and progressive overload records as read-only inputs.
- Bumped PWA cache assets to v35.

## Milestone 3.5 - Program Management System

- Added a Program Manager inside Workout for managing multiple saved programs from the existing workout program storage.
- Added create, blank program, duplicate, rename, delete, archive/restore, and favorite actions.
- Added program detail editing with notes, version display, debounced auto-save, and unsaved-change browser warning.
- Added weekly schedule assignment by weekday and workout, plus Dashboard cards for current program, today's workout, weekly completion, and program version.
- Added Move Up / Move Down controls for workout ordering and exercise ordering.
- Preserved immutable workout logs and workout history while keeping legacy single-program data compatible.
- Bumped PWA cache assets to v34.

## Milestone 3.4 - Progressive Overload Engine

- Added a derived Progressive Overload engine using existing workout logs and program check-in history only.
- Added previous performance, PR detection, estimated 1RM, exercise trends, overload suggestions, workout streaks, and weekly/monthly workout statistics.
- Added Dashboard training cards for last workout, current workout streak, weekly volume, and PR count.
- Enhanced Workout Intelligence and Workout History UI with training summary, PR badges, and per-exercise trend cards.
- Preserved existing workout history data and localStorage keys; all new statistics are calculated from real saved data.
- Bumped PWA cache assets to v33.

## Milestone 3.2.5 - Premium UI/UX Polish

- Reorganized the Dashboard into clearer health, nutrition, hydration, sleep, quick action, and mission sections without changing calculations or storage.
- Added mobile bottom navigation for Dashboard, Health, Food, Workout, and Progress while preserving existing screen IDs and flows.
- Split the Workout page into internal tabs for My Program, Program Builder, Exercise Library, and Workout Log.
- Added premium card spacing, larger touch targets, focus states, empty-state polish, subtle screen transitions, and save toast feedback.
- Bumped PWA cache assets to v32 so browsers load the refreshed UI files.

## Milestone 3.2 - Exercise Library + Smart Program Builder

- Added a centralized exercise catalog with Thai/English names, muscles, movement patterns, equipment, difficulty, goals, instructions, mistakes, safety notes, defaults, and tempo.
- Added an Exercise Library section inside the Workout page with search, muscle filter, movement filter, equipment filter, difficulty filter, clear filters, empty state, and detail card.
- Updated the workout generator to select exercises from the centralized catalog and save exercise IDs on newly generated programs.
- Added equipment-aware program selection for Home, Gym, and Minimal Equipment.
- Added beginner-safe filtering to avoid advanced movements for beginner programs.
- Added conservative injury handling for knee, back, shoulder, and wrist text with a visible medical-advice warning.
- Preserved existing saved workout programs and per-user localStorage program keys.

## Milestone 3.1 - Workout Intelligence Foundation

- Added a Workout Intelligence setup inside the existing Workout tab.
- Added goal, experience level, training days, equipment, workout duration, and injury limitation inputs.
- Added rule-based weekly program generation without AI, backend, external APIs, or subscription gating.
- Added program splits including Full Body, Upper/Lower, Push/Pull/Legs, Upper, Lower, and Conditioning based on user selections.
- Added weekly calendar with training days and rest days.
- Added workout summary for training days, weekly volume, and estimated workout time.
- Added workout detail cards with exercise, sets, reps, rest, notes, and tempo placeholder.
- Kept programs stored per user through existing localStorage program keys.

## Milestone 2.7 - Progress Dashboard

- Rebuilt the Progress page into a premium health Progress Dashboard using only existing real user data.
- Added Overall Progress, Health Score Trend, Body Progress, Nutrition Progress, Hydration Progress, and Sleep Progress sections.
- Added SVG/CSS charts for Health Score, Weight, Water, and Sleep without external libraries.
- Added nutrition averages, calories/protein target progress bars, water and sleep goal achievement, and weight weekly/monthly change.
- Added Weekly Summary and Monthly Summary with strengths and needs-improvement guidance generated from rules, not AI.
- Added earned/locked achievements for check-ins, active days, protein, water, sleep, and high Health Score.
- Added empty state for insufficient data and kept all progress data per user through existing localStorage.

## Milestone 2.6 - Health Score Engine

- Replaced the placeholder Dashboard score with a deterministic daily Health Score engine.
- Added 5 transparent scoring categories: Nutrition 30, Water 20, Sleep 20, Daily Check-in 15, and Weight Consistency 15.
- Added Dashboard score breakdown cards with earned points, max points, Thai explanations, and practical suggestions.
- Added a highest-impact recommendation based on the category with the largest point gap.
- Added 30-day Health Score history stats: latest score, 7-day average, best score, and trend versus the previous 7 days.
- Added safe missing-data handling so new users can open Dashboard without errors.
- Kept all scoring local and per-user through the existing localStorage data model.

## Milestone 2.5 - Sleep Tracking

- Added a dedicated Sleep Tracking page.
- Added sleep time, wake time, automatic sleep hours calculation, 1-5 sleep quality, optional note, and date fields.
- Added editable sleep goal with default 8 hours and per-user local persistence.
- Added today's sleep summary with sleep hours, sleep goal, quality, and completion percentage.
- Added sleep history with edit and delete confirmation.
- Added sleep statistics for weekly average, monthly average, best sleep, worst sleep, average quality, and consistency.
- Added current and best sleep streak based on sleep reaching goal.
- Connected Dashboard sleep cards to today's sleep data.
- Synced Daily Check-in sleep hours into the Sleep Tracking page.
- Stored sleep data inside existing per-user health logs.

## Milestone 2.4 - Water Tracking

- Added a dedicated Water Tracking page.
- Added today's water, daily goal, remaining water, and completion percentage.
- Added animated circular water progress rings for Dashboard and Water page.
- Added quick add buttons for +250 ml, +500 ml, +750 ml, and +1000 ml.
- Added custom water amount entry.
- Added editable per-user daily water goal with local persistence.
- Added last 30 days water history with edit and delete confirmation.
- Added hydration status for Daily Check-in.
- Added current and best hydration streak.
- Added water statistics for average, highest day, lowest day, weekly average, and monthly average.
- Connected Dashboard water cards and quick add to today's local water log.
- Stored water data inside existing per-user health logs.

## Milestone 2.3 - Weight Tracking

- Added a dedicated Weight Tracking page.
- Added weight, body fat, waist, progress photo placeholder, note, and date fields.
- Added latest weight card with current weight, goal weight, difference, and trend.
- Added newest-first weight history with edit and delete confirmation.
- Added weight statistics for highest, lowest, average, and current change.
- Added a simple 7-day weekly trend chart.
- Connected dashboard weight cards to the latest weight tracking record.
- Stored weight records inside existing per-user health logs for local MVP persistence.
- Kept authentication, food tracking, and daily check-in flows unchanged.

## Milestone 2.2 - Daily Check-in

- Added a Daily Check-in page for morning check-ins.
- Added optional weight, sleep hours, mood, energy level, water goal, and today's goal fields.
- Added quick mood buttons and an energy slider.
- Added dashboard check-in completed status and check-in streak.
- Added last 7 days check-in history.
- Stored check-in data per logged-in user through existing local health logs.
- Routes users to Check-in first when today's check-in is not completed.

## Milestone 2.1.5 - Food UX Polish

- Improved Food page spacing, typography, and visual hierarchy.
- Polished daily nutrition summary card with clearer macro cards and progress bars.
- Styled meal groups as separate rounded cards.
- Added save success animation and confirmation text.
- Added delete confirmation before removing a food item.
- Added a clean empty-state illustration placeholder.
- Improved responsive layout for small screens.

## Milestone 2.1 - Food Tracking Core

- Added manual Food page flow for logged-in users.
- Added meal type, food name, calories, protein, carbs, fat, and optional note fields.
- Added today's food log grouped by meal type.
- Added delete action for food log items.
- Added daily nutrition summary with calories, protein, carbs, and fat totals.
- Connected dashboard calories/protein cards to today's food logs.
- Kept food data scoped per local user in localStorage.
- Hid AI/photo/quick demo food surfaces for this manual tracking milestone.

## Sprint 2 - Today Dashboard Core

- Added the Khayubdi Today Dashboard foundation after login.
- Added greeting with display name and current goal.
- Added Today Health Score with Thai status labels.
- Added today summary cards for current weight, target weight, kcal target, protein target, and water target.
- Added quick actions for weight, food, workout, and progress.
- Added Daily Mission Preview for water, protein, weight check-in, and exercise.
- Reduced the primary navigation to Dashboard, Food, Workout, Progress, and Profile.
- Kept auth and localStorage-based user persistence unchanged.
