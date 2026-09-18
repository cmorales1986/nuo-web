"use client";

import Link from "next/link";
import { Badge, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCarrito } from "./cart-context";

export function CarritoBoton() {
  const { totalItems } = useCarrito();
  return (
    <Link href="/tienda/carrito">
      <Badge count={totalItems} size="small">
        <Button icon={<ShoppingCartOutlined />}>Carrito</Button>
      </Badge>
    </Link>
  );
}
