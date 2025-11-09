import { render } from "@testing-library/react";
import App from "./App";

test("renderiza la aplicación sin errores", () => {
  render(<App />);
  // Verifica que la aplicación se renderiza sin errores
  expect(document.body).toBeInTheDocument();
});