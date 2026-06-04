# Android project — config snippets

Use these when you scaffold the Android app in Android Studio (see BUILD_APPS.md
Part B). Package name: **`com.jianchen.japantour`**.

## 1. Project-level `build.gradle` (or `settings.gradle` plugins block)
Add the Google services plugin:
```gradle
plugins {
    id 'com.google.gms.google-services' version '4.4.2' apply false
}
```

## 2. App-level `app/build.gradle`
```gradle
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'   // add this
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:33.1.2')
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'androidx.core:core:1.13.1'
}
```

## 3. `AndroidManifest.xml`
Inside `<manifest>`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```
Make sure your `<activity android:name=".MainActivity">` is the launcher activity
(Android Studio's "Empty Views Activity" template sets this up for you).

## 4. Files to place
- `MainActivity.java` → `app/src/main/java/com/jianchen/japantour/MainActivity.java`
  (replace the generated one with the `android/MainActivity.java` from this project)
- `index.html` → `app/src/main/assets/index.html`
  (copy the latest app HTML here; create the `assets` folder if it doesn't exist)
- `google-services.json` → `app/` (downloaded from Firebase when you register the
  Android app)

## 5. Notes
- FCM auto-displays "notification" messages when the app is in the background or
  closed — which is the normal case for announcements — using the
  `announcements` channel created in `MainActivity`. No extra service is required
  for that. (If you also want banners while the app is open in the foreground,
  add a `FirebaseMessagingService`, but it's optional.)
- The web app auto-detects the `JTNotify` bridge, so no HTML changes are needed.
