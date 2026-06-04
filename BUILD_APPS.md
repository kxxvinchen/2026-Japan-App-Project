# Build & Publish the Apps — step by step

Goal: real installable iPhone and Android apps, both with push notifications.

**Order:** make each app run first, then add push, then distribute. Do iOS and
Android independently — they don't depend on each other.

Prerequisites you're getting:
- Apple Developer Program ($99/yr) — for iPhone.
- Google Play Developer ($25 once) — only if you want the Play Store; APK-by-link
  is free.
- **Android Studio** (free) and **Xcode** (free) on your Mac.
- Firebase CLI (already installed) + Blaze plan with a budget cap (for the push
  Cloud Function).

---

# iOS (iPhone)

## Step 1 — Get the plain app running (no push yet)
1. Open `JapanTour2026-iOS/JapanTour2026.xcodeproj` in Xcode.
2. Select the **JapanTour2026** target → **Signing & Capabilities** → set **Team**
   to your paid Apple Developer team. If the bundle id is taken, change it to
   something unique like `com.yourname.JapanTour2026`.
3. Plug in your iPhone, pick it as the run target, press ▶ (Run).
4. On the phone, trust the developer if prompted (Settings → General → VPN &
   Device Management). Confirm the app opens and works.

✅ You now have a working native iPhone app.

## Step 2 — Add push notifications
Follow **NOTIFICATIONS_SETUP.md** Parts A–D. In short:
1. Create the APNs key in the Apple Developer site; upload it to Firebase
   (Project settings → Cloud Messaging).
2. Register the iOS app in Firebase; download `GoogleService-Info.plist`.
3. In Xcode: add the Firebase SDK package (FirebaseMessaging), drag in
   `GoogleService-Info.plist`, add the **Push Notifications** and **Background
   Modes → Remote notifications** capabilities.
4. Replace `JapanTour2026/JapanTour2026App.swift` with
   `notifications/JapanTour2026App.swift` (the push-enabled version, already
   written for you).
5. Deploy the push function once: from this project folder,
   `firebase deploy --only functions`.
6. Run on a **real iPhone** (push doesn't work on the Simulator). Group tab →
   Enable notifications → have a director post → confirm the banner.

## Step 3 — Distribute
- **TestFlight (recommended):** Xcode → Product → Archive → distribute to App
  Store Connect → TestFlight → enable a **public link** and share it. Up to
  10,000 testers; installs like a normal app; avoids full App Store review.
- **Public App Store (optional):** submit the same build for review. Note Apple
  can be strict about web-wrapper apps — TestFlight is the safer first step.

---

# Android

## Step 1 — Get the plain app running (no push yet)
1. Open **Android Studio** → **New Project → Empty Views Activity**.
   - Name: `JapanTour2026` · Package name: **`com.jianchen.japantour`** ·
     Language: **Java** · Minimum SDK: API 24 or higher.
2. Replace the generated `MainActivity.java` with the one in
   **`android/MainActivity.java`** from this project.
3. Create the folder `app/src/main/assets/` and copy the latest app HTML into it
   as **`index.html`** (use `JapanTour2026_TravelCompanion.html`).
4. Add the INTERNET permission (see `android/android-config-snippets.md` §3).
5. Plug in an Android phone (USB debugging on) and press **Run**. Confirm it
   opens and works.

✅ You now have a working native Android app.

## Step 2 — Add push notifications
1. Firebase console → add an **Android app**, package
   `com.jianchen.japantour`; download **`google-services.json`** into `app/`.
2. Add the Google-services plugin and Firebase Messaging dependency, plus the
   `POST_NOTIFICATIONS` permission — all in `android/android-config-snippets.md`
   (§1, §2, §3).
3. (The `MainActivity.java` already creates the `announcements` channel and the
   topic-subscription bridge — nothing more to write.)
4. Make sure the push Cloud Function is deployed (same one as iOS:
   `firebase deploy --only functions`).
5. Run on a phone → Group tab → Enable notifications → have a director post →
   confirm the notification.

## Step 3 — Distribute
- **Play Store:** Android Studio → Build → Generate Signed Bundle (AAB) → upload
  in the Google Play Console ($25 account). Share the store link.
- **APK by link (free):** Build → Build APK → post the APK as a download (e.g. a
  GitHub release, like your current v1.0).

---

# After you change the app later
The native apps bundle a copy of the HTML, so when the app changes you rebuild
and re-distribute (re-archive to TestFlight / re-upload the AAB or APK). Sending
announcements does **not** require any rebuild. See `UPDATE_WORKFLOW.md`.

# Quick order recap
1. iOS app runs → 2. iOS push → 3. iOS TestFlight.
1. Android app runs → 2. Android push → 3. Play Store / APK link.
(The Cloud Function in step 2 is shared by both — deploy it once.)
