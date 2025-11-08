import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renderiza la aplicación sin errores", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // Verifica que la aplicación se renderiza sin errores
  expect(document.body).toBeInTheDocument();
});