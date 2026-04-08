"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import {
  calculatePrice,
  fishingMethodOptions,
  FishingMethod,
  getTourById,
  snorkelCameraOptions,
  SnorkelCameraOption,
  TimeSlot,
  timeSlots,
  TourId,
  tours,
} from "@/lib/booking";
import { createBooking } from "@/firebase/booking";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTourId?: TourId | "";
}

type BookingStep = "details" | "date";

const slotTimeMap: Record<TimeSlot, { hour: number; minute: number }> = {
  morning: { hour: 6, minute: 0 },
  midday: { hour: 11, minute: 0 },
  afternoon: { hour: 14, minute: 0 },
};

export default function BookingDialog({
  open,
  onOpenChange,
  initialTourId = "",
}: BookingDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  const [activeStep, setActiveStep] = useState<BookingStep>("details");

  const [selectedTour, setSelectedTour] = useState<TourId | "">(
    initialTourId || "",
  );
  const [guestCount, setGuestCount] = useState<number>(1);
  const [snorkelCamera, setSnorkelCamera] =
    useState<SnorkelCameraOption>("without_camera");
  const [fishingMethod, setFishingMethod] = useState<FishingMethod>("jigging");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("morning");
  const [selectedDate, setSelectedDate] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setActiveStep("details");
    setSelectedTour(initialTourId || "");
    setGuestCount(1);
    setSnorkelCamera("without_camera");
    setFishingMethod("jigging");
    setTimeSlot("morning");
    setSelectedDate("");
    setPhone("");
    setSpecialNotes("");
    setFullName(user?.displayName || "");
    setEmail(user?.email || "");
  }, [open, initialTourId, user]);

  const selectedTourData = useMemo(
    () => getTourById(selectedTour),
    [selectedTour],
  );

  const selectedFishingMethodData = useMemo(
    () =>
      fishingMethodOptions.find((option) => option.value === fishingMethod) ||
      fishingMethodOptions[0],
    [fishingMethod],
  );

  const maxGuests = selectedTourData?.maxGuests ?? 10;

  const { total: totalPrice, breakdown: priceBreakdown } = useMemo(
    () => calculatePrice(selectedTour, guestCount, snorkelCamera),
    [selectedTour, guestCount, snorkelCamera],
  );

  const today = useMemo(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  }, []);

  const isSameLocalDate = (dateA: Date, dateB: Date) => {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isPastTimeSlot = (dateString: string, slot: TimeSlot) => {
    if (!dateString) return false;

    const now = new Date();
    const selected = new Date(`${dateString}T00:00:00`);

    if (!isSameLocalDate(now, selected)) return false;

    const slotTime = slotTimeMap[slot];
    const slotDateTime = new Date(selected);
    slotDateTime.setHours(slotTime.hour, slotTime.minute, 0, 0);

    return now.getTime() >= slotDateTime.getTime();
  };

  const availableTimeSlots = useMemo(() => {
    return timeSlots.filter(
      (slot) => !isPastTimeSlot(selectedDate, slot.value),
    );
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;

    const selectedStillValid = availableTimeSlots.some(
      (slot) => slot.value === timeSlot,
    );

    if (!selectedStillValid && availableTimeSlots.length > 0) {
      setTimeSlot(availableTimeSlots[0].value);
    }
  }, [selectedDate, timeSlot, availableTimeSlots]);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const date = new Date(`${selectedDate}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  const handleTourChange = (tourId: TourId | "") => {
    setSelectedTour(tourId);
    setGuestCount(1);
    setSnorkelCamera("without_camera");
    setFishingMethod("jigging");
  };

  const showDialogAlert = (options: {
    icon: "warning" | "error" | "success";
    title: string;
    text: string;
  }) => {
    return Swal.fire({
      ...options,
      target: dialogContentRef.current ?? undefined,
      heightAuto: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      confirmButtonColor: "#2563eb",
      customClass: {
        container: "!z-[9999]",
        popup: "!rounded-3xl !shadow-2xl",
        confirmButton: "!rounded-xl px-6 py-2",
      },
      didOpen: () => {
        Swal.getConfirmButton()?.focus();
      },
    });
  };

  const validateBooking = () => {
    if (!user) {
      showDialogAlert({
        icon: "warning",
        title: "Login required",
        text: "Please sign in before placing a booking request.",
      }).then(() => {
        onOpenChange(false);
        router.push("/login");
      });
      return false;
    }

    if (!selectedTourData) {
      showDialogAlert({
        icon: "warning",
        title: "Select a package",
        text: "Please choose a tour package.",
      });
      return false;
    }

    if (!selectedDate) {
      showDialogAlert({
        icon: "warning",
        title: "Select a date",
        text: "Please choose your preferred booking date.",
      });
      setActiveStep("date");
      return false;
    }

    if (selectedDate && availableTimeSlots.length === 0) {
      showDialogAlert({
        icon: "warning",
        title: "No available slots today",
        text: "All available time slots for today have already passed. Please choose another date.",
      });
      setActiveStep("date");
      return false;
    }

    if (selectedDate && isPastTimeSlot(selectedDate, timeSlot)) {
      showDialogAlert({
        icon: "warning",
        title: "Invalid time slot",
        text: "The selected time slot has already passed for today. Please choose a later time.",
      });
      setActiveStep("date");
      return false;
    }

    if (!fullName.trim()) {
      showDialogAlert({
        icon: "warning",
        title: "Missing name",
        text: "Your name is missing. Please update your account profile or sign in again.",
      });
      return false;
    }

    if (!email.trim()) {
      showDialogAlert({
        icon: "warning",
        title: "Missing email",
        text: "Your email is missing. Please update your account profile or sign in again.",
      });
      return false;
    }

    if (!phone.trim()) {
      showDialogAlert({
        icon: "warning",
        title: "Phone required",
        text: "Please enter your phone or WhatsApp number.",
      });
      return false;
    }

    if (guestCount < 1 || guestCount > maxGuests) {
      showDialogAlert({
        icon: "warning",
        title: "Invalid guest count",
        text: `This package allows up to ${maxGuests} guests.`,
      });
      return false;
    }

    return true;
  };

  const handleSubmitBooking = async () => {
    if (!validateBooking() || !selectedTourData || !user || !selectedDate) {
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        userId: user.uid,
        userEmail: user.email,
        userName: fullName.trim(),
        userPhone: phone.trim(),
        tourId: selectedTourData.id,
        tourTitle: selectedTourData.title,
        bookingDate: new Date(`${selectedDate}T00:00:00`).toISOString(),
        timeSlot,
        guestCount,
        totalPrice,
        priceBreakdown,
        fishingMethod:
          selectedTourData.id === "deep-sea-fishing" ? fishingMethod : null,
        snorkelCamera:
          selectedTourData.id === "snorkeling" ? snorkelCamera : null,
        specialNotes: specialNotes.trim(),
        status: "pending",
        paymentStatus: "unpaid",
      });

      onOpenChange(false);

      await Swal.fire({
        icon: "success",
        title: "Booking request sent",
        text: "Your booking request has been saved successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: "#fff",
        customClass: {
          container: "!z-[9999]",
          popup: "!rounded-3xl shadow-2xl",
        },
      });

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking creation failed:", error);

      showDialogAlert({
        icon: "error",
        title: "Booking failed",
        text: "Something went wrong while saving your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        className={`max-w-3xl bg-white p-0 overflow-hidden gap-0 sm:rounded-[1.5rem] border-0 shadow-2xl ${inter.className}`}
      >
        <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-blue-700 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Book Your Adventure
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Review your package, pick a date, and submit your booking request.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 md:p-6 max-h-[78vh] overflow-y-auto bg-slate-50">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-200/80 p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveStep("details")}
              className={`h-11 rounded-xl text-sm font-semibold transition-all ${
                activeStep === "details"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tour Options
            </button>
            <button
              type="button"
              onClick={() => setActiveStep("date")}
              className={`h-11 rounded-xl text-sm font-semibold transition-all ${
                activeStep === "date"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Select Date
            </button>
          </div>

          {activeStep === "details" ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Tour Selection
                </h3>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Select Experience
                    </Label>
                    <select
                      value={selectedTour}
                      onChange={(e) =>
                        handleTourChange(e.target.value as TourId)
                      }
                      className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Choose your adventure
                      </option>
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTour === "deep-sea-fishing" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">
                          Fishing Method
                        </Label>
                        <select
                          value={fishingMethod}
                          onChange={(e) =>
                            setFishingMethod(e.target.value as FishingMethod)
                          }
                          className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {fishingMethodOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-slate-800 space-y-1">
                        <p className="font-semibold mb-2 text-amber-900">
                          🎣 Fishing Tour Pricing (max 7 guests)
                        </p>
                        <p>
                          • 1 person — <strong>$250</strong> flat rate
                        </p>
                        <p>
                          • 2 persons — <strong>$125/person</strong> ($250
                          total)
                        </p>
                        <p>
                          • 3–7 persons — <strong>$100/person</strong>
                        </p>

                        <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                          <p className="font-semibold text-amber-900">
                            🐟 Fishing Methods
                          </p>
                          <div
                            className={`rounded-lg p-3 mt-1 ${selectedFishingMethodData.cardClassName}`}
                          >
                            <p className="font-semibold">
                              {selectedFishingMethodData.shortLabel}
                            </p>
                            <p className="mt-1">
                              {selectedFishingMethodData.description}
                            </p>
                            <p className="mt-0.5">
                              Catches:{" "}
                              <strong>
                                {selectedFishingMethodData.catches}
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedTour === "snorkeling" && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                        <p className="font-semibold mb-2 text-blue-900">
                          🐢 Snorkeling with Turtles Pricing
                        </p>
                        <p>
                          • Without camera — <strong>$20/person</strong>
                        </p>
                        <p>
                          • With free camera — <strong>$35/person</strong>
                        </p>
                        <p>
                          • Camera rental only — <strong>$20</strong> flat
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">
                          Camera Option
                        </Label>
                        <select
                          value={snorkelCamera}
                          onChange={(e) => {
                            const value = e.target.value as SnorkelCameraOption;
                            setSnorkelCamera(value);
                            if (value === "camera_only") {
                              setGuestCount(1);
                            }
                          }}
                          className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {snorkelCameraOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {selectedTour === "snorkeling-whales" && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-sm text-cyan-800 space-y-1">
                      <p className="font-semibold mb-2 text-cyan-900">
                        🐋 Whale Snorkeling Pricing
                      </p>
                      <p>
                        • Solo (1 person) — <strong>$300</strong>
                      </p>
                      <p>
                        • Group (2+ persons) — <strong>$150/person</strong>
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">
                        Guests
                      </Label>
                      <select
                        value={String(guestCount)}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        disabled={
                          selectedTour === "snorkeling" &&
                          snorkelCamera === "camera_only"
                        }
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        {[...Array(maxGuests)].map((_, i) => (
                          <option key={i} value={String(i + 1)}>
                            {i + 1} {i === 0 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">
                        Time Slot
                      </Label>
                      <select
                        value={timeSlot}
                        onChange={(e) =>
                          setTimeSlot(e.target.value as TimeSlot)
                        }
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {timeSlots.map((slot) => {
                          const disabled = isPastTimeSlot(
                            selectedDate,
                            slot.value,
                          );

                          return (
                            <option
                              key={slot.value}
                              value={slot.value}
                              disabled={disabled}
                            >
                              {slot.label}
                              {disabled ? " — Unavailable today" : ""}
                            </option>
                          );
                        })}
                      </select>

                      {selectedDate && availableTimeSlots.length === 0 && (
                        <p className="text-sm text-red-500">
                          No remaining time slots are available for the selected
                          date.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedTourData && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.14em] font-bold text-blue-600 mb-1">
                        Price Summary
                      </p>
                      <h4 className="text-xl font-bold text-slate-900">
                        {selectedTourData.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {priceBreakdown}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-slate-500">Total Price</p>
                      <p className="text-3xl font-bold text-slate-900">
                        ${totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Your Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Full Name
                    </Label>
                    <Input
                      value={fullName}
                      readOnly
                      className="h-12 rounded-2xl bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Email Address
                    </Label>
                    <Input
                      value={email}
                      readOnly
                      className="h-12 rounded-2xl bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-1">
                    <Label className="text-slate-700 font-semibold">
                      Phone / WhatsApp
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-2xl bg-white border-slate-200 text-black"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="text-slate-700 font-semibold">
                    Special Requests{" "}
                    <span className="text-slate-400 font-medium">
                      (Optional)
                    </span>
                  </Label>
                  <Textarea
                    placeholder="Any special requests, dietary needs, or notes for the captain..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="min-h-[120px] rounded-2xl bg-white text-black border-slate-200 resize-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <p className="text-sm uppercase tracking-[0.14em] font-bold text-blue-600 mb-2">
                    Booking Date
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Select Your Preferred Date
                  </h3>
                  <p className="text-slate-600 mt-2">
                    Choose the day you want for your ocean experience.
                  </p>
                </div>

                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Preferred Date
                    </Label>
                    <Input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-12 rounded-2xl bg-white border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm uppercase tracking-[0.14em] font-bold text-blue-700 mb-2">
                      Selection Preview
                    </p>

                    {selectedDate ? (
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-slate-900">
                          {formattedSelectedDate}
                        </p>
                        <p className="text-slate-600">
                          Time Slot:{" "}
                          <span className="font-semibold text-slate-900">
                            {timeSlots.find((slot) => slot.value === timeSlot)
                              ?.label || timeSlot}
                          </span>
                        </p>
                        {selectedTourData && (
                          <p className="text-slate-600">
                            Package:{" "}
                            <span className="font-semibold text-slate-900">
                              {selectedTourData.title}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-600">
                        Select a date above to preview your booking day.
                      </p>
                    )}
                  </div>

                  <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Booking Note
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Your booking will be submitted as a request first. We can
                      confirm final availability after reviewing your selected
                      date and package.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-5 py-4 md:px-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 flex-1 rounded-2xl"
            disabled={submitting}
          >
            Cancel
          </Button>

          {activeStep === "details" ? (
            <Button
              onClick={() => setActiveStep("date")}
              className="h-12 flex-1 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!selectedTour}
            >
              Continue to Date
            </Button>
          ) : (
            <Button
              onClick={handleSubmitBooking}
              className="h-12 flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-between px-5"
              disabled={submitting}
            >
              <span>{submitting ? "Saving..." : "Confirm Request"}</span>
              <span className="rounded-lg bg-blue-800/30 px-2.5 py-1 text-sm font-mono">
                {totalPrice > 0 ? `$${totalPrice}` : "—"}
              </span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
