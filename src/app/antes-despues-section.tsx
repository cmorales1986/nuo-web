"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { CasoWeb } from "../lib/erp-client";

/** Comparador: se arrastra el control para ver el "antes" sobre el "después". También se maneja con el teclado (flechas). */
function Comparador({ antes, despues, titulo }: { antes: string; despues: string; titulo: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 10, background: "#F7F4F1", userSelect: "none" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={despues} alt={`Después: ${titulo}`} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={antes} alt={`Antes: ${titulo}`} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(42,36,34,.7)", color: "#fff", fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>Antes</span>
      <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(42,36,34,.7)", color: "#fff", fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>Después</span>
      <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "#fff", transform: "translateX(-1px)", boxShadow: "0 0 4px rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 34, height: 34, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--nuo-terracota)", fontSize: 14 }}>↔</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar antes y después: ${titulo}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "ew-resize", margin: 0 }}
      />
    </div>
  );
}

/** Casos de antes/después. El ERP solo envía los que tienen el consentimiento de la paciente registrado. */
export function AntesDespuesSection({ casos }: { casos: CasoWeb[] }) {
  if (casos.length === 0) return null;
  return (
    <section id="resultados" className="nuo-section">
      <span className="nuo-eyebrow">Resultados</span>
      <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 8 }}>Antes y después</h2>
      <p style={{ color: "var(--nuo-taupe)", maxWidth: 620, margin: "0 0 28px", lineHeight: 1.8, fontWeight: 300 }}>Deslizá para comparar. Cada caso se publica con la autorización de la paciente.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {casos.map((c) => (
          <article key={c.id}>
            <Comparador antes={c.fotoAntesUrl} despues={c.fotoDespuesUrl} titulo={c.titulo} />
            <h3 style={{ fontSize: 18, margin: "14px 0 4px" }}>{c.titulo}</h3>
            {(c.servicioNombre || c.detalleTiempo) && <div style={{ fontSize: 13, color: "var(--nuo-taupe)" }}>{[c.servicioNombre, c.detalleTiempo].filter(Boolean).join(" · ")}</div>}
            {c.descripcion && <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>{c.descripcion}</p>}
            <Link href={c.servicioId ? `/reservar?servicio=${encodeURIComponent(c.servicioId)}` : "/reservar"}>
              <Button icon={<CalendarOutlined />} style={{ marginTop: 12 }}>
                Reservar este tratamiento
              </Button>
            </Link>
          </article>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--nuo-taupe)", marginTop: 24 }}>Los resultados varían de una persona a otra. Las imágenes se publican con la autorización de las pacientes.</p>
    </section>
  );
}
