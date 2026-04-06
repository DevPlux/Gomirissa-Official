"use client";

import { SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

type SnorkelCameraOption = "without_camera" | "with_camera" | "camera_only";
type FishingMethod = "trolling" | "jigging";

function calculatePrice(
  tourId: string,
  guestCount: number,
  snorkelCamera: SnorkelCameraOption
): { total: number; breakdown: string } {
  if (tourId === "deep-sea-fishing") {
    if (guestCount === 1) return { total: 250, breakdown: "1 person — $250 flat rate" };
    if (guestCount === 2) return { total: 250, breakdown: "2 persons × $125/person" };
    return { total: guestCount * 100, breakdown: `${guestCount} persons × $100/person` };
  }
  if (tourId === "snorkeling") {
    if (snorkelCamera === "camera_only") return { total: 20, breakdown: "Camera rental only — $20 flat" };
    const rate = snorkelCamera === "with_camera" ? 35 : 20;
    const label = snorkelCamera === "with_camera" ? "with free camera" : "without camera";
    return {
      total: guestCount * rate,
      breakdown: `${guestCount} person${guestCount > 1 ? "s" : ""} × $${rate}/person (${label})`,
    };
  }
  if (tourId === "snorkeling-whales") {
    if (guestCount === 1) return { total: 300, breakdown: "1 person — $300 solo rate" };
    return { total: guestCount * 150, breakdown: `${guestCount} persons × $150/person` };
  }
  return { total: 0, breakdown: "" };
}

export default function BookingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTour = searchParams.get("tour") ?? "";

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTour, setSelectedTour] = useState<string>(defaultTour);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [snorkelCamera, setSnorkelCamera] = useState<SnorkelCameraOption>("without_camera");
  const [fishingMethod, setFishingMethod] = useState<FishingMethod>("jigging");

  const { total: totalPrice, breakdown: priceBreakdown } = calculatePrice(
    selectedTour,
    guestCount,
    snorkelCamera
  );

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-bold">Book Your Adventure</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Secure your spot on the boat. No payment required today.
        </p>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Tour Options</TabsTrigger>
            <TabsTrigger value="calendar">Select Date</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-5">

            {/* Tour Selector */}
            <div className="space-y-2">
              <Label>Select Experience</Label>
              <Select
                value={selectedTour}
                onValueChange={(val: SetStateAction<string>) => {
                  setSelectedTour(val);
                  setGuestCount(1);
                  setSnorkelCamera("without_camera");
                  setFishingMethod("jigging");
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose your adventure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deep-sea-fishing">Deep Sea Fishing</SelectItem>
                  <SelectItem value="snorkeling">Snorkeling with Turtles</SelectItem>
                  <SelectItem value="snorkeling-whales">Snorkeling with Whales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fishing Method */}
            {selectedTour === "deep-sea-fishing" && (
              <div className="space-y-2">
                <Label>Fishing Method</Label>
                <Select
                  value={fishingMethod}
                  onValueChange={(val: string) => setFishingMethod(val as FishingMethod)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jigging">⭐ Jigging (Recommended) — GT, Kingfish, Grouper</SelectItem>
                    <SelectItem value="trolling">Trolling — Tuna, Sailfish, Jackfish, Kingfish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pricing Info — Deep Sea Fishing */}
            {selectedTour === "deep-sea-fishing" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold mb-2 text-amber-900">🎣 Fishing Tour Pricing (max 7 guests)</p>
                <p>• 1 person — <strong>$250</strong> flat rate</p>
                <p>• 2 persons — <strong>$125/person</strong> ($250 total)</p>
                <p>• 3–7 persons — <strong>$100/person</strong></p>
                <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                  <p className="font-semibold text-amber-900">🐟 Fishing Methods</p>
                  {fishingMethod === "jigging" ? (
                    <div className="bg-blue-100 rounded-lg p-2 mt-1">
                      <p className="font-semibold text-amber-900">⭐ Jigging (Recommended)</p>
                      <p className="mt-1">Multiple rods around the boat — best action!</p>
                      <p className="mt-0.5">Catches: <strong>Giant Trevally (GT), Kingfish, Grouper</strong></p>
                    </div>
                  ) : (
                    <div className="bg-amber-100 rounded-lg p-2 mt-1">
                      <p className="font-semibold text-amber-900">Trolling</p>
                      <p className="mt-1">2 rods trolling the open water</p>
                      <p className="mt-0.5">Catches: <strong>Tuna, Jackfish, Kingfish, Sailfish etc...</strong></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Info — Snorkeling Turtles */}
            {selectedTour === "snorkeling" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                <p className="font-semibold mb-2 text-blue-900">🐢 Snorkeling with Turtles Pricing</p>
                <p>• Without camera — <strong>$20/person</strong></p>
                <p>• With free camera — <strong>$35/person</strong></p>
                <p>• Camera rental only — <strong>$20</strong> flat</p>
              </div>
            )}

            {/* Pricing Info — Snorkeling Whales */}
            {selectedTour === "snorkeling-whales" && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-sm text-cyan-800 space-y-1">
                <p className="font-semibold mb-2 text-cyan-900">🐋 Whale Snorkeling Pricing</p>
                <p>• Solo (1 person) — <strong>$300</strong></p>
                <p>• Group (2+ persons) — <strong>$150/person</strong></p>
              </div>
            )}

            {/* Camera Option */}
            {selectedTour === "snorkeling" && (
              <div className="space-y-2">
                <Label>Camera Option</Label>
                <Select
                  value={snorkelCamera}
                  onValueChange={(val: string) => {
                    const v = val as SnorkelCameraOption;
                    setSnorkelCamera(v);
                    if (v === "camera_only") setGuestCount(1);
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without_camera">Without Camera — $20/person</SelectItem>
                    <SelectItem value="with_camera">With Free Camera — $35/person</SelectItem>
                    <SelectItem value="camera_only">Camera Rental Only — $20 flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Guests + Time Slot */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Guests</Label>
                <Select
                  value={String(guestCount)}
                  onValueChange={(val: string) => setGuestCount(parseInt(val))}
                  disabled={selectedTour === "snorkeling" && snorkelCamera === "camera_only"}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(selectedTour === "deep-sea-fishing" ? 7 : 10)].map((_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Morning (6:00 AM)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6:00 AM)</SelectItem>
                    <SelectItem value="midday">Midday (11:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Summary */}
            {selectedTour && (
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                  <span>{priceBreakdown}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-300 pt-3">
                  <span className="font-semibold text-slate-800 text-sm">Total Price</span>
                  <span className="font-bold text-slate-900 text-2xl">${totalPrice}</span>
                </div>
              </div>
            )}

            {/* Contact Fields */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter your name" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Email address" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Phone / WhatsApp</Label>
                  <Input type="tel" placeholder="Phone number" className="h-11" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border">
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
              {selectedDate && (
                <div className="mt-4 text-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium w-full">
                  Selected: {selectedDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t flex gap-3">
        <Button
          onClick={() => router.push("/")}
          className="flex-1 h-12 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
        >
          ← Back
        </Button>
        <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white flex justify-between px-6">
          <span>Confirm Request</span>
          <span className="bg-blue-800/30 px-2 py-1 rounded text-sm font-mono">
            {totalPrice > 0 ? `$${totalPrice}` : "—"}
          </span>
        </Button>
      </div>
    </div>
  );
}