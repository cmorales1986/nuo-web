import Link from "next/link";
import Image from "next/image";
import { CarritoBoton } from "./tienda/carrito-boton";

export function SiteHeader() {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0eeeb",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/logo-nuo-color.png" alt="Nuo Esthetic" width={110} height={48} style={{ objectFit: "contain", height: 40, width: "auto" }} priority />
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link href="/tienda" style={{ fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--nuo-taupe)" }}>
          Tienda
        </Link>
        <CarritoBoton />
      </nav>
    </header>
  );
}
