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
  /** Fotos adicionales para la galería de la ficha. */
  imagenesExtra: string[];
  categoriaNombre: string;
  modoUso: string | null;
  ingredientes: string | null;
  stockDisponible: number;
  /** Venta cruzada: productos que combinan con este (cargados en el ERP). */
  sugeridosIds?: string[];
};

export type KitTienda = {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  descuentoPorcentaje: number;
  servicioId: string | null;
  items: { productoId: string; nombre: string; cantidad: number; precioUnitario: number }[];
  precioSeparado: number;
  precioKit: number;
  stockDisponible: number;
};

export type PedidoOnlinePayload = {
  nombre: string;
  telefono: string;
  correo?: string;
  entrega: "envio" | "retiro";
  direccion?: string;
  metodoPago: "transferencia" | "contra_entrega" | "tarjeta";
  items: { productoId: string; cantidad: number }[];
  /** Kits comprados: el ERP calcula el descuento con sus propios precios. */
  kits?: { kitId: string; cantidad: number }[];
  /** El cliente aceptó recibir recordatorios de reposición por WhatsApp. */
  aceptaRecordatorios?: boolean;
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

export async function crearPedido(payload: PedidoOnlinePayload): Promise<{ numeroDocumento?: string | null; documentoId?: string; total?: number }> {
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

export type ServicioAgenda = {
  id: string;
  nombre: string;
  descripcion: string | null;
  duracionMinutos: number;
  precioVenta: string;
  /** Productos de la tienda recomendados después de este tratamiento (cargados en el ERP). */
  productosRecomendadosIds?: string[];
};
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

/** Kits de la tienda. Si el ERP todavía no los ofrece (o falla), la tienda sigue funcionando sin ellos. */
export async function obtenerKits(): Promise<KitTienda[]> {
  const { baseUrl, secret } = config();
  try {
    const res = await fetch(`${baseUrl}/api/tienda/kits`, { headers: { "X-Tienda-Secret": secret }, cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.kits ?? [];
  } catch {
    return [];
  }
}

export type PedidoParaPago = { documentoId: string; numeroDocumento: string | null; total: number; estadoPedido: string; clienteNombre: string };

/** Datos del pedido para la pantalla de pago: el importe lo define el ERP (el navegador nunca lo manda). */
export async function obtenerPedidoParaPago(documentoId: string): Promise<PedidoParaPago | null> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}/api/tienda/pago?documentoId=${encodeURIComponent(documentoId)}`, { headers: { "X-Tienda-Secret": secret }, cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()).pedido ?? null;
}

/** Le avisa al ERP el resultado del pago. Nunca se envían datos de la tarjeta: solo resultado, referencia y últimos 4 dígitos. */
export async function confirmarPago(params: { documentoId: string; resultado: "aprobado" | "rechazado"; referencia: string; ultimos4?: string }): Promise<{ estadoPedido?: string }> {
  const { baseUrl, secret } = config();
  const res = await fetch(`${baseUrl}/api/tienda/pago`, { method: "POST", headers: { "Content-Type": "application/json", "X-Tienda-Secret": secret }, body: JSON.stringify(params) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo registrar el pago.");
  return data;
}

export type TestimonioWeb = {
  id: string;
  nombre: string;
  texto: string;
  estrellas: number;
  fuente: string;
  urlOrigen: string | null;
  servicioNombre: string | null;
  fecha: string | null;
};

export type CasoWeb = {
  id: string;
  titulo: string;
  descripcion: string | null;
  servicioId: string | null;
  servicioNombre: string | null;
  fotoAntesUrl: string;
  fotoDespuesUrl: string;
  detalleTiempo: string | null;
};

/**
 * Testimonios publicados y casos de antes/después publicados (el ERP solo envía los que tienen consentimiento registrado).
 * Si el ERP todavía no los ofrece o falla, el sitio sigue funcionando sin estas secciones.
 */
export async function obtenerPruebaSocial(): Promise<{ testimonios: TestimonioWeb[]; casos: CasoWeb[] }> {
  const { baseUrl, secret } = config();
  try {
    const res = await fetch(`${baseUrl}/api/tienda/prueba-social`, { headers: { "X-Tienda-Secret": secret }, cache: "no-store" });
    if (!res.ok) return { testimonios: [], casos: [] };
    const data = await res.json();
    return { testimonios: data.testimonios ?? [], casos: data.casos ?? [] };
  } catch {
    return { testimonios: [], casos: [] };
  }
}
