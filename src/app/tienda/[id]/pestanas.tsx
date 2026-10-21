"use client";

import { Tabs } from "antd";

/** Descripción, modo de uso e ingredientes: solo aparecen las pestañas que tienen contenido. */
export function Pestanas({ descripcion, modoUso, ingredientes }: { descripcion: string | null; modoUso: string | null; ingredientes: string | null }) {
  const texto = (t: string) => <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: 1.8, color: "var(--nuo-taupe)" }}>{t}</p>;
  const items: { key: string; label: string; children: React.ReactNode }[] = [];
  if (descripcion) items.push({ key: "descripcion", label: "Descripción", children: texto(descripcion) });
  if (modoUso) items.push({ key: "uso", label: "Modo de uso", children: texto(modoUso) });
  if (ingredientes) items.push({ key: "ingredientes", label: "Ingredientes", children: texto(ingredientes) });
  if (items.length === 0) return null;
  return <Tabs items={items} />;
}
