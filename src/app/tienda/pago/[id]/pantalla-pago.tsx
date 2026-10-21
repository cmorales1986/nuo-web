"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, Input, Result, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { accionPagarSimulado } from "../actions";
import { TARJETAS_DE_PRUEBA } from "../tarjetas-prueba";

const { Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

/** "4111111111111111" -> "4111 1111 1111 1111" */
function agruparNumero(v: string): string {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

/** "1228" -> "12/28" */
function formatearVencimiento(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function PantallaPago({ documentoId, total, cliente }: { documentoId: string; total: number; cliente: string }) {
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState(cliente);
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referencia, setReferencia] = useState<string | null>(null);

  async function pagar() {
    setError(null);
    setPagando(true);
    try {
      const r = await accionPagarSimulado(documentoId, { numero, nombre, vencimiento, cvv });
      if (r.ok) setReferencia(r.referencia ?? "");
      else setError(r.mensaje);
    } finally {
      setPagando(false);
    }
  }

  if (referencia !== null) {
    return (
      <Result
        status="success"
        title="¡Pago aprobado!"
        subTitle={`Recibimos tu pedido y el pago de ${formatearGs(total)}. En breve nos contactamos para coordinar la entrega. Referencia: ${referencia}`}
        extra={
          <Link href="/tienda">
            <Button type="primary">Volver a la tienda</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <Alert type="warning" showIcon style={{ marginBottom: 16 }} title="Modo prueba" description="Esta pantalla es una simulación: no se cobra nada ni se usa una tarjeta real. Usá una de las tarjetas de prueba de abajo." />

      <Card style={{ borderRadius: 12, border: "1px solid #f0eeeb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <Text type="secondary">Total a pagar</Text>
          <Text strong style={{ fontSize: 24, color: "var(--nuo-terracota)" }}>{formatearGs(total)}</Text>
        </div>

        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Número de tarjeta</label>
        <Input size="large" inputMode="numeric" autoComplete="off" placeholder="1234 5678 9012 3456" value={numero} onChange={(e) => setNumero(agruparNumero(e.target.value))} style={{ marginBottom: 14 }} />

        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Nombre en la tarjeta</label>
        <Input size="large" autoComplete="off" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ marginBottom: 14 }} />

        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Vencimiento</label>
            <Input size="large" inputMode="numeric" autoComplete="off" placeholder="MM/AA" value={vencimiento} onChange={(e) => setVencimiento(formatearVencimiento(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Código de seguridad</label>
            <Input.Password size="large" inputMode="numeric" autoComplete="off" placeholder="123" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>

        {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 14 }} />}

        <Button type="primary" size="large" block icon={<LockOutlined />} loading={pagando} onClick={pagar}>
          Pagar {formatearGs(total)}
        </Button>
      </Card>

      <Card size="small" style={{ marginTop: 16, borderRadius: 10, background: "#faf5f2", border: "1px solid #f0e4dc" }} title="Tarjetas de prueba">
        <Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 8 }}>
          Cualquier fecha futura (por ejemplo 12/30) y cualquier código de 3 dígitos. Tocá una para completarla.
        </Text>
        {TARJETAS_DE_PRUEBA.map((t) => (
          <button
            key={t.numero}
            type="button"
            onClick={() => {
              setNumero(t.numero);
              setVencimiento("12/30");
              setCvv("123");
            }}
            style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 8, textAlign: "left", background: "none", border: "none", borderTop: "1px solid #f0e4dc", padding: "8px 0", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
          >
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{t.numero}</span>
            <span style={{ color: "var(--nuo-taupe)" }}>{t.resultado}</span>
          </button>
        ))}
      </Card>
    </div>
  );
}
