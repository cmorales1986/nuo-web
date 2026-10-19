"use client";

import Link from "next/link";
import { Tabs, Card, Typography, Tag, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { ProductoTienda, ServicioAgenda } from "../lib/erp-client";
import { buscarServicioPorNombre } from "../lib/servicios";

const { Text } = Typography;

type Tratamiento = { nombre: string; precio?: string; descripcion?: string };

const CATEGORIAS: { key: string; label: string; items: Tratamiento[] }[] = [
  {
    key: "k-beauty",
    label: "K-Beauty",
    items: [
      {
        nombre: "Glow K-Facial",
        precio: "300.000 gs",
        descripcion:
          "Inicia con un escáner facial de alta tecnología que analiza a profundidad tu piel: hidratación, textura, poros, manchas y más. Con base en ese diagnóstico, realizamos una limpieza express con productos coreanos elegidos según tu tipo de piel.",
      },
      {
        nombre: "K-Skin Deluxe",
        precio: "400.000 gs",
        descripcion:
          "Protocolo completo de diagnóstico, limpieza y tonificación facial con el respaldo de la tecnología y el ritual coreano, con el masaje Kaolift como tratamiento estrella. Una experiencia premium para una transformación visible.",
      },
    ],
  },
  {
    key: "masajes",
    label: "Masajes",
    items: [
      {
        nombre: "Masaje relajante",
        precio: "250.000 gs",
        descripcion: "Una experiencia diseñada para liberar tensiones acumuladas, calmar la mente y reconectar con el bienestar.",
      },
      {
        nombre: "Masaje descontracturante",
        precio: "150.000 gs · por área",
        descripcion: "Enfocado en aliviar tensiones musculares profundas y liberar contracturas generadas por el estrés, la mala postura o el esfuerzo físico.",
      },
      {
        nombre: "Kaolift · masaje japonés",
        precio: "350.000 gs",
        descripcion: "Técnica facial lifting no invasiva que combina maniobras drenantes, tonificantes y de remodelado.",
      },
    ],
  },
  {
    key: "combos",
    label: "Combos",
    items: [
      {
        nombre: "Combo reducción de celulitis",
        precio: "480.000 gs",
        descripcion: "4 sesiones anticelulíticas, ultra cavitación y radiofrecuencia con vacumterapia.",
      },
      {
        nombre: "Combo anti-celulitis",
        precio: "1.000.000 gs",
        descripcion: "5 drenajes linfáticos manuales anticelulíticos + 5 Vela 3D (radiofrecuencia, luz infrarroja, vacumterapia).",
      },
      {
        nombre: "Combo power celulitishock",
        precio: "1.500.000 gs",
        descripcion: "5 drenajes linfáticos manuales anticelulíticos + 5 Vela 3D + 3 sesiones de mesoterapia anticelulítica.",
      },
    ],
  },
  {
    key: "faciales",
    label: "Tratamientos faciales",
    items: [
      { nombre: "Limpieza facial profunda", descripcion: "Tratamiento esencial para purificar la piel, eliminar impurezas y renovar su textura." },
      { nombre: "Limpieza facial express", descripcion: "Opción rápida y efectiva para revitalizar la piel en poco tiempo." },
      {
        nombre: "Hidra facial",
        descripcion: "Tratamiento avanzado de hidratación profunda que limpia, exfolia y nutre la piel en una sola sesión. Ideal para todo tipo de piel, incluso las más sensibles.",
      },
    ],
  },
  {
    key: "estetica",
    label: "Procedimientos estéticos",
    items: [
      { nombre: "Peeling medio" },
      { nombre: "Peeling universal" },
      { nombre: "Botox rostro" },
      { nombre: "Botox rostro y cuello" },
      { nombre: "Baby botox" },
      { nombre: "Neopenmed (facial y cuello)" },
      { nombre: "Plasma rico en plaquetas" },
      { nombre: "NCTF vitamina en rostro" },
      { nombre: "Pbserum" },
      { nombre: "Exosomas + ADN de salmón" },
      { nombre: "ADN de salmón" },
      { nombre: "Suero terapia" },
      { nombre: "Total face" },
      { nombre: "Bioestimuladores de colágeno" },
      { nombre: "Ácido hialurónico (pómulos, labios, mentón, marcación mandibular)" },
      { nombre: "Hilos tensores" },
      { nombre: "Biorevitalizantes" },
      { nombre: "Mesoterapia facial y corporal" },
    ],
  },
];

function hrefReserva(t: Tratamiento, servicios: ServicioAgenda[]): string {
  const s = buscarServicioPorNombre(t.nombre, servicios);
  return s ? `/reservar?servicio=${encodeURIComponent(s.id)}` : "/reservar";
}

function formatearGs(valor: number): string {
  return `${Math.round(valor).toLocaleString("es-PY")} gs`;
}

function TarjetasTratamiento({ items: itemsBase, servicios, productos }: { items: Tratamiento[]; servicios: ServicioAgenda[]; productos: ProductoTienda[] }) {
  // Un tratamiento que ya existe como servicio en el ERP se muestra como tarjeta completa (con precio y botón
  // de reserva) aunque en la web no tenga precio fijo: se toma el del ERP.
  const items = itemsBase.map((t) => {
    if (t.precio) return t;
    const s = buscarServicioPorNombre(t.nombre, servicios);
    return s ? { ...t, precio: formatearGs(Number(s.precioVenta)), descripcion: t.descripcion ?? s.descripcion ?? undefined } : t;
  });
  const conPrecio = items.filter((i) => i.precio);
  const sinPrecio = items.filter((i) => !i.precio);
  const productoPorId = new Map(productos.map((p) => [p.id, p]));

  return (
    <div>
      {conPrecio.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: sinPrecio.length ? 24 : 0 }}>
          {conPrecio.map((t) => (
            <Card key={t.nombre} className="nuo-card-lift" style={{ borderRadius: 10, border: "1px solid #f0eeeb" }} styles={{ body: { padding: 20 } }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <h3 style={{ fontSize: 17, margin: 0 }}>{t.nombre}</h3>
                <Text strong style={{ color: "var(--nuo-terracota)", whiteSpace: "nowrap" }}>
                  {t.precio}
                </Text>
              </div>
              {t.descripcion && (
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.7 }}>
                  {t.descripcion}
                </Text>
              )}
              {(() => {
                const recomendados = (buscarServicioPorNombre(t.nombre, servicios)?.productosRecomendadosIds ?? [])
                  .map((id) => productoPorId.get(id))
                  .filter((p): p is ProductoTienda => !!p);
                if (recomendados.length === 0) return null;
                return (
                  <div style={{ marginTop: 14 }}>
                    <Text style={{ fontSize: 12, color: "var(--nuo-taupe)", display: "block", marginBottom: 6 }}>Para continuar en casa</Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {recomendados.map((p) => (
                        <Link key={p.id} href={`/tienda/${p.id}`}>
                          <Tag style={{ cursor: "pointer", borderRadius: 14, padding: "2px 10px", background: "#F7F4F1", border: "1px solid #ece7e3", color: "var(--foreground)" }}>{p.nombre}</Tag>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <Link href={hrefReserva(t, servicios)}>
                <Button type="primary" block icon={<CalendarOutlined />} style={{ marginTop: 16 }}>
                  Reservar este tratamiento
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
      {sinPrecio.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {sinPrecio.map((t) => (
            <Link key={t.nombre} href={hrefReserva(t, servicios)}>
              <Tag style={{ padding: "8px 14px", borderRadius: 20, fontSize: 13, background: "#F7F4F1", border: "1px solid #ece7e3", color: "var(--foreground)", cursor: "pointer" }}>
                {t.nombre}
              </Tag>
            </Link>
          ))}
        </div>
      )}
      {sinPrecio.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Link href="/reservar">
            <Button type="primary" icon={<CalendarOutlined />}>
              Reservar este tratamiento
            </Button>
          </Link>
          <Text type="secondary" style={{ marginLeft: 12, fontSize: 13 }}>
            Tocá un tratamiento para reservarlo.
          </Text>
        </div>
      )}
    </div>
  );
}

export function TratamientosSection({ servicios, productos }: { servicios: ServicioAgenda[]; productos: ProductoTienda[] }) {
  return (
    <Tabs
      items={CATEGORIAS.map((c) => ({
        key: c.key,
        label: c.label,
        children: <TarjetasTratamiento items={c.items} servicios={servicios} productos={productos} />,
      }))}
    />
  );
}
