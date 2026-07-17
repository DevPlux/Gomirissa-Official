export type TourId = "deep-sea-fishing" | "snorkeling" | "snorkeling-whales";

export type SnorkelCameraOption =
  | "without_camera"
  | "with_camera"
  | "camera_only";

// NEW: shore (no boat) vs boat tour
export type SnorkelTourType = "shore" | "boat";

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

export interface FishingMethodOption {
  value: FishingMethod;
  label: string;
  shortLabel: string;
  catches: string;
  description: string;
  cardClassName: string;
}

export interface CameraOption {
  value: SnorkelCameraOption;
  label: string;
  shortLabel: string;
}

// NEW: shore vs boat tour type option
export interface TourTypeOption {
  value: SnorkelTourType;
  label: string;
  shortLabel: string;
  duration: string;
  maxPerBoat?: number;
  image: string;
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
      "Discover vibrant coral reefs, colorful tropical fish, and swim alongside sea turtles in the clear waters near Mirissa. Choose a quick shore snorkel (1.5 hrs) or a full boat tour (3 hrs) covering deep water, coral reef, and shallow turtle spots. Camera rental available, with or without the tour.",
    price: 20,
    duration: "1.5–3 hours",
    maxGuests: 12,
    image: "/images/snorkeling.jpg",
    features: [
      "All equipment provided",
      "Professional instructor",
      "Choose Shore (1.5 hrs) or Boat Tour w/ coral reef (3 hrs)",
      "Visit turtle hotspots",
      "Fruits & refreshments",
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
      "Seasonal (Dec–Apr)",
      "High-quality gear",
      "Expert marine guide",
      "Weather dependent",
      "Photos included",
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

export const fishingMethodOptions: FishingMethodOption[] = [
  {
    value: "jigging",
    label: "⭐ Jigging (Recommended) — GT, Kingfish, Grouper",
    shortLabel: "⭐ Jigging (Recommended)",
    catches: "Giant Trevally (GT), Kingfish, Grouper",
    description: "Multiple rods around the boat — best action!",
    cardClassName: "bg-blue-100 text-amber-900",
  },
  {
    value: "trolling",
    label: "Trolling — Tuna, Sailfish, Jackfish, Kingfish",
    shortLabel: "Trolling",
    catches: "Tuna, Jackfish, Kingfish, Sailfish etc...",
    description: "2 rods trolling the open water",
    cardClassName: "bg-amber-100 text-amber-900",
  },
];

// UNCHANGED: same 3 camera options/prices apply to both shore and boat tours
// NOTE: no fixed $ amount in labels below since price now depends on shore ($20 base) vs boat ($30 base) — see calculatePrice
export const snorkelCameraOptions: CameraOption[] = [
  {
    value: "without_camera",
    label: "Without Camera",
    shortLabel: "Without Camera",
  },
  {
    value: "with_camera",
    label: "With Free Camera (+$15)",
    shortLabel: "With Free Camera",
  },
  {
    value: "camera_only",
    label: "Camera Rental Only — $20 flat",
    shortLabel: "Camera Rental Only",
  },
];

// NEW: shore vs boat tour type options (affects duration/logistics, not camera pricing)
export const snorkelTourTypeOptions: TourTypeOption[] = [
  {
    value: "shore",
    label: "Shore Snorkeling — 1.5 hours",
    shortLabel: "Shore (1.5 hrs)",
    duration: "1.5 hours",
    image: "/images/snorkeling-shore.png",
  },
  {
    value: "boat",
    label: "Boat Tour — 3 hours, incl. Coral Reef (max 8 people/boat)",
    shortLabel: "Boat Tour (3 hrs)",
    duration: "3 hours",
    maxPerBoat: 8,
    image: "/images/snorkeling-boat.png",
  },
];

// NEW: helper to figure out how many boats are needed for the boat tour option
export function getBoatsNeeded(guestCount: number): number {
  return Math.ceil(guestCount / 8);
}

export function getTourPricingMeta(tourId: TourId) {
  switch (tourId) {
    case "deep-sea-fishing":
      return {
        label: "From $100/person",
        note: "Solo trip: $250 flat",
      };

    case "snorkeling":
      return {
        label: "From $20/person",
        note: "Shore (1.5 hrs) or Boat Tour (3 hrs, max 8/boat) — same camera pricing",
      };

    case "snorkeling-whales":
      return {
        label: "From $150/person",
        note: "Solo trip: $300",
      };

    default:
      return {
        label: "",
        note: "",
      };
  }
}

export function calculatePrice(
  tourId: TourId | "",
  guestCount: number,
  snorkelCamera: SnorkelCameraOption,
  snorkelTourType: SnorkelTourType = "shore", // NEW param, defaults to shore so existing calls still work
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
    const tourLabel =
      snorkelTourType === "boat" ? "boat tour, 3 hrs" : "shore, 1.5 hrs";

    // camera rental only — flat $20, same regardless of shore/boat
    if (snorkelCamera === "camera_only") {
      return {
        total: 20,
        breakdown: `Camera rental only — $20 flat (${tourLabel})`,
      };
    }

    // base price depends on shore ($20) vs boat ($30); camera adds a flat +$15 either way
    const basePrice = snorkelTourType === "boat" ? 30 : 20;
    const rate = snorkelCamera === "with_camera" ? basePrice + 15 : basePrice;
    const cameraLabel =
      snorkelCamera === "with_camera" ? "with free camera" : "without camera";

    // boat-specific logistics note: split into multiple boats if >8 pax
    let boatNote = "";
    if (snorkelTourType === "boat") {
      const boats = getBoatsNeeded(guestCount);
      if (boats > 1) {
        boatNote = ` — requires ${boats} boats (max 8/boat)`;
      }
    }

    return {
      total: guestCount * rate,
      breakdown: `${guestCount} person${guestCount > 1 ? "s" : ""} × $${rate}/person (${cameraLabel}, ${tourLabel})${boatNote}`,
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
