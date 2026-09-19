"use client";

import { useEffect, useState } from "react";
import { Steps, Card, Radio, DatePicker, Form, Input, Button, Result, Spin, Empty, Typography, App } from "antd";
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");
import type { ServicioAgenda, ProfesionalAgenda, SlotDisponible } from "../../lib/erp-client";
import { accionListarServiciosAgenda, accionListarProfesionalesAgenda, accionListarDisponibilidad, accionCrearReserva } from "./actions";

const { Text } = Typography;

function formatearGs(valor: number): string {
  return `Gs. ${Math.round(valor).toLocaleString("es-PY")}`;
}

export function ReservarWizard() {
  const { message } = App.useApp();
  const [paso, setPaso] = useState(0);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [servicios, setServicios] = useState<ServicioAgenda[]>([]);
  const [servicio, setServicio] = useState<ServicioAgenda | null>(null);

  const [profesionales, setProfesionales] = useState<ProfesionalAgenda[]>([]);
  const [cargandoProfesionales, setCargandoProfesionales] = useState(false);
  const [profesionalId, setProfesionalId] = useState<string | null>(null);

  const [fecha, setFecha] = useState<Dayjs>(() => dayjs().add(1, "day"));
  const [slots, setSlots] = useState<SlotDisponible[]>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [slot, setSlot] = useState<SlotDisponible | null>(null);

  const [datosContacto, setDatosContacto] = useState<{ nombre: string; telefono: string; correo?: string; observaciones?: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [reservado, setReservado] = useState(false);

  useEffect(() => {
    accionListarServiciosAgenda().then((r) => {
      if (r.error) message.error(r.error);
      setServicios(r.servicios ?? []);
      setCargandoServicios(false);
    });
  }, [message]);

  useEffect(() => {
    if (!servicio) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch en respuesta a cambio de servicio, no hidratación con riesgo de mismatch SSR
    setCargandoProfesionales(true);
    setProfesionalId(null);
    accionListarProfesionalesAgenda(servicio.id).then((r) => {
      if (r.error) message.error(r.error);
      const lista = r.profesionales ?? [];
      setProfesionales(lista);
      if (lista.length === 1) setProfesionalId(lista[0].id);
      setCargandoProfesionales(false);
    });
  }, [servicio, message]);

  useEffect(() => {
    if (!servicio || !profesionalId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlots([]);
      return;
    }
    setCargandoSlots(true);
    setSlot(null);
    accionListarDisponibilidad({ profesionalId, duracionMinutos: servicio.duracionMinutos, fecha: fecha.format("YYYY-MM-DD") }).then((r) => {
      if (r.error) message.error(r.error);
      setSlots(r.slots ?? []);
      setCargandoSlots(false);
    });
  }, [servicio, profesionalId, fecha, message]);

  async function confirmar() {
    if (!servicio || !slot || !datosContacto) return;
    setEnviando(true);
    try {
      const resultado = await accionCrearReserva({
        servicioId: servicio.id,
        profesionalId: profesionalId!,
        fechaInicio: slot.inicio,
        fechaFin: slot.fin,
        nombre: datosContacto.nombre,
        telefono: datosContacto.telefono,
        correo: datosContacto.correo,
        observaciones: datosContacto.observaciones,
      });
      if (resultado.error) {
        message.error(resultado.error);
        return;
      }
      setReservado(true);
    } finally {
      setEnviando(false);
    }
  }

  if (reservado) {
    return (
      <Result
        status="success"
        title="¡Listo! Tu reserva quedó registrada"
        subTitle="En breve nuestro equipo la confirma y te escribe por WhatsApp o al teléfono que dejaste. Si necesitás cambiar algo, escribinos."
      />
    );
  }

  const pasos = [
    { title: "Servicio", icon: <ClockCircleOutlined /> },
    { title: "Horario", icon: <CalendarOutlined /> },
    { title: "Contacto", icon: <UserOutlined /> },
    { title: "Confirmar", icon: <CheckCircleOutlined /> },
  ];

  return (
    <div>
      <Steps current={paso} items={pasos} style={{ marginBottom: 36 }} />

      {paso === 0 && (
        <Spin spinning={cargandoServicios}>
          {!cargandoServicios && servicios.length === 0 ? (
            <Empty description="Por ahora no hay servicios disponibles para reservar online — escribinos por WhatsApp." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {servicios.map((s) => (
                <Card
                  key={s.id}
                  hoverable
                  className="nuo-card-lift"
                  style={{ borderRadius: 10, border: servicio?.id === s.id ? "2px solid var(--nuo-terracota)" : "1px solid #f0eeeb" }}
                  onClick={() => {
                    setServicio(s);
                    setPaso(1);
                  }}
                >
                  <h3 style={{ fontSize: 17, margin: 0 }}>{s.nombre}</h3>
                  <Text type="secondary" style={{ fontSize: 13, display: "block", margin: "6px 0 10px" }}>
                    {s.duracionMinutos} min
                  </Text>
                  <Text strong style={{ color: "var(--nuo-terracota)" }}>
                    {formatearGs(Number(s.precioVenta))}
                  </Text>
                </Card>
              ))}
            </div>
          )}
        </Spin>
      )}

      {paso === 1 && servicio && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary">Servicio elegido: </Text>
            <Text strong>{servicio.nombre}</Text>
          </div>

          {cargandoProfesionales ? (
            <Spin />
          ) : profesionales.length === 0 ? (
            <Empty description="Ningún profesional tiene este servicio habilitado todavía." />
          ) : (
            <>
              {profesionales.length > 1 && (
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Profesional
                  </Text>
                  <Radio.Group value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
                    {profesionales.map((p) => (
                      <Radio.Button key={p.id} value={p.id}>
                        {p.nombre}
                        {p.especialidad ? ` — ${p.especialidad}` : ""}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Fecha
                </Text>
                <DatePicker
                  value={fecha}
                  onChange={(d) => d && setFecha(d)}
                  disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
                  format="DD/MM/YYYY"
                  allowClear={false}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Horario disponible
                </Text>
                <Spin spinning={cargandoSlots}>
                  {!cargandoSlots && slots.length === 0 ? (
                    <Text type="secondary">No hay horarios libres ese día — probá otra fecha.</Text>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {slots.map((s) => (
                        <Button
                          key={s.inicio}
                          type={slot?.inicio === s.inicio ? "primary" : "default"}
                          onClick={() => setSlot(s)}
                        >
                          {dayjs(s.inicio).format("HH:mm")}
                        </Button>
                      ))}
                    </div>
                  )}
                </Spin>
              </div>

              <Button type="primary" disabled={!slot} onClick={() => setPaso(2)} className="nuo-btn-animated">
                Continuar
              </Button>
            </>
          )}
        </div>
      )}

      {paso === 2 && (
        <Form
          layout="vertical"
          onFinish={(v) => {
            setDatosContacto(v);
            setPaso(3);
          }}
          style={{ maxWidth: 420 }}
        >
          <Form.Item name="nombre" label="Nombre completo" rules={[{ required: true, message: "Ingresá tu nombre." }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono (WhatsApp)" rules={[{ required: true, message: "Ingresá tu teléfono." }]}>
            <Input size="large" placeholder="09xx xxx xxx" />
          </Form.Item>
          <Form.Item name="correo" label="Correo (opcional)">
            <Input size="large" type="email" />
          </Form.Item>
          <Form.Item name="observaciones" label="Observaciones (opcional)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large" block className="nuo-btn-animated">
            Revisar y confirmar
          </Button>
        </Form>
      )}

      {paso === 3 && servicio && slot && datosContacto && (
        <Card style={{ maxWidth: 480, borderRadius: 10, border: "1px solid #f0eeeb" }}>
          <h3 style={{ marginTop: 0 }}>Confirmá tu reserva</h3>
          <p style={{ color: "var(--nuo-taupe)", lineHeight: 1.9 }}>
            <strong>{servicio.nombre}</strong>
            <br />
            {dayjs(slot.inicio).format("dddd D [de] MMMM, HH:mm")} hs
            <br />
            {profesionales.find((p) => p.id === profesionalId)?.nombre}
            <br />
            {datosContacto.nombre} · {datosContacto.telefono}
          </p>
          <Button type="primary" size="large" block loading={enviando} onClick={confirmar} className="nuo-btn-animated">
            Confirmar reserva
          </Button>
        </Card>
      )}
    </div>
  );
}
