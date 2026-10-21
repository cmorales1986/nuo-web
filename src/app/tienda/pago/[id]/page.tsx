import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerPedidoParaPago } from "../../../../lib/erp-client";
import { PantallaPago } from "./pantalla-pago";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pago — Nuo Esthetic" };

export default async function PagoPage({ params }: { params: Promise<{ id: string }> }) {
  // Solo existe mientras el pago sea un simulador (PAGO_MODO=simulado): en producción sin esa variable, esta página no existe.
  if (process.env.PAGO_MODO !== "simulado") notFound();
  const { id } = await params;
  const pedido = await obtenerPedidoParaPago(id).catch(() => null);
  if (!pedido) notFound();

  // Si ya se pagó (o se canceló), no se vuelve a mostrar el formulario.
  if (pedido.estadoPedido !== "pendiente_pago") {
    return (
      <div className="nuo-below-header" style={{ maxWidth: 520, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26 }}>{pedido.estadoPedido === "cancelado" ? "Este pedido fue cancelado" : "Este pedido ya está pagado"}</h1>
        <p style={{ color: "var(--nuo-taupe)" }}>{pedido.estadoPedido === "cancelado" ? "Si querés, podés hacer un pedido nuevo desde la tienda." : "En breve nos contactamos para coordinar la entrega."}</p>
        <Link href="/tienda" style={{ color: "var(--nuo-terracota)" }}>Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="nuo-below-header" style={{ maxWidth: 520, margin: "0 auto", padding: "40px 16px 80px" }}>
      <PantallaPago documentoId={pedido.documentoId} total={pedido.total} cliente={pedido.clienteNombre} />
    </div>
  );
}
