"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, InputNumber, Space, App } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "../cart-context";

export function AgregarAlCarrito({ productoId, nombre, precioVenta, sinStock, stockDisponible }: { productoId: string; nombre: string; precioVenta: number; sinStock: boolean; stockDisponible: number }) {
  const { agregar } = useCarrito();
  const { message } = App.useApp();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);

  function agregarAlCarrito() {
    agregar({ productoId, nombre, precioVenta }, cantidad);
  }

  return (
    <div>
      <Space size={12} wrap style={{ width: "100%" }}>
        <InputNumber min={1} max={Math.max(1, Math.min(20, stockDisponible))} value={cantidad} onChange={(v) => setCantidad(v ?? 1)} size="large" disabled={sinStock} />
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          disabled={sinStock}
          onClick={() => {
            agregarAlCarrito();
            message.success(`"${nombre}" agregado al carrito.`);
          }}
        >
          {sinStock ? "Sin stock por ahora" : "Agregar al carrito"}
        </Button>
      </Space>
      {!sinStock && (
        <Button
          size="large"
          block
          style={{ marginTop: 10, color: "var(--nuo-terracota)", borderColor: "var(--nuo-terracota)" }}
          onClick={() => {
            agregarAlCarrito();
            router.push("/tienda/checkout");
          }}
        >
          Comprar ahora
        </Button>
      )}
    </div>
  );
}
