"use client";

import { Badge, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "./cart-context";

export function CarritoBoton({ claro = false }: { claro?: boolean }) {
  const { totalItems, abrirCarrito } = useCarrito();
  return (
    <span>
      <Badge count={totalItems} size="small">
        <Button
          onClick={abrirCarrito}
          icon={<ShoppingCartOutlined />}
          style={
            claro
              ? { background: "transparent", borderColor: "rgba(255,255,255,0.7)", color: "#fff" }
              : undefined
          }
        >
          Carrito
        </Button>
      </Badge>
    </span>
  );
}
