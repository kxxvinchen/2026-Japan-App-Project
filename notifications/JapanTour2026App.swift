//
//  JapanTour2026App.swift  —  PUSH-ENABLED version
//  Japan Tour 2026 — Travel Companion
//
//  This replaces JapanTour2026-iOS/JapanTour2026/JapanTour2026App.swift once you
//  have completed the Firebase + Apple Push setup (see NOTIFICATIONS_SETUP.md).
//  It keeps the offline WebView app and ADDS:
//    • Firebase Cloud Messaging + Apple Push (APNs) registration
//    • A JS bridge so the web app's channel selection drives FCM topic
//      subscriptions (topics: all / band / orch / choir)
//
//  Requires (see the guide): Firebase iOS SDK via Swift Package Manager
//  (FirebaseMessaging), a GoogleService-Info.plist added to the target, and the
//  "Push Notifications" + "Background Modes → Remote notifications" capabilities.
//

import SwiftUI
import WebKit
import UIKit
import UserNotifications
import FirebaseCore
import FirebaseMessaging

@main
struct JapanTour2026App: App {
    // Bridges UIKit app-delegate callbacks (push) into the SwiftUI lifecycle.
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene {
        WindowGroup {
            WebView().ignoresSafeArea()
        }
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate, MessagingDelegate, UNUserNotificationCenterDelegate {
    static var shared: AppDelegate?
    /// Topics the web app has asked this device to be subscribed to.
    private var desiredTopics: Set<String> = []

    func application(_ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        AppDelegate.shared = self
        FirebaseApp.configure()
        Messaging.messaging().delegate = self
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    /// Called from the web app ("Enable notifications").
    func requestPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            DispatchQueue.main.async {
                if granted { UIApplication.shared.registerForRemoteNotifications() }
            }
        }
    }

    func application(_ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    /// FCM registration token is ready — (re)apply pending topic subscriptions.
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        applyTopics()
    }

    /// subscribe = topics this device wants; all = the full set, so we can
    /// unsubscribe from any the user no longer belongs to.
    func setTopics(subscribe: [String], all: [String]) {
        desiredTopics = Set(subscribe)
        for topic in Set(all).subtracting(desiredTopics) {
            Messaging.messaging().unsubscribe(fromTopic: topic)
        }
        applyTopics()
    }
    private func applyTopics() {
        for topic in desiredTopics { Messaging.messaging().subscribe(toTopic: topic) }
    }

    /// Show the banner even when the app is in the foreground.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }
}

/// Wraps a WKWebView, loads the bundled index.html, forwards external links to
/// Safari, and exposes the "jtNotify" message handler to the web app.
struct WebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let controller = WKUserContentController()
        controller.add(context.coordinator, name: "jtNotify")
        config.userContentController = controller

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.bounces = false
        webView.isOpaque = true

        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        // Keep in-app pages inside the web view; send http/https links to Safari.
        func webView(_ webView: WKWebView,
                     decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url,
               let scheme = url.scheme?.lowercased(),
               scheme == "http" || scheme == "https" {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }
            decisionHandler(.allow)
        }

        // Receive { action, subscribe, all } messages from the web app.
        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let action = body["action"] as? String else { return }
            switch action {
            case "requestPermission":
                AppDelegate.shared?.requestPermission()
            case "setTopics":
                let subscribe = body["subscribe"] as? [String] ?? []
                let all = body["all"] as? [String] ?? []
                AppDelegate.shared?.setTopics(subscribe: subscribe, all: all)
            default:
                break
            }
        }
    }
}
