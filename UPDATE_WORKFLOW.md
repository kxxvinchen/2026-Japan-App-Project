# Update Workflow — where changes need to go

The app exists in a few places. When the app's content or features change, each
surface has to be refreshed. Here's the map so nothing falls out of sync.

## The surfaces

| Surface | File it uses | How it updates |
|---|---|---|
| **Master file** | `JapanTour2026_TravelCompanion.html` | The source of truth. Every other copy is made from this. |
| **Website (Firebase Hosting)** | `public/index.html` | Re-deploy: `firebase deploy --only hosting` |
| **iPhone app** | `JapanTour2026-iOS/JapanTour2026/index.html` | Rebuild in Xcode and re-distribute (TestFlight) |
| **Android app** | (bundled in the APK) | Rebuild the APK and re-post it |

## Two kinds of "change" — important distinction

**1. Announcements (day-to-day use): NO update needed.**
When a director posts an announcement, it goes through Firebase and appears for
everyone automatically — on the website and in the apps. You do **not** rebuild
or redeploy anything to send messages. This is the normal everyday use.

**2. The app itself changes** (itinerary edits, new features, fixes): the master
file changes, and then each surface must be refreshed:
- **Website:** re-run `firebase deploy --only hosting` (the `public/index.html`
  copy is kept in sync for you).
- **iPhone:** open Xcode, rebuild, re-upload to TestFlight.
- **Android:** rebuild the APK, re-post it.

> Claude keeps the three file copies (master, `public/index.html`, iOS
> `index.html`) identical whenever it edits the app. Your job for an app change
> is the **publish** part: redeploy the website and rebuild the apps.

## Quick rule of thumb
- Sending a message → nothing to publish. ✅
- Changing the schedule or the app → redeploy the website **and** rebuild the
  apps so all three stay current.
