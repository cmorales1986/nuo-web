"use server";

import { confirmarPago } from "../../../lib/erp-client";

/**
 * SIMULADOR de pasarela de pago. NO cobra nada ni contacta a ningún banco: decide el resultado según el número de
 * tarjeta de prueba y le avisa al ERP, igual que lo haría el webhook de una pasarela real. Cuando se elija una
 * pasarela (Pagopar, dLocal Go…), solo se reemplaza este archivo y la pantalla de pago; el ERP y el resto del flujo no cambian.
 *
 * Los datos de la tarjeta se evalúan acá y se descartan: no se guardan, no se registran en logs y nunca viajan al ERP.
 */

export type TarjetaPrueba = { numero: string; nombre: string; vencimiento: string; cvv: string };
export type ResultadoPago = { ok: boolean; mensaje: string; referencia?: string };

function luhnValido(numero: string): boolean {
  let suma = 0;
  let doble = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let d = Number(numero[i]);
    if (doble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    suma += d;
    doble = !doble;
  }
  return suma % 10 === 0;
}

export async function accionPagarSimulado(documentoId: string, tarjeta: TarjetaPrueba): Promise<ResultadoPago> {
  if (process.env.PAGO_MODO !== "simulado") return { ok: false, mensaje: "El pago con tarjeta todavía no está disponible." };

  const numero = tarjeta.numero.replace(/\D/g, "");
  const cvv = tarjeta.cvv.replace(/\D/g, "");
  const venc = /^(\d{2})\s*\/\s*(\d{2})$/.exec(tarjeta.vencimiento.trim());
  if (numero.length < 13 || numero.length > 19 || !luhnValido(numero)) return { ok: false, mensaje: "El número de tarjeta no es válido." };
  if (!tarjeta.nombre.trim()) return { ok: false, mensaje: "Ingresá el nombre que figura en la tarjeta." };
  if (!venc || Number(venc[1]) < 1 || Number(venc[1]) > 12) return { ok: false, mensaje: "Ingresá el vencimiento como MM/AA." };
  const finMes = new Date(2000 + Number(venc[2]), Number(venc[1]), 0, 23, 59, 59);
  if (finMes < new Date()) return { ok: false, mensaje: "La tarjeta está vencida." };
  if (cvv.length < 3 || cvv.length > 4) return { ok: false, mensaje: "Ingresá el código de seguridad." };

  const ultimos4 = numero.slice(-4);
  const referencia = `SIM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  let rechazo: string | null = null;
  if (numero === "4000000000000002") rechazo = "La tarjeta fue rechazada: fondos insuficientes.";
  else if (numero === "4000000000000127") rechazo = "La tarjeta fue rechazada: el código de seguridad es incorrecto.";
  if (rechazo) {
    await confirmarPago({ documentoId, resultado: "rechazado", referencia, ultimos4 }).catch(() => undefined);
    return { ok: false, mensaje: rechazo };
  }

  try {
    await confirmarPago({ documentoId, resultado: "aprobado", referencia, ultimos4 });
    return { ok: true, mensaje: "Pago aprobado.", referencia };
  } catch (err) {
    return { ok: false, mensaje: err instanceof Error ? err.message : "No se pudo registrar el pago." };
  }
}
