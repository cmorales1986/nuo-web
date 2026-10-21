"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Checkbox, Empty, Input, Select, Slider, Typography, App } from "antd";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { KitTienda, ProductoTienda } from "../../lib/erp-client";
import { useCarrito } from "./cart-context";
import { KitsSection } from "./kits-section";

const { Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

/** Sin acentos ni mayúsculas, para que "tonico" encuentre "Tónico". */
function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

type Orden = "az" | "precio_asc" | "precio_desc";

const TODO = "__todo__";
const KITS = "__kits__";
// Con pocas unidades se avisa "Quedan N" (urgencia honesta: es el stock real del ERP).
const STOCK_BAJO = 5;

export function CatalogoTienda({ productos, kits }: { productos: ProductoTienda[]; kits: KitTienda[] }) {
  const { agregar } = useCarrito();
  const { message } = App.useApp();

  const precios = productos.map((p) => Number(p.precioVenta));
  const minPrecio = precios.length ? Math.min(...precios) : 0;
  const maxPrecio = precios.length ? Math.max(...precios) : 0;
  // Con pocos productos, un filtro de precio sobra: solo aparece cuando el catálogo ya lo justifica.
  const mostrarPrecio = productos.length >= 6 && maxPrecio > minPrecio;

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string>(TODO);
  const [soloStock, setSoloStock] = useState(false);
  const [rango, setRango] = useState<[number, number]>([minPrecio, maxPrecio]);
  const [orden, setOrden] = useState<Orden>("az");

  const categorias = useMemo(() => {
    const cuenta = new Map<string, number>();
    for (const p of productos) cuenta.set(p.categoriaNombre, (cuenta.get(p.categoriaNombre) ?? 0) + 1);
    return [...cuenta.entries()].sort((a, b) => a[0].localeCompare(b[0], "es"));
  }, [productos]);

  const q = normalizar(busqueda.trim());
  const filtrados = useMemo(() => {
    const lista = productos.filter((p) => {
      if (categoria !== TODO && categoria !== KITS && p.categoriaNombre !== categoria) return false;
      if (soloStock && p.stockDisponible <= 0) return false;
      const precio = Number(p.precioVenta);
      if (mostrarPrecio && (precio < rango[0] || precio > rango[1])) return false;
      if (q && !normalizar(`${p.nombre} ${p.categoriaNombre} ${p.descripcion ?? ""} ${p.ingredientes ?? ""}`).includes(q)) return false;
      return true;
    });
    if (orden === "precio_asc") lista.sort((a, b) => Number(a.precioVenta) - Number(b.precioVenta));
    else if (orden === "precio_desc") lista.sort((a, b) => Number(b.precioVenta) - Number(a.precioVenta));
    else lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return lista;
  }, [productos, categoria, soloStock, rango, mostrarPrecio, q, orden]);

  const kitsVisibles = kits.filter((k) => (categoria === TODO || categoria === KITS) && (!q || normalizar(`${k.nombre} ${k.descripcion ?? ""}`).includes(q)));
  const verProductos = categoria !== KITS;
  const hayFiltros = busqueda || categoria !== TODO || soloStock || (mostrarPrecio && (rango[0] !== minPrecio || rango[1] !== maxPrecio));

  function limpiar() {
    setBusqueda("");
    setCategoria(TODO);
    setSoloStock(false);
    setRango([minPrecio, maxPrecio]);
  }

  const chip = (activa: boolean): React.CSSProperties => ({
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 2px",
    fontSize: 14,
    whiteSpace: "nowrap",
    color: activa ? "var(--nuo-terracota)" : "var(--nuo-taupe)",
    borderBottom: activa ? "2px solid var(--nuo-terracota)" : "2px solid transparent",
    fontFamily: "inherit",
  });

  return (
    <div>
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined style={{ color: "var(--nuo-taupe)" }} />}
        placeholder="Buscar productos, ingredientes, tratamientos"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ maxWidth: 560, marginBottom: 18 }}
      />

      <div style={{ display: "flex", gap: 22, overflowX: "auto", borderBottom: "1px solid #ece7e3", marginBottom: 22 }} role="tablist" aria-label="Categorías">
        <button style={chip(categoria === TODO)} onClick={() => setCategoria(TODO)} role="tab" aria-selected={categoria === TODO}>
          Todo ({productos.length})
        </button>
        {categorias.map(([nombre, n]) => (
          <button key={nombre} style={chip(categoria === nombre)} onClick={() => setCategoria(nombre)} role="tab" aria-selected={categoria === nombre}>
            {nombre} ({n})
          </button>
        ))}
        {kits.length > 0 && (
          <button style={chip(categoria === KITS)} onClick={() => setCategoria(KITS)} role="tab" aria-selected={categoria === KITS}>
            Kits ({kits.length})
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        <aside style={{ flex: "0 0 210px", maxWidth: "100%", fontSize: 14 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Disponibilidad</div>
          <Checkbox checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)}>
            Solo con stock
          </Checkbox>
          {mostrarPrecio && (
            <div style={{ marginTop: 22 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Precio</div>
              <Slider
                range
                min={minPrecio}
                max={maxPrecio}
                step={5000}
                value={rango}
                onChange={(v) => setRango(v as [number, number])}
                tooltip={{ formatter: (v) => formatearGs(Number(v)) }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--nuo-taupe)" }}>
                <span>{formatearGs(rango[0])}</span>
                <span>{formatearGs(rango[1])}</span>
              </div>
            </div>
          )}
          {hayFiltros && (
            <Button type="link" onClick={limpiar} style={{ padding: 0, marginTop: 18, color: "var(--nuo-terracota)" }}>
              Limpiar filtros
            </Button>
          )}
        </aside>

        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          {verProductos && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <Text type="secondary">
                {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
              </Text>
              <Select
                value={orden}
                onChange={setOrden}
                style={{ width: 200 }}
                options={[
                  { value: "az", label: "Ordenar: nombre (A–Z)" },
                  { value: "precio_asc", label: "Ordenar: menor precio" },
                  { value: "precio_desc", label: "Ordenar: mayor precio" },
                ]}
              />
            </div>
          )}

          {kitsVisibles.length > 0 && <KitsSection kits={kitsVisibles} />}

          {verProductos &&
            (filtrados.length === 0 ? (
              <Empty description="No encontramos productos con esos filtros.">
                {hayFiltros && <Button onClick={limpiar}>Limpiar filtros</Button>}
              </Empty>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}>
                {filtrados.map((p) => {
                  const sinStock = p.stockDisponible <= 0;
                  const pocoStock = !sinStock && p.stockDisponible <= STOCK_BAJO;
                  return (
                    <div key={p.id} className="nuo-card-lift" style={{ border: "1px solid #f0eeeb", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
                      <Link href={`/tienda/${p.id}`} style={{ display: "block", color: "inherit" }}>
                        {p.imagenUrl ? (
                          <div className="nuo-hover-zoom">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.imagenUrl} alt={p.nombre} style={{ height: 190, width: "100%", objectFit: "cover", display: "block" }} />
                          </div>
                        ) : (
                          <div style={{ height: 190, background: "#F7F4F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9c2be" }}>Sin foto</div>
                        )}
                      </Link>
                      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{p.categoriaNombre}</Text>
                        <Link href={`/tienda/${p.id}`} style={{ color: "inherit", fontFamily: "var(--font-heading), serif", fontSize: 16, lineHeight: 1.3, margin: "2px 0 6px" }}>
                          {p.nombre}
                        </Link>
                        <Text strong style={{ fontSize: 17, color: "var(--nuo-terracota)" }}>{formatearGs(Number(p.precioVenta))}</Text>
                        <div style={{ minHeight: 20, fontSize: 12, marginBottom: 8 }}>
                          {sinStock && <Text type="danger">Sin stock por ahora</Text>}
                          {pocoStock && <Text style={{ color: "#a8412f" }}>Quedan {p.stockDisponible}</Text>}
                        </div>
                        <Button
                          type="primary"
                          block
                          icon={<ShoppingCartOutlined />}
                          disabled={sinStock}
                          style={{ marginTop: "auto" }}
                          onClick={() => {
                            agregar({ productoId: p.id, nombre: p.nombre, precioVenta: Number(p.precioVenta) });
                            message.success(`"${p.nombre}" agregado al carrito.`);
                          }}
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
