import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  color: number;
  speed: number;
  texture?: string;
  moons?: { name: string; radius: number; distance: number; speed: number }[];
  tilt?: number;
  description: string;
}

export default function SolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 20, 50);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);

    // Sun light
    const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);

    // Additional fill lights for better visibility
    const fillLight1 = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight1.position.set(10, 10, 5);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xFFE4B5, 0.2);
    fillLight2.position.set(-10, -10, -5);
    scene.add(fillLight2);

    // Stars background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Sun with enhanced materials
    const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0x444400,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);

    // Add sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.1
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sun.add(sunGlow);

    scene.add(sun);

    // Planets data with realistic properties
    const planets: PlanetData[] = [
      {
        name: 'Mercurio',
        radius: 0.4,
        distance: 8,
        color: 0x8c7853,
        speed: 0.04,
        description: 'El planeta más cercano al Sol. Temperaturas extremas.'
      },
      {
        name: 'Venus',
        radius: 0.6,
        distance: 12,
        color: 0xffc649,
        speed: 0.035,
        description: 'El planeta más caliente del sistema solar.'
      },
      {
        name: 'Tierra',
        radius: 0.7,
        distance: 16,
        color: 0x6b93d6,
        speed: 0.03,
        moons: [{ name: 'Luna', radius: 0.2, distance: 1.5, speed: 0.1 }],
        description: 'Nuestro hogar. El único planeta con vida conocida.'
      },
      {
        name: 'Marte',
        radius: 0.5,
        distance: 22,
        color: 0xc1440e,
        speed: 0.025,
        description: 'El planeta rojo. Posible vida microbiana.'
      },
      {
        name: 'Júpiter',
        radius: 2.0,
        distance: 35,
        color: 0xd8ca9d,
        speed: 0.013,
        description: 'El gigante gaseoso más grande. Tiene una gran mancha roja.'
      },
      {
        name: 'Saturno',
        radius: 1.7,
        distance: 50,
        color: 0xfad5a5,
        speed: 0.009,
        description: 'Famoso por sus espectaculares anillos de hielo.'
      },
      {
        name: 'Urano',
        radius: 1.2,
        distance: 65,
        color: 0x4fd0e7,
        speed: 0.006,
        tilt: Math.PI / 2,
        description: 'El único planeta que rota de lado.'
      },
      {
        name: 'Neptuno',
        radius: 1.2,
        distance: 80,
        color: 0x4b70dd,
        speed: 0.005,
        description: 'El planeta más lejano. Vientos de hasta 2100 km/h.'
      },
    ];

    const planetMeshes: THREE.Group[] = [];
    const planetAngles: number[] = new Array(planets.length).fill(0);
    const moonAngles: number[][] = planets.map(p => p.moons ? new Array(p.moons.length).fill(0) : []);
    const orbitLines: THREE.Line[] = [];
    const labels: THREE.Sprite[] = [];

    // Create planets
    planets.forEach((planet) => {
      const planetGroup = new THREE.Group();

      // Planet geometry with higher detail
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshLambertMaterial({
        color: planet.color,
        transparent: planet.name === 'Saturno' || planet.name === 'Urano'
      });
      const mesh = new THREE.Mesh(geometry, material);

      if (planet.tilt) {
        mesh.rotation.z = planet.tilt;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { planetName: planet.name, planetData: planet };
      planetGroup.add(mesh);

      // Add moons
      if (planet.moons) {
        planet.moons.forEach((moon) => {
          const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
          const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
          const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          moonMesh.position.set(moon.distance, 0, 0);
          moonMesh.castShadow = true;
          moonMesh.receiveShadow = true;
          planetGroup.add(moonMesh);
        });
      }

      // Add rings for Saturn
      if (planet.name === 'Saturno') {
        const ringGeometry = new THREE.RingGeometry(2.2, 3.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xc4a484,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planetGroup.add(ring);
      }

      // Add Uranus rings
      if (planet.name === 'Urano') {
        const ringGeometry = new THREE.RingGeometry(1.8, 2.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x87CEEB,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planetGroup.add(ring);
      }

      planetGroup.position.set(planet.distance, 0, 0);
      scene.add(planetGroup);
      planetMeshes.push(planetGroup);

      // Create orbit lines
      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitLine.rotation.x = -Math.PI / 2;
      scene.add(orbitLine);
      orbitLines.push(orbitLine);

      // Create labels
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 128;

      context.font = 'Bold 20px Arial';
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.fillText(planet.name, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3, 1.5, 1);
      sprite.position.set(planet.distance, planet.radius + 1, 0);
      scene.add(sprite);
      labels.push(sprite);
    });

    // Enhanced controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraRotation = { x: 0, y: 0 };
    let cameraDistance = 50;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      cameraRotation.y += deltaX * 0.005;
      cameraRotation.x += deltaY * 0.005;
      cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));

      updateCameraPosition();
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraDistance += event.deltaY * 0.1;
      cameraDistance = Math.max(10, Math.min(200, cameraDistance));
      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      camera.position.x = Math.sin(cameraRotation.y) * cameraDistance;
      camera.position.z = Math.cos(cameraRotation.y) * cameraDistance;
      camera.position.y = Math.sin(cameraRotation.x) * cameraDistance;
      camera.lookAt(0, 0, 0);
    };

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const intersect of intersects) {
        const object = intersect.object;
        if (object.userData.planetName) {
          setSelectedPlanet(object.userData.planetName);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (isPlaying) {
        // Rotate sun
        sun.rotation.y += 0.01;
        sunGlow.rotation.y += 0.005;

        // Move planets
        planetMeshes.forEach((planetGroup, index) => {
          const planet = planets[index];
          planetAngles[index] += planet.speed * speedMultiplier;

          planetGroup.position.x = Math.cos(planetAngles[index]) * planet.distance;
          planetGroup.position.z = Math.sin(planetAngles[index]) * planet.distance;

          // Rotate planet
          planetGroup.children[0].rotation.y += 0.02;

          // Move moons
          if (planet.moons) {
            planet.moons.forEach((moon, moonIndex) => {
              moonAngles[index][moonIndex] += moon.speed * speedMultiplier;
              const moonMesh = planetGroup.children[moonIndex + 1];
              moonMesh.position.x = Math.cos(moonAngles[index][moonIndex]) * moon.distance;
              moonMesh.position.z = Math.sin(moonAngles[index][moonIndex]) * moon.distance;
            });
          }

          // Update labels
          if (showLabels) {
            labels[index].position.x = planetGroup.position.x;
            labels[index].position.z = planetGroup.position.z;
            labels[index].position.y = planet.radius + 1;
            labels[index].visible = true;
          } else {
            labels[index].visible = false;
          }
        });

        // Update orbit visibility
        orbitLines.forEach(line => {
          line.visible = showOrbits;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [speedMultiplier, showOrbits, showLabels]);

  const selectedPlanetData = planets.find(p => p.name === selectedPlanet);

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema Solar Interactivo Ultra Realista</h1>

      {/* Controls */}
      <div className="mb-6 bg-gray-100 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
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
            className={`px-4 py-2 rounded-lg font-medium ${
              showOrbits ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {showOrbits ? '👁️ Órbitas ON' : '👁️ Órbitas OFF'}
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-4 py-2 rounded-lg font-medium ${
              showLabels ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {showLabels ? '🏷️ Etiquetas ON' : '🏷️ Etiquetas OFF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            <div ref={mountRef} className="w-full h-96 lg:h-[600px]" />
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>🖱️ <strong>Arrastrar:</strong> Rotar vista • 🔄 <strong>Rueda:</strong> Zoom • 👆 <strong>Clic:</strong> Seleccionar planeta</p>
            <p>🌟 <strong>Características:</strong> Sombras realistas • Estrellas • Anillos • Lunas • Controles avanzados</p>
          </div>
        </div>

        {/* Planet Info Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Información del Planeta</h3>
            {selectedPlanetData ? (
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-2">{selectedPlanetData.name}</h4>
                <p className="text-gray-700 text-sm mb-3">{selectedPlanetData.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Radio relativo:</span>
                    <span className="font-medium">{selectedPlanetData.radius}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distancia al Sol:</span>
                    <span className="font-medium">{selectedPlanetData.distance} UA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocidad orbital:</span>
                    <span className="font-medium">{(selectedPlanetData.speed * 1000).toFixed(1)}x</span>
                  </div>
                  {selectedPlanetData.moons && (
                    <div className="flex justify-between">
                      <span>Lunas:</span>
                      <span className="font-medium">{selectedPlanetData.moons.length}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Haz clic en un planeta para ver su información</p>
            )}
          </div>

          {/* Planet List */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Planetas</h3>
            <div className="space-y-2">
              {planets.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet.name)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedPlanet === planet.name
                      ? 'bg-blue-100 border-blue-300'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{ borderLeft: selectedPlanet === planet.name ? `4px solid #${planet.color.toString(16)}` : 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `#${planet.color.toString(16)}` }}
                    ></div>
                    <span className="text-sm font-medium">{planet.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Planets data for the component
const planets = [
  { name: 'Mercurio', radius: 0.4, distance: 8, color: 0x8c7853, speed: 0.04, description: 'El planeta más cercano al Sol. Temperaturas extremas.' },
  { name: 'Venus', radius: 0.6, distance: 12, color: 0xffc649, speed: 0.035, description: 'El planeta más caliente del sistema solar.' },
  { name: 'Tierra', radius: 0.7, distance: 16, color: 0x6b93d6, speed: 0.03, moons: [{ name: 'Luna', radius: 0.2, distance: 1.5, speed: 0.1 }], description: 'Nuestro hogar. El único planeta con vida conocida.' },
  { name: 'Marte', radius: 0.5, distance: 22, color: 0xc1440e, speed: 0.025, description: 'El planeta rojo. Posible vida microbiana.' },
  { name: 'Júpiter', radius: 2.0, distance: 35, color: 0xd8ca9d, speed: 0.013, description: 'El gigante gaseoso más grande. Tiene una gran mancha roja.' },
  { name: 'Saturno', radius: 1.7, distance: 50, color: 0xfad5a5, speed: 0.009, description: 'Famoso por sus espectaculares anillos de hielo.' },
  { name: 'Urano', radius: 1.2, distance: 65, color: 0x4fd0e7, speed: 0.006, tilt: Math.PI / 2, description: 'El único planeta que rota de lado.' },
  { name: 'Neptuno', radius: 1.2, distance: 80, color: 0x4b70dd, speed: 0.005, description: 'El planeta más lejano. Vientos de hasta 2100 km/h.' },
];
