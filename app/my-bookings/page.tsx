"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Booking, getUserBookings } from "@/firebase/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Icons
const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TicketIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z" />
  </svg>
);

function formatBookingDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case "confirmed":
      return {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "✓",
        label: "Confirmed",
      };
    case "cancelled":
      return {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: "✗",
        label: "Cancelled",
      };
    case "completed":
      return {
        color: "bg-slate-200 text-slate-700 border-slate-300",
        icon: "★",
        label: "Completed",
      };
    default:
      return {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: "⏳",
        label: "Pending",
      };
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

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl"
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
                : "hover:border-blue-500 hover:text-blue-600"
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
        className="rounded-xl"
      >
        Next
      </Button>
    </div>
  );
};

// Filter Button Component
const FilterButton = ({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`rounded-full px-4 ${
      active
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-white hover:border-blue-500 hover:text-blue-600 text-slate-700"
    }`}
  >
    {label}
    {count !== undefined && (
      <span
        className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
          active ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        {count}
      </span>
    )}
  </Button>
);

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  // Apply filter whenever bookings or activeFilter changes
  useEffect(() => {
    let filtered = [...bookings];

    switch (activeFilter) {
      case "confirmed":
        filtered = bookings.filter((b) => b.status === "confirmed");
        break;
      case "pending":
        filtered = bookings.filter((b) => b.status === "pending");
        break;
      case "completed":
        filtered = bookings.filter((b) => b.status === "completed");
        break;
      case "cancelled":
        filtered = bookings.filter((b) => b.status === "cancelled");
        break;
      default:
        filtered = [...bookings];
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [bookings, activeFilter]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Get counts for each status
  const getStatusCount = (status: string) => {
    if (status === "all") return bookings.length;
    return bookings.filter((b) => b.status === status).length;
  };

  const handleExploreTours = () => {
    router.push("/#tours");
  };

  if (loading || pageLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg font-medium"
          >
            Loading Your Bookings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ${inter.className} font-sans`}
      >
        <Navbar />
        <div className="pt-32 max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="rounded-3xl bg-white shadow-xl border border-slate-200 p-12 text-center"
          >
            <div className="w-20 h-20 text-black bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <UsersIcon />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              My Bookings
            </h1>
            <p className="text-slate-600 mb-8">
              Please sign in to view your booking history and manage your
              adventures.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat ${inter.className} font-sans`}
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')",
      }}
    >
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-sm mb-2 uppercase tracking-[0.18em] text-blue-600 font-bold">
                Welcome back, {user.displayName || user.email}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                My Bookings
              </h1>
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl">
            View and manage your tour booking requests. Track your upcoming
            adventures and past experiences.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <FilterButton
              label="All"
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              count={getStatusCount("all")}
            />
            <FilterButton
              label="Pending"
              active={activeFilter === "pending"}
              onClick={() => setActiveFilter("pending")}
              count={getStatusCount("pending")}
            />
            <FilterButton
              label="Confirmed"
              active={activeFilter === "confirmed"}
              onClick={() => setActiveFilter("confirmed")}
              count={getStatusCount("confirmed")}
            />
            <FilterButton
              label="Completed"
              active={activeFilter === "completed"}
              onClick={() => setActiveFilter("completed")}
              count={getStatusCount("completed")}
            />
            <FilterButton
              label="Cancelled"
              active={activeFilter === "cancelled"}
              onClick={() => setActiveFilter("cancelled")}
              count={getStatusCount("cancelled")}
            />
          </div>
        </motion.div>

        {filteredBookings.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="rounded-3xl bg-white shadow-xl border border-slate-200 p-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                {activeFilter === "all"
                  ? "No bookings yet"
                  : `No ${activeFilter} bookings`}
              </h2>
              <p className="text-slate-600 mb-8">
                {activeFilter === "all"
                  ? "You haven't placed any booking requests yet. Start your adventure today!"
                  : `You don't have any ${activeFilter} bookings at the moment.`}
              </p>
              {activeFilter === "all" && (
                <Button
                  onClick={handleExploreTours}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Tours
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Booking Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <p className="text-3xl font-bold text-slate-900">
                  {filteredBookings.length}
                </p>
                <p className="text-sm text-slate-600">Showing Bookings</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <p className="text-3xl font-bold text-green-600">
                  {
                    filteredBookings.filter((b) => b.status === "confirmed")
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Confirmed</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <p className="text-3xl font-bold text-amber-600">
                  {
                    filteredBookings.filter((b) => b.status === "pending")
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <p className="text-3xl font-bold text-slate-600">
                  {
                    filteredBookings.filter((b) => b.status === "completed")
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </motion.div>

            {/* Bookings Grid - 3 cards per row max */}
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBookings.map((booking, index) => {
                  const statusConfig = getStatusConfig(booking.status);
                  return (
                    <motion.div
                      key={booking.id}
                      variants={cardVariants}
                      whileHover="hover"
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="group h-full rounded-2xl bg-white shadow-lg hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col">
                        <div className="p-5 flex flex-col flex-1">
                          {/* Header with Title and Status */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h2 className="text-lg font-bold text-slate-900 line-clamp-2 flex-1">
                              {booking.tourTitle}
                            </h2>
                            <Badge
                              className={`${statusConfig.color} border-0 px-3 py-2 text-xs font-bold tracking-wide rounded-full whitespace-nowrap`}
                            >
                              <span className="mr-1">{statusConfig.icon}</span>
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Booking Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="text-blue-600 flex-shrink-0">
                                <CalendarIcon />
                              </div>
                              <span className="text-slate-600">
                                {formatBookingDate(booking.bookingDate)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <div className="text-blue-600 flex-shrink-0">
                                <ClockIcon />
                              </div>
                              <span className="text-slate-600">
                                {booking.timeSlot}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <div className="text-blue-600 flex-shrink-0">
                                <UsersIcon />
                              </div>
                              <span className="text-slate-600">
                                {booking.guestCount}{" "}
                                {booking.guestCount === 1 ? "Guest" : "Guests"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <div className="text-blue-600 flex-shrink-0">
                                <PhoneIcon />
                              </div>
                              <span className="text-slate-600 text-sm truncate">
                                {booking.userPhone}
                              </span>
                            </div>

                            {booking.fishingMethod && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="text-blue-600 flex-shrink-0">
                                  <MapPinIcon />
                                </div>
                                <span className="text-slate-600">
                                  {booking.fishingMethod}
                                </span>
                              </div>
                            )}

                            {booking.snorkelCamera && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="text-blue-600 flex-shrink-0">
                                  <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                  </svg>
                                </div>
                                <span className="text-slate-600 text-sm">
                                  {booking.snorkelCamera}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Special Notes (if any) */}
                          {booking.specialNotes && (
                            <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3">
                              <p className="text-xs font-semibold text-amber-700 mb-1">
                                Special Notes:
                              </p>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {booking.specialNotes}
                              </p>
                            </div>
                          )}

                          {/* Price and Actions */}
                          <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                  Total Price
                                </p>
                                <p className="text-2xl font-bold text-slate-900">
                                  ${booking.totalPrice}
                                </p>
                                {booking.priceBreakdown && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {booking.priceBreakdown}
                                  </p>
                                )}
                              </div>

                              {booking.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-white rounded-xl border border-amber-300 text-black hover:bg-amber-100"
                                >
                                  Contact
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* Showing results info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-slate-500 mt-4"
            >
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
