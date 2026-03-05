import { DashboardLayout } from "@/components/DashboardLayout";

export default function ClinicalPractice() {
  const profesor = JSON.parse(localStorage.getItem("profesor") || "{}");

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
          <button className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition">
            + Crear
          </button>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tarjeta */}
            <div className="rounded-xl bg-white shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {profesor.nombre_clinico}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                    profesor.estado
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {profesor.estado ? "Activo" : "Finalizado"}
                </span>
              </div>
                  
              <div className="border-t border-gray-200 mb-4" />

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Profesor</span>
                  <span>{profesor.nombre_profesor}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Grupo</span>
                  <span>{profesor.grupo}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Semestre</span>
                  <span>{profesor.semestre}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Inicio</span>
                  <span>{profesor.fecha_inicio}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Finalización
                  </span>
                  <span>{profesor.fecha_final}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6">
                <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>      
      </div>
    </DashboardLayout>
  );
}
