export type TourId = "deep-sea-fishing" | "snorkeling" | "snorkeling-whales";

export type SnorkelCameraOption =
  | "without_camera"
  | "with_camera"
  | "camera_only";

export type FishingMethod = "trolling" | "jigging";

export type TimeSlot = "morning" | "midday" | "afternoon";

export interface Tour {
  id: TourId;
  title: string;
  description: string;
  price: number;
  duration: string;
  maxGuests: number;
  image: string;
  features: string[];
  badge: string;
  badgeColor: string;
}

export const tours: Tour[] = [
  {
    id: "deep-sea-fishing",
    title: "Deep Sea Fishing",
    description:
      "Choose your style: troll the open blue for tuna and sailfish, or drop down jigging for GT, kingfish, and grouper. Jigging is our top recommendation — action-packed from the moment you hit the spot.",
    price: 100,
    duration: "4–6 hours",
    maxGuests: 7,
    image: "/images/bigfish.jpeg",
    features: [
      "Trolling (2 rods): tuna, sailfish, mahi-mahi",
      "Jigging (many rods): GT, kingfish, grouper ⭐",
      "Jigging recommended — best action!",
      "Experienced local crew",
      "Safety briefing & life jackets",
      "Fresh catch cooking available",
    ],
    badge: "Adventure Pick",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    id: "snorkeling",
    title: "Snorkeling with Turtles",
    description:
      "Discover vibrant coral reefs, colorful tropical fish, and swim alongside sea turtles in the clear waters near Mirissa.",
    price: 20,
    duration: "3 hours",
    maxGuests: 12,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    features: [
      "All equipment provided",
      "Professional instructor",
      "Visit turtle hotspots",
      "Fruits & refreshments",
      "Shallow & safe areas",
      "Eco-friendly practices",
    ],
    badge: "Most Popular",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    id: "snorkeling-whales",
    title: "Snorkeling with Whales",
    description:
      "A rare opportunity to snorkel near gentle giants. A responsible wildlife experience strictly adhering to safety guidelines.",
    price: 150,
    duration: "4–5 hours",
    maxGuests: 8,
    image:
      "https://cdn.sanity.io/images/esqfj3od/production/3bf47706fcbf56cf473827e4f2fcdbe0383d8242-1080x720.webp?w=800&q=65&fit=clip&auto=format",
    features: [
      "Responsible approach",
      "High-quality gear",
      "Expert marine guide",
      "Weather dependent",
      "Photos included",
      "Seasonal (Dec–Apr)",
    ],
    badge: "Unique Experience",
    badgeColor: "bg-cyan-500 text-white",
  },
];

export const timeSlots: { value: TimeSlot; label: string }[] = [
  { value: "morning", label: "Morning (6:00 AM)" },
  { value: "midday", label: "Midday (11:00 AM)" },
  { value: "afternoon", label: "Afternoon (2:00 PM)" },
];

export function calculatePrice(
  tourId: TourId | "",
  guestCount: number,
  snorkelCamera: SnorkelCameraOption,
): { total: number; breakdown: string } {
  if (tourId === "deep-sea-fishing") {
    if (guestCount === 1) {
      return { total: 250, breakdown: "1 person — $250 flat rate" };
    } else if (guestCount === 2) {
      return { total: 250, breakdown: "2 persons × $125/person" };
    } else {
      return {
        total: guestCount * 100,
        breakdown: `${guestCount} persons × $100/person`,
      };
    }
  }

  if (tourId === "snorkeling") {
    if (snorkelCamera === "camera_only") {
      return { total: 20, breakdown: "Camera rental only — $20 flat" };
    }

    const rate = snorkelCamera === "with_camera" ? 35 : 20;
    const label =
      snorkelCamera === "with_camera" ? "with free camera" : "without camera";

    return {
      total: guestCount * rate,
      breakdown: `${guestCount} person${guestCount > 1 ? "s" : ""} × $${rate}/person (${label})`,
    };
  }

  if (tourId === "snorkeling-whales") {
    if (guestCount === 1) {
      return { total: 300, breakdown: "1 person — $300 solo rate" };
    } else {
      return {
        total: guestCount * 150,
        breakdown: `${guestCount} persons × $150/person (group rate)`,
      };
    }
  }

  return { total: 0, breakdown: "" };
}

export function getTourById(tourId: TourId | "") {
  return tours.find((tour) => tour.id === tourId);
}
