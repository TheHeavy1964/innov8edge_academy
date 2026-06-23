"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Mock analytics function - replace with actual GA4 or PostHog call
const trackPageView = (url: string) => {
  if (process.env.NODE_ENV === "production") {
    console.log(`[Analytics] Page View: ${url}`);
    // Example: window.gtag('config', 'G-XXXXXXX', { page_path: url });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, properties);
  // Example: window.gtag('event', eventName, properties);
  // Example: posthog.capture(eventName, properties);
};

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
