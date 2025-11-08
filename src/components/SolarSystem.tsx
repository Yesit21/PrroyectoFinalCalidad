import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface PlanetData {
  name: string; radius: number; distance: number; color: number; speed: number;
  moons?: { name: string; radius: number; distance: number; speed: number }[];
  description: string;
}

const planets: PlanetData[] = [
  { name: 'Mercurio', radius: 0.4, distance: 8, color: 0x8c7853, speed: 0.04, description: 'El planeta más cercano al Sol. Temperaturas extremas.' },
  { name: 'Venus', radius: 0.6, distance: 12, color: 0xffc649, speed: 0.035, description: 'El planeta más caliente del sistema solar.' },
  { name: 'Tierra', radius: 0.7, distance: 16, color: 0x6b93d6, speed: 0.03, moons: [{ name: 'Luna', radius: 0.2, distance: 1.5, speed: 0.1 }], description: 'Nuestro hogar. El único planeta con vida conocida.' },
  { name: 'Marte', radius: 0.5, distance: 22, color: 0xc1440e, speed: 0.025, description: 'El planeta rojo. Posible vida microbiana.' },
  { name: 'Júpiter', radius: 2.0, distance: 35, color: 0xd8ca9d, speed: 0.013, description: 'El gigante gaseoso más grande. Tiene una gran mancha roja.' },
  { name: 'Saturno', radius: 1.7, distance: 50, color: 0xfad5a5, speed: 0.009, description: 'Famoso por sus espectaculares anillos de hielo.' },
  { name: 'Urano', radius: 1.2, distance: 65, color: 0x4fd0e7, speed: 0.006, description: 'El único planeta que rota de lado.' },
  { name: 'Neptuno', radius: 1.2, distance: 80, color: 0x4b70dd, speed: 0.005, description: 'El planeta más lejano. Vientos de hasta 2100 km/h.' },
];

const planetQuizzes = {
  'Mercurio': { question: '¿Cuál es la característica principal de Mercurio?', options: ['Es el más grande', 'Temperaturas extremas', 'Tiene muchos anillos', 'Es de color azul'], correct: 1, explanation: '¡Correcto! Mercurio tiene temperaturas extremas, desde -173°C hasta 427°C.' },
  'Venus': { question: '¿Por qué Venus es el planeta más caliente?', options: ['Está más cerca del Sol', 'Efecto invernadero extremo', 'Tiene volcanes activos', 'Es más grande que la Tierra'], correct: 1, explanation: '¡Correcto! Venus tiene un efecto invernadero extremo debido a su atmósfera densa de CO2.' },
  'Tierra': { question: '¿Qué hace única a la Tierra?', options: ['Es el más grande', 'Tiene vida conocida', 'Es el más cercano al Sol', 'Tiene los anillos más grandes'], correct: 1, explanation: '¡Correcto! La Tierra es el único planeta conocido con vida.' },
  'Marte': { question: '¿Cómo se conoce comúnmente a Marte?', options: ['Planeta azul', 'Planeta rojo', 'Planeta gigante', 'Planeta helado'], correct: 1, explanation: '¡Correcto! Marte se conoce como el planeta rojo debido a su color característico.' },
  'Júpiter': { question: '¿Qué característica famosa tiene Júpiter?', options: ['Anillos', 'Gran mancha roja', 'Muchas lunas', 'Es el más pequeño'], correct: 1, explanation: '¡Correcto! Júpiter tiene la Gran Mancha Roja, una tormenta gigante.' },
  'Saturno': { question: '¿Qué hace famoso a Saturno?', options: ['Es el más caliente', 'Sus espectaculares anillos', 'Es el más cercano', 'Tiene vida'], correct: 1, explanation: '¡Correcto! Saturno es famoso por sus espectaculares anillos de hielo.' },
  'Urano': { question: '¿Qué hace único a Urano?', options: ['Es el más grande', 'Rota de lado', 'Es de color rojo', 'Tiene muchos volcanes'], correct: 1, explanation: '¡Correcto! Urano es único porque rota prácticamente de lado.' },
  'Neptuno': { question: '¿Cuál es una característica de Neptuno?', options: ['Es el más cercano', 'Vientos de hasta 2100 km/h', 'Es el más pequeño', 'Tiene anillos grandes'], correct: 1, explanation: '¡Correcto! Neptuno tiene los vientos más rápidos del sistema solar.' }
};

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; utterance.rate = 0.8; utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

