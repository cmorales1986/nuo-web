"use client";

import Link from "next/link";
import { PhoneOutlined, MailOutlined, InstagramOutlined, EnvironmentOutlined } from "@ant-design/icons";

export function SiteFooter() {
  return (
    <footer style={{ background: "#2a2422", color: "#e8e2df", marginTop: 64 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "56px 24px 32px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 32,
        }}
        className="nuo-footer-grid"
      >
        <div>
          <div style={{ fontFamily: "var(--font-heading), serif", fontSize: 22, letterSpacing: "0.04em", marginBottom: 12 }}>
            NUO<span style={{ color: "var(--nuo-oro)" }}>*</span>ESTHETIC
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#c9c2be", maxWidth: 320 }}>
            Centro médico-estético que une salud, ciencia y bienestar. Excelencia, calidez y eficiencia en cada
            tratamiento.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nuo-oro)", marginBottom: 16 }}>
            Información
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <li>
              <a href="tel:+595971203800" style={{ display: "flex", alignItems: "center", gap: 8, color: "#e8e2df" }}>
                <PhoneOutlined /> 0971 203 800
              </a>
            </li>
            <li>
              <a href="mailto:info@nuo.com.py" style={{ display: "flex", alignItems: "center", gap: 8, color: "#e8e2df" }}>
                <MailOutlined /> info@nuo.com.py
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/nuoesthetic_"
                target="_blank"
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, color: "#e8e2df" }}
              >
                <InstagramOutlined /> @nuoesthetic_
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nuo-oro)", marginBottom: 16 }}>
            Sucursales
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <EnvironmentOutlined style={{ marginTop: 3 }} />
              <div>
                <strong>Nuo Clinic</strong>
                <div style={{ color: "#c9c2be" }}>Carlos M. Giménez 4817, entre Juan S. Bogarín y Rodolfo Zotti</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <EnvironmentOutlined style={{ marginTop: 3 }} />
              <div>
                <strong>Nuo Spa</strong>
                <div style={{ color: "#c9c2be" }}>Manuel Talavera 969 casi Antolín Irala</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "16px 24px",
          textAlign: "center",
          fontSize: 12,
          color: "#a89f9b",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <span>© {new Date().getFullYear()} Nuo Esthetic. Todos los derechos reservados.</span>
        <Link href="/tienda" style={{ color: "#a89f9b" }}>
          Tienda
        </Link>
      </div>
    </footer>
  );
}
