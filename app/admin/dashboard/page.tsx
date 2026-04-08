"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  Booking,
  BookingStatus,
  getAllBookings,
  PaymentStatus,
  updateBookingAdminFields,
} from "@/firebase/booking";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";

import bgImage from "@/public/images/sea bg9.jpg";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

function formatBookingDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCreatedAt(createdAt?: { seconds?: number }) {
  if (!createdAt?.seconds) return "—";
  const date = new Date(createdAt.seconds * 1000);
  return date.toLocaleString();
}

function getStatusClasses(status: BookingStatus) {
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

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "refunded":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl bg-white/90 backdrop-blur-sm text-black font-semibold"
      >
        Previous
      </Button>

      {getPageNumbers().map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`rounded-xl min-w-[40px] ${
              currentPage === page
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/90 backdrop-blur-sm hover:border-blue-500 hover:text-blue-600 text-black"
            }`}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl bg-white/90 backdrop-blur-sm text-black font-semibold"
      >
        Next
      </Button>
    </div>
  );
};

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadBookings() {
      try {
        const results = await getAllBookings();
        setBookings(results);
      } catch (error) {
        console.error("Failed to load admin bookings:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load bookings",
          text: "Could not fetch bookings from Firestore.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setPageLoading(false);
      }
    }

    if (!loading && user?.role === "admin") {
      loadBookings();
    } else if (!loading) {
      setPageLoading(false);
    }
  }, [loading, user]);

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const refreshBookings = async () => {
    const results = await getAllBookings();
    setBookings(results);
  };

  const handleUpdateBooking = async (
    bookingId: string,
    data: Partial<Pick<Booking, "status" | "paymentStatus">>,
    successText: string,
  ) => {
    try {
      setUpdatingId(bookingId);
      await updateBookingAdminFields(bookingId, data);
      await refreshBookings();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: successText,
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Admin booking update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Could not update the booking.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
        <Navbar />
        <div className="relative pt-32 max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-8">
            <p className="text-slate-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
        <Navbar />
        <div className="relative pt-32 max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Access Denied
            </h1>
            <p className="text-slate-600">
              Only admin users can access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const paidCount = bookings.filter((b) => b.paymentStatus === "paid").length;

  return (
    <div className={`relative min-h-screen ${inter.className}`}>
      {/* Background Image using Next.js Image component */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      <Navbar />

      <main className="relative pt-32 pb-16 max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-blue-600 font-bold mb-2">
            Admin Panel
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            Booking Management
          </h1>
          <p className="text-slate-600 mt-2">
            Review booking requests, confirm after payment, and manage statuses.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-900">
              {bookings.length}
            </p>
          </div>
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">
              {confirmedCount}
            </p>
          </div>
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Paid</p>
            <p className="text-3xl font-bold text-emerald-600">{paidCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-3">
          {(
            ["all", "pending", "confirmed", "cancelled", "completed"] as const
          ).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                statusFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Results info */}
        {filteredBookings.length > 0 && (
          <div className="mb-4 text-sm text-slate-500">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </div>
        )}

        {/* Booking Cards */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No bookings found
            </h2>
            <p className="text-slate-600">
              There are no bookings for the selected filter.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {currentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-sm border border-slate-200 p-6"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
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

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.14em] ${getPaymentClasses(
                            booking.paymentStatus,
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-900">
                            Customer:
                          </span>{" "}
                          {booking.userName || "—"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Email:
                          </span>{" "}
                          {booking.userEmail || "—"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Phone:
                          </span>{" "}
                          {booking.userPhone}
                        </p>
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
                            Price:
                          </span>{" "}
                          ${booking.totalPrice}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Submitted:
                          </span>{" "}
                          {formatCreatedAt(booking.createdAt)}
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

                      <div className="mt-4 rounded-2xl bg-slate-50/90 backdrop-blur-sm border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-500 mb-1">
                          Price Breakdown
                        </p>
                        <p className="text-sm text-slate-700">
                          {booking.priceBreakdown}
                        </p>
                      </div>

                      {booking.specialNotes && (
                        <div className="mt-4 rounded-2xl bg-slate-50/90 backdrop-blur-sm border border-slate-200 p-4">
                          <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-500 mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-slate-700">
                            {booking.specialNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="xl:w-[280px] shrink-0 space-y-3">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleUpdateBooking(
                            booking.id,
                            { status: "confirmed", paymentStatus: "paid" },
                            "Booking marked as confirmed and paid.",
                          )
                        }
                      >
                        Confirm Booking
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-white/90 backdrop-blur-sm rounded-xl"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleUpdateBooking(
                            booking.id,
                            { paymentStatus: "paid" },
                            "Payment status marked as paid.",
                          )
                        }
                      >
                        Mark as Paid
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-white/90 backdrop-blur-sm rounded-xl"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleUpdateBooking(
                            booking.id,
                            { status: "completed" },
                            "Booking marked as completed.",
                          )
                        }
                      >
                        Mark Completed
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-white/90 backdrop-blur-sm rounded-xl"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleUpdateBooking(
                            booking.id,
                            { status: "cancelled" },
                            "Booking marked as cancelled.",
                          )
                        }
                      >
                        Cancel Booking
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 bg-white/90 backdrop-blur-sm rounded-xl"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleUpdateBooking(
                            booking.id,
                            { paymentStatus: "refunded", status: "cancelled" },
                            "Booking marked as refunded and cancelled.",
                          )
                        }
                      >
                        Refund & Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
