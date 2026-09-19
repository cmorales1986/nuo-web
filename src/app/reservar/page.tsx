import { ReservarWizard } from "./reservar-wizard";

export const metadata = {
  title: "Reservar cita — Nuo Esthetic",
};

export default function ReservarPage() {
  return (
    <div className="nuo-below-header">
      <div style={{ background: "#F7F4F1", padding: "48px 16px", textAlign: "center" }}>
        <span className="nuo-eyebrow">Reserva online</span>
        <h1 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", margin: 0 }}>Reservá tu turno</h1>
        <p style={{ color: "var(--nuo-taupe)", maxWidth: 480, margin: "10px auto 0" }}>
          Elegí el servicio, un horario libre y dejanos tus datos — te confirmamos por WhatsApp.
        </p>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 16px 80px" }}>
        <ReservarWizard />
      </div>
    </div>
  );
}
