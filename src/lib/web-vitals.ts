"use client";

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

export function registerWebVitals() {
  // Collect Core Web Vitals and send to monitoring service
  // Vercel automatically collects these via their Analytics integration
  // This function provides additional logging for local development

  const sendMetric = (metric: any) => {
    // Log to console in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Web Vitals] ${metric.name}: ${Math.round(metric.value)}${metric.name === "CLS" ? "" : "ms"}`,
      );
    }

    // Send to analytics service if available
    // Vercel Web Analytics endpoint (automatic)
    if (typeof window !== "undefined" && (window as any).__webVitalsTracked) {
      (window as any).__webVitalsTracked(metric);
    }

    // Optional: Send to custom analytics endpoint
    // Example: POST /api/analytics with metric data
    // if (metric.rating === "poor" || metric.rating === "needs-improvement") {
    //   navigator.sendBeacon("/api/analytics", JSON.stringify(metric));
    // }
  };

  try {
    onCLS(sendMetric); // Cumulative Layout Shift
    onFCP(sendMetric); // First Contentful Paint
    onINP(sendMetric); // Interaction to Next Paint (replaces FID)
    onLCP(sendMetric); // Largest Contentful Paint
    onTTFB(sendMetric); // Time to First Byte
  } catch (error) {
    // Silently fail if Web Vitals can't be collected
    // (e.g., in browsers that don't support certain APIs)
    if (process.env.NODE_ENV === "development") {
      console.warn("Web Vitals collection error:", error);
    }
  }
}
