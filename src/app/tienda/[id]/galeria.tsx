"use client";

import { useState } from "react";

/** Galería de la ficha: miniaturas a un costado, foto principal con zoom al pasar el mouse. */
export function Galeria({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [actual, setActual] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  if (imagenes.length === 0) {
    return <div style={{ height: 360, background: "#F7F4F1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9c2be" }}>Sin foto</div>;
  }

  const src = imagenes[Math.min(actual, imagenes.length - 1)]!;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      {imagenes.length > 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {imagenes.map((url, i) => (
            <button
              key={url}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${imagenes.length}`}
              aria-current={i === actual}
              onClick={() => setActual(i)}
              onMouseEnter={() => setActual(i)}
              style={{ width: 56, height: 56, padding: 0, borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#F7F4F1", border: i === actual ? "2px solid var(--nuo-terracota)" : "1px solid #ece7e3" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
      <div
        style={{ flex: "1 1 0", minWidth: 0, borderRadius: 12, overflow: "hidden", background: "#F7F4F1", cursor: zoom ? "zoom-in" : "default" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={nombre}
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            transition: zoom ? "none" : "transform .2s",
            transform: zoom ? "scale(1.8)" : "none",
            transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
          }}
        />
      </div>
    </div>
  );
}
