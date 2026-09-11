"use client";

import { useEffect } from "react";
import { registerWebVitals } from "@/lib/web-vitals";

export function WebVitalsTracker() {
  useEffect(() => {
    registerWebVitals();
  }, []);

  return null;
}

export default WebVitalsTracker;
