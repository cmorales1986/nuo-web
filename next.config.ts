import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo en la imagen de contenedor (AWS): servidor mínimo. En Railway/Vercel no cambia nada.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
};

export default nextConfig;
