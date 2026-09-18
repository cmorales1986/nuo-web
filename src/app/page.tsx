import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";

/**
 * Landing institucional — versión inicial, a propósito liviana. El
 * contenido completo (nosotros, equipo, tratamientos, testimonios) que
 * reemplaza a nuo.com.py del todo queda para una etapa aparte (Fase 4);
 * esto ya alcanza para que el sitio tenga una portada real que lleve a
 * la Tienda, en vez de nada.
 */
export default function Home() {
  return (
    <main>
      <section style={{ position: "relative", height: "70vh", minHeight: 420, display: "flex", alignItems: "flex-end" }}>
        <Image src="/hero-tratamiento.jpg" alt="" fill priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,20,20,0.15) 0%, rgba(20,20,20,0.65) 100%)" }} />
        <div style={{ position: "relative", padding: "0 24px 56px", color: "#fff", maxWidth: 720 }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", textTransform: "uppercase", lineHeight: 1.15, marginBottom: 16 }}>
            Un refugio de calma, belleza y bienestar
          </h1>
          <p style={{ fontSize: 16, marginBottom: 24, maxWidth: 520, opacity: 0.9 }}>
            Nuo Esthetic — centro médico-estético y spa. Faciales, corporales, masajes, paquetes y membresías.
          </p>
          <Link href="/tienda">
            <Button type="primary" size="large">Ver tienda</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
