# Japan Tour 2026 — Project Handoff

A complete record of the Japan Tour 2026 Travel Companion app — what it is,
what was built, what's deployed where, and what's open. Anyone picking this
up on another computer should be able to start from here.

## What this is

A self-contained travel companion for the 2026 Japan Performance & Cultural
Exchange Tour (Saratoga HS & Lynbrook HS, June 9–23, 2026). The app shows
the day-by-day itinerary, group-aware schedule, city guides, and lets each
user pick their group, skip activities, and add personal notes. It runs
entirely on-device — no server, no account, fully offline.

The same app exists in three forms, all built from a single `index.html`:

1. **Plain HTML** — `JapanTour2026_TravelCompanion.html`. Open in any browser.
2. **Android APK** — `JapanTour2026.apk`. Native WebView wrapper.
3. **iOS Xcode project** — `JapanTour2026-iOS/`. SwiftUI + WKWebView wrapper.

Everything else (Excel itinerary, build script) is supporting material.

## What's where

| Artifact | Location |
|---|---|
| Source HTML | `JapanTour2026_TravelCompanion.html` |
| iOS Xcode project | `JapanTour2026-iOS/JapanTour2026.xcodeproj` |
| Built Android APK (v1.0) | `JapanTour2026.apk` |
| Excel itinerary | `Japan_Tour_Itinerary_2026.xlsx` |
| Build script for the xlsx | `build_itinerary.py` |
| Public GitHub repo | `https://github.com/jianchen-007/japan-tour-2026` |
| Public APK download | `https://github.com/jianchen-007/japan-tour-2026/releases/download/v1.0/JapanTour2026.apk` |

## How the app is structured

The whole app is a single self-contained HTML file. CSS, JavaScript, and the
itinerary data all live inside `index.html`. State (group choice, skipped
items, custom activities, notes) persists in `localStorage` under keys
prefixed `jt_`. There are no external dependencies, no network calls except
opening Google Maps links in the system browser.

The Android and iOS wrappers do nothing more than load that one HTML file
in a system WebView and forward `http(s)://` link taps to the OS browser.

### To edit the app

Edit `JapanTour2026_TravelCompanion.html` in any text editor, then rebuild
the wrappers from it (next section). Most edits will be to the JavaScript
data arrays at the top of the `<script>` block — the `DAYS` array (per-day
schedule, hotels, items) and the `CITIES` array (city guides).

### To rebuild the Android APK

The APK was built manually (no Gradle) using the Android command-line
SDK tools. Required: JDK 11+, Android build-tools (aapt2, d8, zipalign,
apksigner), and an `android.jar`. Sketch:

```
sed 's/ target="_blank"//g' index.html > proj/assets/index.html
aapt2 compile --dir proj/res -o res.zip
aapt2 link -o base.apk -I android.jar --manifest proj/AndroidManifest.xml \
    -A proj/assets --java gen --min-sdk-version 21 --target-sdk-version 33 \
    --version-code 1 --version-name 1.0 res.zip
javac (or ecj) -source 1.8 -target 1.8 -bootclasspath android.jar -d classes \
    proj/java/com/jianchen/japantour/MainActivity.java \
    gen/com/jianchen/japantour/R.java
d8 --release --min-api 21 --lib android.jar --output dex classes/com/.../*.class
( cd dex && zip -j ../base.apk classes.dex )
zipalign -f -p 4 base.apk aligned.apk
keytool -genkeypair -keystore debug.keystore ...
apksigner sign --ks debug.keystore --ks-pass pass:android --out JapanTour2026.apk aligned.apk
```

The Android project sources (Manifest, MainActivity.java, res/, etc.) used
to build this were generated alongside the build but only the final APK is
preserved. Easier modern path on another machine: open Android Studio,
create a new Empty Views Activity project, paste in the same
`MainActivity` source, drop `index.html` into `assets/`, build.

### To rebuild the iOS app

`JapanTour2026-iOS/` is a complete Xcode project. On another Mac with
Xcode:

1. Open `JapanTour2026.xcodeproj`.
2. Select the **JapanTour2026** target → **Signing & Capabilities** →
   pick your Apple ID under Team. Change the bundle identifier
   (`com.jianchen.JapanTour2026`) to something under the new account if
   it conflicts.
