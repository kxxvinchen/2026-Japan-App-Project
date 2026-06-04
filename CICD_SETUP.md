# Auto-deploy (CI/CD) — one-time setup

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is in place. On every push to the
`main` branch it will:

1. rebuild `index.html` + `sw.js` from the `src/` files (`node build.mjs`), then
2. deploy to Firebase Hosting (the live site).

It needs one secret so GitHub is allowed to deploy to your Firebase project. Do this once:

## 1. Create a Firebase deploy key

1. Go to the [Firebase console](https://console.firebase.google.com/) → your **japan-tour-2026** project.
2. Click the gear → **Project settings** → **Service accounts** tab.
3. Click **Generate new private key** → **Generate key**. A `.json` file downloads. Open it in a
   text editor and copy **all** of its contents.

## 2. Add it to GitHub as a secret

1. Open your repo on github.com → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `FIREBASE_SERVICE_ACCOUNT`  (exactly this).
4. Value: paste the entire JSON you copied.
5. **Add secret**.

## 3. Done

Push any change to `main` and watch the **Actions** tab on GitHub — you'll see the build + deploy
run, and the live site updates automatically. You no longer need to run `firebase deploy` by hand.

You can also trigger it manually: GitHub → **Actions** → **Deploy to Firebase Hosting** → **Run workflow**.

### Notes
- Delete the downloaded `.json` key from your computer after pasting it — it's now stored safely as a
  GitHub secret.
- This deploys **hosting** only (same as `firebase deploy --only hosting`). Cloud Functions still
  deploy manually with `firebase deploy --only functions` when they change.
- Alternative auto-setup: `firebase init hosting:github` does the service-account + secret for you,
  but it writes its own workflow file. If you use it, delete `.github/workflows/deploy.yml` first so
  you don't deploy twice.
