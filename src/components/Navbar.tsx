/**
 * Componente Navbar - Barra de navegación principal
 *
 * Barra de navegación superior con funcionalidades de:
 * - Navegación al Welcome (botón Home)
 * - Cambio de tema oscuro/claro
 * - Menú móvil responsivo
 * - Indicador de página actual
 * - Animaciones fluidas con Framer Motion
 */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaBars, FaTimes, FaHome } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Inicializa el tema al cargar
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved) {
      const isDarkMode = saved === "dark";
      setIsDark(isDarkMode);
      root.classList.toggle("dark", isDarkMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const next = nextIsDark ? "dark" : "light";
    localStorage.setItem("theme", next);
    root.classList.toggle("dark", nextIsDark);
    // Notifica a la app para que vistas activas reaccionen en vivo
    document.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme: next } }));
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      "/": "Inicio",
      "/three": "Three.js Demo",
      "/layouts": "Responsive Layouts",
      "/tts": "Text-to-Speech",
      "/three_2": "Figuras Geométricas",
      "/tablasmul": "Tablas de Multiplicar",
      "/conversorunid": "Conversor de Unidades",
      "/validcontrasena": "Validador de Contraseñas",
      "/contadorclics": "Contador de Clics",
      "/listareas": "Lista de Tareas",
      "/sistema-solar": "Sistema Solar",
      "/globo": "Globo Interactivo",
      "/block-builder": "Block Builder",
    };
    return titles[path] || "UCC Prácticas";
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-16 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Lado izquierdo: logo + marca */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-fun-candy via-fun-lavender to-fun-sky flex items-center justify-center shadow-lg"
                animate={{
                  background: [
                    "linear-gradient(45deg, #ff6b9d, #a29bfe, #74b9ff)",
                    "linear-gradient(45deg, #00d2d3, #ffeaa7, #ff9ff3)",
                    "linear-gradient(45deg, #fdcb6e, #e84393, #00cec9)",
                    "linear-gradient(45deg, #ff6b9d, #a29bfe, #74b9ff)"
                  ],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  background: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 4, repeat: Infinity }
                }}
              >
                <motion.span
                  className="text-white font-bold text-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  E
                </motion.span>
              </motion.div>
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#ff69b4", "#9370db", "#87ceeb", "#98fb98"]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                  backgroundColor: { duration: 4, repeat: Infinity }
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-80"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                EduLink
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                {getPageTitle()}
              </p>
            </div>
          </motion.div>

          {/* Lado derecho: navegación y controles */}
          <div className="flex items-center gap-3">
            {/* Botón Home */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 shadow-sm"
              aria-label="Volver al inicio"
              title="Volver al Welcome"
            >
              <FaHome className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.button>

            {/* Tema toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 shadow-sm"
              aria-label="Cambiar tema"
              title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <FaSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FaMoon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 shadow-sm"
              aria-label="Menú móvil"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <FaBars className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 top-16 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Navegación
                </h3>
                <div className="space-y-2">
                  {/* Aquí podrías agregar enlaces rápidos para móvil */}
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Usa la sidebar en desktop para navegación completa
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
