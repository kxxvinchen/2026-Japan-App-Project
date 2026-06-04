//
//  JapanTour2026App.swift
//  Japan Tour 2026 — Travel Companion
//
//  A native iOS app that hosts the travel-companion web app in a
//  full-screen WKWebView. The HTML/JS/CSS lives in index.html, which
//  is bundled as an app resource and loaded locally (works offline).
//

import SwiftUI
import WebKit
import UIKit

@main
struct JapanTour2026App: App {
    var body: some Scene {
        WindowGroup {
            WebView()
                .ignoresSafeArea()
        }
    }
}

/// Wraps a WKWebView so it can be used as a SwiftUI view.
struct WebView: UIViewRepresentable {

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.scrollView.bounces = false
        webView.isOpaque = true

        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    /// Keeps in-app pages inside the web view, but sends external
    /// http/https links (e.g. the Google Maps links) out to Safari.
    final class Coordinator: NSObject, WKNavigationDelegate {
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
    }
}
