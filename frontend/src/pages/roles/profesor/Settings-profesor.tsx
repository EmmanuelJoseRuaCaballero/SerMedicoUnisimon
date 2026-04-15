import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import React from "react";
import { authFetch } from "@/lib/authFetch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";
import API_URL from "@/lib/config";

interface Usuario {
  cedula_estudiante: number;
  nombre: string;
  semestre: number;
  estado: boolean;
}

export default function Settings_profesor() {
  const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
  const [estadoProfesor, setEstadoProfesor] = React.useState<boolean>();
  const [search, setSearch] = useState("");
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [deshabilitar, SetDeshabilitar] = useState(false);

  const datosFiltrados = estudiantes.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.cedula_estudiante.toString().includes(search),
  );

  const handleCheckboxChange = (user: Usuario) => {
    setSeleccionados((prev) =>
      prev.includes(user.cedula_estudiante)
        ? prev.filter((id) => id !== user.cedula_estudiante)
        : [...prev, user.cedula_estudiante],
    );
  };

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [estudianteRes, estadoProfesorRes] = await Promise.all([
          fetch(`${API_URL}/api/estudiante/`),
          authFetch(`${API_URL}/api/validacionprofesor/`),
        ]);

        const estudianteData = await estudianteRes.json();
        const estadoProfesorData = await estadoProfesorRes.json();

        setEstudiantes(estudianteData);
        setEstadoProfesor(
          estadoProfesorData.estado === true ||
            estadoProfesorData.estado === "true" ||
            estadoProfesorData.estado === 1,
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

  const handleSubmitHabilitar = async (e: React.FormEvent) => {
    e.preventDefault();
    SetDeshabilitar(true);
    const listHabilitados = seleccionados.map((cedula) => ({
      cedula_estudiante: cedula,
      nuevo_estado: true,
    }));

    try {
      const response = await authFetch(`${API_URL}/api/estudiante/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listHabilitados),
      });
      const data = await response.json();
      if (response.ok) {
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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Estudiantes</h2>
              <div className="mb-3 text-sm text-muted-foreground">
  {seleccionados.length} seleccionados
</div>

{seleccionados.length > 0 && (
  <div className="mb-4 text-sm">
    <strong>Seleccionados:</strong>{" "}
    {estudiantes
      .filter((u) => seleccionados.includes(u.cedula_estudiante))
      .map((u) => u.nombre)
      .join(", ")}
  </div>
)}
            </div>

            <Input
              type="text"
              placeholder="Buscar por cedula o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72"
            />
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Semestre</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {datosFiltrados.length > 0 ? (
                      datosFiltrados.map((user) => (
                        <TableRow
                          key={user.cedula_estudiante}
                          className={`transition hover:bg-muted/40 ${
                            seleccionados.includes(user.cedula_estudiante)
                              ? "bg-primary/10"
                              : ""
                          }`}
                        >
                          <TableCell>
                            {estadoProfesor && !user.estado && (
                              <Checkbox
                                checked={seleccionados.includes(
                                  user.cedula_estudiante,
                                )}
                                onCheckedChange={() =>
                                  handleCheckboxChange(user)
                                }
                              />
                            )}
                          </TableCell>

                          <TableCell className="font-medium">
                            {user.cedula_estudiante}
                          </TableCell>

                          <TableCell>{user.nombre}</TableCell>

                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium
                  ${
                    user.estado
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  user.estado ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              {user.estado ? "Habilitado" : "Deshabilitado"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="px-2 py-1 bg-muted rounded text-xs">
                              {user.semestre}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground"
                        >
                          No hay resultados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
            </Table>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center p-4">
            <Button
              onClick={handleSubmitHabilitar}
              disabled={seleccionados.length === 0 || deshabilitar}
            >
              Habilitar seleccionados
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
