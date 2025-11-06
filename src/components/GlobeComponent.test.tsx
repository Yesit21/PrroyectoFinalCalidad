import { render, screen, fireEvent } from "@testing-library/react";
import GlobeComponent from "../components/GlobeComponent";

jest.mock("react-globe.gl", () => {
  return ({ onPointClick }: any) => (
    <div
      data-testid="globe"
      onClick={() =>
        onPointClick &&
        onPointClick({
          lat: 4.570868,
          lng: -74.297333,
          region: "Colombia",
          info: "Capital: Bogotá | Población: 52M | Continente: América del Sur",
        })
      }
    />
  );
});

describe("GlobeComponent", () => {
  test("se renderiza correctamente", () => {
    render(<GlobeComponent />);
    expect(screen.getByTestId("globe")).toBeInTheDocument();
  });

  test("muestra cuadro de información al hacer clic en un país", () => {
    render(<GlobeComponent />);
    fireEvent.click(screen.getByTestId("globe"));

    // Solo seleccionamos el <strong> con el nombre del país
    expect(screen.getByText("Colombia", { selector: "strong" })).toBeInTheDocument();

    // Verificamos título
    expect(screen.getByText(/Región seleccionada:/i)).toBeInTheDocument();

    // Verificamos info completa
    expect(
      screen.getByText(/Capital: Bogotá \| Población: 52M \| Continente: América del Sur/i)
    ).toBeInTheDocument();
  });
});

