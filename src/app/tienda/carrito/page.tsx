"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, Button, InputNumber, Typography, Empty, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCarrito } from "../cart-context";

const { Title, Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export default function CarritoPage() {
  const { items, actualizarCantidad, quitar } = useCarrito();
  const router = useRouter();
  const total = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>
      {items.length === 0 ? (
        <Empty description="Tu carrito está vacío">
          <Link href="/tienda">
            <Button type="primary">Ver productos</Button>
          </Link>
        </Empty>
      ) : (
        <>
          <Title level={2}>Tu carrito</Title>
          <Table
            rowKey="productoId"
            dataSource={items}
            pagination={false}
            columns={[
              { title: "Producto", dataIndex: "nombre" },
              { title: "Precio", dataIndex: "precioVenta", render: (v: number) => formatearGs(v) },
              {
                title: "Cantidad",
                dataIndex: "cantidad",
                render: (v: number, item) => <InputNumber min={1} value={v} onChange={(nuevo) => actualizarCantidad(item.productoId, nuevo ?? 1)} />,
              },
              { title: "Subtotal", render: (_, item) => formatearGs(item.precioVenta * item.cantidad) },
              { title: "", render: (_, item) => <Button danger type="text" icon={<DeleteOutlined />} onClick={() => quitar(item.productoId)} /> },
            ]}
          />
          <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 16 }}>
            <Link href="/tienda">
              <Button>Seguir comprando</Button>
            </Link>
            <Space size={16}>
              <Text strong style={{ fontSize: 18 }}>Total: {formatearGs(total)}</Text>
              <Button type="primary" size="large" onClick={() => router.push("/tienda/checkout")}>
                Continuar
              </Button>
            </Space>
          </Space>
        </>
      )}
    </div>
  );
}
