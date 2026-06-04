# Reminders — setup

Adds two kinds of automatic push reminders:

- **Concert reminders:** each ensemble's channel is pinged **1 hour before**
  their concert. The concert times are built into the function (the firm hall
  performance times) — nothing to enter.
- **Personal activity reminders:** when someone adds their own activity, they can
  pick a reminder (5/10/15/30/60 min before), delivered by push at that time —
  even if the app is closed. (They need notifications turned on.)

Both run off one scheduled Cloud Function that checks every 5 minutes.

## 1. Add the two new collections to your rules

Firestore → **Rules** → replace everything with this → **Publish** (it's the
previous rules plus `reminders` and `sentReminders`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isDirector() {
      return request.auth != null && request.auth.token.email != null
        && exists(/databases/$(database)/documents/directors/$(request.auth.token.email));
    }
    function isChaperoneFor(ch) {
      return request.auth != null && request.auth.token.email != null
        && exists(/databases/$(database)/documents/chaperones/$(request.auth.token.email))
        && get(/databases/$(database)/documents/chaperones/$(request.auth.token.email)).data.channels.hasAny([ch]);
    }
    function isAdmin() {
      return request.auth != null && request.auth.token.email != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    // admin = every channel EXCEPT the directors-only chat
    function adminCan(ch) {
      return isAdmin() && ch != 'directors';
    }
    function canRead(ch) {
      return ch in ['swesso','choir','swesso-shadow','choir-shadow'] || isDirector() || isChaperoneFor(ch) || adminCan(ch);
    }

    function isChapChannel(ch) {
      return ch in ['swesso-chap','choir-chap'];
    }

    match /channels/{ch}/messages/{id} {
      allow read: if canRead(ch);
      allow create: if ( isDirector() || adminCan(ch) || (isChapChannel(ch) && isChaperoneFor(ch)) )
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 2000;
      allow update, delete: if isDirector() || adminCan(ch) || (isChapChannel(ch) && isChaperoneFor(ch));
    }

    match /directors/{email} {
      allow get: if request.auth != null && request.auth.token.email == email;
      allow list, write: if false;
    }
    match /admins/{email} {
      allow get: if request.auth != null && request.auth.token.email == email;
      allow list, write: if false;
    }
    match /chaperones/{email} {
      allow get: if request.auth != null && request.auth.token.email == email;
      allow list, write: if false;
    }

    match /webTokens/{id} {
      allow read, list: if false;
      allow create, update: if request.resource.data.token is string
        && request.resource.data.token.size() < 1000
        && request.resource.data.channels is list
        && request.resource.data.channels.size() <= 10
        && (request.resource.data.channels.hasOnly(['swesso','choir','swesso-shadow','choir-shadow']) || request.auth != null);
      allow delete: if false;
    }

    match /reminders/{id} {
      allow read, list: if false;
      allow create, update: if request.resource.data.token is string
        && request.resource.data.token.size() < 1000
        && request.resource.data.fireAtMs is number
        && request.resource.data.title is string
        && request.resource.data.title.size() <= 200;
      allow delete: if true;
    }

    match /sentReminders/{id} {
      allow read, list, write: if false;
    }
  }
}
```

## 2. Redeploy the functions and the site

From the project root in Terminal:
```sh
firebase deploy --only functions
```
- This adds the new `sendReminders` scheduled function. On the first deploy it may
  ask to **enable the Cloud Scheduler API** — say **yes**.

```sh
firebase deploy --only hosting
```
- Publishes the app with the new reminder picker in "Add your own activity."

## Notes
- Personal reminders only work if the person has **turned on notifications**
  (Group tab → Enable notifications). If they pick a reminder without
  notifications on, the app tells them to enable it.
- Concert times are baked in from the performance schedule. If a concert time
  changes, tell me and I'll update the list in the function.
- Reminders fire within ~5 minutes of the target (the function checks every 5
  min), so a "30-minute" reminder arrives roughly 25–30 minutes before.
