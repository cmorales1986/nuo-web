import Link from "next/link";
import Image from "next/image";
import { Button, Row, Col } from "antd";
import { obtenerProductos } from "../lib/erp-client";
import { TiendaGrid } from "./tienda/tienda-grid";
import { GaleriaSection } from "./galeria-section";
import { TratamientosSection } from "./tratamientos-section";
import { Reveal } from "./reveal";
import { HeroParallax } from "./hero-parallax";
import { HeroCarousel } from "./hero-carousel";

const HERO_IMAGENES = ["/hero-tratamiento.jpg", "/especialidad-clinic.jpg", "/especialidad-spa.jpg"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const productos = await obtenerProductos();
  const destacados = productos.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section style={{ position: "relative", height: "92vh", minHeight: 560, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <HeroParallax>
          <HeroCarousel imagenes={HERO_IMAGENES} />
        </HeroParallax>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.7) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "0 24px 64px",
            color: "#fff",
            maxWidth: 720,
            animation: "nuo-fade-up 1s cubic-bezier(0.16,1,0.3,1) both",
            animationDelay: "0.2s",
          }}
        >
          <span className="nuo-eyebrow" style={{ color: "var(--nuo-oro)" }}>
            Desde 2022 · Asunción, Paraguay
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", textTransform: "uppercase", lineHeight: 1.15, marginBottom: 16 }}>
            Un refugio de calma, belleza y bienestar
          </h1>
          <p style={{ fontSize: 16, marginBottom: 28, maxWidth: 520, opacity: 0.92, fontWeight: 300 }}>
            Centro médico-estético que une salud, ciencia y bienestar en un solo lugar. Atención personalizada con un
            equipo interdisciplinario reconocido a nivel nacional e internacional.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/tienda">
              <Button type="primary" size="large" className="nuo-btn-animated">
                Ver tienda
              </Button>
            </Link>
            <Link href="/reservar">
              <Button size="large" ghost className="nuo-btn-animated">
                Reservar mi turno
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="nuo-section">
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} md={11}>
            <Reveal>
              <span className="nuo-eyebrow">Quiénes somos</span>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 18, lineHeight: 1.25 }}>
                Salud, ciencia y bienestar en un solo lugar
              </h2>
              <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
                Trabajamos con un enfoque integral, ofreciendo atención personalizada y servicios de alta calidad a
                través de un equipo interdisciplinario de profesionales altamente capacitados.
              </p>
              <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
                Nuestra propuesta se basa en un acompañamiento seguro, humano y ético, con los más altos estándares de
                atención y resultados visibles que transforman la vida de nuestros pacientes.
              </p>
              <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
                Hoy, seguimos creciendo con la apertura de una nueva sucursal enfocada en el bienestar y la relajación:
                un Spa Médico que combina tecnología, confort y tratamientos personalizados para que vivas una
                experiencia única de cuidado y renovación.
              </p>
              <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.8, fontWeight: 300 }}>
                Creemos que la verdadera belleza comienza con el equilibrio interior. Por eso, cada detalle de nuestro
                centro está pensado para potenciar tu salud, tu confianza y tu bienestar.
              </p>
            </Reveal>
          </Col>
          <Col xs={24} md={13}>
            <Reveal delay={150}>
              <div className="nuo-hover-zoom" style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 8 }}>
                <Image src="/nosotros.jpg" alt="Equipo Nuo Esthetic" fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </Reveal>
          </Col>
        </Row>

        <Reveal delay={100}>
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
        </Reveal>
      </section>

      {/* Galería / equipo */}
      <section id="equipo" className="nuo-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <span className="nuo-eyebrow">Atención profesional</span>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 12, maxWidth: 640 }}>Un equipo interdisciplinario a tu lado</h2>
          <p style={{ color: "var(--nuo-taupe)", maxWidth: 640, marginBottom: 12, lineHeight: 1.8, fontWeight: 300 }}>
            Contamos con un equipo interdisciplinario de profesionales altamente especializados, con amplia trayectoria
            y formación constante a nivel nacional e internacional.
          </p>
          <p style={{ color: "var(--nuo-taupe)", maxWidth: 640, marginBottom: 36, lineHeight: 1.8, fontWeight: 300 }}>
            Trabajamos en conjunto para ofrecer un abordaje integral, donde la salud, la estética y el bienestar se
            complementan para potenciar lo mejor de cada persona.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <GaleriaSection />
        </Reveal>
      </section>

      {/* Especialidades */}
      <section style={{ background: "#F7F4F1" }}>
        <div className="nuo-section">
          <Reveal>
            <span className="nuo-eyebrow">Dos espacios, un mismo cuidado</span>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 12 }}>Nuestras especialidades</h2>
            <p style={{ color: "var(--nuo-taupe)", maxWidth: 620, marginBottom: 36, lineHeight: 1.8, fontWeight: 300 }}>
              Nuo Clinic para lo médico-estético y Nuo Spa para el bienestar y la relajación — cada sucursal con su
              propio enfoque, bajo el mismo estándar de calidad y atención personalizada.
            </p>
          </Reveal>
          <div className="nuo-especialidad-grid">
            <Reveal delay={0}>
              <div className="nuo-hover-zoom nuo-card-lift" style={{ position: "relative", height: 320, borderRadius: 8 }}>
                <Image src="/especialidad-clinic.jpg" alt="Nuo Clinic" fill style={{ objectFit: "cover" }} sizes="(max-width: 720px) 100vw, 50vw" />
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
            </Reveal>
            <Reveal delay={150}>
              <div className="nuo-hover-zoom nuo-card-lift" style={{ position: "relative", height: 320, borderRadius: 8 }}>
                <Image src="/especialidad-spa.jpg" alt="Nuo Spa" fill style={{ objectFit: "cover" }} sizes="(max-width: 720px) 100vw, 50vw" />
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tratamientos */}
      <section id="tratamientos" className="nuo-section">
        <Reveal>
          <span className="nuo-eyebrow">Face &amp; body</span>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 12 }}>Tratamientos</h2>
          <p style={{ color: "var(--nuo-taupe)", maxWidth: 620, marginBottom: 32, lineHeight: 1.8, fontWeight: 300 }}>
            Faciales, masajes, combos y procedimientos estéticos con tecnología, cosmética coreana y protocolos
            personalizados según lo que tu piel necesita.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <TratamientosSection />
        </Reveal>
      </section>

      {/* Destacados de la tienda */}
      {destacados.length > 0 && (
        <section className="nuo-section">
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="nuo-eyebrow">Skincare</span>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", margin: 0 }}>Productos destacados</h2>
              </div>
              <Link href="/tienda" className="nuo-nav-link" style={{ color: "var(--nuo-terracota)", fontWeight: 500, textTransform: "none", letterSpacing: "normal", fontSize: 15 }}>
                Ver toda la tienda →
              </Link>
            </div>
            <TiendaGrid productos={destacados} ocultarTitulo />
          </Reveal>
        </section>
      )}

      {/* Contacto / CTA */}
      <section id="contacto" style={{ background: "var(--nuo-terracota)", color: "#fff" }}>
        <Reveal>
          <div className="nuo-section" style={{ textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 14 }}>Reservá tu turno</h2>
            <p style={{ maxWidth: 520, margin: "0 auto 28px", opacity: 0.92, lineHeight: 1.8, fontWeight: 300 }}>
              Escribinos por WhatsApp y coordinamos tu cita en Nuo Clinic o Nuo Spa según el tratamiento que buscás.
            </p>
            <a
              href="https://wa.me/595971203800?text=Hola%2C%20quiero%20agendar%20un%20turno.."
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="large"
                className="nuo-btn-animated"
                style={{ background: "#fff", color: "var(--nuo-terracota)", border: "none", fontWeight: 600 }}
              >
                Escribir por WhatsApp
              </Button>
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
