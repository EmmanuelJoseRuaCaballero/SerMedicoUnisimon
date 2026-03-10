import { DashboardLayout } from "@/components/DashboardLayout";
import * as React from "react";

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

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface Practica {
  id_practica: number;
  estado: boolean;
  fecha_inicio: string;
  fecha_final: string;
  codigo_grupo: number;
  semestre: number;
  nombre_profesor: string;
  nombre_clinico: string;
}

interface Clinico {
  id: number;
  nombre: string;
  id_practica: number;
}

interface Grupo {
  id_grupo: number;
  codigo_grupo: number;
}

interface Profesores {
  nombre_1: string;
  apellido_1: string;
}

export default function ClinicalPractice() {
  const cedula = localStorage.getItem("cedula");

  // Tarjetas
  const [practicas, setPracticas] = React.useState<Practica[]>([]);

  // Selects
  const [nombresClinico, setNombresClinico] = React.useState<Clinico[]>([]);
  const [clinico, setClinico] = React.useState<string>("");
  const [valoresGrupos, setValoresGrupos] = React.useState<Grupo[]>([]);
  const [grupo, setGrupo] = React.useState<string>(""); // Para poder convertilo en string a los grupos
  const [estado, setEstado] = React.useState<boolean>(false);
  const [profesores, setProfesores] = React.useState<Profesores[]>([]);
  const [nombreProfesor, setNombreProfesor] = React.useState<string>("");

  // Calendar
  const [dateInicio, setDateInicio] = React.useState<Date>();
  const [dateFinal, setDateFinal] = React.useState<Date>();
  const [openInicio, setOpenInicio] = React.useState(false);
  const [openFinal, setOpenFinal] = React.useState(false);
  const limpiarFormulario = () => {
    setDateInicio(undefined);
    setDateFinal(undefined);
    setClinico("");
    setGrupo("");
    setEstado(false);
    setNombreProfesor("");
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
        const [clinicosRes, gruposRes, profesoresRes, coord_practicaRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/curso-clinico/"),
          fetch("http://127.0.0.1:8000/api/grupo/"),
          fetch("http://127.0.0.1:8000/api/profesores/"),
          fetch(`http://127.0.0.1:8000/api/practica/${cedula}/`),
        ]);
                    
        const clinicosData = await clinicosRes.json();
        const gruposData = await gruposRes.json();
        const profesoresData = await profesoresRes.json();
        const coord_practica = await coord_practicaRes.json();

        setNombresClinico(clinicosData);
        setValoresGrupos(gruposData);
        setProfesores(profesoresData);
        setPracticas(coord_practica);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guardar la fecha formateada
    const inicio = formatDate(dateInicio);
    const final = formatDate(dateFinal);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/practica/${cedula}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clinico,
            estado,
            grupo,
            inicio,
            final,
          }),
        },
      );
      if (response.ok) {
        console.log("Datos enviados correctamente");
      }
    } catch (error) {
      console.error(error);
    }
    setOpenModal(false);
    window.location.reload();
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
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Crear Práctica Clínica</DialogTitle>

                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                  {/* Curso Clinico */}
                  <div className="grid gap-2">
                    <Label>Curso Clínico</Label>

                    <Select onValueChange={(value) => setClinico(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar curso clínico" />
                      </SelectTrigger>

                      <SelectContent>
                        {nombresClinico.map((nombre) => (
                          <SelectItem key={nombre.id} value={nombre.nombre}>
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

                    <Select onValueChange={(value) => setGrupo(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>

                      <SelectContent>
                        {valoresGrupos.map((grupo) => (
                          <SelectItem
                            key={grupo.id_grupo}
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
                    disabled={!clinico || !grupo || !dateInicio || !dateFinal}
                  >
                    Guardar Práctica
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tarjeta */}
            {practicas.map((practica: Practica) => (
              <div key={practica.id_practica} className="rounded-xl bg-white shadow-md border border-gray-200 p-6 hover:shadow-lg transition flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {practica.nombre_clinico}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${practica.estado
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {practica.estado ? "Activo" : "Finalizado"}
                  </span>
                </div>

                <div className="border-t border-gray-200 mb-4" />

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Profesor</span>
                    <span>{practica.nombre_profesor}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Grupo</span>
                    <span>{practica.codigo_grupo}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Semestre</span>
                    <span>{practica.semestre}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Inicio</span>
                    <span>{practica.fecha_inicio}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Finalización
                    </span>
                    <span>{practica.fecha_final}</span>
                  </div>
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

                          <Select onValueChange={(value) => setClinico(value)}>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={practica.nombre_clinico}
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {nombresClinico.map((nombre) => (
                                <SelectItem
                                  key={nombre.id}
                                  value={nombre.nombre}
                                >
                                  {nombre.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Profesor */}
                        <div className="flex items-center gap-2">
                          <Label className="whitespace-nowrap">Profesor:</Label>

                          <Select
                            onValueChange={(value) => setNombreProfesor(value)}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={practica.nombre_profesor}
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {profesores.map((profesor) => (
                                <SelectItem
                                  key={`${profesor.nombre_1}-${profesor.apellido_1}`}
                                  value={profesor.nombre_1}
                                >
                                  {profesor.nombre_1} {profesor.apellido_1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Estudiantes */}

                        <div className="flex items-center gap-2">
                          <Label className="whitespace-nowrap">
                            Estudiantes:
                          </Label>
                          <Label>Estudiante 1</Label>
                          <Checkbox />
                          <Label>Estudiante 2</Label>
                          <Checkbox />
                          <Label>Estudiante 3</Label>
                          <Checkbox />
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
                                  dateInicio ?? parseISO(practica.fecha_inicio)
                                }
                                defaultMonth={
                                  dateInicio ?? parseISO(practica.fecha_inicio)
                                }
                                onSelect={(date) => {
                                  setDateInicio(date);
                                  setOpenInicio(false);
                                }}
                                disabled={(date) =>
                                  date >
                                  (dateFinal ?? parseISO(practica.fecha_final))
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

                          <Popover open={openFinal} onOpenChange={setOpenFinal}>
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
