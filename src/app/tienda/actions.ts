"use server";

import { crearPedido, type PedidoOnlinePayload } from "../../lib/erp-client";

/** El navegador nunca ve el secreto del ERP — pasa por esta Server Action, que corre en el servidor de este mismo proyecto. */
export async function accionCrearPedidoOnline(payload: PedidoOnlinePayload): Promise<{ error?: string; numeroDocumento?: string | null }> {
  try {
    return await crearPedido(payload);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo registrar el pedido." };
  }
}
