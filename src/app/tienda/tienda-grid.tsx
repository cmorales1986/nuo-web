"use client";

import { Row, Col, Card, Typography, Button, Empty, App } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { ProductoTienda } from "../../lib/erp-client";
import { useCarrito } from "./cart-context";

const { Text, Title } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function TiendaGrid({ productos }: { productos: ProductoTienda[] }) {
  const { agregar } = useCarrito();
  const { message } = App.useApp();

  if (productos.length === 0) {
    return <Empty description="Todavía no hay productos publicados en la tienda." style={{ marginTop: 80 }} />;
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 4 }}>Nuestros productos</Title>
      <Text type="secondary">Productos de cuidado de la piel seleccionados por Nuo Esthetic.</Text>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {productos.map((p) => {
          const sinStock = p.stockDisponible <= 0;
          return (
            <Col xs={24} sm={12} md={8} key={p.id}>
              <Card
                hoverable
                cover={
                  p.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagenUrl} alt={p.nombre} style={{ height: 200, objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: 200, background: "#F0EEEB", display: "flex", alignItems: "center", justifyContent: "center", color: "#bfbfbf" }}>Sin foto</div>
                  )
                }
              >
                <Card.Meta
                  title={p.nombre}
                  description={
                    <>
                      <Text type="secondary" style={{ display: "block", minHeight: 40, fontSize: 13 }}>{p.descripcion || " "}</Text>
                      <Text strong style={{ fontSize: 16 }}>{formatearGs(Number(p.precioVenta))}</Text>
                      {sinStock && <Text type="danger" style={{ display: "block", fontSize: 12 }}>Sin stock por ahora</Text>}
                    </>
                  }
                />
                <Button
                  type="primary"
                  block
                  icon={<ShoppingCartOutlined />}
                  style={{ marginTop: 12 }}
                  disabled={sinStock}
                  onClick={() => {
                    agregar({ productoId: p.id, nombre: p.nombre, precioVenta: Number(p.precioVenta) });
                    message.success(`"${p.nombre}" agregado al carrito.`);
                  }}
                >
                  Agregar al carrito
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
