"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ItemCarrito = { productoId: string; nombre: string; precioVenta: number; cantidad: number };

const CLAVE_STORAGE = "nuo-tienda-carrito";

type CarritoContextType = {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitar: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  totalItems: number;
};

const CarritoContext = createContext<CarritoContextType | null>(null);

/** Carrito 100% del lado del cliente (localStorage) — sin cuenta de usuario; el pedido se confirma de verdad recién en el checkout, contra la API del ERP. */
export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  // A propósito en un efecto (no lazy-init de useState): el server siempre
  // renderiza el carrito vacío, así que hidratar sincrónicamente desde
  // localStorage en el primer render del cliente rompería la hidratación.
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // localStorage puede fallar (privado/bloqueado) — el carrito arranca vacío, no rompe la página.
    } finally {
      setCargado(true);
    }
  }, []);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch {
      // idem arriba
    }
  }, [items, cargado]);

  const agregar = useCallback((item: Omit<ItemCarrito, "cantidad">, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.productoId === item.productoId);
      if (existente) return prev.map((i) => (i.productoId === item.productoId ? { ...i, cantidad: i.cantidad + cantidad } : i));
      return [...prev, { ...item, cantidad }];
    });
  }, []);

  const quitar = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId: string, cantidad: number) => {
    setItems((prev) => (cantidad <= 0 ? prev.filter((i) => i.productoId !== productoId) : prev.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i))));
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.cantidad, 0), [items]);

  return <CarritoContext.Provider value={{ items, agregar, quitar, actualizarCantidad, vaciar, totalItems }}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextType {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>.");
  return ctx;
}
