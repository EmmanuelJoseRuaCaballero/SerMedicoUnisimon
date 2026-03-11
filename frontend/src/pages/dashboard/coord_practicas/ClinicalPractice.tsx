import { DashboardLayout } from "@/components/DashboardLayout";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toastSuccess, toastError } from "@/hooks/toast-sonner";

interface Estudiante {
  nombre_estudiante: string;
}

interface Practica {
  nombre_clinico: string;
  estado: boolean;
  nombre_profesor: string;
  nombre_coord_curso: string;
  semestre: number;
  codigo_grupo: number;
  fecha_inicio: string;
  fecha_final: string;
  estudiantes_nombres: Estudiante[];
}

interface CursoClinico {
  nombre: string;
}

interface Grupo {
  codigo_grupo: number;
}

interface Profesor {
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
}

interface CoordinadorCurso {
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
}

export default function ClinicalPractice() {
  const cedula = localStorage.getItem("cedula");

  // Tarjetas
  const [practicas, setPracticas] = React.useState<Practica[]>([]);

  // Selects
  // Curso Clinico
  const [cursoClinico, setCursoClinico] = React.useState<CursoClinico[]>([]);
  const [nombreClinico, setNombreClinico] = React.useState<string>("");
  //Grupo
  const [grupo, setGrupo] = React.useState<Grupo[]>([]);
  const [codigoGrupo, setCodigoGrupo] = React.useState<string>(""); // Para poder convertilo en string a los grupos
  // Estado
  const [estado, setEstado] = React.useState<boolean>(false);
  // Profesor
  const [profesor, setProfesor] = React.useState<Profesor[]>([]);
  const [nombreProfesor, setNombreProfesor] = React.useState<string>("");
  // Coordinador Curso
  const [coordCurso, setCoordCurso] = React.useState<CoordinadorCurso[]>([]);
  const [nombreCoordCurso, setNombreCoordCurso] = React.useState<string>("");

  // Calendario
  const [dateInicio, setDateInicio] = React.useState<Date>();
  const [dateFinal, setDateFinal] = React.useState<Date>();
  const [openInicio, setOpenInicio] = React.useState(false);
  const [openFinal, setOpenFinal] = React.useState(false);
  const limpiarFormulario = () => {
    setDateInicio(undefined);
    setDateFinal(undefined);
    setNombreClinico("");
    setCodigoGrupo("");
    setEstado(false);
    setNombreProfesor("");
    setNombreCoordCurso("");
  };

  // Modal Crear
  const [openModal, setOpenModal] = React.useState(false);

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [
          clinicosRes,
          gruposRes,
          profesoresRes,
          coord_practicaRes,
          coord_cursoRes,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/curso-clinico/"),
          fetch("http://127.0.0.1:8000/api/grupo/"),
          fetch("http://127.0.0.1:8000/api/profesores/"),
          fetch(`http://127.0.0.1:8000/api/practica/${cedula}/`),
          fetch(`http://127.0.0.1:8000/api/coord-curso/`),
        ]);

        const clinicosData = await clinicosRes.json();
        const gruposData = await gruposRes.json();
        const profesoresData = await profesoresRes.json();
        const coord_practica = await coord_practicaRes.json();
        const coord_cursos = await coord_cursoRes.json();

        setCursoClinico(clinicosData);
        setGrupo(gruposData);
        setProfesor(profesoresData);
        setPracticas(coord_practica);
        setCoordCurso(coord_cursos);
      } catch (error) {
        console.error(error);
      }
    };

    cargarDatos();
  }, [cedula]);

  // Formatear fecha
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nombreClinico,
      nombreProfesor,
      nombreCoordCurso,
      dateInicio,
      dateFinal,
    });
  };

  const handleSubmitCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guardar la fecha formateada
    const fechaInicio = formatDate(dateInicio);
    const fechaFinal = formatDate(dateFinal);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/practica/${cedula}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreClinico,
            estado,
            codigoGrupo,
            fechaInicio,
            fechaFinal,
          }),
        },
      );
      const data = await response.json();
      console.log(response.status)
      if (response.ok) {
        toastSuccess("Practica creada");
        await new Promise(resolve => setTimeout(resolve, 3000));
        setOpenModal(false);
        window.location.reload();
      } else if(response.status == 400) {
        toastError(data.message);         
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toastError("Error de conexión con el servidor");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Clinical Practice
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your clinical practice hours and experiences
            </p>
          </div>
          <Dialog
            open={openModal}
            onOpenChange={(value) => {
              setOpenModal(value);
              if (!value) {
                limpiarFormulario();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90">
                + Crear
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[520px] rounded-lg">
              <form onSubmit={handleSubmitCrear}>
                <DialogHeader>
                  <DialogTitle>Crear Práctica Clínica</DialogTitle>

                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                  {/* Curso Clinico */}
                  <div className="grid gap-2">
                    <Label>Curso Clínico</Label>

                    <Select onValueChange={(value) => setNombreClinico(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar curso clínico" />
                      </SelectTrigger>

                      <SelectContent>
                        {cursoClinico.map((nombre, index) => (
                          <SelectItem key={index} value={nombre.nombre}>
                            {nombre.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="grid gap-2">
                    <Label>Estado</Label>

                    <Select
                      onValueChange={(value) => setEstado(value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grupo */}
                  <div className="grid gap-2">
                    <Label>Grupo</Label>

                    <Select onValueChange={(value) => setCodigoGrupo(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>

                      <SelectContent>
                        {grupo.map((grupo, index) => (
                          <SelectItem
                            key={index}
                            value={String(grupo.codigo_grupo)}
                          >
                            {grupo.codigo_grupo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha Inicio */}
                  <div className="grid gap-2">
                    <Label>Fecha Inicio</Label>

                    <Popover open={openInicio} onOpenChange={setOpenInicio}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {dateInicio
                            ? format(dateInicio, "PPPP", { locale: es })
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={dateInicio}
                          onSelect={(date) => {
                            setDateInicio(date);
                            setOpenInicio(false);
                          }}
                          disabled={(date) =>
                            dateFinal ? date > dateFinal : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Fecha Final */}
                  <div className="grid gap-2">
                    <Label>Fecha Final</Label>

                    <Popover
                      open={dateInicio ? openFinal : false}
                      onOpenChange={setOpenFinal}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {!dateInicio
                            ? "Primero selecciona fecha inicio"
                            : dateFinal
                              ? format(dateFinal, "PPPP", { locale: es })
                              : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={dateFinal}
                          onSelect={(date) => {
                            setDateFinal(date);
                            setOpenFinal(false);
                          }}
                          disabled={(date) =>
                            dateInicio ? date < dateInicio : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={
                      !nombreClinico ||
                      !codigoGrupo ||
                      !dateInicio ||
                      !dateFinal
                    }
                  >
                    Guardar Práctica
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta */}
            {practicas.map((practica: Practica, index) => (
              <div
                key={index}
                className="rounded-xl bg-white shadow-md border border-gray-200 p-6 hover:shadow-lg transition flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-2">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {practica.nombre_clinico}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      practica.estado
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {practica.estado ? "Activo" : "Finalizado"}
                  </span>
                </div>

                <div className="border-t border-gray-200 mb-4" />

                {/* Info */}
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Profesor</span>
                  <span>{practica.nombre_profesor}</span>

                  <span className="font-medium text-gray-700 ">
                    Coordinador Curso
                  </span>
                  <span>{practica.nombre_coord_curso}</span>

                  <span className="font-medium text-gray-700">Grupo</span>
                  <span>{practica.codigo_grupo}</span>

                  <span className="font-medium text-gray-700">Semestre</span>
                  <span>{practica.semestre}</span>

                  <span className="font-medium text-gray-700">Inicio</span>
                  <span>{practica.fecha_inicio}</span>

                  <span className="font-medium text-gray-700">
                    Finalización
                  </span>
                  <span>{practica.fecha_final}</span>
                </div>

                {/* Footer */}
                <div className="mt-6">
                  <Dialog
                    onOpenChange={(value) => {
                      if (!value) {
                        limpiarFormulario();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
                        Ver Detalles
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[640px] md:max-w-[568px] max-h-[80vh] overflow-y-auto rounded-lg">
                      <form onSubmit={handleSubmitEdit}>
                        <DialogHeader>
                          <DialogTitle>
                            Detalles - Grupo {practica.codigo_grupo} -{" "}
                            {practica.semestre} Semestre
                          </DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2">
                          {/* Curso Clinico */}
                          <div className="flex items-center gap-2">
                            <Label className="whitespace-nowrap">
                              Nombre Clinico:
                            </Label>

                            <Select
                              onValueChange={(value) => setNombreClinico(value)}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={practica.nombre_clinico}
                                />
                              </SelectTrigger>

                              <SelectContent>
                                {cursoClinico.map((nombre, index) => (
                                  <SelectItem key={index} value={nombre.nombre}>
                                    {nombre.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Coordinador Curso */}
                          <div className="flex items-center gap-2">
                            <Label className="whitespace-nowrap">
                              Coordinador Curso:
                            </Label>

                            <Select
                              onValueChange={(value) =>
                                setNombreCoordCurso(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={practica.nombre_coord_curso}
                                />
                              </SelectTrigger>

                              <SelectContent>
                                {coordCurso.map((coord, index) => (
                                  <SelectItem
                                    key={index}
                                    value={`${coord.nombre_1} ${coord.nombre_2} ${coord.apellido_1} ${coord.apellido_2}`}
                                  >
                                    {coord.nombre_1} {coord.nombre_2}{" "}
                                    {coord.apellido_1} {coord.apellido_2}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Profesor */}
                          <div className="flex items-center gap-2">
                            <Label className="whitespace-nowrap">
                              Profesor:
                            </Label>

                            <Select
                              onValueChange={(value) =>
                                setNombreProfesor(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={practica.nombre_profesor}
                                />
                              </SelectTrigger>

                              <SelectContent>
                                {profesor.map((profesor, index) => (
                                  <SelectItem
                                    key={index}
                                    value={`${profesor.nombre_1} ${profesor.nombre_2} ${profesor.apellido_1} ${profesor.apellido_2}`}
                                  >
                                    {profesor.nombre_1} {profesor.nombre_2}{" "}
                                    {profesor.apellido_1} {profesor.apellido_2}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Estudiantes */}
                          <div className="flex items-center gap-2">
                            <div className="relative w-full overflow-auto">
                              <Label className="whitespace-nowrap">
                                Lista Estudiantes:
                              </Label>
                              <Table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="bg-gray-100 text-gray-700">
                                      Nombre
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {practica.estudiantes_nombres.map(
                                    (nombre, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="px-3 py-2 border-b">
                                          {nombre.nombre_estudiante}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          {/* Fecha Inicio */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                            <Label className="whitespace-nowrap">
                              Fecha Inicio:
                            </Label>

                            <Popover
                              open={openInicio}
                              onOpenChange={setOpenInicio}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal w-full"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />

                                  {dateInicio
                                    ? format(dateInicio, "PPPP", { locale: es })
                                    : format(
                                        parseISO(practica.fecha_inicio),
                                        "PPPP",
                                        { locale: es },
                                      )}
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  locale={es}
                                  mode="single"
                                  selected={
                                    dateInicio ??
                                    parseISO(practica.fecha_inicio)
                                  }
                                  defaultMonth={
                                    dateInicio ??
                                    parseISO(practica.fecha_inicio)
                                  }
                                  onSelect={(date) => {
                                    setDateInicio(date);
                                    setOpenInicio(false);
                                  }}
                                  disabled={(date) =>
                                    date >
                                    (dateFinal ??
                                      parseISO(practica.fecha_final))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Fecha Final */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                            <Label className="whitespace-nowrap">
                              Fecha Final:
                            </Label>

                            <Popover
                              open={openFinal}
                              onOpenChange={setOpenFinal}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal w-full"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />

                                  {dateFinal
                                    ? format(dateFinal, "PPPP", { locale: es })
                                    : format(
                                        parseISO(practica.fecha_final),
                                        "PPPP",
                                        {
                                          locale: es,
                                        },
                                      )}
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  locale={es}
                                  mode="single"
                                  selected={
                                    dateFinal ?? parseISO(practica.fecha_final)
                                  }
                                  defaultMonth={
                                    dateFinal ?? parseISO(practica.fecha_final)
                                  }
                                  onSelect={(date) => {
                                    setDateFinal(date);
                                    setOpenFinal(false);
                                  }}
                                  disabled={(date) =>
                                    date <
                                    (dateInicio ??
                                      parseISO(practica.fecha_inicio))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Observacion */}
                          <div className="flex items-center gap-2">
                            <Label className="whitespace-nowrap">
                              Observaciones:
                            </Label>
                            <Textarea
                              id="my-textarea"
                              placeholder="Ingresa tu texto aquí..."
                            />
                          </div>
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                          <Button variant="destructive">Eliminar</Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogClose>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
