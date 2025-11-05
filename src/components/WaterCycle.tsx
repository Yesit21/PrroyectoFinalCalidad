import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function WaterCycle() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

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
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground (Earth)
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ocean/Lake
    const waterGeometry = new THREE.PlaneGeometry(8, 6);
    const waterMaterial = new THREE.MeshLambertMaterial({
      color: 0x4169E1,
      transparent: true,
      opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.01;
    scene.add(water);

    // Clouds (Evaporation)
    const cloudGroup = new THREE.Group();
    const cloudGeometry = new THREE.SphereGeometry(0.3, 8, 8);

    for (let i = 0; i < 15; i++) {
      const cloudMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 10,
        3 + Math.random() * 2,
        (Math.random() - 0.5) * 10
      );
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // Rain drops (Precipitation)
    const rainGroup = new THREE.Group();
    const rainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
    const rainMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });

    for (let i = 0; i < 50; i++) {
      const rainDrop = new THREE.Mesh(rainGeometry, rainMaterial);
      rainDrop.position.set(
        (Math.random() - 0.5) * 20,
        5 + Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
      rainGroup.add(rainDrop);
    }
    scene.add(rainGroup);

    // Rivers/Streams (Runoff)
    const riverGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10);
    const riverMaterial = new THREE.MeshLambertMaterial({ color: 0x4682B4 });
    const river = new THREE.Mesh(riverGeometry, riverMaterial);
    river.position.set(5, 0.1, 0);
    river.rotation.z = Math.PI / 4;
    scene.add(river);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-8, 6, -8);
    scene.add(sun);

    // Animation variables
    let evaporationPhase = 0;
    let rainFallSpeed = 0.05;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Sun rotation
      sun.rotation.y += 0.005;

      // Cloud movement (evaporation rising)
      evaporationPhase += 0.01;
      cloudGroup.children.forEach((cloud, index) => {
        cloud.position.y += Math.sin(evaporationPhase + index * 0.1) * 0.002;
        cloud.position.x += Math.sin(evaporationPhase * 0.5 + index) * 0.001;
      });

      // Rain falling (precipitation)
      rainGroup.children.forEach((rainDrop, index) => {
        rainDrop.position.y -= rainFallSpeed;

        // Reset rain drop when it hits ground
        if (rainDrop.position.y < 0) {
          rainDrop.position.y = 8 + Math.random() * 5;
          rainDrop.position.x = (Math.random() - 0.5) * 20;
          rainDrop.position.z = (Math.random() - 0.5) * 20;
        }
      });

      // Water surface animation
      water.material.opacity = 0.7 + Math.sin(Date.now() * 0.001) * 0.1;

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
      <h1 className="text-2xl font-bold mb-4">Ciclo del Agua en 3D</h1>
      <div className="bg-sky-100 rounded-lg overflow-hidden shadow-lg">
        <div ref={mountRef} className="w-full h-96" />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-100 p-3 rounded-lg">
          <h3 className="font-bold text-blue-800">🌊 Evaporación</h3>
          <p className="text-blue-700">Agua del océano se convierte en vapor</p>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <h3 className="font-bold text-gray-800">☁️ Condensación</h3>
          <p className="text-gray-700">Vapor se convierte en nubes</p>
        </div>
        <div className="bg-blue-200 p-3 rounded-lg">
          <h3 className="font-bold text-blue-900">🌧️ Precipitación</h3>
          <p className="text-blue-800">Agua cae como lluvia</p>
        </div>
        <div className="bg-green-100 p-3 rounded-lg">
          <h3 className="font-bold text-green-800">🏞️ Escorrentía</h3>
          <p className="text-green-700">Agua fluye de vuelta al océano</p>
        </div>
      </div>
    </div>
  );
}