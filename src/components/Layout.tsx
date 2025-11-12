/**
 * Componente Layout - Estructura principal de la aplicación
 *
 * Layout base que incluye:
 * - Sidebar lateral de navegación
 * - Navbar superior con controles
 * - Área de contenido principal con animaciones
 * - Fondo degradado responsivo
 * - Soporte para tema oscuro/claro
 */
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido dinámico (cada vista) */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="min-h-full">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
