import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntApp } from "antd";
import esES from "antd/locale/es_ES";
import { CarritoProvider } from "./tienda/cart-context";
import { SiteHeader } from "./site-header";
import "./globals.css";

// Misma tipografía real de nuo.com.py (relevada en vivo): Fraunces para
// títulos (serif editorial, el estilo "UN REFUGIO DE CALMA..." del hero),
// Jost para texto de cuerpo. Sitio distinto del ERP, misma identidad.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600"] });
const jost = Jost({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Nuo Esthetic",
  description: "Centro médico-estético y spa en Paraguay — faciales, corporales, masajes, paquetes y membresías.",
};

export const viewport: Viewport = {
  themeColor: "#B5695A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${jost.variable}`}>
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={esES}
            theme={{
              token: {
                colorPrimary: "#B5695A",
                colorInfo: "#B5695A",
                borderRadius: 4,
                fontFamily: "var(--font-body), sans-serif",
              },
            }}
          >
            <AntApp>
              <CarritoProvider>
                <SiteHeader />
                {children}
                <footer style={{ textAlign: "center", padding: 24, color: "#8c8c8c", fontSize: 12 }}>Nuo Esthetic — centro médico-estético y spa</footer>
              </CarritoProvider>
            </AntApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
