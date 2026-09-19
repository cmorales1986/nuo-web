"use client";

import Link from "next/link";
import { Badge, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "./cart-context";

export function CarritoBoton({ claro = false }: { claro?: boolean }) {
  const { totalItems } = useCarrito();
  return (
    <Link href="/tienda/carrito">
      <Badge count={totalItems} size="small">
        <Button
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
    </Link>
  );
}
