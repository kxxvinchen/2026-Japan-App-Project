# Japan Tour 2026 — Get-It-Live Checklist

Work top to bottom. Each phase builds on the last. Detailed steps for the
Firebase and notification phases live in **FIREBASE_SETUP.md** and
**NOTIFICATIONS_SETUP.md** — this is the map that ties them together.

Legend: 💻 needs your Mac · 💳 costs money · ⏳ may involve a wait ·
🙋 you can hand this to Claude.

---

## Phase 0 — See what already works (5 min, nothing needed)
- [ ] Double-click `JapanTour2026_TravelCompanion.html` to open it in a browser.
- [ ] Try it: pick a group, browse the 15-day itinerary, open "Full logistics,"
      pick a flight group and bus number, add your own activity.
- [ ] The **Messages** tab will say "not set up yet" — that's expected until Phase 1.

> Everything above is done and needs no accounts. Phases 1–3 turn on messaging
> and notifications.

---

## Phase 1 — Messaging backend (Firebase)  ·  ~30 min, free
Full details: **FIREBASE_SETUP.md**. The short version:

- [ ] **Create a Firebase project** at https://console.firebase.google.com.
- [ ] **Add a Web App**, copy the 6 `firebaseConfig` values. 🙋 *Send me these and
      I'll paste them into the app for you.*
- [ ] **Enable Firestore** (Production mode).
- [ ] **Paste the security rules** from FIREBASE_SETUP.md Step 4.
- [ ] **Enable Email/Password sign-in** (Authentication).
- [ ] **Add each director:** create their Auth account (email + password), then
      add a document with their email as the ID in a `directors` collection.
- [ ] **Connect the app:** put the config values into `FIREBASE_CONFIG` in the
      HTML (or let me do it 🙋), then re-copy the HTML into the iOS project's
      `index.html`.
- [ ] **Test:** open the app → Messages → Director sign-in → post a message.

✅ After Phase 1, messaging works in the browser and in the apps.

---

## Phase 2 — Apple Developer account  ·  💳 $99/yr, ⏳ approval
- [ ] Enroll at https://developer.apple.com/programs/ ($99/year).
- [ ] Wait for approval (often hours, sometimes a day or two).

> Needed for: iPhone push notifications **and** distributing the app to the
> whole group via TestFlight (Phase 4).

---

## Phase 3 — Push notifications  ·  💻 + 💳, after Phases 1–2
Full details: **NOTIFICATIONS_SETUP.md**. The short version:

- [ ] **APNs key:** in the Apple Developer site, create an APNs Auth Key (.p8),
      note the Key ID + Team ID.
- [ ] **Upload it to Firebase** (Project settings → Cloud Messaging).
- [ ] **Register the iOS app** in Firebase; download `GoogleService-Info.plist`.
- [ ] **In Xcode** 💻:
      - Add the Firebase SDK package (FirebaseMessaging).
      - Drag in `GoogleService-Info.plist`.
      - Add capabilities: Push Notifications + Background Modes → Remote notifications.
      - Replace `JapanTour2026App.swift` with `notifications/JapanTour2026App.swift`.
      - Set signing to your paid Apple Developer team.
- [ ] **Deploy the Cloud Function** (turns each message into a push):
      requires the Blaze plan (set a budget cap). See NOTIFICATIONS_SETUP.md Part D.
- [ ] **Test on a real iPhone** (not the Simulator): Group tab → Enable
      notifications → have a director post → confirm the banner arrives.

✅ After Phase 3, director messages push to phones even when the app is closed.

---

## Phase 4 — Build & give the app to everyone  ·  💻
- [ ] **iOS — TestFlight (recommended for the group):** with the paid account,
      upload the build to App Store Connect → TestFlight, then share the public
      invite link. Installs last 90 days, up to 10,000 testers. (The plain
      Xcode-to-device method only does one phone at a time and expires in 7 days.)
- [ ] **Android — rebuild the APK:** drop the latest `index.html` into the
      Android project's assets and rebuild. For notifications, also add FCM to
      the Android app (NOTIFICATIONS_SETUP.md Part E). Post the APK on your
      GitHub release for download.
- [ ] **Whenever you change the itinerary or app:** edit
      `JapanTour2026_TravelCompanion.html`, copy it over the iOS `index.html`,
      rebuild the APK, and re-upload to TestFlight.

---

## Quick dependency map
```
Phase 0  ── already done
Phase 1  (Firebase)           → messaging works
Phase 2  (Apple acct, $99)    ┐
Phase 3  (APNs + Xcode + fn)  ┘→ needs Phases 1 & 2 → notifications work
Phase 4  (TestFlight / APK)   → everyone gets the app
```

## What you can hand to Claude 🙋
- The 6 Firebase config values → I'll paste them into the app and re-sync iOS.
- Any itinerary corrections → I'll update the data and re-sync.
- Questions on any console/Xcode step → I'll walk you through it.

## What only you can do
- Create the cloud accounts (Firebase, Apple) and director accounts.
- Anything inside Xcode / on your Mac (builds, signing, capabilities).
- Pay for the Apple Developer Program and enable the Blaze plan.
