/**
 * Componente UnitConverter - Conversor de temperatura Celsius a Fahrenheit
 *
 * Componente educativo que convierte temperaturas de grados Celsius
 * a grados Fahrenheit usando la fórmula: °F = (°C × 9/5) + 32
 *
 * Incluye imagen de referencia de la fórmula de conversión.
 */
import { useState } from "react";

export default function UnitConverter() {
  const [celsius, setCelsius] = useState<number | null>(null);
  const [fahrenheit, setFahrenheit] = useState<number | null>(null);

  const handleConvert = () => {
    if (celsius === null || isNaN(celsius)) return;
    const result = (celsius * 9) / 5 + 32;
    setFahrenheit(result);
  };

  return (
    <div className="h-full w-full p-6">
      <h3 className="text-2xl font-bold mb-4">Conversor de Unidades</h3>
    <img src="/formula_celsius.jpg" alt="Fórmula de conversión" className="mb-4 w-48" />

      <div className="flex flex-col gap-4 max-w-sm">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Celsius (°C):</span>
          <input
            type="number"
            className="border rounded-lg p-2"
            placeholder="Ingrese valor en Celsius"
            value={celsius ?? ""}
            onChange={(e) => setCelsius(parseFloat(e.target.value))}
          />
        </label>

        <button
          onClick={handleConvert}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Convertir
        </button>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Fahrenheit (°F):</span>
          <input
            type="text"
            className="border rounded-lg p-2 bg-gray-100"
            value={fahrenheit !== null ? fahrenheit.toFixed(2) : ""}
            readOnly
          />
        </label>
      </div>
    </div>
  );
}
