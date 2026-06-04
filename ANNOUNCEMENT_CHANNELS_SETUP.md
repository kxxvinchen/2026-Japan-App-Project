# Announcement Channels + Chaperones — setup update

The Announcements tab now has **subtabs**:

- **Travelers:** Band, Orchestra, Choir, Shadow — each person sees only the
  subtab(s) for the group they picked in the Group tab.
- **Chaperones:** Band Chaperone, Orchestra Chaperone, Choir Chaperone —
  **truly private**: only a chaperone you give a login to (and assign) can open
  them. Students cannot see them.
- **Directors:** once signed in, see and can post to **every** channel,
  including the chaperone ones.

Three one-time updates in the Firebase console / Terminal:

---

## 1. Replace the Firestore security rules

Firestore → **Rules** → replace everything with this → **Publish**:

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
    function canRead(ch) {
      return ch in ['band','orch','choir','shadow'] || isDirector() || isChaperoneFor(ch);
    }

    match /channels/{ch}/messages/{id} {
      allow read: if canRead(ch);
      allow create: if isDirector()
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 2000;
      allow update, delete: if isDirector();
    }

    match /directors/{email} {
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
        && (request.resource.data.channels.hasOnly(['band','orch','choir','shadow']) || request.auth != null);
      allow delete: if false;
    }
  }
}
```

What this does: the 4 traveler channels are readable by anyone (privacy by
group sign-up in the app); the 3 chaperone channels are readable only by an
assigned chaperone or any director; only directors can post anywhere.

> Note: this changes where messages are stored (now `channels/<id>/messages`).
> Any test messages from before live in the old `messages` collection and simply
> won't show — that's fine, just post fresh ones.

## 2. Add your chaperones

Just like directors, each chaperone needs a login **and** an assignment.

**a. Create the login:** Authentication → **Users** → **Add user** → email +
password for the chaperone. Give them those credentials.

**b. Assign their channel:** Firestore → **Data** → open (or start) the
`chaperones` collection → **Add document**:
- **Document ID:** the chaperone's email (exactly as in step a, lowercase).
- Add a field named **`channels`**, type **array**, and add the channel id(s)
  they should see: one or more of `band-chap`, `orch-chap`, `choir-chap`.
  (Example: a choir chaperone → array with one value `choir-chap`.)
- Save.

Repeat per chaperone. To revoke someone, delete their `chaperones` document.

(Directors are unchanged — they're still in the `directors` collection and now
automatically see all channels, including chaperone ones.)

## 3. Redeploy the function and the site

From the project root in Terminal:
```sh
firebase deploy --only functions
```
```sh
firebase deploy --only hosting
```

(The function now fires per channel and pushes to that channel's subscribers.)

---

## How people use it
- **Travelers:** open the app → Group tab → pick their group → the matching
  subtab(s) appear under Announcements.
- **Chaperones:** Announcements tab → **Director / chaperone sign-in** → sign in
  → their private chaperone subtab appears.
- **Directors:** Announcements tab → sign in → all subtabs appear, plus a
  Channel picker in the compose box to post to any of them.
