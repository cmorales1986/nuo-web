"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Parallax lento del fondo del hero (la imagen se mueve más lento que el scroll), igual que el "headline-parallax-slow" de nuo.com.py. */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", inset: "-10% 0 0 0", height: "120%" }}>
      {children}
    </div>
  );
}
