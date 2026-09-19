import Link from "next/link";
import Image from "next/image";
import { Button, Row, Col } from "antd";
import { obtenerProductos } from "../lib/erp-client";
import { TiendaGrid } from "./tienda/tienda-grid";
import { GaleriaSection } from "./galeria-section";
import { TratamientosSection } from "./tratamientos-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const productos = await obtenerProductos();
  const destacados = productos.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section style={{ position: "relative", height: "78vh", minHeight: 480, display: "flex", alignItems: "flex-end" }}>
        <Image src="/hero-tratamiento.jpg" alt="" fill priority style={{ objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.7) 100%)",
          }}
        />
        <div style={{ position: "relative", padding: "0 24px 64px", color: "#fff", maxWidth: 720 }}>
          <span className="nuo-eyebrow" style={{ color: "var(--nuo-oro)" }}>
            Desde 2022 · Asunción, Paraguay
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", textTransform: "uppercase", lineHeight: 1.15, marginBottom: 16 }}>
            Un refugio de calma, belleza y bienestar
          </h1>
          <p style={{ fontSize: 16, marginBottom: 28, maxWidth: 520, opacity: 0.92 }}>
            Centro médico-estético que une salud, ciencia y bienestar en un solo lugar. Atención personalizada con un
            equipo interdisciplinario reconocido a nivel nacional e internacional.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/tienda">
              <Button type="primary" size="large">
                Ver tienda
              </Button>
            </Link>
            <a href="https://lite.agendia.co/nuoesthetic" target="_blank" rel="noreferrer">
              <Button size="large" ghost>
                Reservar mi turno
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="nuo-section">
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} md={11}>
            <span className="nuo-eyebrow">Quiénes somos</span>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 18, lineHeight: 1.25 }}>
              Salud, ciencia y bienestar en un solo lugar
            </h2>
            <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8, marginBottom: 16 }}>
              Trabajamos con un enfoque integral, ofreciendo atención personalizada y servicios de alta calidad a
              través de un equipo interdisciplinario de profesionales altamente capacitados.
            </p>
            <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8 }}>
              Nuestra propuesta se basa en un acompañamiento seguro, humano y ético, con los más altos estándares de
              atención y resultados visibles que transforman la vida de nuestros pacientes.
            </p>
          </Col>
          <Col xs={24} md={13}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 8, overflow: "hidden" }}>
              <Image src="/nosotros.jpg" alt="Equipo Nuo Esthetic" fill style={{ objectFit: "cover" }} />
            </div>
          </Col>
        </Row>

        <div className="nuo-stat-grid" style={{ marginTop: 56 }}>
          <div>
            <strong>2</strong>
            Sucursales
          </div>
          <div>
            <strong>20+</strong>
            Tratamientos estéticos
          </div>
          <div>
            <strong>15+</strong>
            Profesionales
          </div>
          <div>
            <strong>3+</strong>
            Años de experiencia
          </div>
        </div>
      </section>

      {/* Galería / equipo */}
      <section id="equipo" className="nuo-section" style={{ paddingTop: 0 }}>
        <GaleriaSection />
      </section>

      {/* Especialidades */}
      <section style={{ background: "#F7F4F1" }}>
        <div className="nuo-section">
          <span className="nuo-eyebrow">Atención profesional</span>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 12 }}>Nuestras especialidades</h2>
          <p style={{ color: "var(--nuo-taupe)", maxWidth: 620, marginBottom: 36, lineHeight: 1.8 }}>
            Contamos con un equipo interdisciplinario donde la salud, la estética y el bienestar se complementan para
            potenciar lo mejor de cada persona.
          </p>
          <div className="nuo-especialidad-grid">
            <div style={{ position: "relative", height: 320, borderRadius: 8, overflow: "hidden" }}>
              <Image src="/especialidad-clinic.jpg" alt="Nuo Clinic" fill style={{ objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(20,20,20,0.75) 0%, rgba(20,20,20,0) 55%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 24,
                  color: "#fff",
                }}
              >
                <span style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--nuo-oro)" }}>CLINIC</span>
                <h3 style={{ color: "#fff", fontSize: 22, margin: 0 }}>Especialidades médicas</h3>
              </div>
            </div>
            <div style={{ position: "relative", height: 320, borderRadius: 8, overflow: "hidden" }}>
              <Image src="/especialidad-spa.jpg" alt="Nuo Spa" fill style={{ objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(20,20,20,0.75) 0%, rgba(20,20,20,0) 55%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 24,
                  color: "#fff",
                }}
              >
                <span style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--nuo-oro)" }}>SPA</span>
                <h3 style={{ color: "#fff", fontSize: 22, margin: 0 }}>Tratamientos estéticos</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tratamientos */}
      <section id="tratamientos" className="nuo-section">
        <span className="nuo-eyebrow">Face &amp; body</span>
        <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 12 }}>Tratamientos</h2>
        <p style={{ color: "var(--nuo-taupe)", maxWidth: 620, marginBottom: 32, lineHeight: 1.8 }}>
          Faciales, masajes, combos y procedimientos estéticos con tecnología, cosmética coreana y protocolos
          personalizados según lo que tu piel necesita.
        </p>
        <TratamientosSection />
      </section>

      {/* Destacados de la tienda */}
      {destacados.length > 0 && (
        <section className="nuo-section">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="nuo-eyebrow">Skincare</span>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", margin: 0 }}>Productos destacados</h2>
            </div>
            <Link href="/tienda" style={{ color: "var(--nuo-terracota)", fontWeight: 500 }}>
              Ver toda la tienda →
            </Link>
          </div>
          <TiendaGrid productos={destacados} ocultarTitulo />
        </section>
      )}

      {/* Contacto / CTA */}
      <section id="contacto" style={{ background: "var(--nuo-terracota)", color: "#fff" }}>
        <div className="nuo-section" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 14 }}>Reservá tu turno</h2>
          <p style={{ maxWidth: 520, margin: "0 auto 28px", opacity: 0.92, lineHeight: 1.8 }}>
            Escribinos por WhatsApp y coordinamos tu cita en Nuo Clinic o Nuo Spa según el tratamiento que buscás.
          </p>
          <a
            href="https://wa.me/595971203800?text=Hola%2C%20quiero%20agendar%20un%20turno.."
            target="_blank"
            rel="noreferrer"
          >
            <Button size="large" style={{ background: "#fff", color: "var(--nuo-terracota)", border: "none", fontWeight: 600 }}>
              Escribir por WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
