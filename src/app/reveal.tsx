"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Envoltorio liviano para el fade-up al entrar en viewport (sin librería:
 * un solo IntersectionObserver compartido por instancia). `delay` en ms
 * para escalonar varios hijos en fila (ver especialidades/tratamientos).
 */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("nuo-in");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`nuo-reveal ${className}`}>
      {children}
    </div>
  );
}
