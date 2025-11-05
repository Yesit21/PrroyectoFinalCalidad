import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function SolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

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
      1000
    );
    camera.position.set(0, 5, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    // Planets data
    const planets = [
      { name: 'Mercury', radius: 0.4, distance: 4, color: 0x8c7853, speed: 0.02 },
      { name: 'Venus', radius: 0.6, distance: 6, color: 0xffc649, speed: 0.015 },
      { name: 'Earth', radius: 0.7, distance: 8, color: 0x6b93d6, speed: 0.01 },
      { name: 'Mars', radius: 0.5, distance: 10, color: 0xc1440e, speed: 0.008 },
      { name: 'Jupiter', radius: 1.2, distance: 14, color: 0xd8ca9d, speed: 0.005 },
      { name: 'Saturn', radius: 1.0, distance: 18, color: 0xfad5a5, speed: 0.003 },
      { name: 'Uranus', radius: 0.8, distance: 22, color: 0x4fd0e7, speed: 0.002 },
      { name: 'Neptune', radius: 0.8, distance: 26, color: 0x4b70dd, speed: 0.001 },
    ];

    const planetMeshes: THREE.Mesh[] = [];
    const planetAngles: number[] = new Array(planets.length).fill(0);

    planets.forEach((planet, index) => {
      const geometry = new THREE.SphereGeometry(planet.radius, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(planet.distance, 0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      planetMeshes.push(mesh);

      // Add rings for Saturn
      if (planet.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xc4a484,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      camera.position.x -= deltaX * 0.01;
      camera.position.y += deltaY * 0.01;

      camera.lookAt(0, 0, 0);
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(5, Math.min(50, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate sun
      sun.rotation.y += 0.005;

      // Move planets
      planetMeshes.forEach((planet, index) => {
        planetAngles[index] += planets[index].speed;
        planet.position.x = Math.cos(planetAngles[index]) * planets[index].distance;
        planet.position.z = Math.sin(planetAngles[index]) * planets[index].distance;
        planet.rotation.y += 0.01;
      });

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
      <h1 className="text-2xl font-bold mb-4">Sistema Solar Interactivo</h1>
      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <div ref={mountRef} className="w-full h-96" />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>🖱️ Arrastra para rotar la vista • 🔄 Rueda para zoom • Los planetas orbitan alrededor del Sol</p>
      </div>
    </div>
  );
}