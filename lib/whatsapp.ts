import { BookingPayload } from "@/firebase/booking";

export function buildBookingWhatsAppMessage(
  bookingData: BookingPayload,
  bookingId: string
): string {
  const dateObj = new Date(bookingData.bookingDate);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let message = `*New Booking Request Fom Gomirissa.com!* 🎉\n\n`;
  message += `*Booking ID:* ${bookingId}\n`;
  message += `*Customer:* ${bookingData.userName}\n`;
  message += `*Phone:* ${bookingData.userPhone}\n`;
  if (bookingData.userEmail) {
    message += `*Email:* ${bookingData.userEmail}\n`;
  }
  message += `\n`;
  message += `*Tour:* ${bookingData.tourTitle}\n`;
  message += `*Date:* ${formattedDate}\n`;
  message += `*Time Slot:* ${bookingData.timeSlot}\n`;
  message += `*Guests:* ${bookingData.guestCount}\n`;
  message += `*Total Price:* $${bookingData.totalPrice}\n`;

  if (bookingData.fishingMethod) {
    message += `*Fishing Method:* ${bookingData.fishingMethod}\n`;
  }
  if (bookingData.snorkelCamera) {
    message += `*Camera Option:* ${bookingData.snorkelCamera}\n`;
  }
  if (bookingData.specialNotes) {
    message += `*Special Notes:* ${bookingData.specialNotes}\n`;
  }

  message += `\n*Please confirm availability for this booking request.*`;

  return message;
}

export function generateWhatsAppUrl(adminNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminNumber}?text=${encodedMessage}`;
}
