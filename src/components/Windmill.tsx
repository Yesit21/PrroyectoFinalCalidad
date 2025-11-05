import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Windmill() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();
  const bladesRef = useRef<THREE.Group>();
  const windSpeedRef = useRef(0.02);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Windmill Tower (Base)
    const towerGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(0, 2, 0);
    tower.castShadow = true;
    tower.receiveShadow = true;
    scene.add(tower);

    // Tower Cap
    const capGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 8);
    const capMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.set(0, 4.1, 0);
    cap.castShadow = true;
    scene.add(cap);

    // Windmill Head (rotates)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 4, 0);

    // Head base
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // Blades
    const bladesGroup = new THREE.Group();
    bladesRef.current = bladesGroup;

    const bladeGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.3);
    const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.position.set(0, 1.25, 0);
      blade.rotation.z = (Math.PI / 2) * i;
      blade.castShadow = true;
      bladesGroup.add(blade);
    }

    headGroup.add(bladesGroup);
    scene.add(headGroup);

    // Energy indicators
    const energyIndicators = [];
    for (let i = 0; i < 5; i++) {
      const indicatorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
      indicator.position.set(-2, 0.5 + i * 0.3, 0);
      indicator.visible = false;
      energyIndicators.push(indicator);
      scene.add(indicator);
    }

    // Wind particles
    const windParticles = [];
    for (let i = 0; i < 20; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        -10 + Math.random() * 20,
        Math.random() * 6,
        -5 + Math.random() * 10
      );
      windParticles.push(particle);
      scene.add(particle);
    }

    // Animation variables
    let headRotation = 0;
    let bladeRotation = 0;
    let energyLevel = 0;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Windmill head rotation (slow)
      headRotation += 0.005;
      headGroup.rotation.y = headRotation;

      // Blade rotation (faster, based on wind speed)
      bladeRotation += windSpeedRef.current;
      bladesGroup.rotation.z = bladeRotation;

      // Wind particles movement
      windParticles.forEach((particle, index) => {
        particle.position.x += 0.02;
        if (particle.position.x > 10) {
          particle.position.x = -10;
          particle.position.y = Math.random() * 6;
          particle.position.z = -5 + Math.random() * 10;
        }
        particle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
      });

      // Energy generation based on wind speed
      energyLevel = Math.min(5, Math.max(0, (windSpeedRef.current - 0.01) * 200));

      // Update energy indicators
      energyIndicators.forEach((indicator, index) => {
        indicator.visible = index < Math.floor(energyLevel);
        if (indicator.visible) {
          indicator.material.color.setHSL(0.3, 1, 0.5 + (index * 0.1));
        }
      });

      // Dynamic wind speed variation
      windSpeedRef.current = 0.02 + Math.sin(Date.now() * 0.0005) * 0.015 + Math.random() * 0.005;

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

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Simulación de Energía Eólica - Molino de Viento</h1>
      <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden shadow-lg">
        <div ref={mountRef} className="w-full h-96" />
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-bold mb-4 text-blue-800">⚡ Generación de Energía</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Energía generada:</span>
              <span className="font-bold text-green-600">
                {Math.floor((windSpeedRef.current - 0.01) * 200)} kW
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, (windSpeedRef.current - 0.01) * 200))}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-bold mb-4 text-blue-800">💨 Velocidad del Viento</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Velocidad actual:</span>
              <span className="font-bold text-blue-600">
                {(windSpeedRef.current * 50).toFixed(1)} km/h
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>• Viento fuerte = Más energía</p>
              <p>• Las aspas giran según el viento</p>
              <p>• Energía renovable y limpia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-blue-800">🔄 Ciclo de Energía Eólica</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">🌬️</div>
            <div className="font-semibold">Viento</div>
            <div className="text-gray-600">Energía cinética del aire</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold">Aspas</div>
            <div className="text-gray-600">Capturan la energía del viento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold">Generador</div>
            <div className="text-gray-600">Convierte movimiento en electricidad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold">Red Eléctrica</div>
            <div className="text-gray-600">Distribuye energía limpia</div>
          </div>
        </div>
      </div>
    </div>
  );
}