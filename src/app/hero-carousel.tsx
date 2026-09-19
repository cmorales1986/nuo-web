"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const INTERVALO_MS = 5500;

/** Carrusel del hero con crossfade + zoom lento continuo por imagen, igual que el slider (fade + image_effect_zoom, autoplay) de nuo.com.py. */
export function HeroCarousel({ imagenes }: { imagenes: string[] }) {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActivo((i) => (i + 1) % imagenes.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, [imagenes.length]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {imagenes.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === activo ? 1 : 0,
            transition: "opacity 1.4s ease",
          }}
        >
          <div style={{ position: "absolute", inset: 0, animation: "nuo-kenburns-loop 14s ease-in-out infinite alternate" }}>
            <Image src={src} alt="" fill priority={i === 0} style={{ objectFit: "cover" }} sizes="100vw" />
          </div>
        </div>
      ))}
    </div>
  );
}
