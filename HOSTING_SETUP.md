# Web Hosting Setup — Japan Tour 2026

This publishes the app to a public web link (e.g. `https://japan-tour-2026.web.app`)
so directors can post announcements from any Mac/PC browser, and anyone can open
the app on the web. Same Firebase project as messaging/notifications.

The hosting files are already prepared in this project:
- `firebase.json` — points hosting at the `public/` folder (and functions at
  `notifications/functions`)
- `.firebaserc` — sets the default project to `japan-tour-2026`
- `public/index.html` — the app (kept in sync with the main HTML)

## One-time: install the Firebase CLI

You need Node.js installed (https://nodejs.org, the "LTS" download). Then, in
**Terminal**:

```sh
npm install -g firebase-tools
firebase login
```
`firebase login` opens a browser — sign in with the same Google account that owns
the Firebase project.

## Deploy (and re-deploy after changes)

In Terminal, go to this project folder and deploy:

```sh
cd "/Users/kevin/2026 Japan App Project"
firebase deploy --only hosting
```

When it finishes it prints your URLs:
- `https://japan-tour-2026.web.app`
- `https://japan-tour-2026.firebaseapp.com`

Share either link. Directors open it → **Announcements → Director sign-in** → post.

## Updating later

Whenever the app changes, `public/index.html` must be refreshed and the site
re-deployed. Claude keeps `public/index.html` in sync with the main HTML
automatically; on your side you just re-run:

```sh
firebase deploy --only hosting
```

(See UPDATE_WORKFLOW.md for the full picture of which copies update where.)
