/**
 * Componente principal de la aplicación
 *
 * Punto de entrada que configura el enrutamiento con React Router.
 * Envuelve toda la aplicación con BrowserRouter para habilitar
 * la navegación entre diferentes vistas.
 */
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

