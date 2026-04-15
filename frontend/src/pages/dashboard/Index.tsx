import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const obtenerPerfil = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/perfil/`, {});

      const data = await response.json();

      if (!response.ok) {
        sileo.error({
          title: "Error obteniendo perfil",
          duration: 3000,
          position: "top-center",
        });
        return;
      }
      
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("nombre", data.nombre);

      if (data.rol === "Profesor") {
        localStorage.setItem("ruta", "/profesor");
        navigate("/profesor/dashboard");
      } else if (data.rol === "Estudiante") {
        localStorage.setItem("ruta", "/estudiante");
        navigate("/estudiante/dashboard");
      }
    } catch {
      sileo.error({
          title: "Error en el perfil",
          duration: 3000,
          position: "top-center",
        });
        return;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    const ruta = localStorage.getItem("ruta");

    if (token && ruta) {
      navigate(`${ruta}/dashboard`);
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // API inicio de sesion
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        sileo.error({
          title: "Credenciales invalidas",
          description: "Porfavor intenta otra vez.",
          duration: 3000,
          position: "top-center",
        });
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      obtenerPerfil();
    } catch {
      sileo.error({
        title: "Error de conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Medical Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-medical-blue/90 to-medical-blue/70">
        {/* Medical Image Background */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-medical-blue via-medical-blue to-[hsl(177_58%_50%)] opacity-40">
          <div className="text-center text-white/60">
            <svg
              className="w-32 h-32 mx-auto mb-4 opacity-40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <p className="text-lg font-medium">Medical Image Area</p>
          </div>
        </div>

        {/* Logo Area - Top Left */}
        <div className="absolute top-8 left-8 z-10">
          <div className="w-14 h-14 bg-white/95 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-medical-blue">USB</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-medical-teal/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-medical-light">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-medical-blue">USB</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-medical-blue mb-2">
                E-Portafolio Ser Médico
              </h1>
              <p className="text-medical-gray text-sm font-medium">
                Faculty of Medicine – Universidad Simón Bolívar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="Username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Usuario institucional"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-0 focus:bg-white transition"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-0 focus:bg-white transition pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-medical-gray hover:text-medical-blue transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-medical-red hover:text-medical-blue transition"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-medical-blue hover:bg-[hsl(214_75%_15%)] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-medical-gray">
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="button"
                className="w-full border-2 border-medical-blue text-medical-blue hover:bg-medical-light font-semibold py-3 rounded-lg transition duration-200"
              >
                Create Account
              </button>
            </form>

            {/* Footer Text */}
            <p className="text-xs text-center text-medical-gray mt-8">
              By signing in, you agree to our{" "}
              <a href="#" className="text-medical-blue hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-medical-blue hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
