/**
 * hooks/useVisitorTracking.ts
 *
 * Encapsulates all unique-visitor tracking logic:
 *  1. Retrieves (or generates) a persistent UUID from Local Storage.
 *  2. Starts a 30-second engagement timer on mount.
 *  3. After 30 seconds, fires a Firestore transaction to count the visitor.
 *  4. Cancels the timer if the component unmounts before 30 seconds.
 *
 * Usage: call `useVisitorTracking()` once inside a "use client" component
 * that is mounted for the full duration of the visitor's session.
 */

"use client";

import { useEffect } from "react";
import {
  getOrCreateVisitorId,
  recordUniqueVisitor,
} from "@/firebase/analytics";

/** Duration (ms) a visitor must remain before being counted. (Set to 10s) */
const ENGAGEMENT_THRESHOLD_MS = 10_000;

export function useVisitorTracking(): void {
  useEffect(() => {
    // Retrieve or create a stable visitor UUID
    const visitorId = getOrCreateVisitorId();
    console.log("[Analytics] Visitor ID:", visitorId, "- waiting 5s to record...");

    // Start the engagement timer
    const timerId = window.setTimeout(async () => {
      console.log("[Analytics] 5s elapsed, attempting to record visitor...");
      await recordUniqueVisitor(visitorId);
      console.log("[Analytics] recordUniqueVisitor completed.");
    }, ENGAGEMENT_THRESHOLD_MS);

    // Cancel if the visitor leaves before the threshold
    return () => {
      window.clearTimeout(timerId);
    };
  }, []); // Run only once per page load
}
