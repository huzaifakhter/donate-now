"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Check if window and IntersectionObserver are available
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-10");
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return null;
}
