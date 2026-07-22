/**
 * components/UniqueVisitorCard.tsx
 *
 * Admin Dashboard card that displays the live unique visitor count
 * with a real-time Firestore listener and a smooth animated counter.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToUniqueVisitors } from "@/firebase/analytics";

// ─── Animated number counter ────────────────────────────────────────────────

/**
 * Smoothly animates from `from` to `to` over `durationMs` milliseconds
 * using an ease-out cubic curve, calling `onTick` on every animation frame.
 */
function animateCounter(
  from: number,
  to: number,
  durationMs: number,
  onTick: (value: number) => void,
): () => void {
  const startTime = performance.now();
  let rafId: number;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    onTick(current);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  // Return a cancel function
  return () => cancelAnimationFrame(rafId);
}

// ─── SVG icon ───────────────────────────────────────────────────────────────

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
  </span>
);

// ─── Component ───────────────────────────────────────────────────────────────

interface UniqueVisitorCardProps {
  /** Animation duration in ms (default: 1500) */
  animationDuration?: number;
}

export default function UniqueVisitorCard({
  animationDuration = 1500,
}: UniqueVisitorCardProps) {
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [firestoreCount, setFirestoreCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track the previous Firestore value to animate FROM
  const prevCountRef = useRef<number>(0);
  const cancelAnimRef = useRef<(() => void) | null>(null);

  // ── Subscribe to Firestore real-time updates ───────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToUniqueVisitors(
      (count) => {
        setFirestoreCount(count);
        setIsLoading(false);
        setError(null);
      },
      () => {
        setError("Unable to load visitor data.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ── Animate counter whenever firestoreCount changes ───────────────────
  useEffect(() => {
    if (firestoreCount === null) return;

    // Cancel any in-progress animation
    if (cancelAnimRef.current) {
      cancelAnimRef.current();
    }

    const from = prevCountRef.current;
    const to = firestoreCount;

    // Kick off the animation
    cancelAnimRef.current = animateCounter(
      from,
      to,
      animationDuration,
      setDisplayCount,
    );

    prevCountRef.current = to;

    return () => {
      if (cancelAnimRef.current) cancelAnimRef.current();
    };
  }, [firestoreCount, animationDuration]);

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div
      id="unique-visitor-card"
      className="rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 p-6 shadow-sm"
      role="region"
      aria-label="Unique Visitors Statistics"
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <UsersIcon />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold">
              Website Analytics
            </p>
            <h2 className="text-sm font-semibold text-slate-800 mt-0.5">
              Unique Visitors
            </h2>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <LiveDot />
          <span className="text-xs font-semibold text-emerald-700">
            LIVE
          </span>
        </div>
      </div>

      {/* Main count */}
      <div className="mb-4">
        {isLoading ? (
          /* Skeleton loader */
          <div className="h-14 w-40 rounded-xl bg-slate-100 animate-pulse" />
        ) : error ? (
          <div className="flex items-center gap-2 text-rose-500">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <p
            className="text-5xl font-black text-slate-900 tabular-nums leading-none"
            aria-live="polite"
            aria-label={`${displayCount.toLocaleString()} unique visitors`}
          >
            {displayCount.toLocaleString()}
          </p>
        )}
      </div>

      {/* Sub-label */}
      {!isLoading && !error && (
        <div className="flex items-center gap-2">


        </div>
      )}
    </div>
  );
}
