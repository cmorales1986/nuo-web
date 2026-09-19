import "server-only";

/**
 * Único punto de contacto con el ERP (proyecto aparte, "nuo-esthetic") —
 * nunca accede a su base de datos directo, todo pasa por su API interna
 * protegida (`X-Tienda-Secret`). Server-only a propósito: el secreto
 * nunca puede llegar al navegador.
 */

export type ProductoTienda = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precioVenta: string;
  imagenUrl: string | null;
  stockDisponible: number;
};

export type PedidoOnlinePayload = {
  nombre: string;
  telefono: string;
  correo?: string;
  entrega: "envio" | "retiro";
  direccion?: string;
  metodoPago: "transferencia" | "contra_entrega";
  items: { productoId: string; cantidad: number }[];
};

function config() {
  const baseUrl = process.env.ERP_API_URL;
  const secret = process.env.TIENDA_API_SECRET;
  if (!baseUrl || !secret) throw new Error("Falta configurar ERP_API_URL/TIENDA_API_SECRET.");
  return { baseUrl, secret };
}

export async function obtenerProductos(): Promise<ProductoTienda[]> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}/api/tienda/productos`, {
    headers: { "X-Tienda-Secret": secret },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo cargar la tienda.");
  return data.productos;
}

export async function crearPedido(payload: PedidoOnlinePayload): Promise<{ numeroDocumento?: string | null }> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}/api/tienda/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Tienda-Secret": secret },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo registrar el pedido.");
  return data;
}

export type ServicioAgenda = { id: string; nombre: string; descripcion: string | null; duracionMinutos: number; precioVenta: string };
export type ProfesionalAgenda = { id: string; nombre: string; especialidad: string | null; sucursalId: string; sucursalNombre: string };
export type SlotDisponible = { inicio: string; fin: string };
export type ReservaPayload = {
  servicioId: string;
  profesionalId: string;
  fechaInicio: string;
  fechaFin: string;
  nombre: string;
  telefono: string;
  correo?: string;
  observaciones?: string;
};

async function get<T>(path: string): Promise<T> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}${path}`, { headers: { "X-Tienda-Secret": secret }, cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo cargar la agenda.");
  return data;
}

export async function obtenerServiciosAgenda(): Promise<ServicioAgenda[]> {
  const data = await get<{ servicios: ServicioAgenda[] }>("/api/agenda-publica/servicios");
  return data.servicios;
}

export async function obtenerProfesionalesAgenda(servicioId: string): Promise<ProfesionalAgenda[]> {
  const data = await get<{ profesionales: ProfesionalAgenda[] }>(`/api/agenda-publica/profesionales?servicioId=${encodeURIComponent(servicioId)}`);
  return data.profesionales;
}

export async function obtenerDisponibilidad(params: { profesionalId: string; duracionMinutos: number; fecha: string }): Promise<SlotDisponible[]> {
  const qs = new URLSearchParams({ profesionalId: params.profesionalId, duracionMinutos: String(params.duracionMinutos), fecha: params.fecha });
  const data = await get<{ slots: SlotDisponible[] }>(`/api/agenda-publica/disponibilidad?${qs.toString()}`);
  return data.slots;
}

export async function crearReserva(payload: ReservaPayload): Promise<{ ok?: boolean }> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}/api/agenda-publica/reservar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Tienda-Secret": secret },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo registrar la reserva.");
  return data;
}
