import { obtenerProductos } from "../../lib/erp-client";
import { TiendaGrid } from "./tienda-grid";

export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  const productos = await obtenerProductos();
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>
      <TiendaGrid productos={productos} />
    </div>
  );
}
