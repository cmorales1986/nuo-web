"use client";

import Link from "next/link";
import { Button, Drawer, Empty, InputNumber, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCarrito } from "./cart-context";

const { Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

/** Carrito lateral: se abre al agregar un producto, sin sacar a la persona de la página que está mirando. */
export function CarritoDrawer() {
  const { items, abierto, cerrarCarrito, actualizarCantidad, quitar, totalItems } = useCarrito();
  const total = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);

  return (
    <Drawer
      open={abierto}
      onClose={cerrarCarrito}
      placement="right"
      size={420}
      title={`Tu carrito${totalItems > 0 ? ` (${totalItems})` : ""}`}
      styles={{ body: { padding: 0, display: "flex", flexDirection: "column" }, footer: { padding: 16 } }}
      footer={
        items.length > 0 ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <Text>Total</Text>
              <Text strong style={{ fontSize: 20, color: "var(--nuo-terracota)" }}>{formatearGs(total)}</Text>
            </div>
            <Link href="/tienda/checkout" onClick={cerrarCarrito}>
              <Button type="primary" size="large" block>
                Finalizar compra
              </Button>
            </Link>
            <Link href="/tienda/carrito" onClick={cerrarCarrito} style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 13, color: "var(--nuo-taupe)", textDecoration: "underline" }}>
              Ver carrito completo
            </Link>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <Empty description="Tu carrito está vacío" style={{ marginTop: 80 }}>
          <Link href="/tienda" onClick={cerrarCarrito}>
            <Button type="primary">Ver productos</Button>
          </Link>
        </Empty>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: "4px 16px", overflowY: "auto" }}>
          {items.map((i) => (
            <li key={i.productoId} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #f0eeeb" }}>
              {i.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.imagenUrl} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, background: "#F7F4F1", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 8, background: "#F7F4F1", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, lineHeight: 1.35 }}>{i.nombre}</div>
                <Text type="secondary" style={{ fontSize: 13 }}>{formatearGs(i.precioVenta)}</Text>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <InputNumber size="small" min={1} max={99} value={i.cantidad} onChange={(v) => actualizarCantidad(i.productoId, v ?? 1)} aria-label={`Cantidad de ${i.nombre}`} />
                  <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => quitar(i.productoId)} aria-label={`Quitar ${i.nombre}`} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
