import { BookingPayload } from "@/firebase/booking";

export function buildBookingWhatsAppMessage(
  bookingData: BookingPayload,
  bookingId: string,
): string {
  const dateObj = new Date(bookingData.bookingDate);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // ─── Header ───
  let message = `🌊 *NEW BOOKING REQUEST* 🌊\n\n`;

  // ─── Booking ID ───
  message += `🆔 *Booking ID:* \`${bookingId}\`\n\n`;

  // ─── Customer Details ───
  message += `👤 *Customer Details*\n`;
  message += `───────────────────\n`;
  message += `*Name:* ${bookingData.userName}\n`;
  message += `*Phone:* ${bookingData.userPhone}\n`;
  if (bookingData.userEmail) {
    message += `*Email:* ${bookingData.userEmail}\n`;
  }
  message += `\n`;

  // ─── Tour Details ───
  message += `🎣 *Tour Details*\n`;
  message += `───────────────────\n`;
  message += `*Tour:* ${bookingData.tourTitle}\n`;
  message += `*Date:* ${formattedDate}\n`;
  message += `*Time Slot:* ${bookingData.timeSlot}\n`;
  message += `*Guests:* ${bookingData.guestCount} ${bookingData.guestCount > 1 ? "people" : "person"}\n`;
  message += `*Total Price:* $${bookingData.totalPrice}\n`;

  // ─── Optional Extras ───
  const extras: string[] = [];
  if (bookingData.fishingMethod) {
    extras.push(`*Fishing Method:* ${bookingData.fishingMethod}`);
  }
  if (bookingData.snorkelCamera) {
    extras.push(`*Camera Option:* ${bookingData.snorkelCamera}`);
  }
  if (extras.length > 0) {
    message += `\n*Extras:*\n`;
    extras.forEach((e) => (message += `  • ${e}\n`));
  }

  // ─── Special Notes ───
  if (bookingData.specialNotes) {
    message += `\n📝 *Special Notes:*\n`;
    message += `  “${bookingData.specialNotes}”\n`;
  }

  // ─── Footer ───
  message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ *Please confirm availability for this booking.*\n`;
  message += `📌 Reply to this message to accept or ask questions.`;

  return message;
}

export function generateWhatsAppUrl(
  adminNumber: string,
  message: string,
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminNumber}?text=${encodedMessage}`;
}
