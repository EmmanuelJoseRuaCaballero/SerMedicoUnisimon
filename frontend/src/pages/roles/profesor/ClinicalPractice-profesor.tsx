import { DashboardLayout } from "@/components/DashboardLayout";
import { toastError } from "@/hooks/toast-sonner";
import { authFetch } from "@/lib/authFetch";
import React from "react";

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
      const tableProcedimientos = async () => {
        try {
          const response = await authFetch(
            "http://127.0.0.1:8000/api/tablaprocedimientos/profesor/",
          );
          const data = await response.json();
          setTablaProcedimientos(data);
          console.log(tablaProcedimientos);
        } catch {
          toastError("Error de conexión con el servidor");
        }
      };
      tableProcedimientos();
    });
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clinical Practice</h1>
          <p className="text-muted-foreground mt-2">
            Track your clinical practice hours and experiences
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96">
                  {tablaProcedimientos.length != 0 ? (
                    <div className="border rounded-xl overflow-hidden text-sm">
                      <div className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] bg-green-100 px-4 py-2 text-xs font-semibold">
                        <div>PROCEDIMIENTOS</div>
                        <div className="text-center">REAL</div>
                        <div className="text-center">SIMULADA</div>
                        <div className="text-center">LUGAR</div>
                        <div className="text-center">ESTUDIANTE</div>
                      </div>
        
                      {tablaProcedimientos.map((proc, i) => (
                        <div key={i}>
                          {/* Procedimientos */}
                          <div className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] px-4 py-2 bg-muted/30 font-medium border-t">
                            <div>{proc.nombre_procedimiento}</div>
        
                            <div className="text-center">{proc.actividad_real}</div>
        
                            <div className="text-center">{proc.actividad_simulada}</div>
        
                            <div></div>
                            <div></div>
                          </div>
        
                          {/* Opciones */}
                          {(proc.opciones ?? []).map((op, j) => (
                            <React.Fragment key={j}>
                              <div className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] px-4 py-2 border-t">
                                <div className="pl-6">{op.nombre_opcion}</div>
        
                                <div className="text-center">{op.actividad_real}</div>
        
                                <div className="text-center">
                                  {op.actividad_simulada}
                                </div>
        
                                <div className="text-xs">
                                  {(op.lugares ?? []).join(", ")}
                                </div>
        
                                <div className="text-xs">
                                  {(op.estudiantes ?? []).join(", ")}
                                </div>
                              </div>
        
                              {/* Subopciones */}
                              {(op.subopciones ?? []).map((sub, k) => (
                                <div
                                  key={k}
                                  className="grid grid-cols-[3fr_1fr_1fr_2fr_2fr] px-4 py-2 border-t"
                                >
                                  <div className="pl-12">{sub.nombre_subopcion}</div>
        
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
                      ))}
                    </div>
                  ) : (
                    <p>No hay datos</p>
                  )}
                </div>
      </div>
    </DashboardLayout>
  );
}