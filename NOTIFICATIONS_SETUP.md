# Push Notifications Setup — Japan Tour 2026

This adds **push notifications**: when a director posts an announcement in the
app, everyone subscribed to that channel (All / Band / Orchestra / Choir) gets a
notification on their phone — even when the app is closed.

**How it works:** director posts a message → it lands in Firestore → a small
Cloud Function fires → it sends the notification to the channel's FCM "topic" →
phones subscribed to that topic receive it. Each phone subscribes to topics
based on the traveler's group selection (the app handles this automatically
through the native shell).

> Prerequisite: finish **FIREBASE_SETUP.md** first (messaging must work before
> notifications can). You'll reuse the same Firebase project here.

This is the path that uses a **paid Apple Developer Program account ($99/yr)**,
which Apple requires for push on iPhones.

---

## Part A — Apple side (iPhone push) 🍎

### A1. Enroll in the Apple Developer Program
Go to https://developer.apple.com/programs/ and enroll ($99/year). Approval is
usually quick but can take a day or two. You need this for push entitlement and
for distributing to more than one device (TestFlight).

### A2. Create an APNs Auth Key
1. https://developer.apple.com/account → **Certificates, IDs & Profiles** → **Keys**.
2. Click **+**, name it `Japan Tour APNs`, tick **Apple Push Notifications service (APNs)**, **Continue → Register**.
3. **Download** the `.p8` file (you can only download it once — keep it safe).
4. Note the **Key ID** (shown on the key) and your **Team ID** (top-right of the
   developer account, or under Membership).

### A3. Give the key to Firebase
1. Firebase console → your project → **Project settings** (gear) → **Cloud Messaging** tab.
2. Under **Apple app configuration → APNs Authentication Key**, click **Upload**.
3. Upload the `.p8`, and enter the **Key ID** and **Team ID** from A2. Save.

---

## Part B — Firebase iOS app

### B1. Register the iOS app in Firebase
1. Firebase console → **Project settings → General → Your apps → Add app → iOS**.
2. **Apple bundle ID:** must match your Xcode bundle id exactly
   (e.g. `com.yourname.JapanTour2026`). Register.
3. **Download `GoogleService-Info.plist`** — you'll add it to Xcode in C2.

---

## Part C — Xcode changes (on your Mac)

### C1. Add the Firebase SDK
1. Open `JapanTour2026.xcodeproj`.
2. **File → Add Package Dependencies…**
3. Enter `https://github.com/firebase/firebase-ios-sdk`, **Add Package**.
4. When prompted for products, add **FirebaseMessaging** to the JapanTour2026
   target. (You can skip the others.)

### C2. Add the config file
Drag the `GoogleService-Info.plist` (from B1) into the Xcode project navigator,
inside the `JapanTour2026` folder. In the dialog, tick **Copy items if needed**
and make sure the **JapanTour2026** target is checked.

### C3. Turn on the capabilities
Select the **JapanTour2026** target → **Signing & Capabilities** →
**+ Capability**, and add:
- **Push Notifications**
- **Background Modes** → tick **Remote notifications**

(Signing must use your paid Apple Developer **Team** here, not a free personal team.)

### C4. Swap in the push-enabled app code
Replace the contents of `JapanTour2026/JapanTour2026App.swift` with the file
**`notifications/JapanTour2026App.swift`** included in this project. It keeps the
WebView app and adds the Firebase/APNs registration plus the JS bridge that
subscribes each device to its channel topics.

### C5. Build & run on a real iPhone
Push does **not** work on the Simulator — use a real device. Build and run, open
the app, go to the **Group** tab → **Enable notifications**, accept the prompt.

---

## Part D — The Cloud Function (auto-send on each message)

This makes every director message turn into a push automatically.

1. Install the Firebase CLI (one time):
   ```sh
   npm install -g firebase-tools
   firebase login
   ```
