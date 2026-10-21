"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Radio, Button, Typography, Empty, Result, App, Card, Checkbox } from "antd";
import { useCarrito } from "../cart-context";
import { accionCrearPedidoOnline } from "../actions";

const { Title, Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function CheckoutView({ pagoSimulado }: { pagoSimulado: boolean }) {
  const router = useRouter();
  const { items, vaciar } = useCarrito();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [entrega, setEntrega] = useState<"envio" | "retiro">("retiro");
  const [enviando, setEnviando] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string | null | undefined>(undefined);

  const total = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);

  async function confirmar(valores: { nombre: string; telefono: string; correo?: string; direccion?: string; metodoPago: "transferencia" | "contra_entrega" | "tarjeta"; aceptaRecordatorios?: boolean }) {
    setEnviando(true);
    try {
      const resultado = await accionCrearPedidoOnline({
        nombre: valores.nombre,
        telefono: valores.telefono,
        correo: valores.correo || undefined,
        entrega,
        direccion: entrega === "envio" ? valores.direccion : undefined,
        metodoPago: valores.metodoPago,
        items: items.filter((i) => !i.kitId).map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
        kits: items.filter((i) => i.kitId).map((i) => ({ kitId: i.kitId!, cantidad: i.cantidad })),
        aceptaRecordatorios: valores.aceptaRecordatorios === true,
      });
      if (resultado.error) {
        message.error(resultado.error);
        return;
      }
      vaciar();
      // Con tarjeta el pedido queda esperando el pago: se sigue a la pantalla de pago (simulada).
      if (valores.metodoPago === "tarjeta" && resultado.documentoId) {
        router.push(`/tienda/pago/${resultado.documentoId}`);
        return;
      }
      setNumeroPedido(resultado.numeroDocumento ?? null);
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start", maxWidth: 940, margin: "0 auto" }}>
      <Card style={{ borderRadius: 10, border: "1px solid #f0eeeb" }}>
        <Title level={2}>Confirmar pedido</Title>
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
              {pagoSimulado && <Radio.Button value="tarjeta">Tarjeta (modo prueba)</Radio.Button>}
            </Radio.Group>
          </Form.Item>
          {pagoSimulado && (
            <Text type="secondary" style={{ display: "block", fontSize: 12, margin: "-12px 0 16px" }}>
              El pago con tarjeta es una simulación: no se cobra nada.
            </Text>
          )}
          <Form.Item name="aceptaRecordatorios" valuePropName="checked" initialValue={false}>
            <Checkbox>Quiero recibir por WhatsApp un recordatorio cuando sea momento de reponer mis productos.</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={enviando}>
            Confirmar pedido
          </Button>
        </Form>
      </Card>
      <Card style={{ borderRadius: 10, border: "1px solid #f0eeeb", position: "sticky", top: 96, background: "#faf8f6" }} title="Resumen del pedido">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((i) => (
            <li key={i.productoId} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeeb" }}>
              {i.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.imagenUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 6, background: "#F7F4F1", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.35 }}>
                {i.nombre}
                <div style={{ color: "var(--nuo-taupe)" }}>Cantidad: {i.cantidad}</div>
              </div>
              <Text style={{ fontSize: 13, whiteSpace: "nowrap" }}>{formatearGs(i.precioVenta * i.cantidad)}</Text>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
          <Text strong>Total</Text>
          <Text strong style={{ fontSize: 20, color: "var(--nuo-terracota)" }}>{formatearGs(total)}</Text>
        </div>
        <Link href="/tienda/carrito" style={{ display: "block", marginTop: 12, fontSize: 13, color: "var(--nuo-taupe)", textDecoration: "underline" }}>
          Modificar carrito
        </Link>
      </Card>
      </div>
    );
  };

  return (
    <div className="nuo-below-header" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 16px" }}>
      {contenido()}
    </div>
  );
}
