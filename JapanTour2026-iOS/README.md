# Japan Tour 2026 — iOS App

A native iPhone app (Swift + WKWebView) that runs the Japan Tour 2026 travel
companion. The whole web app is bundled inside, so it works fully offline; the
only thing that goes online is tapping a Google Maps link, which opens Safari.

## What you need

1. **A Mac with Xcode** — free from the Mac App Store (large download, ~15 GB).
2. **An Apple ID** — a free one works. A paid Apple Developer account ($99/year)
   is optional; see "The 7-day limit" below.
3. **A USB cable** to connect the iPhone to the Mac.

## Build and install — step by step

1. **Open the project.** Double-click `JapanTour2026.xcodeproj`. Xcode opens it.

2. **Set signing.** In the left sidebar click the blue **JapanTour2026** project,
   select the **JapanTour2026** target, open the **Signing & Capabilities** tab.
   - Tick **Automatically manage signing**.
   - In **Team**, choose your Apple ID. If none is listed, click *Add an Account…*
     and sign in with your Apple ID, then pick it.
   - If you see a red error about the bundle identifier being taken, change
     **Bundle Identifier** to something unique, e.g. `com.yourname.JapanTour2026`.

3. **Connect the iPhone** to the Mac with the cable. On the iPhone tap **Trust**
   if asked. At the top of the Xcode window, click the device selector (next to
   the app name) and choose your iPhone.

4. **Run.** Click the ▶ (Run) button, or press ⌘R. Xcode builds the app and
   installs it on the iPhone.

5. **Trust the developer (first run only).** The first launch will be blocked
   with "Untrusted Developer". On the iPhone go to
   **Settings → General → VPN & Device Management**, tap your Apple ID under
   *Developer App*, and tap **Trust**. Then open the app from the Home Screen.

The app icon is "Japan Tour 2026" and it launches full-screen like any app.

## The 7-day limit (free Apple ID)

Apps signed with a **free** Apple ID stop opening after **7 days**. To use it
again, just reconnect the iPhone and press Run in Xcode — that resigns it for
another 7 days. A **paid Apple Developer account** extends this to **1 year**.

## If the project will not open

This project file was written by hand. If Xcode reports it is damaged, create
the project fresh — it takes a minute:

1. Xcode → **File → New → Project… → iOS → App**. Name it `JapanTour2026`,
   Interface **SwiftUI**, Language **Swift**.
2. In the new project, replace the contents of the generated `…App.swift`
   file with the contents of `JapanTour2026/JapanTour2026App.swift` from this
   folder. Delete the generated `ContentView.swift` if there is one.
3. Drag `JapanTour2026/index.html` from this folder into the Xcode project
   navigator. In the dialog, tick **Copy items if needed** and make sure the
   **JapanTour2026** target is checked.
4. (Optional) Replace the generated `AppIcon` in `Assets.xcassets` with
   `AppIcon-1024.png` from this folder.
5. Continue from step 2 of "Build and install" above.

## Files in this folder

- `JapanTour2026.xcodeproj` — the Xcode project.
- `JapanTour2026/JapanTour2026App.swift` — the app code (WKWebView wrapper).
- `JapanTour2026/index.html` — the travel companion web app (bundled).
- `JapanTour2026/Assets.xcassets` — the app icon.
