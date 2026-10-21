"use client";

import { Card, Typography, Button, Tag } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import type { KitTienda } from "../../lib/erp-client";
import { useCarrito } from "./cart-context";

const { Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function KitsSection({ kits }: { kits: KitTienda[] }) {
  const { agregar } = useCarrito();
  if (kits.length === 0) return null;

  return (
    <section style={{ marginBottom: 56 }}>
      <span className="nuo-eyebrow">Rutinas completas</span>
      <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", margin: "0 0 6px" }}>Kits post-tratamiento</h2>
      <Text type="secondary">Todo lo que necesitás para continuar el cuidado en casa, a mejor precio que por separado.</Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginTop: 20 }}>
        {kits.map((k) => {
          const sinStock = k.stockDisponible <= 0;
          return (
            <Card key={k.id} id={`kit-${k.id}`} className="nuo-card-lift" style={{ borderRadius: 10, border: "1px solid #f0eeeb" }} styles={{ body: { padding: 20 } }}>
              {k.imagenUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={k.imagenUrl} alt={k.nombre} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 14, display: "block" }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <h3 style={{ fontSize: 18, margin: 0 }}>{k.nombre}</h3>
                {k.descuentoPorcentaje > 0 && <Tag color="red" style={{ marginInlineEnd: 0 }}>-{Math.round(k.descuentoPorcentaje)}%</Tag>}
              </div>
              {k.descripcion && <Text type="secondary" style={{ display: "block", fontSize: 13, margin: "6px 0 10px", lineHeight: 1.7 }}>{k.descripcion}</Text>}
              <ul style={{ margin: "8px 0 14px", paddingLeft: 18, fontSize: 13 }}>
                {k.items.map((i) => (
                  <li key={i.productoId}>
                    {i.cantidad > 1 ? `${i.cantidad} × ` : ""}
                    {i.nombre}
                  </li>
                ))}
              </ul>
              <div style={{ marginBottom: 12 }}>
                {k.precioKit < k.precioSeparado && <Text delete type="secondary" style={{ marginRight: 8 }}>{formatearGs(k.precioSeparado)}</Text>}
                <Text strong style={{ fontSize: 19, color: "var(--nuo-terracota)" }}>{formatearGs(k.precioKit)}</Text>
                {k.precioKit < k.precioSeparado && <Text style={{ display: "block", fontSize: 12, color: "#389e0d" }}>Ahorrás {formatearGs(k.precioSeparado - k.precioKit)}</Text>}
              </div>
              <Button
                type="primary"
                block
                icon={<GiftOutlined />}
                disabled={sinStock}
                onClick={() => {
                  agregar({ productoId: `kit:${k.id}`, kitId: k.id, nombre: `Kit: ${k.nombre}`, precioVenta: k.precioKit, imagenUrl: k.imagenUrl });
                }}
              >
                {sinStock ? "Sin stock por ahora" : "Agregar kit al carrito"}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
