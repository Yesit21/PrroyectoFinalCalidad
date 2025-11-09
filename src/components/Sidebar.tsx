import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCube,
  FaColumns,
  FaMicrophone,
  FaShapes,
  FaCalculator,
  FaRuler,
  FaKey,
  FaMouse,
  FaList,
  FaSun,
  FaGlobeAmericas,
  FaCubes,
} from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome /> },
  { label: "Three.js Demo", route: "/three", icon: <FaCube /> },
  { label: "Responsive Layouts", route: "/layouts", icon: <FaColumns /> },
  { label: "Text-to-Speech", route: "/tts", icon: <FaMicrophone /> },
  { label: "Figuras Geometricas", route: "/three_2", icon: <FaShapes /> },
];

const exerciseItems: SidebarItem[] = [
  { label: "Tablas de Multiplicar", route: "/tablasmul", icon: <FaCalculator /> },
  { label: "Conversor de Unidades", route: "/conversorunid", icon: <FaRuler /> },
  { label: "Validador de Contrasenas", route: "/validcontrasena", icon: <FaKey /> },
  { label: "Contador de Clics con Almacenamiento", route: "/contadorclics", icon: <FaMouse /> },
  { label: "Lista de Tareas", route: "/listareas", icon: <FaList /> },
];

const scienceItems: SidebarItem[] = [
  { label: "Sistema Solar Interactivo", route: "/sistema-solar", icon: <FaSun /> },
];

const socialItems: SidebarItem[] = [
  { label: "Globo Interactivo", route: "/globo", icon: <FaGlobeAmericas /> },
];

const techLogicItems: SidebarItem[] = [
  { label: "Construccion con Bloques", route: "/block-builder", icon: <FaCubes /> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);
  const [openScience, setOpenScience] = useState(false);
  const [openSocial, setOpenSocial] = useState(false);
  const [openTechLogic, setOpenTechLogic] = useState(false);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
         hover:bg-slate-50 dark:hover:bg-slate-800 
         ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}`
      }
    >
      <div className="flex items-center gap-2">
        {icon} {label}
      </div>
    </NavLink>
  );

  const renderSection = (
    title: string,
    isOpen: boolean,
    toggle: () => void,
    items: SidebarItem[],
  ) => (
    <>
      <button
        onClick={toggle}
        className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
                   hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
      >
        {title}
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="pl-4 space-y-1">{items.map(renderNavItem)}</div>}
    </>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-3 space-y-1">
        {renderSection("Menu Principal", openMain, () => setOpenMain(!openMain), mainItems)}
        {renderSection("Ejercicios - Jtest", openExercises, () => setOpenExercises(!openExercises), exerciseItems)}
        {renderSection("Ciencias Naturales", openScience, () => setOpenScience(!openScience), scienceItems)}
        {renderSection(
          "Tecnologia y Pensamiento Logico",
          openTechLogic,
          () => setOpenTechLogic(!openTechLogic),
          techLogicItems,
        )}
        {renderSection("Sociales", openSocial, () => setOpenSocial(!openSocial), socialItems)}
      </div>
    </aside>
  );
}
