package com.adititripathi.redthread;

import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.webkit.ServiceWorkerController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String CACHE_PREFERENCES = "red_thread_web_cache";
    private static final String CACHE_VERSION = "2.0.0";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences preferences = getSharedPreferences(CACHE_PREFERENCES, MODE_PRIVATE);
        if (CACHE_VERSION.equals(preferences.getString("version", "")) || getBridge() == null) {
            return;
        }

        WebView webView = getBridge().getWebView();
        webView.clearCache(true);
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ServiceWorkerController.getInstance().getServiceWorkerWebSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        }

        preferences.edit().putString("version", CACHE_VERSION).apply();
    }
}
