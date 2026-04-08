// latest root page.tsx code. (New implementation with animations, gallery, and booking dialog)

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import logo from "../assets/gomirissa.png";

import BookingDialog from "@/components/BookingDialog";
import { tours, TourId } from "@/lib/booking";

// --- Icons (same as before) ---
const AnchorIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="8" x2="12" y2="21" />
    <path d="M5 12H2a10 10 0 0020 0h-3" />
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

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
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

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const testimonials = [
  {
    name: "Sarah Davies",
    location: "San Diego, CA",
    rating: 5,
    text: "Muthu offered to send me photos of dolphins that had been captured the day before. He is a honest and trustworthy guide. Highly recommend trips with him.",
    tour: "Deep Sea Fishing",
    avatar: "S",
  },
  {
    name: "Beate Blaser",
    location: "Austin, TX",
    rating: 5,
    text: "It was great! Thank you so much for the wonderful experience.",
    tour: "Whale Watching",
    avatar: "B",
  },
  {
    name: "Abdulsalam B.",
    location: "United Kingdom",
    rating: 5,
    text: "With Mutu as my guide, we spotted whales on the first attempt! A surreal experience. He is a wonderful man full of knowledge.",
    tour: "Deep Sea Fishing",
    avatar: "A",
  },
  {
    name: "Emma Rodriguez",
    location: "Miami, FL",
    rating: 5,
    text: "Professional, friendly, and so much fun! The boat was clean and comfortable. I've already recommended this to friends.",
    tour: "Snorkeling Adventure",
    avatar: "E",
  },
];

const galleryImages = [
  { src: "/images/14.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/2.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/3.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/6.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/8.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/9.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/10.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/23.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/24.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/12.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/13.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/15.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/16.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/17.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/18.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/19.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/20.jpeg", alt: "Muthu Tour destination" },
  { src: "/images/21.jpeg", alt: "Muthu Tour destination" },
];

