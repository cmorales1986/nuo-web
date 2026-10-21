import { obtenerProductos, obtenerKits } from "../../lib/erp-client";
import { CatalogoTienda } from "./catalogo-tienda";

export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  const [productos, kits] = await Promise.all([obtenerProductos(), obtenerKits()]);
  return (
    <div className="nuo-below-header">
      <div style={{ background: "#F7F4F1", padding: "48px 16px", textAlign: "center" }}>
        <span className="nuo-eyebrow">Skincare Nuo</span>
        <h1 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", margin: 0 }}>Tienda online</h1>
        <p style={{ color: "var(--nuo-taupe)", maxWidth: 480, margin: "10px auto 0" }}>
          Retiro en el local o envío a domicilio. Pago por transferencia o contra entrega.
        </p>
      </div>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 16px" }}>
        <CatalogoTienda productos={productos} kits={kits} />
      </div>
    </div>
  );
}
