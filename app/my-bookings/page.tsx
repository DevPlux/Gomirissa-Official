"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Booking, getUserBookings } from "@/firebase/booking";
import { Button } from "@/components/ui/button";

function formatBookingDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "completed":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setBookings([]);
        setPageLoading(false);
        return;
      }

      try {
        const results = await getUserBookings(user.uid);
        setBookings(results);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setPageLoading(false);
      }
    }

    if (!loading) {
      loadBookings();
    }
  }, [user, loading]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-8">
            <p className="text-slate-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              My Bookings
            </h1>
            <p className="text-slate-600 mb-6">
              Please sign in to view your bookings.
            </p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-blue-600 font-bold mb-2">
            Account
          </p>
          <h1 className="text-4xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-600 mt-2">
            View your submitted tour booking requests.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No bookings yet
            </h2>
            <p className="text-slate-600 mb-6">
              You haven’t placed any booking requests yet.
            </p>
            <Link href="/">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
                Explore Tours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {booking.tourTitle}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.14em] ${getStatusClasses(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Date:
                        </span>{" "}
                        {formatBookingDate(booking.bookingDate)}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Time:
                        </span>{" "}
                        {booking.timeSlot}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Guests:
                        </span>{" "}
                        {booking.guestCount}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Contact:
                        </span>{" "}
                        {booking.userPhone}
                      </p>

                      {booking.fishingMethod && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Fishing Method:
                          </span>{" "}
                          {booking.fishingMethod}
                        </p>
                      )}

                      {booking.snorkelCamera && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Camera Option:
                          </span>{" "}
                          {booking.snorkelCamera}
                        </p>
                      )}
                    </div>

                    {booking.specialNotes && (
                      <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-500 mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-slate-700">
                          {booking.specialNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="md:text-right min-w-[180px]">
                    <p className="text-sm text-slate-500 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${booking.totalPrice}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {booking.priceBreakdown}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
