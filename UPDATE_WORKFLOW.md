# Update Workflow — where changes need to go

The app exists in a few places. When the app's content or features change, each
surface has to be refreshed. Here's the map so nothing falls out of sync.

## The surfaces

| Surface                        | File it uses        | How it updates                              |
| ------------------------------ | ------------------- | ------------------------------------------- |
| **Website (Firebase Hosting)** | `public/index.html` | Re-deploy: `firebase deploy --only hosting` |

## Two kinds of "change" — important distinction

**1. Announcements (day-to-day use): NO update needed.**
When a director posts an announcement, it goes through Firebase and appears for
everyone automatically — on the website and in the apps. You do **not** rebuild
or redeploy anything to send messages. This is the normal everyday use.

**2. The app itself changes** (itinerary edits, new features, fixes): the master
file changes, and then each surface must be refreshed:

- **Website:** re-run `firebase deploy --only hosting` (the `public/index.html`
  copy is kept in sync for you).

> Claude keeps the three file copies (master, `public/index.html`, iOS
> `index.html`) identical whenever it edits the app. Your job for an app change
> is the **publish** part: redeploy the website.

## Quick rule of thumb

- Sending a message → nothing to publish. ✅
- Changing the schedule or the app → ensure `public/index.html` is up to date, then re-deploy hosting.
