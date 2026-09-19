"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HeartOutlined } from "@ant-design/icons";
import { CarritoBoton } from "./tienda/carrito-boton";

const AGENDIA_URL = "https://lite.agendia.co/nuoesthetic";
const ALTO_HEADER = 82;

/** Mismo comportamiento que nuo.com.py: el header se esconde al bajar y reaparece al subir. */
function useHeaderScrollState() {
  const [oculto, setOculto] = useState(false);
  const [enTopeHero, setEnTopeHero] = useState(true);
  const ultimoScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const actual = window.scrollY;
      const bajando = actual > ultimoScroll.current;
      setOculto(bajando && actual > 160);
      setEnTopeHero(actual < window.innerHeight * 0.8);
      ultimoScroll.current = actual;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { oculto, enTopeHero };
}

export function SiteHeader() {
  const { oculto, enTopeHero } = useHeaderScrollState();
  const pathname = usePathname();
  // Transparente y flotando sobre la foto del hero, igual que nuo.com.py —
  // solo tiene sentido en la home mientras el hero sigue a la vista.
  const transparente = pathname === "/" && enTopeHero;

  return (
    <header
      style={{
        background: transparente ? "transparent" : "rgba(255,255,255,0.92)",
        backdropFilter: transparente ? "none" : "blur(8px)",
        borderBottom: transparente ? "1px solid transparent" : "1px solid #f0eeeb",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: ALTO_HEADER,
        zIndex: 20,
        transform: oculto ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src={transparente ? "/logo-nuo-blanco.png" : "/logo-nuo-color.png"}
          alt="Nuo Esthetic"
          width={140}
          height={62}
          style={{ objectFit: "contain", height: 48, width: "auto", transition: "opacity 0.2s ease" }}
          priority
        />
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <Link href="/#nosotros" className="nuo-nav-link" style={transparente ? { color: "#fff" } : undefined}>
          Nosotros
        </Link>
        <Link href="/#equipo" className="nuo-nav-link" style={transparente ? { color: "#fff" } : undefined}>
          Equipo
        </Link>
        <Link href="/#tratamientos" className="nuo-nav-link" style={transparente ? { color: "#fff" } : undefined}>
          Tratamientos
        </Link>
        <Link href="/tienda" className="nuo-nav-link" style={transparente ? { color: "#fff" } : undefined}>
          Tienda
        </Link>
        <Link href="/#contacto" className="nuo-nav-link" style={transparente ? { color: "#fff" } : undefined}>
          Contacto
        </Link>
        <CarritoBoton claro={transparente} />
        <a
          href={AGENDIA_URL}
          target="_blank"
          rel="noreferrer"
          className="nuo-btn-animated"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: transparente ? "transparent" : "var(--nuo-terracota)",
            border: transparente ? "1px solid rgba(255,255,255,0.7)" : "1px solid var(--nuo-terracota)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 13,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontWeight: 600,
            whiteSpace: "nowrap",
            transition: "background 0.35s ease, border-color 0.35s ease",
          }}
        >
          <HeartOutlined /> Reserva tu cita
        </a>
      </nav>
    </header>
  );
}
