# Khayubdi Project

## Project Vision

Khayubdi is a mobile-first health tracking app for Thai users who want a simple daily system for food, exercise, weight, water, sleep, mood, and progress. The product direction is to become a premium AI health coach while keeping the MVP stable, fast, and easy to open on phone browsers.

## Goals

- Help users perform a daily check-in as the first action of the day.
- Track nutrition manually with calories, protein, carbs, and fat.
- Show a useful Today Dashboard after login.
- Keep user data available after logout/login.
- Store MVP data locally per user without demo users.
- Maintain a black/neon green premium mobile UI.
- Keep the app simple before adding backend, AI, payments, and complex analytics.

## Architecture Overview

Khayubdi currently uses a simple server-rendered static app foundation.

- `server.js` serves the app and LINE OA connector endpoints.
- `public/exercise.html` contains the main Khayubdi app shell and screens.
- `public/exercise.css` contains the mobile-first black/neon green UI.
- `public/exercise.js` contains app state, auth flow, dashboard, food tracking, daily check-in, and localStorage persistence.
- `public/manifest.webmanifest` and `public/service-worker.js` support installable/PWA behavior.
- `khayubdi-exercise-app.html` is a standalone generated app file for direct opening or sharing.

## Data Model

The MVP stores data locally in the browser with localStorage.

- User accounts are local MVP records.
- Active session is local.
- Food logs are stored per logged-in user.
- Health logs and check-ins are stored per logged-in user.
- Logout does not erase user profile or tracking data.

## Current Scope

Completed foundation:

- Landing
- Register
- Login
- Logout
- Profile data
- Dashboard
- Manual food tracking
- Food UX polish
- Daily check-in
- Per-user local storage

Deferred:

- Real backend authentication
- Real AI food vision
- Workout program
- Payments/subscriptions
- Admin analytics
- App Store and Google Play native packaging
