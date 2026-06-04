# PWA + Web Push Setup — Japan Tour 2026

This makes the hosted app **installable** (Add to Home Screen), **offline-ready**,
and able to send **push notifications** via Firebase — no App Store, no native
build, one link for everyone.

The app code is done. Four things remain, all in your Firebase console / Terminal.

---

## 1. Generate the Web Push (VAPID) key  🙋 give this to Claude
Firebase console → **Project settings** (gear) → **Cloud Messaging** tab →
**Web configuration** → under **Web Push certificates**, click **Generate key
pair**. Copy the key string (starts with `B...`).

**Send that key to Claude** — it goes into `WEB_PUSH_VAPID_KEY` in the app. Web
push won't work until this is filled in.

## 2. Update the Firestore security rules
The app now stores each web device's push token in a `webTokens` collection.
Firestore → **Rules** → replace everything with this and **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isDirector() {
      return request.auth != null
        && request.auth.token.email != null
        && exists(/databases/$(database)/documents/directors/$(request.auth.token.email));
    }

    match /messages/{id} {
      allow read: if true;
      allow create: if isDirector()
        && request.resource.data.channel in ['all','band','orch','choir']
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 2000;
      allow update, delete: if isDirector();
    }

    match /directors/{email} {
      allow get: if request.auth != null && request.auth.token.email == email;
      allow list, write: if false;
    }

    match /webTokens/{id} {
      allow read, list: if false;
      allow create, update: if request.resource.data.channels is list
        && request.resource.data.channels.size() <= 8
        && request.resource.data.token is string
        && request.resource.data.token.size() < 1000;
      allow delete: if false;
    }
  }
}
```

## 3. Turn on Blaze + deploy the push function
Sending push requires a tiny server function, which needs the **Blaze**
(pay-as-you-go) plan. In the console, **Upgrade** the project to Blaze and set a
low **budget cap** (a few dollars) — real usage stays in the free tier.

Then, from the project folder in Terminal:
```sh
firebase deploy --only functions
```

## 4. Re-deploy the website (it includes the new PWA files)
```sh
firebase deploy --only hosting
```
This publishes the manifest, icons, service worker, and updated app.

---

## How people install & turn on notifications

Share **https://japan-tour-2026.web.app**. Then:

- **iPhone (Safari, iOS 16.4+):** open the link → tap the **Share** button →
  **Add to Home Screen** → open the app from the new icon → **Group tab → Enable
  notifications** → Allow.
  *(On iPhone, notifications only work after Add to Home Screen — that's an Apple
  rule for web apps.)*
- **Android (Chrome):** open the link → "Install app" / "Add to Home screen" when
  prompted (or from the ⋮ menu) → open it → **Group tab → Enable notifications**.
- **Any computer:** just open the link; directors can sign in and post from there.

## Test
1. Install on a phone and enable notifications (as above), pick your ensemble.
2. On another device, open the link, sign in as a director, post to that channel.
3. The phone gets a push notification, and the announcement shows in-app.

## Notes
- **Offline:** once opened, the app works with no signal (cached). New
  announcements sync when back online.
- **Updates:** when the app changes, just re-run `firebase deploy --only hosting`
  — everyone gets the new version next time they open it. No rebuild, no store.
- **Older iPhones (below iOS 16.4):** can use the app but can't receive web push.