2. From the **project root** (this folder, which has `firebase.json`):
   ```sh
   firebase deploy --only functions
   ```
   The root `firebase.json` already points functions at `notifications/functions`
   (which has `index.js` and `package.json`).
3. Deploying Cloud Functions requires the **Blaze (pay-as-you-go)** plan. Set a
   low budget cap in the Google Cloud console for peace of mind — actual usage
   for this stays within the free monthly allowance.

> No-code alternative (no Cloud Function): directors can instead open Firebase
> console → **Messaging → Create campaign / Send test message**, and send to a
> topic (`all`, `band`, `orch`, or `choir`) by hand. The Cloud Function just
> automates this so the in-app message and the push are one action.

---

## Part E — Android (when you rebuild the APK)

The Android wrapper needs the same FCM wiring. In your Android Studio project:

1. Firebase console → add an **Android app** (use the APK's package id,
   `com.jianchen.japantour`), download **`google-services.json`** into
   `app/`.
2. In `build.gradle`: add the Google services plugin and
   `implementation 'com.google.firebase:firebase-messaging:24.0.0'`.
3. Add a JS bridge in `MainActivity` so the web app can call it:
   ```java
   webView.getSettings().setJavaScriptEnabled(true);
   webView.addJavascriptInterface(new JTNotify(this), "JTNotify");
   ```
   ```java
   public class JTNotify {
       Context ctx;
       JTNotify(Context c){ ctx = c; }
       @android.webkit.JavascriptInterface
       public void handle(String json) {
           try {
               org.json.JSONObject o = new org.json.JSONObject(json);
               String action = o.optString("action");
               if ("setTopics".equals(action)) {
                   org.json.JSONArray subs = o.optJSONArray("subscribe");
                   org.json.JSONArray all  = o.optJSONArray("all");
                   java.util.Set<String> want = new java.util.HashSet<>();
                   for (int i=0; i<subs.length(); i++) want.add(subs.getString(i));
                   for (int i=0; i<all.length(); i++) {
                       String t = all.getString(i);
                       if (want.contains(t))
                           com.google.firebase.messaging.FirebaseMessaging.getInstance().subscribeToTopic(t);
                       else
                           com.google.firebase.messaging.FirebaseMessaging.getInstance().unsubscribeFromTopic(t);
                   }
               }
               // "requestPermission": on Android 13+ request POST_NOTIFICATIONS at runtime.
           } catch (Exception e) { /* ignore */ }
       }
   }
   ```
4. On Android 13+ request the `POST_NOTIFICATIONS` runtime permission, and
   create a notification channel with id `announcements` (matches the Cloud
   Function payload).

The web app auto-detects either bridge (`window.webkit.messageHandlers.jtNotify`
on iOS, `window.JTNotify` on Android), so no further HTML changes are needed.

---

## Part F — Test it end to end

1. On a real phone with the rebuilt app: **Group** tab → pick your ensemble →
   **Enable notifications** → accept the prompt.
2. On another device, sign in as a director (Messages tab) and post to a
   channel the test phone belongs to (e.g. **Band** or **All**).
3. The test phone should get a banner within a few seconds, and the message also
   appears in the Messages tab.

### Troubleshooting
- **No push on iPhone:** must be a real device (not Simulator); the APNs key
  (A2/A3) must be uploaded; capabilities (C3) must be on; signing must use the
  paid team.
- **Message appears in-app but no push:** the Cloud Function isn't deployed
  (Part D) — the in-app message uses Firestore, the push needs the function.
- **Got the permission prompt but nothing arrives:** confirm the device
  subscribed to the topic (check the group selection) and that you posted to a
  matching channel.

---

## What's already done in the app
- The HTML/app already detects the native bridge and, whenever you pick or change
  your group, tells the shell which topics to subscribe to (All + your ensemble).
- The **Group → Enable notifications** button triggers the iOS/Android permission
  prompt through the bridge.
- Everything degrades gracefully: in a plain browser (or before this setup is
  done), the button simply notes that notifications work in the installed app,
  and nothing breaks.
