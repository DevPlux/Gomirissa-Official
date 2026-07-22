/**
 * firebase/analytics.ts
 *
 * Unique Visitor Tracking — Firestore implementation.
 *
 * Firestore structure:
 *   analytics/website  { uniqueVisitors: number }
 *   visitors/{uuid}    { createdAt: Timestamp }
 */

import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase/config";

// ─── Collection / document paths ───────────────────────────────────────────
const ANALYTICS_DOC = doc(db, "analytics", "website");
const VISITORS_COL = collection(db, "visitors");

// ─── UUID helper ────────────────────────────────────────────────────────────

/**
 * Returns a v4-style UUID string using the Web Crypto API (or a fallback).
 */
function generateUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Local Storage ──────────────────────────────────────────────────────────

const VISITOR_ID_KEY = "visitorId";

/**
 * Retrieves the persisted visitor UUID from Local Storage.
 * If none exists, generates a new UUID, persists it, and returns it.
 *
 * NOTE: Must only be called in a browser context.
 */
export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const newId = generateUUID();
    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch {
    // Private browsing can throw on localStorage access — return a session UUID
    return generateUUID();
  }
}

// ─── Firestore initialisation ────────────────────────────────────────────────

/**
 * Ensures the analytics/website document exists in Firestore.
 * Runs only once; harmless to call multiple times (uses setDoc with merge).
 */
async function ensureAnalyticsDocument(): Promise<void> {
  const snap = await getDoc(ANALYTICS_DOC);
  if (!snap.exists()) {
    await setDoc(ANALYTICS_DOC, { uniqueVisitors: 0 });
  }
}

// ─── Counting transaction ───────────────────────────────────────────────────

/**
 * Attempts to count a unique visitor using a Firestore transaction.
 *
 * Inside the transaction:
 *  1. Check if visitors/{visitorId} already exists.
 *  2. If it does → exit without writing anything.
 *  3. If it doesn't → create the visitor document + atomically increment
 *     analytics/website.uniqueVisitors by 1.
 *
 * The transaction guarantees race-condition safety: even if two tabs fire
 * simultaneously, Firestore will only let one succeed and the other will see
 * the document already exists on retry.
 */
export async function recordUniqueVisitor(visitorId: string): Promise<void> {
  try {
    await ensureAnalyticsDocument();

    const visitorRef = doc(VISITORS_COL, visitorId);

    await runTransaction(db, async (transaction) => {
      const visitorSnap = await transaction.get(visitorRef);

      if (visitorSnap.exists()) {
        // Already counted — do nothing.
        return;
      }

      // Create visitor document
      transaction.set(visitorRef, {
        createdAt: serverTimestamp(),
      });

      // Atomically increment the counter
      transaction.update(ANALYTICS_DOC, {
        uniqueVisitors: increment(1),
      });
    });
  } catch (error) {
    // Graceful degradation — log but do not crash the page
    console.warn("[Analytics] Failed to record unique visitor:", error);
  }
}

// ─── Real-time listener ─────────────────────────────────────────────────────

/**
 * Subscribes to real-time updates of analytics/website.uniqueVisitors.
 *
 * @param onUpdate  Called with the latest count whenever Firestore updates.
 * @param onError   Called if the listener encounters an unrecoverable error.
 * @returns An unsubscribe function — call it on component unmount.
 */
export function subscribeToUniqueVisitors(
  onUpdate: (count: number) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    ANALYTICS_DOC,
    (snap) => {
      if (!snap.exists()) {
        onUpdate(0);
        return;
      }
      const data = snap.data();
      const count =
        typeof data?.uniqueVisitors === "number" ? data.uniqueVisitors : 0;
      onUpdate(count);
    },
    (error) => {
      console.warn("[Analytics] Real-time listener error:", error);
      onError?.(error);
    },
  );
}
