import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dashboard/Index";
import NotFound from "./pages/dashboard/NotFound";
import Settings from "./pages/dashboard/Settings";
import AcademicProgress from "./pages/dashboard/AcademicProgress";
import Evaluations from "./pages/dashboard/Evaluations";
import ClinicalPractice from "./pages/dashboard/ClinicalPractice";
import Portfolio from "./pages/dashboard/Portfolio";
import Dashboard from "./pages/dashboard/Dashboard";

import "./index.css";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/clinical-practice" element={<ClinicalPractice />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/academic-progress" element={<AcademicProgress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
