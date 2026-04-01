/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardLayout } from "@/components/DashboardLayout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authFetch } from "@/lib/authFetch";

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

interface CurvaAprendizaje {
  id_autoevaluacion: number;
  codigo_procedimiento: number;
  nivel_desempeño_estudiante: string;
  fecha: string;
  nombre_profesor: string;
  nivel_desempeño_profesor: string;
}

export default function AcademicProgress_estudiante() {
  // Selects
  // Procedimientos
  const [procedimientos, setProcedimientos] = React.useState<Procedimientos[]>(
    [],
  );
  const [seleccionado, setSeleccionado] = React.useState<string>(
    "Seleccionar procedimiento",
  );
  const [procedimientoID, setProcedimientoID] = React.useState<number>();
  // Graficos
  // Curva aprendizaje
  const [curvaAprendizaje, setCurvaAprendizaje] = React.useState<
    CurvaAprendizaje[]
  >([]);

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [procedimientosRes, curvaAprendizajeRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/procedimientos/"),
          authFetch(`http://127.0.0.1:8000/api/curvaaprendizaje/`),
        ]);

        const procedimientoData = await procedimientosRes.json();
        const curvaAprendizajeData = await curvaAprendizajeRes.json();

        setProcedimientos(procedimientoData);
        setCurvaAprendizaje(curvaAprendizajeData);
      } catch (error) {
        console.error(error);
      }
    };
    cargarDatos();
  });

  const dataFiltrada = curvaAprendizaje.filter(
    (item) => item.codigo_procedimiento === procedimientoID,
  );

  const nivelesMap: Record<string, number> = {
    Novato: 1,
    "Principiante Avanzado": 2,
    Competente: 3,
    Profesional: 4,
    Experto: 5,
  };

  const yLabels = [
    "Novato",
    "Principiante Avanzado",
    "Competente",
    "Profesional",
    "Experto",
  ];

  const dataChart = dataFiltrada.map((item, index) => ({
    id: index,
    fecha: `${item.fecha}-${index}`,
    fechaReal: item.fecha,
    estudiante: nivelesMap[item.nivel_desempeño_estudiante],
    profesor: nivelesMap[item.nivel_desempeño_profesor],
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Academic Progress
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your academic progress and grades
          </p>
          <br />
          {/* Procedimientos */}
          <div className="grid gap-2">
            <Label>Procedimientos</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start w-full truncate text-left"
                >
                  {seleccionado || "Seleccionar procedimiento"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[280px] max-h-[420px] overflow-y-auto"
              >
                {procedimientos.map((procedimiento) => (
                  <DropdownMenuSub key={procedimiento.id_procedimientos}>
                    <DropdownMenuSubTrigger>
                      <span className="whitespace-normal break-words text-left">
                        {procedimiento.nombre_p}
                      </span>
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent className="w-[280px] max-h-[420px] overflow-y-auto">
                      {procedimiento.opcion_procedimientos.map((opcion) => {
                        // SIN SUBOPCIONES
                        if (!opcion.sub_opcion_procedimientos?.length) {
                          return (
                            <DropdownMenuItem
                              key={opcion.id_opcion_procedimientos}
                              onClick={() => {
                                setSeleccionado(
                                  `${procedimiento.nombre_p} - ${opcion.nombre_op}`,
                                );
                                setProcedimientoID(
                                  opcion.id_opcion_procedimientos,
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
                              {opcion.sub_opcion_procedimientos.map((sub) => (
                                <DropdownMenuItem
                                  key={sub.id_sub_opcion_procedimientos}
                                  onClick={() => {
                                    setSeleccionado(
                                      `${procedimiento.nombre_p} - ${opcion.nombre_op} - ${sub.nombre_sop}`,
                                    );
                                    setProcedimientoID(
                                      sub.id_sub_opcion_procedimientos,
                                    );
                                  }}
                                >
                                  <span className="whitespace-normal break-words text-left">
                                    {sub.nombre_sop}
                                  </span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Curva Aprendizaje
              </h2>
              <p className="text-sm text-gray-500">
                {seleccionado != "Seleccionar procedimiento" && seleccionado}
              </p>
            </div>

            <div style={{ width: "100%", height: 380 }}>
              {!procedimientoID ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Selecciona un procedimiento para visualizar datos
                </div>
              ) : (
                <ResponsiveContainer>
                  <LineChart
                    data={dataChart}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                    <XAxis
                      dataKey="fecha"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) =>
                        value.split("-").slice(0, 3).join("-")
                      }
                      axisLine={{ stroke: "#d1d5db" }}
                      tickLine={false}
                      padding={{ left: 20, right: 20 }}
                    />

                    <YAxis
                      domain={[0.5, 5.5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => yLabels[value - 1]}
                      tick={{ fontSize: 12, fill: "#374151" }}
                      width={160}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;

                          return (
                            <div className="bg-white border shadow p-2 rounded">
                              <p className="text-xs text-gray-400 mb-1">{data.fechaReal}</p>
                              {payload.map((entry: any, i: number) => (
                                <p key={i} className="text-xs text-gray-400 mb-1">
                                  {entry.name}:{" "} 
                                  <span className="font-semibold text-blue-600">
                                  {yLabels[entry.value - 1]}
                                  </span>
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Legend
                      wrapperStyle={{
                        fontSize: "13px",
                        color: "#374151",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey={"estudiante"}
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Estudiante"
                    />

                    <Line
                      type="monotone"
                      dataKey="profesor"
                      stroke="#059669"
                      strokeWidth={3}
                      strokeDasharray="6 4"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Profesor"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      
    </DashboardLayout>
  );
}
