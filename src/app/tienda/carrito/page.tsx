import { obtenerProductos, obtenerKits } from "../../../lib/erp-client";
import { CarritoView } from "./carrito-view";

export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  // Los productos se traen acá solo para las sugerencias de venta cruzada; si falla, el carrito funciona igual.
  const [productos, kits] = await Promise.all([obtenerProductos().catch(() => []), obtenerKits()]);
  return <CarritoView productos={productos} kits={kits} />;
}