// Animation variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ScrollToSection component for smooth scrolling
const ScrollToSection = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialGalleryCount = 5;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<TourId | "">("");

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBookNow = (tourId: TourId) => {
    setSelectedTourId(tourId);
    setBookingOpen(true);
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Loading screen
  if (isLoading) {
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
            Loading Mirissa Adventures...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen font-sans antialiased text-slate-900 selection:bg-cyan-200 selection:text-cyan-900"
      >
        {/* --- Navigation --- */}
        <Navbar onBookNow={() => setBookingOpen(true)} />

        {/* --- Hero Section --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-105"
            >
              <source src="/videos/fish.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-900/90" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-cyan-400"
              />
              Top Rated Ocean Tours in Mirissa
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter drop-shadow-sm"
            >
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white">
                Deep Blue
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Experience the thrill of deep-sea fishing and the serenity of
              snorkeling with Muthu Tours. Your gateway to Sri Lanka&#39;s
              underwater wonders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-10 py-7 text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-transform hover:scale-105"
              >
                Start Adventure
              </Button>
              <ScrollToSection href="#tours">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 border-white/30 text-white hover:bg-white/20 hover:text-white rounded-full px-10 py-7 text-lg backdrop-blur-sm transition-transform hover:scale-105"
                >
                  View Packages
                </Button>
              </ScrollToSection>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-8 left-4 right-4 md:bottom-12 md:left-1/2 md:-translate-x-1/2 md:w-auto w-auto z-20"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:px-8 md:py-5 flex flex-wrap justify-center gap-6 md:gap-12 shadow-2xl">
              {[
                { icon: <AnchorIcon size={20} />, text: "Expert Captains" },
                { icon: <UsersIcon />, text: "Private Groups" },
                { icon: <CheckIcon />, text: "Safety Certified" },
                { icon: <StarIcon />, text: "4.9/5 Rating" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center gap-2 text-white/90"
                >
                  <div className="text-cyan-300">{item.icon}</div>
                  <span className="text-sm font-semibold tracking-wide">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- Tours Section --- */}
        <section id="tours" className="py-24 bg-slate-50 relative">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            >
              <div className="max-w-2xl">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                  Our Packages
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  Choose Your <span className="text-blue-600">Expedition</span>
                </h2>
                <p className="text-slate-600 mt-4 text-lg">
                  Curated experiences for every type of traveler. From
                  adrenaline-pumping fishing to peaceful snorkeling.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {tours.map((tour) => (
                <motion.div
                  key={tour.id}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card className="group border-0 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      <Badge
                        className={`absolute top-4 left-4 border-0 px-3 py-1.5 ${tour.badgeColor} shadow-lg backdrop-blur-sm`}
                      >
                        {tour.badge}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-medium bg-black/30 backdrop-blur-md px-2 py-1 rounded-md mb-2 w-fit">
                            <ClockIcon /> {tour.duration}
                          </div>
                          <h3 className="text-2xl font-bold leading-tight">
                            {tour.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-grow">
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {tour.description}
                      </p>
                      <div className="space-y-3 mb-6">
                        {tour.features.slice(0, 4).map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <div className="text-green-500 mt-0.5">
                              <CheckIcon />
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-5 mt-auto flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-500">
                          Starting from
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-slate-900">
                            ${tour.price}
                          </span>
                          <span className="text-slate-500">/person</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBookNow(tour.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-12 shadow-lg hover:shadow-xl transition-all"
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- Gallery Section --- */}
        <section id="gallery" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-cyan-600 font-bold tracking-wider uppercase text-sm">
                Visual Diary
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 mt-2">
                Captured Moments
              </h2>
              <p className="text-lg text-slate-600">
                Real photos from our daily excursions. No stock filters, just
                pure ocean beauty.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isGalleryExpanded ? "expanded" : "collapsed"}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
              >
                {galleryImages
                  .slice(
                    0,
                    isGalleryExpanded
                      ? galleryImages.length
                      : initialGalleryCount,
                  )
                  .map((img, idx) => (
                    <motion.div
                      key={`${img.src}-${idx}`}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedImage(img.src)}
                      className={`relative rounded-2xl overflow-hidden cursor-zoom-in group shadow-md
              ${idx === 0 && !isGalleryExpanded ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                className="rounded-full font-semibold px-6 border-slate-200 bg-blue-700 text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shadow-sm"
              >
                {isGalleryExpanded
                  ? "Show Less"
                  : `Load More Images (${galleryImages.length - initialGalleryCount} more)`}
              </Button>
            </motion.div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section
          id="about"
          className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 lg:w-[500px] lg:h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 lg:w-[500px] lg:h-[500px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInLeft}
                className="order-1"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                  Established 2010
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Authentic Mirissa. <br />
                  <span className="text-blue-600">Personalized Service.</span>
                </h2>
                <div className="space-y-6 text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
                  <p>
                    Muthu Tours is a locally owned service founded by Sandun
                    Muthumala. For over 8 years, we have been the trusted choice
                    for travelers seeking genuine ocean experiences away from
                    the crowded tourist traps.
                  </p>
                  <p>
                    We believe the Sri Lankan ocean should be explored with
                    respect and precision. We aren&#39;t just boat drivers; we
                    are ocean enthusiasts ready to show you the hidden beauty of
                    Mirissa.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-l-4 border-blue-600 p-6 rounded-r-xl shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AnchorIcon
                      size={80}
                      className="lg:w-[100px] lg:h-[100px]"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-600">
                      <UsersIcon />
                    </span>
                    A Note from Sandun
                  </h4>
                  <p className="italic text-slate-600 text-sm md:text-base">
                    &#34;I handle every tour coordination myself. No agents, no
                    middlemen. When you book with Muthu Tours, you are booking
                    directly with me and my local crew. Watch out for
                    imitators!&#34;
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 lg:mt-10">
                  {[
                    { label: "Years Active", value: "8+" },
                    { label: "Happy Guests", value: "5k+" },
                    { label: "Rating", value: "5.0" },
                    { label: "Safety Record", value: "100%" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-3 md:p-4 bg-white rounded-2xl shadow-sm border border-slate-100"
                    >
                      <div className="text-xl md:text-2xl font-bold text-slate-900">
                        {stat.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 uppercase font-medium mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button
                    onClick={scrollToContact}
                    className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    Get Info <span className="text-xl">→</span>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInRight}
                className="order-2 relative h-[400px] lg:h-[600px] w-full mt-8 lg:mt-0"
              >
                <div className="absolute top-8 left-4 lg:top-10 lg:left-10 w-3/4 h-3/4 bg-slate-200 rounded-[2rem] lg:rounded-[3rem] rotate-3" />
                <motion.img
                  src="/images/15.jpeg"
                  alt="Whale watching boat"
                  whileHover={{ rotate: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 w-3/4 h-3/4 object-cover rounded-[2rem] lg:rounded-[3rem] shadow-2xl z-10"
                />
                <motion.img
                  src="/images/muthu.jpg"
                  alt="Sandun Muthumala"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 right-0 lg:bottom-10 lg:right-4 w-1/2 h-1/2 object-cover rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl border-4 lg:border-8 border-white z-20"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <section
          id="testimonials"
          className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
            >
              <div>
                <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 mb-4 border-0">
                  Traveler Reviews
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Stories from the Sea
                </h2>
              </div>
              <div className="flex items-center gap-2 text-yellow-400 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <StarIcon /> <span className="font-bold text-white">5.0</span>{" "}
                <span className="text-white/60 text-sm">Average Rating</span>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-slate-100 hover:bg-white/10 transition-colors duration-300">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 text-yellow-400 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6 min-h-[80px]">
                        &#34;{t.text}&#34;
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section
          id="contact"
          className="py-24 bg-gradient-to-b from-white to-slate-50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            >
              {/* Left side - Contact Info */}
              <div className="lg:w-2/5 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-medium">
                        Quick Response
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                  >
                    Let&#39;s Plan Your <br />
                    <span className="text-white/90">Mirissa Adventure</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-blue-100 mb-10 text-lg leading-relaxed"
                  >
                    Have questions about the weather, whale season, or custom
                    packages? We&#39;re here to help within 24 hours.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    {[
                      {
                        icon: <MapPinIcon />,
                        title: "Visit Us",
                        content: "49 A, Bandaramulla, Mirissa, Sri Lanka",
                        link: "https://maps.google.com/?q=49+A+Bandaramulla+Mirissa+Sri+Lanka",
                      },
                      {
                        icon: <PhoneIcon />,
                        title: "Call / WhatsApp",
                        content: "+94 71 434 3478",
                        link: "https://wa.me/94714343478",
                      },
                      {
                        icon: <MailIcon />,
                        title: "Email Us",
                        content: "muthutoursmirissa@gmail.com",
                        link: "mailto:muthutoursmirissa@gmail.com",
                      },
                    ].map((item, idx) => (
                      <motion.a
                        key={idx}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="flex items-start gap-4 group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md flex-shrink-0">
                          <div className="text-white group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-white/90 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-blue-100 opacity-90 text-sm">
                            {item.content}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </motion.div>
                </div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative z-10 mt-12 pt-8 border-t border-white/20"
                >
                  <div className="flex gap-4 justify-start flex-wrap">
                    {[
                      { text: "100% Local", icon: "🇱🇰" },
                      { text: "Best Price", icon: "💰" },
                      { text: "Free Cancellation", icon: "✓" },
                    ].map((badge, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right side - Form */}
              <div className="lg:w-3/5 bg-white p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-4xl font-bold text-slate-900 mb-2">
                      Send an Inquiry
                    </h3>
                    <p className="text-slate-500">
                      Fill out the form and we&#39;ll get back to you shortly
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-5"
                  >
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          First Name *
                        </Label>
                        <Input
                          placeholder="Enter your first name"
                          className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          Last Name *
                        </Label>
                        <Input
                          placeholder="Enter your last name"
                          className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-sm">
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          placeholder="+94 XX XXX XXXX"
                          className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          Number of Guests
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="rounded-2xl z-[100] bg-white shadow-xl border-slate-200 max-h-[300px]"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem
                                key={num}
                                value={String(num)}
                                className="rounded-xl cursor-pointer hover:bg-slate-100 text-black font-semibold"
                              >
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-sm">
                        Interested In *
                      </Label>
                      <Select required>
                        <SelectTrigger className="bg-slate-50 text-black border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select an adventure" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="rounded-2xl z-[100] bg-white shadow-xl border-slate-200 text-black font-semibold"
                        >
                          <SelectItem
                            value="deep-sea-fishing"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            🎣 Deep Sea Fishing
                          </SelectItem>
                          <SelectItem
                            value="snorkeling-turtles"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            🐢 Snorkeling with Turtles
                          </SelectItem>
                          <SelectItem
                            value="snorkeling-whales"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            🐋 Snorkeling with Whales
                          </SelectItem>
                          <SelectItem
                            value="whale-watching"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            🐳 Whale Watching
                          </SelectItem>
                          <SelectItem
                            value="custom"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            ⭐ Custom Package
                          </SelectItem>
                          <SelectItem
                            value="other"
                            className="rounded-xl cursor-pointer hover:bg-slate-100"
                          >
                            📝 General Inquiry
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          Preferred Date
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-sm">
                          Preferred Time
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-slate-50 border-slate-200 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="rounded-2xl z-[100] bg-white shadow-xl border-slate-200 text-black font-semibold"
                          >
                            <SelectItem
                              value="morning"
                              className="rounded-xl cursor-pointer hover:bg-slate-100"
                            >
                              🌅 Morning (6:00 AM)
                            </SelectItem>
                            <SelectItem
                              value="midday"
                              className="rounded-xl cursor-pointer hover:bg-slate-100"
                            >
                              ☀️ Midday (11:00 AM)
                            </SelectItem>
                            <SelectItem
                              value="afternoon"
                              className="rounded-xl cursor-pointer hover:bg-slate-100"
                            >
                              🌤️ Afternoon (2:00 PM)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-sm">
                        Message *
                      </Label>
                      <Textarea
                        placeholder="Tell us about your expectations, group size, special requests, or any questions you have..."
                        className="bg-slate-50 border-slate-200 min-h-[130px] resize-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span>Send Message</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.button>

                    <p className="text-xs text-slate-400 text-center mt-4">
                      By submitting, you agree to our privacy policy. We&#39;ll
                      never share your information.
                    </p>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Footer (same as before, keep the ScrollToSection usage) --- */}
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="space-y-4">
                {/* Logo + Brand Name */}
                <div className="flex items-center gap-3 text-white">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={logo}
                      alt="GoMirissa Fishing Tours Logo"
                      fill
                      className="object-contain rounded-2xl"
                      priority
                    />
                  </div>

                  <span className="text-xl font-bold tracking-wide">
                    GoMirissa
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Creating unforgettable ocean memories in Sri Lanka since 2010.
                  Authentic, safe, and locally guided.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Experiences</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <ScrollToSection href="#tours">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Snorkeling with Turtles
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#tours">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Snorkeling with Whales
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#tours">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Deep Sea Fishing
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#tours">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Private Boat Hire
                      </span>
                    </ScrollToSection>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <ScrollToSection href="#about">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        About Us
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#gallery">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Gallery
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#testimonials">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Reviews
                      </span>
                    </ScrollToSection>
                  </li>
                  <li>
                    <ScrollToSection href="#contact">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">
                        Contact
                      </span>
                    </ScrollToSection>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Cancellation Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-900 text-center text-xs">
              <p>
                &copy; {new Date().getFullYear()} Muthu Tours Mirissa. All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* --- Booking Dialog --- */}
        <BookingDialog
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          initialTourId={selectedTourId}
        />

        {/* --- Image Lightbox --- */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-[100vw] h-screen bg-black/90 border-0 p-0 flex items-center justify-center focus:outline-none">
            {/* Add visually hidden DialogTitle for accessibility */}
            <DialogTitle className="sr-only">Fullscreen Image</DialogTitle>

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            {selectedImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt="Gallery Fullscreen"
                className="max-h-[90vh] max-w-[95vw] object-contain shadow-2xl"
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.main>
    </AnimatePresence>
  );
}