3. Connect an iPhone, select it as the run destination, press Run.
4. On the iPhone, first run shows "Untrusted Developer". Trust it under
   Settings → General → VPN & Device Management.

Free Apple ID signing lasts 7 days. Paid Apple Developer Program ($99/yr)
extends to 1 year and unlocks TestFlight for wider distribution.

## What's deployed and where

| Channel | Status | Notes |
|---|---|---|
| GitHub Release v1.0 (Android) | Live | Public download link, see Releases section above |
| Android (Pixel 4 "John C") | Installed | Manually pushed via `adb` / Device Explorer |
| iOS (iPhone XR "John C") | Installed | Built and run from Xcode, free-signed, expires 7 days |
| iOS distribution to others | Not done | Would need TestFlight (paid Apple Dev) or PWA route |
| PWA / hosted | Not done | Discussed; not deployed. See "Open decisions". |
| Backend (chat / sync) | Not done | Discussed; not built. See "Open decisions". |

## Open decisions — discussed but not built

These came up in the build conversation and are deliberately left open.
Whoever picks this up should know they're on the table.

### iOS distribution beyond one device

The Xcode flow above works for one tester at a time. For broader rollout
two realistic paths:

- **Apple Developer Program** ($99/yr) → upload to **TestFlight** → invite
  up to 10,000 testers via a public link. The app then installs from
  Apple's servers, lasts 90 days per build. The "right" answer for a real
  tour group.
- **Hosted PWA** — host the existing HTML behind a real URL with a service
  worker for offline caching; iOS users add to Home Screen and get a
  pseudo-native app. No App Store, no expiry, works on Android too. Trade-off
  is that the page must be on the public web.

### Group chat / messaging

Several backends were sized for a 500-person tour:

- **Firebase** (Blaze plan, ~$50–$200 total for 14 days, hard budget cap)
- **Supabase Pro** ($25/mo flat, predictable)
- **Cloudflare Workers + Durable Objects** (~$10–$30 total, more code)
- **Stream Chat** (free Maker plan caps at 100 MAU — wouldn't fit)
- **Telegram Bot** (free, official API, can two-way mirror an actual chat —
  the only path that delivers the "messages appear in both app and group"
  experience that was originally asked of WhatsApp; WhatsApp itself does
  not allow this for personal accounts.)

Nothing was wired up; the app today has no chat or shared feed.

### Multi-platform single distribution

The cleanest "one URL for everyone" answer is a **hosted PWA** with a
service worker. It would unify Android and iOS distribution into one
add-to-Home-Screen link. The trade-off is that the itinerary content
becomes reachable on the open web (random URL helps but isn't private).

## Identifiers / accounts to know

| Item | Value |
|---|---|
| Bundle ID (iOS & Android) | `com.jianchen.JapanTour2026` (iOS) / `com.jianchen.japantour` (Android) |
| Apple ID used for iOS signing | `jian_chen_007@yahoo.com` |
| iOS development team | Personal Team (`2R9FTBNM4H`) |
| GitHub account | `jianchen-007` |
| GitHub repo | `jianchen-007/japan-tour-2026` |
| Connected iPhone | "John C", iPhone XR, iOS 18.7.6 |
| Connected Android | Google Pixel 4 |

## Picking up on another computer

Two reasonable handoff paths:

**A. Via GitHub (recommended).** Push this whole folder to the GitHub repo
that's already created. Anyone with access does `git clone` and has
everything. Steps from a Mac:

```sh
cd /path/to/handoff-bundle
git init
git remote add origin https://github.com/jianchen-007/japan-tour-2026.git
git fetch
git checkout main
# copy in the source files alongside the existing README
cp -R JapanTour2026-iOS JapanTour2026_TravelCompanion.html build_itinerary.py Japan_Tour_Itinerary_2026.xlsx HANDOFF.md .
git add . && git commit -m "Add full source and handoff doc"
git push
```

The new computer then needs: Xcode (for iOS), Android Studio (optional, for
Android), a text editor (for the HTML). And to do iOS signing, the user's
own Apple ID — not necessarily the same one used originally.

**B. Direct transfer.** Zip this folder, drop in Drive/Dropbox/iCloud, share
the link, the other computer downloads and unzips. No version control going
forward, but immediately usable.
