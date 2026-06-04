# Messaging Setup (Firebase) — Japan Tour 2026

The app's **Messages** tab lets directors broadcast announcements to students on
channels (Band, Orchestra, Choir, All). Students only read; only director
accounts can post. This is powered by a free Firebase project that you create
once. Until you do the steps below, the Messages tab politely shows
"Messaging isn't set up yet" and the rest of the app works normally.

You'll do everything in your own Google account. The only thing you paste back
into the app is the project's web config (safe to ship — security is enforced
by the rules in Step 4).

---

## Step 1 — Create the Firebase project (5 min)

1. Go to https://console.firebase.google.com and click **Create a project**.
2. Name it e.g. `japan-tour-2026`. You can disable Google Analytics.
3. When it's ready, click the project to open it.

## Step 2 — Add a Web App and copy the config

1. On the project overview, click the **web icon** (`</>`) — "Add app".
2. Nickname it `Japan Tour Web`, click **Register app**.
3. You'll see a `firebaseConfig` object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza…",
     authDomain: "japan-tour-2026.firebaseapp.com",
     projectId: "japan-tour-2026",
     storageBucket: "japan-tour-2026.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```
4. Copy those six values. (You'll paste them in Step 6.)

## Step 3 — Turn on Firestore

1. Left menu → **Build → Firestore Database** → **Create database**.
2. Choose **Production mode** (we'll set rules next), pick a location near
   California (e.g. `us-west1`), and create.

## Step 4 — Paste the security rules

In Firestore → **Rules** tab, replace everything with the block below and click
**Publish**. This makes messages public to read, but only authorized director
accounts can post.

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
  }
}
```

## Step 5 — Add directors

**5a. Enable email sign-in:** Left menu → **Build → Authentication** →
**Get started** → **Sign-in method** → enable **Email/Password** → Save.

**5b. Create each director's account:** Authentication → **Users** →
**Add user** → enter the director's email and a password → Add user.
Repeat for every director. Give each director their email + password.

**5c. Authorize each director:** Firestore → **Data** tab →
**Start collection** → Collection ID: `directors`. For the first document,
set **Document ID** to the director's email **exactly as entered in 5b**
(use lowercase to be safe), leave fields empty (or add `name`), and Save.
Add one document per director (same `directors` collection).

> Only emails that have BOTH an Auth account (5b) and a `directors` document
> (5c) can post. To revoke someone, delete their `directors` document.

## Step 6 — Connect the app

1. Open `JapanTour2026_TravelCompanion.html` in a text editor.
2. Find `const FIREBASE_CONFIG={` near the top of the `<script>` block.
3. Paste your six values from Step 2 between the quotes:
   ```js
   const FIREBASE_CONFIG={
     apiKey:"AIza…", authDomain:"japan-tour-2026.firebaseapp.com",
     projectId:"japan-tour-2026", appId:"1:1234567890:web:abc123",
     messagingSenderId:"1234567890", storageBucket:"japan-tour-2026.appspot.com"
   };
   ```
4. Save. Then copy this file over `JapanTour2026-iOS/JapanTour2026/index.html`
   and rebuild the iOS/Android apps (or just open the HTML to test in a browser).

## Step 7 — Test

1. Open the app, go to the **Messages** tab.
2. Tap **Director sign-in**, sign in with a director email/password.
3. The "Post an announcement" box appears. Pick a channel, type a message,
   **Send to students**.
4. On another device (or as a student with no sign-in), the message appears in
   the Messages tab, filtered to its channel.

---

## Notes

- **Cost:** Firebase's free (Spark) tier easily covers ~500 readers for two
  weeks. If you want a safety margin, upgrade to Blaze (pay-as-you-go) and set a
  budget cap of a few dollars — realistic usage stays in the free allowance.
- **Offline:** the app caches the latest messages on each device, so students
  can re-read announcements with no signal. New messages sync when back online.
- **Push notifications** (separate feature) will use this same Firebase project
  (Cloud Messaging), so this setup is a prerequisite for that too.
- The `apiKey` is **not** a secret — it only identifies the project. All write
  protection comes from the rules in Step 4.
