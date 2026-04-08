"use client";

import { SetStateAction, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CameraIcon,
  FishIcon,
  WavesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

type SnorkelCameraOption = "without_camera" | "with_camera" | "camera_only";
type FishingMethod = "trolling" | "jigging";

function calculatePrice(
  tourId: string,
  guestCount: number,
  snorkelCamera: SnorkelCameraOption,
): { total: number; breakdown: string } {
  if (tourId === "deep-sea-fishing") {
    if (guestCount === 1)
      return { total: 250, breakdown: "1 person — $250 flat rate" };
    if (guestCount === 2)
      return { total: 250, breakdown: "2 persons × $125/person" };
    return {
      total: guestCount * 100,
      breakdown: `${guestCount} persons × $100/person`,
    };
  }
  if (tourId === "snorkeling") {
    if (snorkelCamera === "camera_only")
      return { total: 20, breakdown: "Camera rental only — $20 flat" };
    const rate = snorkelCamera === "with_camera" ? 35 : 20;
    const label =
      snorkelCamera === "with_camera" ? "with free camera" : "without camera";
    return {
      total: guestCount * rate,
      breakdown: `${guestCount} person${guestCount > 1 ? "s" : ""} × $${rate}/person (${label})`,
    };
  }
  if (tourId === "snorkeling-whales") {
    if (guestCount === 1)
      return { total: 300, breakdown: "1 person — $300 solo rate" };
    return {
      total: guestCount * 150,
      breakdown: `${guestCount} persons × $150/person`,
    };
  }
  return { total: 0, breakdown: "" };
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

interface BookingSectionProps {
  onClose?: () => void;
  isDialog?: boolean;
  initialTour?: string;
}

export default function BookingSection({
  onClose,
  isDialog = false,
  initialTour = "",
}: BookingSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTour = searchParams.get("tour") ?? initialTour;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTour, setSelectedTour] = useState<string>(defaultTour);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [snorkelCamera, setSnorkelCamera] =
    useState<SnorkelCameraOption>("without_camera");
  const [fishingMethod, setFishingMethod] = useState<FishingMethod>("jigging");
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    timeSlot: "morning",
  });

  const { total: totalPrice, breakdown: priceBreakdown } = calculatePrice(
    selectedTour,
    guestCount,
    snorkelCamera,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // Close dialog after success if in dialog mode
    if (isDialog && onClose) {
      setTimeout(() => onClose(), 2000);
    }
  };

  // Get tour icon and color
  const getTourDetails = () => {
    switch (selectedTour) {
      case "deep-sea-fishing":
        return {
          icon: FishIcon,
          color: "from-amber-500 to-yellow-500",
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          label: "Deep Sea Fishing",
        };
      case "snorkeling":
        return {
          icon: WavesIcon,
          color: "from-blue-500 to-cyan-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          label: "Snorkeling with Turtles",
        };
      case "snorkeling-whales":
        return {
          icon: WavesIcon,
          color: "from-cyan-500 to-teal-500",
          bg: "bg-cyan-50",
          border: "border-cyan-200",
          text: "text-cyan-700",
          label: "Snorkeling with Whales",
        };
      default:
        return {
          icon: WavesIcon,
          color: "from-blue-500 to-cyan-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          label: "Select an experience",
        };
    }
  };

  const tourDetails = getTourDetails();
  const TourIcon = tourDetails.icon;

  // If not in dialog mode, show full page with header
  if (!isDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block mb-4"
            >
              <div className="bg-yellow-400 rounded-full p-3 shadow-lg">
                <StarIcon className="w-8 h-8 text-slate-900" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Book Your <span className="text-yellow-400">Adventure</span>
            </h1>
            <p className="text-blue-200 text-lg">
              Secure your spot on the boat. No payment required today.
            </p>
          </motion.div>
          {renderBookingCard()}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-blue-200 text-sm mt-6"
          >
            <MapPinIcon className="w-4 h-4 inline mr-1" />
            Mirissa, Sri Lanka — Best ocean adventures guaranteed
          </motion.p>
        </div>
      </div>
    );
  }

  // In dialog mode, just show the card without the outer header
  return renderBookingCard();

  function renderBookingCard() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>Booking request sent successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Banner */}
        <motion.div
          className="relative h-48 bg-gradient-to-r from-slate-900 to-blue-800 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <TourIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white">
                {tourDetails.label}
              </h2>
              {selectedTour && (
                <p className="text-blue-200 text-sm mt-1">
                  Experience the best of Sri Lanka&#39;s waters
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger
                value="details"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Tour Options
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Select Date
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  x: activeTab === "details" ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "details" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="details" className="mt-0">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-5"
                  >
                    {/* Tour Selector */}
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label className="text-slate-700 font-semibold flex items-center gap-2">
                        <WavesIcon className="w-4 h-4 text-blue-600" />
                        Select Experience
                      </Label>
                      <Select
                        value={selectedTour}
                        onValueChange={(val: SetStateAction<string>) => {
                          setSelectedTour(val);
                          setGuestCount(1);
                          setSnorkelCamera("without_camera");
                          setFishingMethod("jigging");
                        }}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                          <SelectValue placeholder="Choose your adventure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deep-sea-fishing">
                            <div className="flex items-center gap-2">
                              <FishIcon className="w-4 h-4 text-amber-500" />
                              Deep Sea Fishing
                            </div>
                          </SelectItem>
                          <SelectItem value="snorkeling">
                            <div className="flex items-center gap-2">
                              <WavesIcon className="w-4 h-4 text-blue-500" />
                              Snorkeling with Turtles
                            </div>
                          </SelectItem>
                          <SelectItem value="snorkeling-whales">
                            <div className="flex items-center gap-2">
                              <WavesIcon className="w-4 h-4 text-cyan-500" />
                              Snorkeling with Whales
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Fishing Method */}
                    <AnimatePresence>
                      {selectedTour === "deep-sea-fishing" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label className="text-slate-700 font-semibold flex items-center gap-2">
                            <FishIcon className="w-4 h-4 text-amber-600" />
                            Fishing Method
                          </Label>
                          <Select
                            value={fishingMethod}
                            onValueChange={(val: string) =>
                              setFishingMethod(val as FishingMethod)
                            }
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jigging">
                                ⭐ Jigging (Recommended) — GT, Kingfish, Grouper
                              </SelectItem>
                              <SelectItem value="trolling">
                                Trolling — Tuna, Sailfish, Jackfish, Kingfish
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pricing Info Cards with Animation */}
                    <AnimatePresence>
                      {selectedTour === "deep-sea-fishing" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4"
                        >
                          <p className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                            <FishIcon className="w-5 h-5" />
                            🎣 Fishing Tour Pricing (max 7 guests)
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>• 1 person</span>
                              <span className="font-bold">$250 flat rate</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• 2 persons</span>
                              <span className="font-bold">
                                $125/person ($250 total)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>• 3–7 persons</span>
                              <span className="font-bold">$100/person</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <p className="font-bold text-amber-900 mb-2">
                              🐟{" "}
                              {fishingMethod === "jigging"
                                ? "Jigging (Recommended)"
                                : "Trolling"}
                            </p>
                            <div className="bg-white/60 rounded-lg p-2">
                              <p className="text-amber-800">
                                {fishingMethod === "jigging"
                                  ? "Multiple rods around the boat — best action! Catches: Giant Trevally (GT), Kingfish, Grouper"
                                  : "2 rods trolling the open water. Catches: Tuna, Jackfish, Kingfish, Sailfish"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Snorkeling Pricing */}
                    <AnimatePresence>
                      {selectedTour === "snorkeling" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4"
                        >
                          <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <WavesIcon className="w-5 h-5" />
                            🐢 Snorkeling with Turtles Pricing
                          </p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>• Without camera</span>
                              <span className="font-bold">$20/person</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• With free camera</span>
                              <span className="font-bold">$35/person</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Camera rental only</span>
                              <span className="font-bold">$20 flat</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Whale Snorkeling Pricing */}
                    <AnimatePresence>
                      {selectedTour === "snorkeling-whales" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl p-4"
                        >
                          <p className="font-bold text-cyan-900 mb-2 flex items-center gap-2">
                            <WavesIcon className="w-5 h-5" />
                            🐋 Whale Snorkeling Pricing
                          </p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>• Solo (1 person)</span>
                              <span className="font-bold">$300</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Group (2+ persons)</span>
                              <span className="font-bold">$150/person</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Camera Option */}
                    <AnimatePresence>
                      {selectedTour === "snorkeling" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label className="text-slate-700 font-semibold flex items-center gap-2">
                            <CameraIcon className="w-4 h-4 text-blue-600" />
                            Camera Option
                          </Label>
                          <Select
                            value={snorkelCamera}
                            onValueChange={(val: string) => {
                              const v = val as SnorkelCameraOption;
                              setSnorkelCamera(v);
                              if (v === "camera_only") setGuestCount(1);
                            }}
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="without_camera">
                                Without Camera — $20/person
                              </SelectItem>
                              <SelectItem value="with_camera">
                                With Free Camera — $35/person
                              </SelectItem>
                              <SelectItem value="camera_only">
                                Camera Rental Only — $20 flat
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Guests + Time Slot */}
                    <motion.div
                      variants={fadeInUp}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          Guests
                        </Label>
                        <Select
                          value={String(guestCount)}
                          onValueChange={(val: string) =>
                            setGuestCount(parseInt(val))
                          }
                          disabled={
                            selectedTour === "snorkeling" &&
                            snorkelCamera === "camera_only"
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              ...Array(
                                selectedTour === "deep-sea-fishing" ? 7 : 10,
                              ),
                            ].map((_, i) => (
                              <SelectItem key={i} value={String(i + 1)}>
                                {i + 1} {i === 0 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-blue-600" />
                          Time Slot
                        </Label>
                        <Select
                          value={formData.timeSlot}
                          onValueChange={(val: string) =>
                            setFormData({ ...formData, timeSlot: val })
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Morning (6:00 AM)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">
                              🌅 Morning (6:00 AM)
                            </SelectItem>
                            <SelectItem value="midday">
                              ☀️ Midday (11:00 AM)
                            </SelectItem>
                            <SelectItem value="afternoon">
                              🌤️ Afternoon (2:00 PM)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Price Summary with Animation */}
                    {selectedTour && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-xl text-white"
                      >
                        <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
                          <span>{priceBreakdown}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                          <span className="font-semibold">Total Price</span>
                          <motion.span
                            key={totalPrice}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="font-bold text-3xl text-yellow-400"
                          >
                            ${totalPrice}
                          </motion.span>
                        </div>
                      </motion.div>
                    )}

                    {/* Contact Fields */}
                    <motion.div
                      variants={fadeInUp}
                      className="space-y-4 pt-4 border-t border-slate-200"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          Full Name
                        </Label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-blue-600" />
                            Email
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-blue-600" />
                            Phone / WhatsApp
                          </Label>
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone number"
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                {/* Calendar Tab */}
                <TabsContent value="calendar" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-blue-100"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                      disabled={(date: Date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                    <AnimatePresence>
                      {selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4 text-center bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium w-full"
                        >
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          {selectedDate.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        {/* Footer Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3"
        >
          <motion.div {...scaleOnHover} className="flex-1">
            <Button
              onClick={isDialog ? onClose : () => router.push("/")}
              className="w-full h-12 rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300"
            >
              ← {isDialog ? "Cancel" : "Back"}
            </Button>
          </motion.div>
          <motion.div {...scaleOnHover} className="flex-1">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedTour || !selectedDate}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <span className="flex items-center justify-between w-full px-4">
                  Confirm Request
                  <ChevronRightIcon className="w-5 h-5" />
                </span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
}
