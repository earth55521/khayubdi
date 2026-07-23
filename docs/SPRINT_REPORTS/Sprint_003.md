# Sprint 003 - Health Tracking Foundation

## Goal

Build the first real health tracking features while keeping authentication and dashboard behavior stable.

## Completed

### Food Tracking Core

- Added Food page.
- Added manual food form.
- Supported meal types: เช้า, กลางวัน, เย็น, ของว่าง.
- Stored food name, calories, protein, carbs, fat, and note.
- Grouped today's food logs by meal type.
- Added delete action.
- Added daily macro totals.
- Connected dashboard calories and protein to today's food logs.
- Stored logs per user in localStorage.

### Food UX Polish

- Improved spacing, typography, and visual hierarchy.
- Added meal cards.
- Improved summary card.
- Added calories and protein progress bars.
- Added save success feedback.
- Added delete confirmation.
- Added empty-state placeholder.
- Improved responsive layout.

### Daily Check-in

- Added Check-in page.
- Added optional weight, sleep hours, mood, energy level, water goal, and today's goal.
- Added quick mood buttons.
- Added energy slider.
- Added dashboard check-in completed status.
- Added check-in streak.
- Added last 7 days check-in history.
- Stored check-in data per user.
- Routed users to Check-in first when today's check-in is incomplete.

## Outcome

Khayubdi now supports a daily habit loop: check in, view dashboard, and log food.

## QA Focus

- App opens.
- Login still works.
- Food still works.
- Check-in saves.
- Dashboard updates.
- Data persists after logout/login.
- Console has no new errors.
