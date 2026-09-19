import Image from "next/image";

const FOTOS = [
  "/galeria/foto-1.jpg",
  "/galeria/foto-2.jpg",
  "/galeria/foto-3.jpg",
  "/galeria/foto-4.jpg",
  "/galeria/foto-5.jpg",
  "/galeria/foto-6.jpg",
];

export function GaleriaSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }} className="nuo-galeria-grid">
      {FOTOS.map((src) => (
        <div key={src} style={{ position: "relative", aspectRatio: "3 / 4", borderRadius: 6, overflow: "hidden" }}>
          <Image src={src} alt="" fill sizes="(max-width: 720px) 33vw, 16vw" style={{ objectFit: "cover" }} />
        </div>
      ))}
    </div>
  );
}
