import { obtenerProductos } from "../../lib/erp-client";
import { TiendaGrid } from "./tienda-grid";

export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  const productos = await obtenerProductos();
  return (
    <div className="nuo-below-header">
      <div style={{ background: "#F7F4F1", padding: "48px 16px", textAlign: "center" }}>
        <span className="nuo-eyebrow">Skincare Nuo</span>
        <h1 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", margin: 0 }}>Tienda online</h1>
        <p style={{ color: "var(--nuo-taupe)", maxWidth: 480, margin: "10px auto 0" }}>
          Retiro en el local o envío a domicilio. Pago por transferencia o contra entrega.
        </p>
      </div>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 16px" }}>
        <TiendaGrid productos={productos} ocultarTitulo />
      </div>
    </div>
  );
}
