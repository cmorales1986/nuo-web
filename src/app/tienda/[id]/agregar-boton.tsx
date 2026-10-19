"use client";

import { useState } from "react";
import { Button, InputNumber, Space, App } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "../cart-context";

export function AgregarAlCarrito({ productoId, nombre, precioVenta, sinStock }: { productoId: string; nombre: string; precioVenta: number; sinStock: boolean }) {
  const { agregar } = useCarrito();
  const { message } = App.useApp();
  const [cantidad, setCantidad] = useState(1);

  return (
    <Space size={12} wrap>
      <InputNumber min={1} max={20} value={cantidad} onChange={(v) => setCantidad(v ?? 1)} size="large" disabled={sinStock} />
      <Button
        type="primary"
        size="large"
        icon={<ShoppingCartOutlined />}
        disabled={sinStock}
        onClick={() => {
          agregar({ productoId, nombre, precioVenta }, cantidad);
          message.success(`"${nombre}" agregado al carrito.`);
        }}
      >
        {sinStock ? "Sin stock por ahora" : "Agregar al carrito"}
      </Button>
    </Space>
  );
}
