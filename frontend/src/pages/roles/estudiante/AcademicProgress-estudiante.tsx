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
import type {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sileo } from "sileo";

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

  const isMobile = useIsMobile();

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [procedimientosRes, curvaAprendizajeRes] = await Promise.all([
          fetch(`${API_URL}/api/procedimientos/`),
          authFetch(`${API_URL}/api/curvaaprendizaje/`),
        ]);

        const procedimientoData = await procedimientosRes.json();
        const curvaAprendizajeData = await curvaAprendizajeRes.json();

        setProcedimientos(procedimientoData);
        setCurvaAprendizaje(curvaAprendizajeData);
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
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Academic Progress
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your academic progress and grades
          </p>
          <br />
          {/* Procedimientos */}
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
                    {procedimientos.map((proc) => (
                      <div key={proc.id_procedimientos}>
                        {/* NOMBRE PROCEDIMIENTO */}
                        <p className="font-semibold text-sm mb-2">
                          {proc.nombre_p}
                        </p>

                        {/* OPCIONES */}
                        {proc.opcion_procedimientos.map((op) => (
                          <div
                            key={op.id_opcion_procedimientos}
                            className="ml-2"
                          >
                            {/* SIN SUBOPCIONES */}
                            {!op.sub_opcion_procedimientos?.length && (
                              <SheetClose asChild>
                                <button
                                  className="block w-full text-left text-sm py-2 px-2 rounded hover:bg-muted active:bg-muted"
                                  onClick={() => {
                                    setSeleccionado(
                                      `${proc.nombre_p} - ${op.nombre_op}`,
                                    );
                                    setProcedimientoID(
                                      op.id_opcion_procedimientos,
                                    );
                                  }}
                                >
                                  {op.nombre_op}
                                </button>
                              </SheetClose>
                            )}

                            {/* CON SUBOPCIONES */}
                            {op.sub_opcion_procedimientos?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium py-2 px-2">
                                  {op.nombre_op}
                                </p>

                                {op.sub_opcion_procedimientos.map((sub) => (
                                  <SheetClose
                                    asChild
                                    key={sub.id_sub_opcion_procedimientos}
                                  >
                                    <button
                                      className="block w-full text-left text-sm py-2 pl-6 pr-2 rounded text-muted-foreground hover:bg-muted active:bg-muted"
                                      onClick={() => {
                                        setSeleccionado(
                                          `${proc.nombre_p} - ${op.nombre_op} - ${sub.nombre_sop}`,
                                        );
                                        setProcedimientoID(
                                          sub.id_sub_opcion_procedimientos,
                                        );
                                      }}
                                    >
                                      {sub.nombre_sop}
                                    </button>
                                  </SheetClose>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="grid gap-2">
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
          )}
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border min-h-96">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Curva Aprendizaje
            </h2>

            <p className="text-xs md:text-sm text-gray-500">
              {seleccionado !== "Seleccionar procedimiento" && seleccionado}
            </p>
          </div>

          <div className="w-full h-[300px] md:h-[380px]">
            {!procedimientoID ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Selecciona un procedimiento para visualizar datos
              </div>
            ) : (
              <ResponsiveContainer>
                <LineChart
                  data={dataChart}
                  margin={{
                    top: 20,
                    right: isMobile ? 10 : 30,
                    left: isMobile ? 0 : 20,
                    bottom: isMobile ? 20 : 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: isMobile ? 12 : 12, fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      value.split("-").slice(0, 3).join("-")
                    }
                    axisLine={{ stroke: "#d1d5db" }}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />

                  <YAxis
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => yLabels[value - 1]}
                    tick={{ fontSize: isMobile ? 10 : 12, fill: "#374151" }}
                    width={isMobile ? 80 : 160}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;

                        return (
                          <div className="bg-white border shadow p-2 rounded">
                            <p className="text-xs text-gray-400 mb-1">
                              {data.fechaReal}
                            </p>

                            {payload.map(
                              (
                                entry: Payload<ValueType, NameType>,
                                i: number,
                              ) => (
                                <p
                                  key={i}
                                  className="text-xs text-gray-400 mb-1"
                                >
                                  {entry.name}:{" "}
                                  <span className="font-semibold text-blue-600">
                                    {yLabels[Number(entry.value) - 1]}
                                  </span>
                                </p>
                              ),
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: isMobile ? "11px" : "13px",
                      color: "#374151",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={"estudiante"}
                    stroke="#e0ca01"
                    strokeWidth={isMobile ? 2 : 3}
                    dot={{ r: isMobile ? 2 : 4 }}
                    activeDot={{ r: isMobile ? 4 : 6 }}
                    name="Estudiante"
                    isAnimationActive
                  />

                  <Line
                    type="monotone"
                    dataKey="profesor"
                    stroke="#059669"
                    strokeWidth={isMobile ? 2 : 3}
                    dot={{ r: isMobile ? 2 : 4 }}
                    activeDot={{ r: isMobile ? 4 : 6 }}
                    name="Profesor"
                    isAnimationActive
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
