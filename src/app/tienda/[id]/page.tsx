import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProductos, obtenerServiciosAgenda, obtenerKits } from "../../../lib/erp-client";
import { AgregarAlCarrito } from "./agregar-boton";
import { Galeria } from "./galeria";
import { Pestanas } from "./pestanas";

export const dynamic = "force-dynamic";

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

// Con pocas unidades se avisa "Quedan N" (es el stock real del ERP).
const STOCK_BAJO = 5;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = (await obtenerProductos().catch(() => [])).find((p) => p.id === id);
  return { title: producto ? `${producto.nombre} — Nuo Esthetic` : "Producto — Nuo Esthetic" };
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [productos, servicios, kits] = await Promise.all([obtenerProductos(), obtenerServiciosAgenda().catch(() => []), obtenerKits()]);
  const producto = productos.find((p) => p.id === id);
  if (!producto) notFound();

  const sinStock = producto.stockDisponible <= 0;
  const pocoStock = !sinStock && producto.stockDisponible <= STOCK_BAJO;
  const imagenes = [producto.imagenUrl, ...(producto.imagenesExtra ?? [])].filter((u): u is string => !!u);

  // Tratamientos que recomiendan este producto (cargado en el ERP, en Catálogo).
  const tratamientos = servicios.filter((s) => s.productosRecomendadosIds?.includes(producto.id));
  // Combina con: lo cargado a mano como venta cruzada, más lo que se recomienda junto en los mismos tratamientos.
  const idsRelacionados = new Set(tratamientos.flatMap((s) => s.productosRecomendadosIds ?? []));
  for (const sid of producto.sugeridosIds ?? []) idsRelacionados.add(sid);
  idsRelacionados.delete(producto.id);
  const relacionados = productos.filter((p) => idsRelacionados.has(p.id));
  const kitsConEste = kits.filter((k) => k.items.some((i) => i.productoId === producto.id));

  return (
    <div className="nuo-below-header">
      <div className="nuo-ficha-producto" style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 16px 80px" }}>
        <nav aria-label="Ubicación" style={{ fontSize: 13, color: "var(--nuo-taupe)" }}>
          <Link href="/tienda">Tienda</Link> / {producto.categoriaNombre} / <span style={{ color: "var(--foreground)" }}>{producto.nombre}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 44, marginTop: 20, alignItems: "start" }}>
          <Galeria imagenes={imagenes} nombre={producto.nombre} />

          <div>
            <span className="nuo-eyebrow">{producto.categoriaNombre}</span>
            <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", margin: "4px 0 10px" }}>{producto.nombre}</h1>
            <div style={{ fontSize: 26, color: "var(--nuo-terracota)", fontWeight: 600 }}>{formatearGs(Number(producto.precioVenta))}</div>
            <div style={{ fontSize: 13, margin: "6px 0 20px", color: sinStock ? "#cf1322" : pocoStock ? "#a8412f" : "#389e0d" }}>
              {sinStock ? "Sin stock por ahora" : pocoStock ? `Quedan ${producto.stockDisponible} unidades` : "En stock"}
            </div>

            <AgregarAlCarrito productoId={producto.id} nombre={producto.nombre} precioVenta={Number(producto.precioVenta)} sinStock={sinStock} stockDisponible={producto.stockDisponible} imagenUrl={producto.imagenUrl} />

            {tratamientos.length > 0 && (
              <div style={{ marginTop: 22, background: "#faf5f2", borderRadius: 10, padding: "12px 14px", fontSize: 13 }}>
                Se recomienda después de:{" "}
                {tratamientos.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ", "}
                    <Link href={`/reservar?servicio=${encodeURIComponent(s.id)}`} style={{ color: "var(--nuo-terracota)", fontWeight: 500 }}>
                      {s.nombre}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <Pestanas descripcion={producto.descripcion} modoUso={producto.modoUso} ingredientes={producto.ingredientes} />
        </div>

        {(relacionados.length > 0 || kitsConEste.length > 0) && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Combina muy bien con</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
              {relacionados.map((p) => (
                <Link key={p.id} href={`/tienda/${p.id}`} style={{ border: "1px solid #f0eeeb", borderRadius: 10, overflow: "hidden", display: "block", color: "inherit" }}>
                  {p.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagenUrl} alt={p.nombre} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: 130, background: "#F7F4F1" }} />
                  )}
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                    <div style={{ color: "var(--nuo-terracota)", marginTop: 2 }}>{formatearGs(Number(p.precioVenta))}</div>
                  </div>
                </Link>
              ))}
              {kitsConEste.map((k) => (
                <Link key={k.id} href={`/tienda#kit-${k.id}`} style={{ border: "1px solid #c9a876", background: "#fbf7ef", borderRadius: 10, padding: 14, display: "block", color: "inherit" }}>
                  <div style={{ fontSize: 12, color: "var(--nuo-taupe)" }}>Kit</div>
                  <div style={{ fontWeight: 500 }}>{k.nombre}</div>
                  <div style={{ color: "var(--nuo-terracota)", marginTop: 2 }}>
                    {formatearGs(k.precioKit)}
                    {k.descuentoPorcentaje > 0 ? ` · -${Math.round(k.descuentoPorcentaje)}%` : ""}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
