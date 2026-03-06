import { DashboardLayout } from "@/components/DashboardLayout";
import * as React from "react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogTrigger,DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Practica {
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

export default function ClinicalPractice() {
  // Tarjetas
  const coord_practica = JSON.parse(localStorage.getItem("profesor") || "[]");
  const practicas: Practica[] = coord_practica;

  // Selects
  const [nombresClinico, setNombresClinico] = React.useState<Clinico[]>([]);
  const [clinico, setClinico] = React.useState<string>("");
  const [valoresGrupos, setValoresGrupos] = React.useState<Grupo[]>([]);
  const [grupo, setGrupo] = React.useState<string>(""); // Para poder convertilo en string a los grupos
  const [estado, setEstado] = React.useState<string>("");

  // Calendar
  const [dateInicio, setDateInicio] = React.useState<Date>();
  const [dateFinal, setDateFinal] = React.useState<Date>();
  const [openInicio, setOpenInicio] = React.useState(false);
  const [openFinal, setOpenFinal] = React.useState(false);

  // Modal
  const [open, setOpen] = React.useState(false);

  // APIS
  // API nombre clinicos
  const obtenerClinicos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/curso-clinico/");
      const data = await response.json();
      setNombresClinico(data);
    } catch (error) {
      console.error(error);
    }
  };

  // API grupos
  const obtenerGrupos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/grupo/");
      const data = await response.json();
      setValoresGrupos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Llamar API
  React.useEffect(() => {
    obtenerClinicos();
    obtenerGrupos();
  }, []);

  // Formatear fecha
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Guardar la fecha formateada
  const inicio = formatDate(dateInicio);
  const final = formatDate(dateFinal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(grupo)
    console.log(estado);
    console.log(clinico);
    console.log(inicio);
    console.log(final);
    console.log();

    setOpen(false);
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90">
                + Crear
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Crear Práctica Clínica</DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                  {/* Grupo */}
                  <div className="grid gap-2">
                    <Label>Grupo</Label>

                    <Select value={grupo}
                      onValueChange={(value) => setGrupo(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>

                      <SelectContent>
                        {valoresGrupos.map((grupo) => (
                          <SelectItem
                            key={grupo.id_grupo}
                            value={String(grupo.id_grupo)}
                          >
                            {grupo.codigo_grupo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Curso Clinico */}
                  <div className="grid gap-2">
                    <Label>Curso Clínico</Label>

                    <Select onValueChange={(value) => setClinico(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar curso clínico" />
                      </SelectTrigger>

                      <SelectContent>
                        {nombresClinico.map((nombre) => (
                          <SelectItem value={nombre.nombre}>
                            {nombre.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="grid gap-2">
                    <Label>Estado</Label>

                    <Select onValueChange={(value) => setEstado(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Finalizado</SelectItem>
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
                            ? format(dateInicio, "PPP")
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateInicio}
                          onSelect={(date) => {
                            setDateInicio(date);
                            setOpenInicio(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Fecha Final */}
                  <div className="grid gap-2">
                    <Label>Fecha Final</Label>

                    <Popover open={openFinal} onOpenChange={setOpenFinal}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {dateFinal
                            ? format(dateFinal, "PPP")
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFinal}
                          onSelect={(date) => {
                            setDateFinal(date);
                            setOpenFinal(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Guardar Práctica</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tarjeta */}
            {practicas.map((practica: Practica) => (
              <div className="rounded-xl bg-white shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
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
                  <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
