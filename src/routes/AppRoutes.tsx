/**
 * Configuración de rutas principales de la aplicación
 *
 * Define la estructura de navegación con dos niveles:
 * - "/" : Página de bienvenida (WelcomeView)
 * - "/app/*" : Aplicación principal con layout (Navbar + Sidebar)
 *
 * Incluye rutas para todas las experiencias educativas disponibles.
 */
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// Views
import WelcomeView from "../views/WelcomeView";
import HomePage from "../views/HomePage";
import ThreeDemoView from "../views/ThreeDemoView";
import LayoutsView from "../views/LayoutsView";
import SpeechDemoView from "../views/SpeechDemoView";
import GeometryExplorer from "../views/GeometryExplorer";
import SettingsView from "../views/SettingsView";
import TablasMul from "../views/TablasMul";
import ConversorUnid from "../views/ConversorUnid";
import ValidContrasena from "../views/ValidContrasena";
import ContadorClics from "../views/ContadorClics";
import ListaTareas from "../views/ListaTareas";
import SolarSystemView from "../views/SolarSystemView";
import BlockBuilderView from "../views/BlockBuilderView";
import GlobeView from "../views/GlobeView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="three" element={<ThreeDemoView />} />
        <Route path="layouts" element={<LayoutsView />} />
        <Route path="tts" element={<SpeechDemoView />} />
        <Route path="three_2" element={<GeometryExplorer />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="tablasmul" element={<TablasMul />} />
        <Route path="conversorunid" element={<ConversorUnid />} />
        <Route path="validcontrasena" element={<ValidContrasena />} />
        <Route path="contadorclics" element={<ContadorClics />} />
        <Route path="listareas" element={<ListaTareas />} />
        <Route path="sistema-solar" element={<SolarSystemView />} />
        <Route path="block-builder" element={<BlockBuilderView />} />
        <Route path="globo" element={<GlobeView />} />
      </Route>
    </Routes>
  );
}
