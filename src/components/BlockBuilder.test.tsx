import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlockBuilder from "./BlockBuilder";
import * as THREE from "three";

jest.mock("three");

const asMock = (fn: unknown) => fn as jest.Mock;

beforeAll(() => {
  global.requestAnimationFrame = jest.fn().mockImplementation(() => 1);
  global.cancelAnimationFrame = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("BlockBuilder", () => {
  test("renderiza todos los botones de materiales", () => {
    render(<BlockBuilder />);
    expect(screen.getByRole("button", { name: "grass" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "dirt" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "stone" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "wood" })).toBeInTheDocument();
  });

  test("permite seleccionar un material distinto", () => {
    render(<BlockBuilder />);
    const woodButton = screen.getByRole("button", { name: "wood" });
    expect(woodButton).not.toHaveClass("bg-emerald-500");
    fireEvent.click(woodButton);
    expect(woodButton).toHaveClass("bg-emerald-500");
  });

  test("muestra las instrucciones de control", () => {
    render(<BlockBuilder />);
    expect(screen.getByText(/Click izquierdo/i)).toBeInTheDocument();
    expect(screen.getByText(/clic derecho/i)).toBeInTheDocument();
  });

  test("los botones de rotacion actualizan la camara", () => {
    render(<BlockBuilder />);
    const cameraInstance = asMock(THREE.PerspectiveCamera).mock.results[0].value;
    const initialCalls = cameraInstance.position.set.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "▶" }));
    expect(cameraInstance.position.set.mock.calls.length).toBeGreaterThan(initialCalls);
  });

  test("muestra las secciones de controles de camara", () => {
    render(<BlockBuilder />);
    expect(screen.getByText("Rotar")).toBeInTheDocument();
    expect(screen.getByText(/Inclinaci/i)).toBeInTheDocument();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
  });

  test("los botones de zoom modifican la camara", () => {
    render(<BlockBuilder />);
    const cameraInstance = asMock(THREE.PerspectiveCamera).mock.results[0].value;
    const initialCalls = cameraInstance.position.set.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(cameraInstance.position.set.mock.calls.length).toBeGreaterThan(initialCalls);
  });
});
