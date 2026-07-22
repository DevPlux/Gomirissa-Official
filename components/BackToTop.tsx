"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react"; // or any icon library you prefer

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed md:bottom-8 md:right-8 bottom-4 right-4 z-50 p-3 border border-white rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <ChevronUp className="h-6 w-6 animate-ping text-white" />
        </button>
      )}
    </>
  );
}
