"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Input, Radio, Button, Typography, Empty, Result, App, Card } from "antd";
import { useCarrito } from "../cart-context";
import { accionCrearPedidoOnline } from "../actions";

const { Title, Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export default function CheckoutPage() {
  const { items, vaciar } = useCarrito();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [entrega, setEntrega] = useState<"envio" | "retiro">("retiro");
  const [enviando, setEnviando] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string | null | undefined>(undefined);

  const total = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);

  async function confirmar(valores: { nombre: string; telefono: string; correo?: string; direccion?: string; metodoPago: "transferencia" | "contra_entrega" }) {
    setEnviando(true);
    try {
      const resultado = await accionCrearPedidoOnline({
        nombre: valores.nombre,
        telefono: valores.telefono,
        correo: valores.correo || undefined,
        entrega,
        direccion: entrega === "envio" ? valores.direccion : undefined,
        metodoPago: valores.metodoPago,
        items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      });
      if (resultado.error) {
        message.error(resultado.error);
        return;
      }
      setNumeroPedido(resultado.numeroDocumento ?? null);
      vaciar();
    } finally {
      setEnviando(false);
    }
  }

  const contenido = () => {
    if (numeroPedido !== undefined) {
      return (
        <Result
          status="success"
          title="¡Pedido recibido!"
          subTitle="En breve nos contactamos para confirmar el pago y coordinar la entrega."
          extra={
            <Link href="/tienda">
              <Button type="primary">Volver a la tienda</Button>
            </Link>
          }
        />
      );
    }

    if (items.length === 0) {
      return (
        <Empty description="Tu carrito está vacío">
          <Link href="/tienda">
            <Button type="primary">Ver productos</Button>
          </Link>
        </Empty>
      );
    }

    return (
      <Card style={{ maxWidth: 480, margin: "0 auto", borderRadius: 10, border: "1px solid #f0eeeb" }}>
        <Title level={2}>Confirmar pedido</Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>Total: {formatearGs(total)}</Text>
        <Form form={form} layout="vertical" onFinish={confirmar} disabled={enviando}>
          <Form.Item name="nombre" label="Nombre y apellido" rules={[{ required: true, message: "Ingresá tu nombre" }]}>
            <Input placeholder="Ana Pérez" />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono (WhatsApp)" rules={[{ required: true, message: "Ingresá tu teléfono" }]}>
            <Input placeholder="0981234567" />
          </Form.Item>
          <Form.Item name="correo" label="Correo (opcional)">
            <Input placeholder="vos@correo.com" />
          </Form.Item>
          <Form.Item label="Entrega">
            <Radio.Group value={entrega} onChange={(e) => setEntrega(e.target.value)}>
              <Radio.Button value="retiro">Retiro en el local</Radio.Button>
              <Radio.Button value="envio">Envío a domicilio</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {entrega === "envio" && (
            <Form.Item name="direccion" label="Dirección de envío" rules={[{ required: true, message: "Ingresá la dirección" }]}>
              <Input.TextArea placeholder="Calle, número, barrio, ciudad" autoSize={{ minRows: 2 }} />
            </Form.Item>
          )}
          <Form.Item name="metodoPago" label="Forma de pago" rules={[{ required: true, message: "Elegí una forma de pago" }]} initialValue="transferencia">
            <Radio.Group>
              <Radio.Button value="transferencia">Transferencia bancaria</Radio.Button>
              <Radio.Button value="contra_entrega">Contra entrega</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={enviando}>
            Confirmar pedido
          </Button>
        </Form>
      </Card>
    );
  };

  return <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 16px" }}>{contenido()}</div>;
}
