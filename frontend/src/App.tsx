import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dashboard/Index";
import NotFound from "./pages/dashboard/NotFound";

import Settings from "./pages/dashboard/coord_practicas/Settings";
import AcademicProgress from "./pages/dashboard/coord_practicas/AcademicProgress";
import Evaluations from "./pages/dashboard/coord_practicas/Evaluations";
import ClinicalPractice from "./pages/dashboard/coord_practicas/ClinicalPractice";
import Portfolio from "./pages/dashboard/coord_practicas/Portfolio";
import Dashboard from "./pages/dashboard/coord_practicas/Dashboard";

import "./index.css";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>  
    <TooltipProvider>
      <Sonner position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Director Programa */}

          {/* Coordinador Practicas */}
          <Route path="/coord-prac/dashboard" element={<Dashboard />} />
          <Route path="/coord-prac/portfolio" element={<Portfolio />} />
          <Route path="/coord-prac/clinical-practice" element={<ClinicalPractice />} />
          <Route path="/coord-prac/evaluations" element={<Evaluations />} />
          <Route path="/coord-prac/academic-progress" element={<AcademicProgress />} />
          <Route path="/coord-prac/settings" element={<Settings />} />

          {/* Coordinador Curso */}
          {/* Profesor */}
          {/* Estudiante */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
