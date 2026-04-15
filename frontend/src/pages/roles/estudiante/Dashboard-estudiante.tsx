import { DashboardLayout } from "@/components/DashboardLayout";
import { sileo } from "sileo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import React from "react";
import { PieChart, Pie, Tooltip, Legend } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface BarData {
  year: string;
  real: number;
  simulado: number;
}

interface PieData {
  name: string;
  value: number;
  fill?: string;
}

interface EstadisticaYear {
  year: number;
  real: number;
  simulado: number;
}

interface UltimasAutoevaluaciones {
  id_autoevaluacion: number;
  fecha: string;
  nombre_profesor: string;
  nombre_procedimiento: string;
}

export default function Dashboard_estudiante() {
  const [dataBar, setDataBar] = React.useState<BarData[]>([]);
  const [dataPie, setDataPie] = React.useState<PieData[]>([]);
  const [ultimasAutoevaluaciones, setUltimasAutoevaluaciones] = React.useState<
    UltimasAutoevaluaciones[]
  >([]);

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [estadisticasProcedimientosRes, ultimasAutoevaluacionesRes] =
          await Promise.all([
            authFetch(`${API_URL}/api/estadisticasprocedimientos/estudiante/`),
            authFetch(`${API_URL}/api/ultimasautoevaluaciones/estudiante/`),
          ]);

        const estadisticasProcedimientoData =
          await estadisticasProcedimientosRes.json();

        const ultimasAutoevaluacionesData =
          await ultimasAutoevaluacionesRes.json();

        const dataTransformada = estadisticasProcedimientoData.year.map(
          (item: EstadisticaYear) => ({
            year: item.year.toString(),
            real: item.real,
            simulado: item.simulado,
          }),
        );

        setDataBar(dataTransformada);
        setDataPie([
          {
            name: "Real",
            value: estadisticasProcedimientoData.totales.real,
            fill: "#3b82f6",
          },
          {
            name: "Simulado",
            value: estadisticasProcedimientoData.totales.simulado,
            fill: "#e0ca01",
          },
        ]);
        setUltimasAutoevaluaciones(ultimasAutoevaluacionesData);
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

  // calcular total
  const total = dataPie.reduce((acc, item) => acc + item.value, 0);

  // label personalizado en el centro
  const renderCenterLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <>
        {/* Número */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-xl font-bold"
        >
          {total}
        </text>

        {/* Texto debajo */}
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-sm"
        >
          Total
        </text>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical portfolio and academic progress
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              Estadísticas
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center lg:col-span-1">
              <PieChart width={260} height={260}>
                <Pie
                  data={dataPie}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  cornerRadius={8}
                  labelLine={false}
                  label={renderCenterLabel}
                  isAnimationActive
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#3d3939",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border lg:col-span-2">
              <div className="w-full h-[320px]">
                <ResponsiveContainer>
                  <BarChart
                    data={dataBar}
                    margin={{ top: 10, right: 1, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="year" />
                    <YAxis />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#3d3939",
                        border: "none",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />

                    <Legend />

                    <Bar
                      dataKey="real"
                      stackId="total"
                      fill="#3b82f6"
                      name="Real"
                      isAnimationActive
                    />

                    <Bar
                      dataKey="simulado"
                      stackId="total"
                      fill="#e0ca01"
                      name="Simulado"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary content area */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Activity
            </h2>
          </div>

          {/* CONTENT */}
          {ultimasAutoevaluaciones.length === 0 ? (
            /* EMPTY STATE */
            <div className="min-h-48 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay actividad reciente
              </p>
            </div>
          ) : (
            /* GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ultimasAutoevaluaciones.map((item) => (
                <Card
                  id={`${item.id_autoevaluacion}`}
                  key={item.id_autoevaluacion}
                  className="hover:shadow-md transition-all duration-200 border border-border"
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-sm font-semibold leading-tight">
                      {item.nombre_procedimiento}
                    </CardTitle>

                    <CardDescription className="text-xs">
                      {item.fecha}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">Profesor:</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.nombre_profesor}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
