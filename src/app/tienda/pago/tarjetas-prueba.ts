/** Tarjetas de prueba que fuerzan cada resultado en el simulador de pago (las muestra la pantalla de pago). */
export const TARJETAS_DE_PRUEBA = [
  { numero: "4111 1111 1111 1111", resultado: "Pago aprobado" },
  { numero: "4000 0000 0000 0002", resultado: "Rechazada: fondos insuficientes" },
  { numero: "4000 0000 0000 0127", resultado: "Rechazada: código de seguridad incorrecto" },
] as const;
