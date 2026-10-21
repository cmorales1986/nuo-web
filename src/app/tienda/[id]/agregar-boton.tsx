"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, InputNumber, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "../cart-context";

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function AgregarAlCarrito({
  productoId,
  nombre,
  precioVenta,
  sinStock,
  stockDisponible,
  imagenUrl,
}: {
  productoId: string;
  nombre: string;
  precioVenta: number;
  sinStock: boolean;
  stockDisponible: number;
  imagenUrl: string | null;
}) {
  const { agregar } = useCarrito();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);

  return (
    <div>
      <Space size={12} wrap style={{ width: "100%" }}>
        <InputNumber min={1} max={Math.max(1, Math.min(20, stockDisponible))} value={cantidad} onChange={(v) => setCantidad(v ?? 1)} size="large" disabled={sinStock} />
        <Button type="primary" size="large" icon={<ShoppingCartOutlined />} disabled={sinStock} onClick={() => agregar({ productoId, nombre, precioVenta, imagenUrl }, cantidad)}>
          {sinStock ? "Sin stock por ahora" : "Agregar al carrito"}
        </Button>
      </Space>
      {!sinStock && (
        <Button
          size="large"
          block
          style={{ marginTop: 10, color: "var(--nuo-terracota)", borderColor: "var(--nuo-terracota)" }}
          onClick={() => {
            agregar({ productoId, nombre, precioVenta, imagenUrl }, cantidad, { abrir: false });
            router.push("/tienda/checkout");
          }}
        >
          Comprar ahora
        </Button>
      )}

      {/* En celular: barra fija abajo, para no tener que subir y bajar para comprar. */}
      {!sinStock && (
        <div className="nuo-barra-compra" role="region" aria-label="Comprar">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "var(--nuo-taupe)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombre}</div>
            <div style={{ fontWeight: 600, color: "var(--nuo-terracota)" }}>{formatearGs(precioVenta)}</div>
          </div>
          <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={() => agregar({ productoId, nombre, precioVenta, imagenUrl }, cantidad)}>
            Agregar
          </Button>
        </div>
      )}
    </div>
  );
}
