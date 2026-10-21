"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, Button, InputNumber, Typography, Empty, Space, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCarrito } from "../cart-context";
import type { ProductoTienda, KitTienda } from "../../../lib/erp-client";

const { Title, Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function CarritoView({ productos, kits }: { productos: ProductoTienda[]; kits: KitTienda[] }) {
  const { items, actualizarCantidad, quitar, agregar } = useCarrito();
  const router = useRouter();
  const total = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);

  // Venta cruzada: lo que el ERP sugiere para cada producto del carrito, sin repetir lo que ya está y solo con stock.
  // Lo que viene dentro de un kit del carrito también cuenta como "ya está".
  const enCarrito = new Set(items.flatMap((i) => (i.kitId ? (kits.find((k) => k.id === i.kitId)?.items.map((x) => x.productoId) ?? []) : [i.productoId])));
  const porId = new Map(productos.map((p) => [p.id, p]));
  const sugerencias: { producto: ProductoTienda; motivo: string }[] = [];
  for (const item of items.filter((i) => !i.kitId)) {
    for (const sid of porId.get(item.productoId)?.sugeridosIds ?? []) {
      const s = porId.get(sid);
      if (!s || enCarrito.has(s.id) || s.stockDisponible <= 0 || sugerencias.some((x) => x.producto.id === s.id)) continue;
      sugerencias.push({ producto: s, motivo: item.nombre });
    }
  }
  const sugerenciasVisibles = sugerencias.slice(0, 3);

  return (
    <div className="nuo-below-header" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 16px" }}>
      {items.length === 0 ? (
        <Empty description="Tu carrito está vacío" style={{ marginTop: 60 }}>
          <Link href="/tienda">
            <Button type="primary">Ver productos</Button>
          </Link>
        </Empty>
      ) : (
        <Card style={{ borderRadius: 10, border: "1px solid #f0eeeb" }}>
          <Title level={2} style={{ marginBottom: 20 }}>Tu carrito</Title>
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
        </Card>
      )}
      {items.length > 0 && sugerenciasVisibles.length > 0 && (
        <Card style={{ borderRadius: 10, border: "1px solid #f0eeeb", marginTop: 20 }}>
          <Title level={4} style={{ marginTop: 0 }}>Completá tu pedido</Title>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {sugerenciasVisibles.map(({ producto, motivo }) => (
              <div key={producto.id} style={{ border: "1px solid #f0eeeb", borderRadius: 10, padding: 14 }}>
                <Text type="secondary" style={{ fontSize: 12, display: "block" }}>Combina muy bien con {motivo}</Text>
                <Link href={`/tienda/${producto.id}`} style={{ fontWeight: 500, color: "inherit", display: "block", margin: "4px 0" }}>{producto.nombre}</Link>
                <Text strong style={{ color: "var(--nuo-terracota)" }}>{formatearGs(Number(producto.precioVenta))}</Text>
                <Button block style={{ marginTop: 10 }} onClick={() => agregar({ productoId: producto.id, nombre: producto.nombre, precioVenta: Number(producto.precioVenta) })}>
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
