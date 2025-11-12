/**
 * Vista HomePage - Página principal con landing page moderna
 *
 * Página de inicio con diseño moderno que presenta las características
 * principales del proyecto. Incluye animaciones, estadísticas y
 * navegación a diferentes secciones de la aplicación.
 */
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaPalette, FaGlobe, FaSun, FaCubes } from "react-icons/fa";

export default function HomeContent() {
  const features = [
    {
      icon: <FaCode className="w-8 h-8" />,
      title: "Desarrollo Moderno",
      description: "React 19 + TypeScript + Vite"
    },
    {
      icon: <FaPalette className="w-8 h-8" />,
      title: "Diseño Responsivo",
      description: "TailwindCSS + Tema Oscuro"
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "3D Interactivo",
      description: "Three.js + WebGL"
    },
    {
      icon: <FaSun className="w-8 h-8" />,
      title: "Sistema Solar",
      description: "Exploración Espacial"
    },
    {
      icon: <FaCubes className="w-8 h-8" />,
      title: "Construcción 3D",
      description: "Block Builder Interactivo"
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Experimentos",
      description: "Aprendizaje Práctico"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo animado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <FaRocket className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            UCC Prácticas
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Explora el futuro del desarrollo web con{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">React + TypeScript</span>{" "}
            y descubre experiencias 3D interactivas
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-2">
                <FaRocket className="w-5 h-5" />
                Explorar Demo
              </span>
            </button>
            <button className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-2">
                <FaCode className="w-5 h-5" />
                Ver Código
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Características Destacadas
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Una colección completa de componentes y experiencias interactivas para aprender desarrollo web moderno
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-600 py-16"
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">13+</div>
              <div className="text-emerald-100">Componentes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">35+</div>
              <div className="text-emerald-100">Tests</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
              <div className="text-emerald-100">TypeScript</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">∞</div>
              <div className="text-emerald-100">Posibilidades</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
