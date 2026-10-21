import type { TestimonioWeb } from "../lib/erp-client";

const ETIQUETA_FUENTE: Record<string, string> = { google: "Reseña de Google", instagram: "Instagram" };

function Estrellas({ n }: { n: number }) {
  return (
    <span aria-label={`${n} de 5 estrellas`} role="img" style={{ color: "var(--nuo-oro)", letterSpacing: 2, fontSize: 16 }}>
      {"★".repeat(n)}
      <span style={{ color: "#e4dfdb" }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

/** Testimonios cargados en el ERP. Sin testimonios publicados no se muestra la sección. */
export function TestimoniosSection({ testimonios, urlGoogle }: { testimonios: TestimonioWeb[]; urlGoogle?: string }) {
  if (testimonios.length === 0) return null;
  return (
    <section id="testimonios" style={{ background: "#F7F4F1" }}>
      <div className="nuo-section">
        <span className="nuo-eyebrow">Lo que dicen nuestras clientas</span>
        <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 28 }}>Experiencias reales</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {testimonios.map((t) => (
            <figure key={t.id} style={{ margin: 0, background: "#fff", border: "1px solid #f0eeeb", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column" }}>
              <Estrellas n={t.estrellas} />
              <blockquote style={{ margin: "12px 0 16px", lineHeight: 1.8, fontWeight: 300, flex: 1, whiteSpace: "pre-line" }}>“{t.texto}”</blockquote>
              <figcaption style={{ fontSize: 14 }}>
                <b style={{ fontWeight: 500 }}>{t.nombre}</b>
                {t.servicioNombre && <span style={{ color: "var(--nuo-taupe)" }}> · {t.servicioNombre}</span>}
                {ETIQUETA_FUENTE[t.fuente] && (
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {t.urlOrigen ? (
                      <a href={t.urlOrigen} target="_blank" rel="noreferrer" style={{ color: "var(--nuo-terracota)" }}>{ETIQUETA_FUENTE[t.fuente]} ↗</a>
                    ) : (
                      <span style={{ color: "var(--nuo-taupe)" }}>{ETIQUETA_FUENTE[t.fuente]}</span>
                    )}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        {urlGoogle && (
          <p style={{ marginTop: 24 }}>
            <a href={urlGoogle} target="_blank" rel="noreferrer" style={{ color: "var(--nuo-terracota)", fontWeight: 500 }}>
              Ver todas las reseñas en Google ↗
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
