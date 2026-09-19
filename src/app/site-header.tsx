"use client";

import Link from "next/link";
import Image from "next/image";
import { HeartOutlined } from "@ant-design/icons";
import { CarritoBoton } from "./tienda/carrito-boton";

const AGENDIA_URL = "https://lite.agendia.co/nuoesthetic";

export function SiteHeader() {
  return (
    <header
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #f0eeeb",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/logo-nuo-color.png"
          alt="Nuo Esthetic"
          width={140}
          height={62}
          style={{ objectFit: "contain", height: 52, width: "auto" }}
          priority
        />
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <Link href="/#nosotros" className="nuo-nav-link">
          Nosotros
        </Link>
        <Link href="/#equipo" className="nuo-nav-link">
          Equipo
        </Link>
        <Link href="/#tratamientos" className="nuo-nav-link">
          Tratamientos
        </Link>
        <Link href="/tienda" className="nuo-nav-link">
          Tienda
        </Link>
        <Link href="/#contacto" className="nuo-nav-link">
          Contacto
        </Link>
        <CarritoBoton />
        <a
          href={AGENDIA_URL}
          target="_blank"
          rel="noreferrer"
          className="nuo-btn-animated"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--nuo-terracota)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 13,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <HeartOutlined /> Reserva tu cita
        </a>
      </nav>
    </header>
  );
}
