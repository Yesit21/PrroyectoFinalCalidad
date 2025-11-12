/**
 * Componente Sidebar - Panel lateral de navegación
 *
 * Sidebar colapsable con secciones organizadas por categorías:
 * - Ciencias: Sistema Solar
 * - Tecnología: Block Builder
 * - Sociales: Globo Interactivo
 *
 * Incluye animaciones fluidas, indicadores visuales y navegación intuitiva
 */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSun,
  FaGlobeAmericas,
  FaCubes,
  FaChevronDown,
} from "react-icons/fa";

/**
 * Interfaz para items de navegación en el sidebar
 */
interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
  description?: string;
}


const scienceItems: SidebarItem[] = [
  { label: "Sistema Solar", route: "/sistema-solar", icon: <FaSun />, description: "Exploración espacial" },
];

const socialItems: SidebarItem[] = [
  { label: "Globo Interactivo", route: "/globo", icon: <FaGlobeAmericas />, description: "Geografía mundial" },
];

const techLogicItems: SidebarItem[] = [
  { label: "Block Builder", route: "/block-builder", icon: <FaCubes />, description: "Construcción 3D" },
];

export default function Sidebar() {
  const [openScience, setOpenScience] = useState(true);
  const [openSocial, setOpenSocial] = useState(false);
  const [openTechLogic, setOpenTechLogic] = useState(false);

  const renderNavItem = ({ label, route, icon, description }: SidebarItem) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <NavLink
        key={route}
        to={route}
        className={({ isActive }) =>
          `group w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 transform hover:scale-105 ${
            isActive
              ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg shadow-pink-400/25 animate-pulse"
              : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 hover:shadow-md"
          }`
        }
      >
        <div className={`p-2 rounded-lg transition-colors duration-200 ${
          ({ isActive }: { isActive: boolean }) => isActive
            ? "bg-white/20"
            : "bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 group-hover:from-pink-300 group-hover:to-purple-300 dark:group-hover:from-pink-700 dark:group-hover:to-purple-700"
        }`}>
          <div className="w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{label}</div>
          {description && (
            <div className={`text-xs opacity-70 truncate ${
              ({ isActive }: { isActive: boolean }) => isActive ? "text-white/70" : ""
            }`}>
              {description}
            </div>
          )}
        </div>
      </NavLink>
    </motion.div>
  );

  const renderSection = (
    title: string,
    isOpen: boolean,
    toggle: () => void,
    items: SidebarItem[],
    color: string = "emerald"
  ) => (
    <motion.div
      initial={false}
      animate={{ height: "auto" }}
      className="space-y-2"
    >
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full text-left flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
          isOpen
            ? `bg-gradient-to-r from-${color}-500 to-blue-600 text-white shadow-lg`
            : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-${color}-500 ${isOpen ? "bg-white" : ""}`}></span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-1 overflow-hidden"
          >
            {items.map(renderNavItem)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden md:block w-full md:w-[280px] border-r border-fun-candy/30 dark:border-fun-lavender/30 bg-gradient-to-b from-fun-bubblegum/20 via-fun-lavender/20 to-fun-sky/20 dark:from-fun-candy/10 dark:via-fun-lavender/10 dark:to-fun-sky/10 backdrop-blur-xl shadow-xl"
    >
      <div className="p-4 space-y-4">


        {/* Navigation Sections */}
        <div className="space-y-3">
          {renderSection("🔬 Ciencias", openScience, () => setOpenScience(!openScience), scienceItems, "purple")}
          {renderSection("🧠 Tecnología", openTechLogic, () => setOpenTechLogic(!openTechLogic), techLogicItems, "orange")}
          {renderSection("🌍 Sociales", openSocial, () => setOpenSocial(!openSocial), socialItems, "pink")}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4 border-t border-fun-candy/30"
        >
          <div className="text-center">
            <motion.div
              className="text-xs text-slate-500 dark:text-slate-400 mb-2"
              animate={{ color: ["#64748b", "#a29bfe", "#74b9ff", "#64748b"] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              React + TypeScript + Vite
            </motion.div>
            <div className="flex justify-center gap-1 mt-2">
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-fun-candy to-fun-bubblegum rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-fun-lavender to-fun-sky rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -180, -360],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-fun-mint to-fun-sunshine rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
