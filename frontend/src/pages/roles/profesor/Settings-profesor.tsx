import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import React from "react";
import { toastSuccess, toastError } from "@/hooks/toast-sonner";
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

interface Usuario {
  cedula_estudiante: number;
  nombre: string;
  semestre: number;
  estado: boolean;
}

export default function Settings_profesor() {
  const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
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
        const [estudianteRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/estudiante/"),
        ]);

        const estudianteData = await estudianteRes.json();

        setEstudiantes(estudianteData);
      } catch (error) {
        console.error(error);
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
      const response = await authFetch(
        `http://127.0.0.1:8000/api/estudiante/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listHabilitados),
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold">Estudiantes</h2>

            {/* Buscador */}
            <Input
              type="text"
              placeholder="Buscar por nombre o cedula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info seleccionados */}
          <div className="mb-2 text-sm text-gray-500">
            {seleccionados.length} seleccionados
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded border border-gray-300">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Cedula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map((user) => (
                    <TableRow
                      key={user.cedula_estudiante}
                      className={`transition hover:bg-gray-50 ${
                        seleccionados.includes(user.cedula_estudiante)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <TableCell>
                        {!user.estado && (
                          <Checkbox
                            checked={seleccionados.includes(
                              user.cedula_estudiante,
                            )}
                            onCheckedChange={() => {
                              handleCheckboxChange(user);
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell className="font-medium text-gray-700">
                        {user.cedula_estudiante}
                      </TableCell>

                      <TableCell>{user.nombre}</TableCell>

                      <TableCell>{user.semestre}</TableCell>

                      <TableCell>
                        <span
                          className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium w-fit
      ${user.estado ? "bg-gray-100 border border-gray-300 text-gray-600" : "bg-gray-100 border border-gray-300 text-gray-600"}
    `}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.estado ? "bg-green-500" : "bg-red-400"
                            }`}
                          ></span>

                          {user.estado ? "Habilitado" : "Deshabilitado"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-gray-500"
                    >
                      No hay resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Botón */}
          <div className="flex justify-end mt-4">
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
