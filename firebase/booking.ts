import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  FishingMethod,
  SnorkelCameraOption,
  TimeSlot,
  TourId,
} from "@/lib/booking";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface BookingPayload {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  userPhone: string;
  tourId: TourId;
  tourTitle: string;
  bookingDate: string;
  timeSlot: TimeSlot;
  guestCount: number;
  totalPrice: number;
  priceBreakdown: string;
  fishingMethod: FishingMethod | null;
  snorkelCamera: SnorkelCameraOption | null;
  specialNotes: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

export interface Booking extends BookingPayload {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createBooking(payload: BookingPayload) {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Booking, "id">),
  }));
}

export async function getAllBookings(): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Booking, "id">),
  }));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const ref = doc(db, "bookings", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Booking, "id">),
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  const ref = doc(db, "bookings", bookingId);

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
) {
  const ref = doc(db, "bookings", bookingId);

  await updateDoc(ref, {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateBookingAdminFields(
  bookingId: string,
  data: Partial<Pick<Booking, "status" | "paymentStatus">>,
) {
  const ref = doc(db, "bookings", bookingId);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
