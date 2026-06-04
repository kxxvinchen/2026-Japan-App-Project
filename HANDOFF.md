# Japan Tour 2026 — Project Handoff

This repo is now a **PWA-first travel companion** for the 2026 Japan
Performance & Cultural Exchange Tour. It is built from a small `src/` source
set into a web app, then served from `public/` and optionally deployed with
Firebase Hosting and Firebase Functions.

## What this app is

The app shows the tour itinerary, group-aware schedules, hotels, emergency
info, announcements, reminders, and lightweight personalization. It is meant
to run as a standalone web app that can be installed to a phone home screen
and work offline through a service worker.

## Current architecture

The repo is organized around a generated PWA build:

- `src/index.template.html` — HTML shell
- `src/styles.css` — all styling
- `src/data.js` — tour data, groups, hotels, emergency info, version string
- `src/logic.js` — app behavior, rendering, state, Firebase integration
- `public/index.html` — generated production HTML
- `public/manifest.json` — PWA manifest
- `public/sw.js` — service worker for offline caching and push support
- `public/` assets — icons and static app files
- `notifications/functions/index.js` — Firebase Cloud Functions for message
  fan-out and scheduled reminders
- `notifications/JapanTour2026App.swift` — leftover native iOS push-enabled
  Swift file from the migration history, kept as a reference artifact

## Build flow

`build.mjs` assembles the app by stitching the source files into the HTML
shell and writing these generated outputs:

- `JapanTour2026_TravelCompanion.html`
- `public/index.html`
- `JapanTour2026-iOS/JapanTour2026/index.html` if that legacy target path is present

It also keeps the service worker cache version in sync with `APP_VERSION`.

The build inputs are:

- `src/index.template.html`
- `src/styles.css`
- `src/data.js`
- `src/logic.js`

## App behavior

- The app uses `localStorage` for user-specific state such as selected group,
  skips, notes, and theme preferences.
- The service worker caches the app shell for offline use.
- Firebase Cloud Messaging is present for background push notifications.
- Firebase Functions provide channel message fan-out and scheduled reminders.

## How to work on the app

Edit the `src/` files, not the generated files under `public/` or the root
HTML copy.

Recommended edit flow:

1. Update content or logic in `src/data.js` or `src/logic.js`.
2. Run `node build.mjs`.
3. Verify the generated `public/index.html` and `public/sw.js`.
4. Deploy the web app and functions if needed.

## Deployment targets

The repo includes Firebase setup files and docs, so the intended deployment
path is:

- **Firebase Hosting** for the PWA
- **Firebase Functions** for notifications and reminders

Relevant files:

- `firebase.json`
- `notifications/functions/package.json`
- `notifications/functions/index.js`

## Migration leftovers from native apps

The project used to have native iOS and Android wrappers. In the current repo,
those platforms are mostly gone. The main leftover native artifact is:

- `notifications/JapanTour2026App.swift` — iOS Swift source from the old
  wrapper-based app

I did not find active Android source files such as `AndroidManifest.xml`,
`build.gradle`, `.java`, or `.kt` files in the current workspace.

Several docs still mention the older native-app path and should be treated as
historical unless you plan to keep them updated:

- `BUILD_APPS.md`
- `NOTIFICATIONS_SETUP.md`
- `SETUP_CHECKLIST.md`
- parts of `HANDOFF.md` itself before this rewrite

## What is worth keeping in sync

- `APP_VERSION` in `src/data.js`
- service worker cache version in `public/sw.js`
- generated output from `build.mjs`
- Firebase functions and any notification channel names used by the app

## Quick mental model for a new maintainer

If you only remember one thing, remember this:

**Source lives in `src/`; build generates the PWA; `public/` is what gets
served; Firebase adds notifications and reminders.**
