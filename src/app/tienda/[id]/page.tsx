import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProductos, obtenerServiciosAgenda } from "../../../lib/erp-client";
import { AgregarAlCarrito } from "./agregar-boton";

export const dynamic = "force-dynamic";

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = (await obtenerProductos().catch(() => [])).find((p) => p.id === id);
  return { title: producto ? `${producto.nombre} — Nuo Esthetic` : "Producto — Nuo Esthetic" };
}

/** Texto libre con saltos de línea (modo de uso / ingredientes) — se respetan sin armar HTML. */
function Bloque({ titulo, texto }: { titulo: string; texto: string | null }) {
  if (!texto) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>{titulo}</h2>
      <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: 1.8, color: "var(--nuo-taupe)" }}>{texto}</p>
    </section>
  );
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [productos, servicios] = await Promise.all([obtenerProductos(), obtenerServiciosAgenda().catch(() => [])]);
  const producto = productos.find((p) => p.id === id);
  if (!producto) notFound();

  const sinStock = producto.stockDisponible <= 0;
  // Tratamientos que recomiendan este producto (cargado en el ERP, en Catálogo).
  const tratamientos = servicios.filter((s) => s.productosRecomendadosIds?.includes(producto.id));
  // Otros productos para completar la rutina: los recomendados junto a los mismos tratamientos.
  const idsRelacionados = new Set(tratamientos.flatMap((s) => s.productosRecomendadosIds ?? []));
  idsRelacionados.delete(producto.id);
  const relacionados = productos.filter((p) => idsRelacionados.has(p.id));

  return (
    <div className="nuo-below-header">
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 16px 80px" }}>
        <Link href="/tienda" style={{ fontSize: 14, color: "var(--nuo-taupe)" }}>
          ← Volver a la tienda
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, marginTop: 20, alignItems: "start" }}>
          <div>
            {producto.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={producto.imagenUrl} alt={producto.nombre} style={{ width: "100%", borderRadius: 12, display: "block", objectFit: "cover" }} />
            ) : (
              <div style={{ height: 360, background: "#F7F4F1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9c2be" }}>Sin foto</div>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", margin: "0 0 10px" }}>{producto.nombre}</h1>
            <div style={{ fontSize: 24, color: "var(--nuo-terracota)", fontWeight: 600, marginBottom: 16 }}>{formatearGs(Number(producto.precioVenta))}</div>
            {producto.descripcion && <p style={{ margin: "0 0 22px", whiteSpace: "pre-line", lineHeight: 1.8 }}>{producto.descripcion}</p>}
            <AgregarAlCarrito productoId={producto.id} nombre={producto.nombre} precioVenta={Number(producto.precioVenta)} sinStock={sinStock} />

            <Bloque titulo="Modo de uso" texto={producto.modoUso} />
            <Bloque titulo="Ingredientes" texto={producto.ingredientes} />

            {tratamientos.length > 0 && (
              <section style={{ marginTop: 28 }}>
                <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>Se recomienda después de</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tratamientos.map((s) => (
                    <Link key={s.id} href={`/reservar?servicio=${encodeURIComponent(s.id)}`} style={{ padding: "6px 14px", borderRadius: 20, background: "#F7F4F1", border: "1px solid #ece7e3", fontSize: 13 }}>
                      {s.nombre}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Completá tu rutina</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {relacionados.map((p) => (
                <Link key={p.id} href={`/tienda/${p.id}`} style={{ border: "1px solid #f0eeeb", borderRadius: 10, padding: 14, display: "block", color: "inherit" }}>
                  <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                  <div style={{ color: "var(--nuo-terracota)", marginTop: 4 }}>{formatearGs(Number(p.precioVenta))}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
