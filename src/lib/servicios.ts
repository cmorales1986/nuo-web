/**
 * Los tratamientos de la web son textos fijos; los servicios reservables viven en el ERP.
 * Se vinculan por NOMBRE (sin tildes ni mayúsculas): para que "Reservar este tratamiento"
 * llegue con el servicio ya elegido, el servicio del ERP tiene que llamarse igual que en la web.
 * Solo se acepta coincidencia exacta a propósito: es mejor no preseleccionar que reservar el servicio equivocado.
 */
import type { ServicioAgenda } from "./erp-client";

export function normalizarNombre(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function buscarServicioPorNombre(nombre: string, servicios: ServicioAgenda[]): ServicioAgenda | undefined {
  const n = normalizarNombre(nombre);
  return servicios.find((s) => normalizarNombre(s.nombre) === n);
}
