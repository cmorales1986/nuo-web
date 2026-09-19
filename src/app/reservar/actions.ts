"use server";

import {
  obtenerServiciosAgenda,
  obtenerProfesionalesAgenda,
  obtenerDisponibilidad,
  crearReserva,
  type ServicioAgenda,
  type ProfesionalAgenda,
  type SlotDisponible,
  type ReservaPayload,
} from "../../lib/erp-client";

/** El navegador nunca ve el secreto del ERP — todo pasa por estas Server Actions, igual que la tienda. */

export async function accionListarServiciosAgenda(): Promise<{ error?: string; servicios?: ServicioAgenda[] }> {
  try {
    return { servicios: await obtenerServiciosAgenda() };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudieron cargar los servicios." };
  }
}

export async function accionListarProfesionalesAgenda(servicioId: string): Promise<{ error?: string; profesionales?: ProfesionalAgenda[] }> {
  try {
    return { profesionales: await obtenerProfesionalesAgenda(servicioId) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudieron cargar los profesionales." };
  }
}

export async function accionListarDisponibilidad(params: { profesionalId: string; duracionMinutos: number; fecha: string }): Promise<{ error?: string; slots?: SlotDisponible[] }> {
  try {
    return { slots: await obtenerDisponibilidad(params) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo calcular la disponibilidad." };
  }
}

export async function accionCrearReserva(payload: ReservaPayload): Promise<{ error?: string; ok?: boolean }> {
  try {
    return await crearReserva(payload);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo registrar la reserva." };
  }
}
