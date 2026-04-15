import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
//import { CalendarIcon } from "lucide-react";
//import { format } from "date-fns";
//import { es } from "date-fns/locale";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
//import { Calendar } from "@/components/ui/calendar";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
/*
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { sileo } from "sileo";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubOpcionProcedimiento {
  id_sub_opcion_procedimientos: number;
  nombre_sop: string;
}

interface OpcionProcedimiento {
  id_opcion_procedimientos: number;
  nombre_op: string;
  sub_opcion_procedimientos: SubOpcionProcedimiento[];
}

interface Procedimientos {
  id_procedimientos: number;
  nombre_p: string;
  opcion_procedimientos: OpcionProcedimiento[];
}

interface Lugar {
  id_lugar: number;
  nombre: string;
}

interface Profesor {
  cedula_profesor: number;
  nombre: string;
}

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
  nombre_profesor: string;
  retroalimentacion: Retroalimentacion;
}

interface BorradorAutoevaluacion {
  verificacion: boolean;
  id_borrador_autoevaluacion: number;
  nombre_procedimiento: string;
  procedimiento: number;
  id_procedimientos: number;
  id_lugar: number;
  nivel_desempeño: number;
  actividad: boolean;
  cedula_profesor: number;
  hora_inicio: string;
  hora_final: string;
  fecha: string;
}

export default function Evaluations_estudiante() {
  // Tarjetas
  const [autoevaluacion, setAutoevaluacion] = React.useState<Autoevaluacion[]>(
    [],
  );
  // Selects
  // Procedimientos
  const [procedimientos, setProcedimientos] = React.useState<Procedimientos[]>(
    [],
  );
  const [seleccionado, setSeleccionado] = React.useState<string>(
    "Seleccionar procedimiento",
  );
  const [procedimiento, setProcedimiento] = React.useState<number>();
  const [procedimientoID, setProcedimientoID] = React.useState<number>();
  // Lugar
  const [lugares, setLugares] = React.useState<Lugar[]>([]);
  const [lugarID, setLugarID] = React.useState<number>();
  // Nivel desempeño
  const [nivelDesempeño, setNivelDesempeño] = React.useState<number>();
  // Actividad
  const [tipoActividad, setTipoActividad] = React.useState<boolean | null>(
    null,
  );
  // Estudiante
  const [estadoEstudiante, setEstadoEstudiante] = React.useState<boolean>();
  // Profesor
  const [profesores, setProfesores] = React.useState<Profesor[]>([]);
  const [profesor, setProfesor] = React.useState<number>();
  // Hora
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  // Calendario
  /*
  const [fecha, setFecha] = React.useState<Date>();
  const [openFecha, setOpenFecha] = React.useState(false);
  */

  // Borrador
  const [borradorAutoevaluacion, setBorradorAutoevaluacion] =
    React.useState<BorradorAutoevaluacion | null>(null);

  // Botones
  const [deshabilitar, SetDeshabilitar] = useState(false);

  // Reiniciar formulario
  const limpiarFormulario = () => {
    setSeleccionado("Seleccionar procedimiento");
    setProcedimiento(undefined);
    setProcedimientoID(undefined);
    setLugarID(undefined);
    setNivelDesempeño(undefined);
    setTipoActividad(null);
    setProfesor(undefined);
    setHoraInicio("");
    setHoraFinal("");
    //setFecha(undefined);
  };

  // Formatear fecha
  /*
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }; */

  // Formato hora
  const horas = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
  );

  const isMobile = useIsMobile();

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [
          procedimientosRes,
          lugarRes,
          profesoresRes,
          autoevaluacionRes,
          borradorAutoevaluacionRes,
          estadoEstudianteRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/procedimientos/`),
          fetch(`${API_URL}/api/lugar/`),
          fetch(`${API_URL}/api/profesor/`),
          authFetch(`${API_URL}/api/autoevaluacion/estudiante/`),
          authFetch(`${API_URL}/api/borradorautoevaluacion/`),
          authFetch(`${API_URL}/api/validacionestudiante/`),
        ]);

        const procedimientoData = await procedimientosRes.json();
        const lugarData = await lugarRes.json();
        const profesoresData = await profesoresRes.json();
        const autoevaluacionData = await autoevaluacionRes.json();
        const borradorAutoevaluacionData =
          await borradorAutoevaluacionRes.json();
        const estadoEstudianteData = await estadoEstudianteRes.json();

        setProcedimientos(procedimientoData);
        setLugares(lugarData);
        setProfesores(profesoresData);
        setAutoevaluacion(autoevaluacionData);
        setBorradorAutoevaluacion(borradorAutoevaluacionData);
        setEstadoEstudiante(
          estadoEstudianteData.estado === true ||
            estadoEstudianteData.estado === "true" ||
            estadoEstudianteData.estado === 1,
        );
      } catch {
        sileo.error({
          title: "Error",
          description: "Ha ocurrido un problema conexion con el servidor",
          duration: 3000,
          position: "top-center",
        });
      }
    };
    cargarDatos();
  });

  const actualizarEstadoEstudiante = async (estadoEstudiante: boolean) => {
    try {
      await authFetch(`${API_URL}/api/validacionestudiante/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nuevo_estado: estadoEstudiante,
        }),
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const actualizarEstadoProfesor = async (estadoProfesor: boolean) => {
    try {
      await authFetch(`${API_URL}/api/validacionprofesor/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula_profesor: Number(profesor),
          nuevo_estado: estadoProfesor,
        }),
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleSubmitCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    let actividad: number = 0;

    if (tipoActividad == true) {
      actividad = 1;
    } else {
      actividad = 0;
    }
    SetDeshabilitar(true);

    try {
      const response = await authFetch(
        `${API_URL}/api/autoevaluacion/estudiante/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nivel_desempeño: nivelDesempeño,
            tipo_actividad: actividad,
            hora_inicio: horaInicio,
            hora_final: horaFinal,
            //fecha: formatDate(fecha),
            lugar_id: lugarID,
            cedula_profesor: Number(profesor),
            procedimiento,
            procedimientos_id: procedimientoID,
            id_borrador_autoevaluacion:
              borradorAutoevaluacion?.id_borrador_autoevaluacion,
          }),
        },
      );

      const data = await response.json();
      if (response.status == 201) {
        actualizarEstadoEstudiante(false);
        actualizarEstadoProfesor(false);
        sileo.success({
          title: "Exitoso",
          description: data.message,
          duration: 5000,
          position: "top-right",
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
      }
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleBorrador = async () => {
    try {
      const response = await authFetch(
        `${API_URL}/api/borradorautoevaluacion/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_procedimiento: seleccionado,
            procedimiento,
            id_procedimientos: procedimientoID,
            id_lugar: lugarID,
            nivel_desempeño: nivelDesempeño,
            actividad: tipoActividad,
            cedula_profesor: profesor,
            hora_inicio: horaInicio,
            hora_final: horaFinal,
            //fecha: formatDate(fecha),
          }),
        },
      );
      const data = await response.json();
      if (data.condition) {
        sileo.warning({
          title: "Advertencia",
          description: data.message,
          duration: 3000,
          position: "top-right",
        });
      } else if (response.ok) {
        SetDeshabilitar(true);
        sileo.success({
          title: "Exitoso",
          description: data.message,
          duration: 5000,
          position: "top-right",
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
      }
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  // Verificacion de borrador
  const verificacion = borradorAutoevaluacion?.verificacion;
  const verificar = (valor: boolean) => {
    if (valor && borradorAutoevaluacion) {
      setSeleccionado(borradorAutoevaluacion.nombre_procedimiento.toString());
      setProcedimiento(borradorAutoevaluacion.procedimiento);
      setProcedimientoID(borradorAutoevaluacion.id_procedimientos);
      setLugarID(borradorAutoevaluacion.id_lugar);
      setNivelDesempeño(borradorAutoevaluacion.nivel_desempeño);
      setTipoActividad(borradorAutoevaluacion.actividad);
      setProfesor(borradorAutoevaluacion.cedula_profesor);
      setHoraInicio(borradorAutoevaluacion.hora_inicio.slice(0, 5));
      setHoraFinal(borradorAutoevaluacion.hora_final.slice(0, 5));
      //const [year, month, day] = borradorAutoevaluacion.fecha.split("-");
      //setFecha(new Date(Number(year), Number(month) - 1, Number(day)));
    }
  };

  // Filtros
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtroLugar, setFiltroLugar] = useState<number | undefined>();
  const [filtroProfesor, setFiltroProfesor] = useState<number | undefined>();
  const [filtroNivel, setFiltroNivel] = useState<string | undefined>();
  const autoevaluacionesFiltradas = autoevaluacion.filter((ae) => {
    const matchLugar =
      !filtroLugar ||
      lugares.find((l) => l.id_lugar === filtroLugar)?.nombre === ae.lugar;

    const matchProfesor =
      !filtroProfesor ||
      profesores.find((p) => p.cedula_profesor === filtroProfesor)?.nombre ===
        ae.nombre_profesor;

    const matchNivel = !filtroNivel || ae.nivel_desempeño === filtroNivel;

    return matchLugar && matchProfesor && matchNivel;
  });

  const autoevaluacionesPaginadas = autoevaluacionesFiltradas.slice(
    (pagina - 1) * itemsPorPagina,
    pagina * itemsPorPagina,
  );

  const totalPaginas = Math.ceil(
    autoevaluacionesFiltradas.length / itemsPorPagina,
  );

  const limpiarFiltros = () => {
    setFiltroLugar(undefined);
    setFiltroProfesor(undefined);
    setFiltroNivel(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evaluations</h1>
            <p className="text-muted-foreground mt-2">
              Review your evaluations and feedback aqui
            </p>
          </div>
          <div className="flex justify-end items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpenFiltros(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <Dialog
              onOpenChange={(value) => {
                if (!value) {
                  limpiarFormulario();
                }
                verificar(!!verificacion);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90"
                  disabled={!estadoEstudiante}
                >
                  + Crear Autoevaluacion
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[640px] md:max-w-[768px] max-h-[80vh] overflow-y-auto rounded-lg bg-white">
                <form onSubmit={handleSubmitCrear}>
                  <DialogHeader>
                    <DialogTitle>Crear Autoevaluacion</DialogTitle>
                    <DialogDescription>
                      Aqui podras crear una autoevaluacion
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 py-4">
                    {/* Procedimientos */}
                    {/* Mobile */}
                    {isMobile ? (
                      <div className="grid gap-2">
                        <Label>Procedimientos</Label>

                        <Sheet>
                          {/* BOTÓN */}
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-auto px-3 py-2 md:px-4 md:py-3"
                            >
                              <div className="w-full text-left whitespace-normal break-words leading-tight">
                                {seleccionado || "Seleccionar procedimiento"}
                              </div>
                            </Button>
                          </SheetTrigger>

                          {/* CONTENIDO */}
                          <SheetContent
                            side="bottom"
                            className="h-[85vh] overflow-y-auto"
                          >
                            <div className="space-y-4">
                              {procedimientos.map((procedimiento) => (
                                <div key={procedimiento.id_procedimientos}>
                                  {/* NOMBRE PROCEDIMIENTO */}
                                  <p className="font-semibold text-sm mb-2">
                                    {procedimiento.nombre_p}
                                  </p>

                                  {/* OPCIONES */}
                                  {procedimiento.opcion_procedimientos.map(
                                    (opcion) => (
                                      <div
                                        key={opcion.id_opcion_procedimientos}
                                        className="ml-2"
                                      >
                                        {/* SIN SUBOPCIONES */}
                                        {!opcion.sub_opcion_procedimientos
                                          ?.length && (
                                          <SheetClose asChild>
                                            <button
                                              className="block w-full text-left text-sm py-2 px-2 rounded hover:bg-muted active:bg-muted"
                                              onClick={() => {
                                                setSeleccionado(
                                                  `${procedimiento.nombre_p} - ${opcion.nombre_op}`,
                                                );

                                                setProcedimiento(
                                                  opcion.id_opcion_procedimientos,
                                                );
                                                setProcedimientoID(
                                                  procedimiento.id_procedimientos,
                                                );
                                              }}
                                            >
                                              {opcion.nombre_op}
                                            </button>
                                          </SheetClose>
                                        )}

                                        {/* CON SUBOPCIONES */}
                                        {opcion.sub_opcion_procedimientos
                                          ?.length > 0 && (
                                          <div>
                                            <p className="text-sm font-medium py-2 px-2">
                                              {opcion.nombre_op}
                                            </p>

                                            {opcion.sub_opcion_procedimientos.map(
                                              (sub) => (
                                                <SheetClose
                                                  asChild
                                                  key={
                                                    sub.id_sub_opcion_procedimientos
                                                  }
                                                >
                                                  <button
                                                    className="block w-full text-left text-sm py-2 pl-6 pr-2 rounded text-muted-foreground hover:bg-muted active:bg-muted"
                                                    onClick={() => {
                                                      setSeleccionado(
                                                        `${procedimiento.nombre_p} - ${opcion.nombre_op} - ${sub.nombre_sop}`,
                                                      );

                                                      setProcedimiento(
                                                        sub.id_sub_opcion_procedimientos,
                                                      );
                                                      setProcedimientoID(
                                                        procedimiento.id_procedimientos,
                                                      );
                                                    }}
                                                  >
                                                    {sub.nombre_sop}
                                                  </button>
                                                </SheetClose>
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              ))}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {/*Desktop */}
                        <Label>Procedimientos</Label>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start px-3 py-2 md:px-4 md:py-3 h-auto"
                            >
                              <div className="w-full text-left whitespace-normal break-words leading-tight">
                                {seleccionado || "Seleccionar procedimiento"}
                              </div>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="start"
                            className="w-[280px] max-h-[420px] overflow-y-auto"
                          >
                            {procedimientos.map((procedimiento) => (
                              <DropdownMenuSub
                                key={procedimiento.id_procedimientos}
                              >
                                <DropdownMenuSubTrigger>
                                  <span className="whitespace-normal break-words text-left">
                                    {procedimiento.nombre_p}
                                  </span>
                                </DropdownMenuSubTrigger>

                                <DropdownMenuSubContent className="w-[280px] max-h-[420px] overflow-y-auto">
                                  {procedimiento.opcion_procedimientos.map(
                                    (opcion) => {
                                      // SIN SUBOPCIONES
                                      if (
                                        !opcion.sub_opcion_procedimientos
                                          ?.length
                                      ) {
                                        return (
                                          <DropdownMenuItem
                                            key={
                                              opcion.id_opcion_procedimientos
                                            }
                                            onClick={() => {
                                              setSeleccionado(
                                                `${procedimiento.nombre_p} - ${opcion.nombre_op}`,
                                              );
                                              setProcedimiento(
                                                opcion.id_opcion_procedimientos,
                                              );
                                              setProcedimientoID(
                                                procedimiento.id_procedimientos,
                                              );
                                            }}
                                          >
                                            <span className="whitespace-normal break-words text-left">
                                              {opcion.nombre_op}
                                            </span>
                                          </DropdownMenuItem>
                                        );
                                      }

                                      // CON SUBOPCIONES
                                      return (
                                        <DropdownMenuSub
                                          key={opcion.id_opcion_procedimientos}
                                        >
                                          <DropdownMenuSubTrigger>
                                            <span className="whitespace-normal break-words text-left">
                                              {opcion.nombre_op}
                                            </span>
                                          </DropdownMenuSubTrigger>

                                          <DropdownMenuSubContent className="w-[280px] max-h-[420px] overflow-y-auto">
                                            {opcion.sub_opcion_procedimientos.map(
                                              (sub) => (
                                                <DropdownMenuItem
                                                  key={
                                                    sub.id_sub_opcion_procedimientos
                                                  }
                                                  onClick={() => {
                                                    setSeleccionado(
                                                      `${procedimiento.nombre_p} - ${opcion.nombre_op} - ${sub.nombre_sop}`,
                                                    );
                                                    setProcedimiento(
                                                      sub.id_sub_opcion_procedimientos,
                                                    );
                                                    setProcedimientoID(
                                                      procedimiento.id_procedimientos,
                                                    );
                                                  }}
                                                >
                                                  <span className="whitespace-normal break-words text-left">
                                                    {sub.nombre_sop}
                                                  </span>
                                                </DropdownMenuItem>
                                              ),
                                            )}
                                          </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                      );
                                    },
                                  )}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    {/* Lugar */}
                    <div className="grid gap-2">
                      <Label>Lugar</Label>

                      <Select
                        value={lugarID ? String(lugarID) : ""}
                        onValueChange={(value) => setLugarID(Number(value))}
                      >
                        <SelectTrigger className="w-full justify-start px-3 py-2 md:px-4 md:py-3 h-auto">
                          <div className="w-full text-left whitespace-normal break-words leading-tight">
                            <SelectValue placeholder="Seleccionar lugar" />
                          </div>
                        </SelectTrigger>

                        <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto">
                          {lugares.map((lugar) => (
                            <SelectItem
                              key={lugar.id_lugar}
                              value={String(lugar.id_lugar)}
                              className="whitespace-normal break-words leading-snug"
                            >
                              {lugar.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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

                    {/* Actividad */}
                    <div className="grid gap-2">
                      <Label>Actividad</Label>

                      <Select
                        value={
                          tipoActividad !== null ? String(tipoActividad) : ""
                        }
                        onValueChange={(value) => {
                          setTipoActividad(value === "true");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Actividad" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="true">Real</SelectItem>
                          <SelectItem value="false">Simulada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Profesor */}
                    <div className="grid gap-2">
                      <Label>Profesor</Label>

                      <Select
                        value={profesor ? String(profesor) : ""}
                        onValueChange={(value) => setProfesor(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Profesor" />
                        </SelectTrigger>

                        <SelectContent>
                          {profesores.map((profesor) => (
                            <SelectItem
                              key={profesor.cedula_profesor}
                              value={`${profesor.cedula_profesor}`}
                            >
                              {profesor.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hora Inicio */}
                    <div className="grid gap-2">
                      <Label>Hora Inicio</Label>

                      <Select
                        value={horaInicio ? String(horaInicio) : ""}
                        onValueChange={(value) => setHoraInicio(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>

                        <SelectContent className="max-h-60">
                          {horas.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hora Final */}
                    <div className="grid gap-2">
                      <Label>Hora Final</Label>

                      <Select
                        value={horaFinal ? String(horaFinal) : ""}
                        onValueChange={(value) => setHoraFinal(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>

                        <SelectContent className="max-h-60">
                          {horas.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fecha                   
                  <div className="grid gap-2">
                    <Label>Fecha</Label>

                    <Popover open={openFecha} onOpenChange={setOpenFecha}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fecha
                            ? format(fecha, "PPPP", { locale: es })
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={fecha}
                          onSelect={(date) => {
                            setFecha(date);
                            setOpenFecha(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  */}
                  </div>
                  <div className="mt-3">
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                        <Button
                          variant={"borrador"}
                          type="button"
                          onClick={handleBorrador}
                          disabled={
                            deshabilitar ||
                            !seleccionado ||
                            !lugarID ||
                            !nivelDesempeño ||
                            tipoActividad === null ||
                            !profesor ||
                            !horaInicio ||
                            !horaFinal // ||
                            //!fecha
                          }
                        >
                          Crear Borrador
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            deshabilitar ||
                            !seleccionado ||
                            !lugarID ||
                            !nivelDesempeño ||
                            tipoActividad === null ||
                            !profesor ||
                            !horaInicio ||
                            !horaFinal // ||
                            //!fecha
                          }
                        >
                          Guardar Autoevaluacion
                        </Button>
                    </DialogFooter>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
          {/* Tarjetas */}
          <div className="flex flex-col gap-6">
            {autoevaluacionesPaginadas.map((ae: Autoevaluacion) => (
              <div
                key={ae.id_autoevaluacion}
                className="scroll-mt-24 rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                {/* Contenido principal */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {ae.nombre_procedimiento}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">
                        Profesor
                      </span>
                      <p>{ae.nombre_profesor}</p>
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

                    <div>
                      <span className="font-medium text-gray-700">Fecha</span>
                      <p>{ae.fecha}</p>
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
        <Sheet open={openFiltros} onOpenChange={setOpenFiltros}>
          <SheetContent
            side="right"
            className="w-[90vw] sm:w-[420px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label>Lugar</Label>
                <Select
                  value={filtroLugar ? String(filtroLugar) : ""}
                  onValueChange={(value) => setFiltroLugar(Number(value))}
                >
                  <SelectTrigger className="w-full justify-start px-3 py-2 md:px-4 md:py-3 h-auto">
                    <div className="w-full text-left whitespace-normal break-words leading-tight">
                      {" "}
                      <SelectValue placeholder="Seleccionar lugar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto">
                    {lugares.map((lugar) => (
                      <SelectItem
                        key={lugar.id_lugar}
                        value={String(lugar.id_lugar)}
                        className="whitespace-normal break-words leading-snug"
                      >
                        {lugar.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Profesor</Label>
                <Select
                  value={filtroProfesor ? String(filtroProfesor) : ""}
                  onValueChange={(value) => setFiltroProfesor(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {profesores.map((prof) => (
                      <SelectItem
                        key={prof.cedula_profesor}
                        value={String(prof.cedula_profesor)}
                      >
                        {prof.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Nivel desempeño</Label>
                <Select
                  value={filtroNivel ?? ""}
                  onValueChange={(value) => setFiltroNivel(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel desempeño" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Novato">Novato</SelectItem>
                    <SelectItem value="Principiante Avanzado">
                      Principiante Avanzado
                    </SelectItem>
                    <SelectItem value="Competente">Competente</SelectItem>
                    <SelectItem value="Profesional">Profesional</SelectItem>
                    <SelectItem value="Experto">Experto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => setOpenFiltros(false)}
                >
                  Aplicar
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={limpiarFiltros}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={() => {
              setPagina((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={pagina === 1}
          >
            <ChevronLeft />
          </Button>

          <span className="text-sm">
            Página {pagina} de {totalPaginas}
          </span>

          <Button
            onClick={() => {
              setPagina((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={pagina === totalPaginas}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
