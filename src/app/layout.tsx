import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntApp } from "antd";
import esES from "antd/locale/es_ES";
import { CarritoProvider } from "./tienda/cart-context";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import "./globals.css";

// Misma tipografía real de nuo.com.py (relevada en vivo, incluido el peso
// exacto: TODO el texto ahí —títulos y párrafos— corre en weight 300, con
// el eje óptico "opsz" al máximo en los títulos grandes para ese trazo
// fino y editorial). Fraunces para títulos, Jost para cuerpo.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});
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
                <SiteFooter />
              </CarritoProvider>
            </AntApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
