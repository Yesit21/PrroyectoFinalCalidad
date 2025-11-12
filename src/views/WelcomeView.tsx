/**
 * Vista WelcomeView - Página de bienvenida principal
 *
 * Página de entrada de la aplicación que presenta las áreas de aprendizaje
 * disponibles: Ciencias, Tecnología y Sociales. Incluye navegación
 * interactiva con emojis y cards descriptivas.
 */
import { useNavigate } from "react-router-dom";

export default function WelcomeView() {
  const navigate = useNavigate();

  const handleStartAdventure = (path: string) => {
    navigate('/app' + path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* WELCOME Header */}
        <div className="mb-12">
          <div className="text-8xl mb-6">🎈</div>
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
            WELCOME
          </h1>
          <div className="text-2xl md:text-3xl text-gray-700 mb-8 font-medium">
            ¡Tu aventura de aprendizaje comienza aquí!
          </div>
        </div>

        {/* Main Areas */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-8 text-4xl md:text-5xl mb-6">
            <span>🔬</span>
            <span>🧠</span>
            <span>🌍</span>
          </div>
          <div className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Elige tu área de aprendizaje
          </div>
        </div>

        {/* Simple Areas Display */}
        <div className="mb-8">
          <div className="inline-flex flex-col items-center gap-4 text-3xl md:text-4xl">
            <div className="flex items-center gap-6">
              <span
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleStartAdventure('/sistema-solar')}
              >
                🔬
              </span>
              <span
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleStartAdventure('/block-builder')}
              >
                🧠
              </span>
              <span
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleStartAdventure('/globo')}
              >
                🌍
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-lg md:text-xl font-semibold text-gray-700">
              <div className="flex items-center gap-4">
                <span>🔬 Ciencias</span>
                <span>🧠 Tecnología</span>
                <span>🌍 Sociales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Summary */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            🧭 Áreas Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-pink-300 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStartAdventure('/sistema-solar')}
            >
              <div className="text-3xl mb-2">🔬</div>
              <div className="font-bold text-pink-600">Ciencias</div>
              <div className="text-sm text-gray-600">Sistema Solar</div>
            </div>
            <div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-purple-300 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStartAdventure('/block-builder')}
            >
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-bold text-purple-600">Tecnología</div>
              <div className="text-sm text-gray-600">Block Builder</div>
            </div>
            <div
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-blue-300 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStartAdventure('/globo')}
            >
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-bold text-blue-600">Sociales</div>
              <div className="text-sm text-gray-600">Globo Interactivo</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>⚡</span>
            <span>Powered by React + TypeScript + Vite</span>
            <span>⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
}