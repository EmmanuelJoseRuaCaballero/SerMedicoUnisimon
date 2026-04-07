import { DashboardLayout } from "@/components/DashboardLayout";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/hooks/toast-sonner";
import { authFetch } from "@/lib/authFetch";

interface Retroalimentacion {
  nivel_desempeño: string;
  observaciones: string;
  fecha: string;
}

interface Autoevaluacion {
  id_autoevaluacion: number;
  nombre_procedimiento: string;
  nivel_desempeño: string;
  tipo_actividad: string;
  hora_inicio: string;
  hora_final: string;
  fecha: string;
  lugar: string;
  nombre_estudiante: string;
  retroalimentacion: Retroalimentacion;
}

interface BorradorRetroalimentacion {
  id_borrador_retroalimentacion: number;
  nivel_desempeño: number;
  observaciones: string;
  id_autoevaluacion: number;
}

export default function Evaluations_profesor() {
  // Tarjetas
  const [autoevaluacion, setAutoevaluacion] = React.useState<Autoevaluacion[]>(
    [],
  );
  const [autoevaluacionSeleccionada, setAutoevaluacionSeleccionada] =
    React.useState<Autoevaluacion | null>(null);
  const [autoevaluacionID, setAutoevaluacionID] = React.useState<number>();
  // Selects
  // Nivel desempeño
  const [nivelDesempeño, setNivelDesempeño] = React.useState<number>();
  // observaciones
  const [observaciones, setObservaciones] = React.useState<string>("");
  // Modal
  const [openModalRetroalimentacion, setOpenModalRetroalimentacion] =
    React.useState(false);

  // Borrador
  const [borradorRetroalimentacion, setBorradorRetroalimentacion] =
    React.useState<BorradorRetroalimentacion[]>([]);
  const [id_borrador_retroalimentacion, setIdBorradorRetroalimentacion] = React.useState<number>(); 

  // Reiniciar formulario
  const limpiarFormulario = () => {
    setNivelDesempeño(undefined);
    setObservaciones("");
  };
  
  // Botones
    const [deshabilitar, SetDeshabilitar] = useState(false);

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [autoevaluacionRes, borradorRetroalimentacionRes] =
          await Promise.all([
            authFetch(
              `http://127.0.0.1:8000/api/autoevaluacion/profesor/`,
            ),
            authFetch(
              `http://127.0.0.1:8000/api/borradorretroalimentacion/`,
            ),
          ]);

        const autoevaluacionData = await autoevaluacionRes.json();
        const borradorRetroalimentacionData =
          await borradorRetroalimentacionRes.json();

        setAutoevaluacion(autoevaluacionData);
        setBorradorRetroalimentacion(borradorRetroalimentacionData);
      } catch (error) {
        console.error(error);
      }
    };
    cargarDatos();
  },);

  const handleSubmitRetroalimentacion = async (e: React.FormEvent) => {
    e.preventDefault();
    SetDeshabilitar(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/retroalimentacion/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nivel_desempeño: nivelDesempeño,
            observaciones: observaciones,
            autoevaluacion_id: autoevaluacionID,
            id_borrador_retroalimentacion: id_borrador_retroalimentacion
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toastSuccess(data.message);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
      }
    } catch {
      toastError("Error de conexión con el servidor");
    }
  };

  const handleBorrador = async (id: number) => {
    SetDeshabilitar(true);
    try {
      const response = await authFetch(
        `http://127.0.0.1:8000/api/borradorretroalimentacion/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nivel_desempeño: nivelDesempeño,
            observaciones: observaciones,
            id_autoevaluacion: id,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        toastSuccess(data.message);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
      } else if (response.status == 400) {
        toastError(data.error);
      }
    } catch {
      toastError("Error de conexión con el servidor");
    }
  };

  // Verificacion de borrador
  const verificar = (ae: Autoevaluacion) => {
    const borrador = borradorRetroalimentacion.find(
      (element) => element.id_autoevaluacion == ae.id_autoevaluacion,
    );

    if (borrador) {
      setNivelDesempeño(borrador.nivel_desempeño);
      setObservaciones(borrador.observaciones);
      setIdBorradorRetroalimentacion(borrador.id_borrador_retroalimentacion);
    } else {
      limpiarFormulario();
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evaluations</h1>
            <p className="text-muted-foreground mt-2">
              Review your evaluations and feedback aqui
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
          {/* Tarjetas */}
          <div className="flex flex-col gap-6">
            {autoevaluacion.map((ae: Autoevaluacion) => (
              <div
                key={ae.id_autoevaluacion}
                className="rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                {/* Contenido principal */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {ae.nombre_procedimiento}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 [&>div]:min-w-0">
                    <div>
                      <span className="font-medium text-gray-700">
                        Estudiante
                      </span>
                      <p>{ae.nombre_estudiante}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Nivel Desempeño
                      </span>
                      <p>{ae.nivel_desempeño}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Tipo Actividad
                      </span>
                      <p>{ae.tipo_actividad}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Lugar</span>
                      <p>{ae.lugar}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Hora Inicio
                      </span>
                      <p>{ae.hora_inicio}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Hora Final
                      </span>
                      <p>{ae.hora_final}</p>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">Fecha</span>
                      <p>{ae.fecha}</p>
                    </div>

                    <div>
                      {!ae.retroalimentacion.nivel_desempeño &&
                        !ae.retroalimentacion.observaciones && (
                          <>
                            <Button
                              className="max-w-full"
                              onClick={() => {
                                setAutoevaluacionSeleccionada(ae);
                                verificar(ae);
                                setOpenModalRetroalimentacion(true);
                              }}
                            >
                              Retroalimentacion
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                </div>

                {/* Accordion */}
                <div className="border-t border-gray-200 px-6 py-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="detalle">
                      <AccordionTrigger className="text-sm font-medium">
                        Ver retroalimentación
                      </AccordionTrigger>

                      <AccordionContent className="text-sm text-gray-600 pb-4">
                        <div className="flex items-start space-x-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-700">
                              Nivel Desempeño
                            </span>
                            <p>{ae.retroalimentacion.nivel_desempeño}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Fecha
                            </span>
                            <p>{ae.retroalimentacion.fecha}</p>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            Observaciones
                          </span>
                          <p>{ae.retroalimentacion.observaciones}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Dialog
            open={openModalRetroalimentacion}
            onOpenChange={(value) => {
              if (!value) {
                setOpenModalRetroalimentacion(value);
                limpiarFormulario();
              }
            }}
          >
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[640px] md:max-w-[568px] max-h-[80vh] overflow-y-auto rounded-lg bg-white">
              {autoevaluacionSeleccionada && (
                <form onSubmit={handleSubmitRetroalimentacion}>
                  <DialogHeader>
                    <DialogTitle>Retroalimentacion</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 py-4">
                    {/* Nivel Desempeño */}
                    <div className="grid gap-2">
                      <Label>Nivel Desempeño (Modelo Dreyfus y Dreyfus)</Label>

                      <Select
                        value={nivelDesempeño ? String(nivelDesempeño) : ""}
                        onValueChange={(value) =>
                          setNivelDesempeño(Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Desempeño" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="1">Novato</SelectItem>
                          <SelectItem value="2">
                            Principiante Avanzado
                          </SelectItem>
                          <SelectItem value="3">Competente</SelectItem>
                          <SelectItem value="4">Profesional</SelectItem>
                          <SelectItem value="5">Experto</SelectItem>
                        </SelectContent>
                      </Select>

                      {nivelDesempeño && (
                        <Card className="mt-4">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {nivelDesempeño === 1 && "Novato"}
                              {nivelDesempeño === 2 && "Principiante Avanzado"}
                              {nivelDesempeño === 3 && "Competente"}
                              {nivelDesempeño === 4 && "Profesional"}
                              {nivelDesempeño === 5 && "Experto"}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="text-sm text-muted-foreground">
                            {nivelDesempeño === 1 && (
                              <>
                                <p>
                                  Este nivel se caracteriza por la falta de
                                  experiencia y conocimientos en una determinada
                                  área. Los novatos requieren instrucciones y
                                  reglas explícitas para llevar a cabo tareas,
                                  además de orientación por parte del profesor.
                                </p>
                                <br />
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>
                                    Sigue reglas estrictas, descontextualizadas
                                    y literales.
                                  </li>
                                  <li>
                                    No reconoce patrones; depende completamente
                                    del manual o del docente.
                                  </li>
                                  <li>
                                    Actúa paso a paso, sin priorizar
                                    información.
                                  </li>
                                  <li>
                                    En medicina: corresponde al estudiante que
                                    necesita guías claras, listas de chequeo y
                                    supervisión directa.
                                  </li>
                                </ul>
                              </>
                            )}

                            {nivelDesempeño === 2 && (
                              <>
                                <p>
                                  En este nivel, los individuos tienen alguna
                                  experiencia práctica en el área y pueden
                                  empezar a tomar decisiones por sí mismos,
                                  aunque aún requieren reglas claras y
                                  orientación del profesor.
                                </p>
                                <br />
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>
                                    Comienza a identificar situaciones
                                    recurrentes o “aspectos relevantes”.
                                  </li>
                                  <li>
                                    Todavía depende de reglas, pero ya reconoce
                                    patrones simples.
                                  </li>
                                  <li>
                                    Toma decisiones básicas con apoyo cercano.
                                  </li>
                                  <li>
                                    En medicina: puede realizar tareas
                                    estructuradas (anamnesis, exploración) con
                                    ayuda y ejemplos.
                                  </li>
                                </ul>
                              </>
                            )}

                            {nivelDesempeño === 3 && (
                              <>
                                <p>
                                  Las personas en este nivel tienen suficiente
                                  experiencia práctica para tomar decisiones sin
                                  necesidad de seguir reglas explícitas. Son
                                  capaces de resolver problemas comunes y
                                  realizar tareas de manera eficiente.
                                </p>
                                <br />
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>
                                    Organiza la información, prioriza y
                                    planifica acciones.
                                  </li>
                                  <li>
                                    Toma decisiones deliberadas y responsables.
                                  </li>
                                  <li>Gestiona casos clínicos comunes.</li>
                                  <li>
                                    En medicina: puede llevar un caso completo,
                                    justificar decisiones y reflexionar sobre
                                    errores.
                                  </li>
                                </ul>
                              </>
                            )}

                            {nivelDesempeño === 4 && (
                              <>
                                <p>
                                  Las personas alcanzan un alto nivel de
                                  experiencia práctica, lo que les permite
                                  adaptarse a situaciones imprevistas y manejar
                                  tareas complejas con éxito.
                                </p>
                                <br />
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>
                                    Percibe la situación de manera holística
                                    (integral).
                                  </li>
                                  <li>
                                    Aplica las reglas con flexibilidad y empieza
                                    a utilizar la intuición basada en la
                                    experiencia.
                                  </li>
                                  <li>
                                    Anticipa problemas y adapta planes de
                                    acción.
                                  </li>
                                  <li>
                                    En medicina: resuelve casos complejos,
                                    integra múltiples protocolos y orienta a
                                    otros profesionales.
                                  </li>
                                </ul>
                              </>
                            )}

                            {nivelDesempeño === 5 && (
                              <>
                                <p>
                                  En este nivel, las personas tienen un
                                  conocimiento profundo y una amplia experiencia
                                  en el área que les permite tomar decisiones
                                  intuitivas y creativas en situaciones
                                  complejas.
                                </p>
                                <br />
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>
                                    Toma decisiones de forma fluida, automática
                                    e intuitiva.
                                  </li>
                                  <li>
                                    Las reglas ya no guían su acción; actúa con
                                    base en modelos mentales profundos.
                                  </li>
                                  <li>
                                    Reconoce patrones sutiles y responde
                                    rápidamente sin análisis explícito.
                                  </li>
                                  <li>
                                    En medicina: corresponde a un clínico
                                    altamente competente, líder y referente, con
                                    elevada conciencia situacional.
                                  </li>
                                </ul>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Observaciones */}
                    <div className="grid gap-2">
                      <Label>Observaciones:</Label>
                      <Textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        id="my-textarea"
                        placeholder="Por favor realice comentarios útiles para fortalecer el desempeño del estudiante..."
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button
                        variant={"borrador"}
                        type="button"
                        onClick={() => {
                          handleBorrador(autoevaluacionSeleccionada.id_autoevaluacion);
                        }}
                        disabled={deshabilitar || !nivelDesempeño || !observaciones}
                      >
                        Crear Borrador
                      </Button>
                      <Button
                        type="submit"
                        onClick={() => {
                          setAutoevaluacionID(
                            autoevaluacionSeleccionada.id_autoevaluacion,
                          );
                        }}
                        disabled={deshabilitar || !nivelDesempeño || !observaciones}
                      >
                        Guardar Retroalimentacion
                      </Button>
                    </DialogFooter>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}
