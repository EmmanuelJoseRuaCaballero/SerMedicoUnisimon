import { DashboardLayout } from "@/components/DashboardLayout";
import { authFetch } from "@/lib/authFetch";
import React from "react";
import { sileo } from "sileo";
import API_URL from "@/lib/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Subopcion {
  nombre_subopcion: string;
  actividad_real: number;
  actividad_simulada: number;
  lugares: string[];
  estudiantes: string[];
}

interface Opcion {
  nombre_opcion: string;
  actividad_real: number;
  actividad_simulada: number;
  lugares: string[];
  estudiantes: string[];
  subopciones: Subopcion[];
}

interface Procedimientos {
  nombre_procedimiento: string;
  actividad_real: number;
  actividad_simulada: number;
  opciones: Opcion[];
}

export default function ClinicalPractice_profesor() {
  const [tablaProcedimientos, setTablaProcedimientos] = React.useState<
    Procedimientos[]
  >([]);
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const tablaProcedimientos = async () => {
      try {
        const response = await authFetch(
          `${API_URL}/api/tablaprocedimientos/profesor/`,
        );
        const data = await response.json();
        setTablaProcedimientos(data);
        console.log(tablaProcedimientos);
      } catch {
        sileo.error({
          title: "Error",
          description: "Ha ocurrido un problema conexion con el servidor",
          duration: 3000,
          position: "top-center",
        });
      }
    };
    tablaProcedimientos();
  });
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Clinical Practice
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your clinical practice hours and experiences
          </p>
        </div>

        <Accordion type="multiple" className="space-y-3">
          {tablaProcedimientos.map((proc, i) => (
            <AccordionItem
              key={i}
              value={`proc-${i}`}
              className="border rounded-xl bg-card shadow-sm overflow-hidden"
            >
              {/* HEADER */}
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex w-full justify-between items-center">
                  <div className="text-left">
                    <p className="font-semibold">{proc.nombre_procedimiento}</p>
                    <p className="text-xs text-muted-foreground">
                      Real: {proc.actividad_real} · Simulada:{" "}
                      {proc.actividad_simulada}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              {/* CONTENT */}
              <AccordionContent className="px-0">
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="border-t">
                      {/* HEADER TABLA */}
                      <div className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] bg-muted/40 px-4 py-2 text-xs font-semibold">
                        <div>OPCIÓN / SUBOPCIÓN</div>
                        <div className="text-center">REAL</div>
                        <div className="text-center">SIMULADA</div>
                        <div className="text-center">LUGAR</div>
                        <div className="text-center">PROFESOR</div>
                      </div>

                      {/* OPCIONES */}
                      {proc.opciones?.map((op, j) => (
                        <React.Fragment key={j}>
                          <div className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] px-4 py-3 border-t bg-background">
                            <div className="pl-4 font-medium">
                              {op.nombre_opcion}
                            </div>

                            <div className="text-center">
                              {op.actividad_real}
                            </div>
                            <div className="text-center">
                              {op.actividad_simulada}
                            </div>

                            <div className="text-xs">
                              <ul className="list-disc list-inside space-y-1">
                                {(op.lugares ?? []).map((lugar, i) => (
                                  <li key={i}>{lugar}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="text-xs">
                              <ul className="list-disc list-inside space-y-1">
                                {(op.estudiantes ?? []).map((estudiante, i) => (
                                  <li key={i}>{estudiante}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* SUBOPCIONES */}
                          {op.subopciones?.map((sub, k) => (
                            <div
                              key={k}
                              className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] px-4 py-2 border-t bg-muted/20"
                            >
                              <div className="pl-10 text-sm text-muted-foreground">
                                └ {sub.nombre_subopcion}
                              </div>

                              <div className="text-center">
                                {sub.actividad_real}
                              </div>
                              <div className="text-center">
                                {sub.actividad_simulada}
                              </div>

                              <div className="text-xs">
                                {(sub.lugares ?? []).join(", ")}
                              </div>

                              <div className="text-xs">
                                {(sub.estudiantes ?? []).join(", ")}
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