export default function SolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [enableNarration, setEnableNarration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🚀 Inicializando Sistema Solar 3D...');

    // Verificar WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('❌ WebGL no está disponible');
        mountRef.current.innerHTML = '<div style="color: white; text-align: center; padding: 50px; background: black;">❌ WebGL no está disponible en este navegador</div>';
        return;
      }
      console.log('✅ WebGL disponible');
    } catch (e) {
      console.error('❌ Error verificando WebGL:', e);
      return;
    }

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 500);
    scene.add(pointLight);

    // Estrellas de fondo
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Sol
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Grupo del sistema solar
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Arrays para planetas, ángulos y órbitas
    const planetGroups: THREE.Group[] = [];
    const planetAngles: number[] = [];
    const moonAngles: number[][] = [];
    const orbitLines: THREE.Mesh[] = [];

    // Crear planetas
    planets.forEach((planet) => {
      const planetGroup = new THREE.Group();

      // Planeta
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      planetGroup.add(mesh);

      // Lunas
      if (planet.moons) {
        const planetMoonAngles: number[] = [];
        planet.moons.forEach((moon) => {
          const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
          const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
          const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          const moonGroup = new THREE.Group();
          moonGroup.add(moonMesh);
          moonGroup.position.x = moon.distance;
          planetGroup.add(moonGroup);
          planetMoonAngles.push(Math.random() * Math.PI * 2);
        });
        moonAngles.push(planetMoonAngles);
      } else {
        moonAngles.push([]);
      }

      // Órbitas
      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);
      orbitLines.push(orbit);

      solarSystemGroup.add(planetGroup);
      planetGroups.push(planetGroup);
      planetAngles.push(Math.random() * Math.PI * 2);
    });

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isPlaying) return;

      // Rotar sol
      sun.rotation.y += 0.005;

      // Mover planetas
      planetGroups.forEach((group, i) => {
        const planet = planets[i];
        planetAngles[i] += planet.speed * speedMultiplier;
        group.position.x = Math.cos(planetAngles[i]) * planet.distance;
        group.position.z = Math.sin(planetAngles[i]) * planet.distance;
        (group.children[0] as THREE.Mesh).rotation.y += 0.01;

        // Mover lunas
        if (planet.moons && moonAngles[i]) {
          planet.moons.forEach((moon, j) => {
            moonAngles[i][j] += moon.speed * speedMultiplier;
            const moonGroup = group.children[j + 1] as THREE.Group;
            moonGroup.position.x = Math.cos(moonAngles[i][j]) * moon.distance;
            moonGroup.position.z = Math.sin(moonAngles[i][j]) * moon.distance;
          });
        }
      });

      // Actualizar órbitas
      orbitLines.forEach(orbit => orbit.visible = showOrbits);

      controls.update();
      renderer.render(scene, camera);
    };

    console.log('▶️ Iniciando animación...');
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m?.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
      console.log('✅ Sistema Solar limpiado');
    };
  }, [isPlaying, speedMultiplier, showOrbits]);

  const selectedPlanetData = planets.find(p => p.name === selectedPlanet);

  // Multimedia functions
  const narratePlanet = (planet: PlanetData) => {
    if (enableNarration) {
      const text = `${planet.name}. ${planet.description}`;
      speakText(text);
    }
  };

  const startQuiz = (planetName: string) => {
    const quiz = planetQuizzes[planetName as keyof typeof planetQuizzes];
    if (quiz) {
      setCurrentQuiz({ ...quiz, planetName });
      setShowQuiz(true);
    }
  };

  const answerQuiz = (selectedIndex: number) => {
    if (currentQuiz && selectedIndex === currentQuiz.correct) {
      speakText('¡Respuesta correcta! ' + currentQuiz.explanation);
      alert('¡Correcto! 🎉\n\n' + currentQuiz.explanation);
    } else {
      speakText('Respuesta incorrecta. Inténtalo de nuevo.');
      alert('Incorrecto. Inténtalo de nuevo. 🤔');
    }
    setShowQuiz(false);
    setCurrentQuiz(null);
  };

  // Auto-narrate when planet is selected
  useEffect(() => {
    if (selectedPlanetData && enableNarration) {
      narratePlanet(selectedPlanetData);
    }
  }, [selectedPlanet, enableNarration]);

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema Solar Interactivo 3D</h1>

      {/* Controles */}
      <div className="mb-6 bg-gray-100 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg font-medium ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Velocidad:</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm">{speedMultiplier}x</span>
          </div>
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-4 py-2 rounded-lg font-medium ${showOrbits ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {showOrbits ? '👁️ Órbitas ON' : '👁️ Órbitas OFF'}
          </button>
          <button
            onClick={() => setEnableNarration(!enableNarration)}
            className={`px-4 py-2 rounded-lg font-medium ${enableNarration ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {enableNarration ? '🔊 Narración ON' : '🔊 Narración OFF'}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-4 py-2 rounded-lg font-medium ${autoRotate ? 'bg-indigo-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {autoRotate ? '🔄 Auto ON' : '🔄 Auto OFF'}
          </button>
        </div>
      </div>

      {/* Información del planeta seleccionado */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3">Información del Planeta</h3>
        {selectedPlanetData ? (
          <div>
            <h4 className="text-xl font-bold text-blue-600 mb-2">{selectedPlanetData.name}</h4>
            <p className="text-gray-700 text-sm mb-3">{selectedPlanetData.description}</p>
            <div className="space-y-2 text-sm mb-4">
              <div><strong>Distancia:</strong> {selectedPlanetData.distance} UA</div>
              <div><strong>Velocidad:</strong> {(selectedPlanetData.speed * 1000).toFixed(1)}x</div>
              {selectedPlanetData.moons && <div><strong>Lunas:</strong> {selectedPlanetData.moons.length}</div>}
            </div>
            <button
              onClick={() => startQuiz(selectedPlanetData.name)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-3"
            >
              🎯 Hacer Quiz sobre {selectedPlanetData.name}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Haz clic en un planeta para ver su información</p>
        )}
      </div>

      {/* Lista de planetas */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3">Planetas del Sistema Solar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {planets.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet.name)}
              className={`p-2 rounded-lg text-sm transition-colors ${
                selectedPlanet === planet.name
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'hover:bg-gray-100'
              }`}
              style={{ borderLeft: selectedPlanet === planet.name ? `4px solid #${planet.color.toString(16)}` : 'none' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `#${planet.color.toString(16)}` }}
                ></div>
                <span className="font-medium">{planet.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Escena 3D */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
        <div ref={mountRef} className="w-full h-96 lg:h-[600px]" />
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Usa el mouse para rotar la vista, hacer zoom con la rueda, y arrastra para mover la cámara.
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Quiz: {currentQuiz.planetName}</h3>
            <p className="text-gray-700 mb-4">{currentQuiz.question}</p>
            <div className="space-y-2">
              {currentQuiz.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => answerQuiz(index)}
                  className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowQuiz(false)}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
