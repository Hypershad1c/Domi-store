"use client";

import { useEffect } from "react";

export function ScrollReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section:not(:first-of-type)"));
    document.documentElement.classList.add("motion-enhanced");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    sections.forEach((section) => {
      section.classList.add("scroll-reveal");
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-enhanced");
      sections.forEach((section) => section.classList.remove("scroll-reveal", "is-visible"));
    };
  }, []);

  return null;
}
