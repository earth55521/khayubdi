# Khayubdi Coding Standard

## Naming

- Use clear camelCase names in JavaScript.
- DOM element variables should describe the element purpose.
- Storage helper functions should describe the data they read or write.
- Keep user-facing Thai labels in HTML/JS close to the related UI.

## Folder Structure

Current app structure:

- `server.js`: local app server and backend-like endpoints.
- `public/`: browser app files.
- `public/exercise.html`: main app screens.
- `public/exercise.css`: app styling.
- `public/exercise.js`: app state and behavior.
- `public/manifest.webmanifest`: install metadata.
- `public/service-worker.js`: cache handling.
- `docs/`: project documentation.
- `docs/SPRINT_REPORTS/`: completed sprint summaries.

## Storage Rules

- Store MVP data in localStorage only.
- Scope user tracking data per logged-in user.
- Logging out must not erase user data.
- Do not create demo users or demo food data.
- Avoid changing storage keys unless a migration is added.
- Keep future backend sync paths in mind when creating data shapes.

## LocalStorage Keys

Exact keys should be checked in `public/exercise.js` before changes. Current storage concepts include:

- Registered users
- Active session
- User profile
- Food logs
- Health logs
- Check-in data inside health logs
- Workout/progress placeholders from older app areas

## JavaScript Conventions

- Keep the app compiling with `node --check public/exercise.js`.
- Prefer small helper functions for repeated localStorage, date, and render logic.
- Render from state after data changes.
- Do not let one broken section block Landing, Login, Register, or Dashboard.
- Keep new features behind stable UI paths.
- Avoid adding external dependencies unless the app clearly needs them.
- Preserve existing authentication and food tracking behavior when adding health features.

## HTML/CSS Conventions

- Keep screen sections identifiable by stable IDs.
- Use existing class patterns before adding new ones.
- Maintain mobile-first layouts.
- Do not remove hidden legacy elements unless dependent JavaScript is updated safely.
- Keep premium black/neon green styling consistent.

## QA Checklist For Changes

- App opens from local server.
- Login still works.
- Register still works.
- Logout still works.
- Dashboard loads.
- Food page still works.
- Check-in still works.
- Console has no new errors.
- `server.js` syntax check passes.
- `public/exercise.js` syntax check passes.
