"use client";

import { Row, Col, Card, Typography, Button, Empty, App } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { ProductoTienda } from "../../lib/erp-client";
import { useCarrito } from "./cart-context";

const { Text, Title } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function TiendaGrid({ productos, ocultarTitulo }: { productos: ProductoTienda[]; ocultarTitulo?: boolean }) {
  const { agregar } = useCarrito();
  const { message } = App.useApp();

  if (productos.length === 0) {
    return <Empty description="Todavía no hay productos publicados en la tienda." style={{ marginTop: 80 }} />;
  }

  return (
    <div>
      {!ocultarTitulo && (
        <>
          <Title level={2} style={{ marginBottom: 4 }}>Nuestros productos</Title>
          <Text type="secondary">Productos de cuidado de la piel seleccionados por Nuo Esthetic.</Text>
        </>
      )}
      <Row gutter={[20, 20]} style={{ marginTop: ocultarTitulo ? 0 : 20 }}>
        {productos.map((p) => {
          const sinStock = p.stockDisponible <= 0;
          return (
            <Col xs={24} sm={12} md={8} key={p.id}>
              <Card
                hoverable
                style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f0eeeb" }}
                styles={{ body: { padding: 16 } }}
                cover={
                  p.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagenUrl} alt={p.nombre} style={{ height: 220, objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: 220, background: "#F7F4F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9c2be" }}>Sin foto</div>
                  )
                }
              >
                <Card.Meta
                  title={<span style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500 }}>{p.nombre}</span>}
                  description={
                    <>
                      <Text type="secondary" style={{ display: "block", minHeight: 40, fontSize: 13 }}>{p.descripcion || " "}</Text>
                      <Text strong style={{ fontSize: 17, color: "var(--nuo-terracota)" }}>{formatearGs(Number(p.precioVenta))}</Text>
                      {sinStock && <Text type="danger" style={{ display: "block", fontSize: 12 }}>Sin stock por ahora</Text>}
                    </>
                  }
                />
                <Button
                  type="primary"
                  block
                  icon={<ShoppingCartOutlined />}
                  style={{ marginTop: 14 }}
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
