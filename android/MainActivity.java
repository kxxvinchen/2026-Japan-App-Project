package com.jianchen.japantour;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import com.google.firebase.messaging.FirebaseMessaging;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.HashSet;
import java.util.Set;

/**
 * WebView host for the Japan Tour 2026 app.
 * - Loads the bundled web app from assets/index.html (works offline).
 * - Sends http/https links to the system browser.
 * - Exposes a "JTNotify" bridge so the web app can request notification
 *   permission and subscribe to FCM topics (all / band / orch / choir).
 */
public class MainActivity extends AppCompatActivity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);

        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true); // localStorage for the app's saved data
        web.addJavascriptInterface(new JTNotify(), "JTNotify");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    return true;
                }
                return false;
            }
        });

        createChannel();
        web.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            android.app.NotificationChannel ch = new android.app.NotificationChannel(
                    "announcements", "Announcements",
                    android.app.NotificationManager.IMPORTANCE_HIGH);
            android.app.NotificationManager nm = getSystemService(android.app.NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    /** Bridge object the web app calls via window.JTNotify.handle(jsonString). */
    public class JTNotify {
        @JavascriptInterface
        public void handle(String json) {
            try {
                final JSONObject o = new JSONObject(json);
                final String action = o.optString("action");
                if ("requestPermission".equals(action)) {
                    runOnUiThread(() -> {
                        if (Build.VERSION.SDK_INT >= 33) {
                            ActivityCompat.requestPermissions(MainActivity.this,
                                    new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1);
                        }
                    });
                } else if ("setTopics".equals(action)) {
                    JSONArray subs = o.optJSONArray("subscribe");
                    JSONArray all = o.optJSONArray("all");
                    Set<String> want = new HashSet<>();
                    if (subs != null) for (int i = 0; i < subs.length(); i++) want.add(subs.getString(i));
                    if (all != null) for (int i = 0; i < all.length(); i++) {
                        String t = all.getString(i);
                        if (want.contains(t)) FirebaseMessaging.getInstance().subscribeToTopic(t);
                        else FirebaseMessaging.getInstance().unsubscribeFromTopic(t);
                    }
                }
            } catch (Exception e) {
                // ignore malformed bridge messages
            }
        }
    }
}
