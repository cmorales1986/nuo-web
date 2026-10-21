import { CheckoutView } from "./checkout-view";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  // La opción "Tarjeta" solo existe mientras el pago sea un simulador (PAGO_MODO=simulado). En producción, sin esa variable, no aparece.
  return <CheckoutView pagoSimulado={process.env.PAGO_MODO === "simulado"} />;
}
