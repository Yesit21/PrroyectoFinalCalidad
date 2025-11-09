import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BLOCK_COLORS = {
  grass: 0x55aa55,
  dirt: 0x8b5a2b,
  stone: 0x888888,
  wood: 0x8f6a3a,
} as const;

export default function BlockBuilder() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const groundRef = useRef<THREE.Mesh>();
  const blocksRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const orbitState = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    radius: 28,
    polar: Math.PI / 3,
    azimuth: Math.PI / 4,
    dragPointerId: null as number | null,
  });
  const [materialKey, setMaterialKey] =
    useState<keyof typeof BLOCK_COLORS>("grass");

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, polar, azimuth } = orbitState.current;
    const x = radius * Math.sin(polar) * Math.cos(azimuth);
    const y = radius * Math.cos(polar);
    const z = radius * Math.sin(polar) * Math.sin(azimuth);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  const nudgeCamera = (deltaAzimuth = 0, deltaPolar = 0, deltaRadius = 0) => {
    orbitState.current.azimuth += deltaAzimuth;
    orbitState.current.polar = Math.max(
      0.2,
      Math.min(Math.PI / 2 - 0.05, orbitState.current.polar + deltaPolar),
    );
    orbitState.current.radius = Math.max(
      8,
      Math.min(60, orbitState.current.radius + deltaRadius),
    );
    updateCameraPosition();
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene bootstrap
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(12, 16, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const radius = camera.position.length();
    orbitState.current.radius = radius;
    orbitState.current.polar = Math.acos(camera.position.y / radius);
    orbitState.current.azimuth = Math.atan2(camera.position.z, camera.position.x);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Helpers
    const gridHelper = new THREE.GridHelper(32, 32, 0x444444, 0x888888);
    scene.add(gridHelper);

    // Ground plane receives clicks when no blocks are present
    const planeGeometry = new THREE.PlaneGeometry(32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f8f3a,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(planeGeometry, planeMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);
    groundRef.current = ground;

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      updateCameraPosition();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  const placeBlock = (point: THREE.Vector3) => {
    const size = 1;
    const snappedX = Math.round(point.x / size) * size;
    const snappedZ = Math.round(point.z / size) * size;
    const key = `${snappedX}:${snappedZ}`;

    if (blocksRef.current.has(key)) return;

    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({
      color: BLOCK_COLORS[materialKey],
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(snappedX, size / 2, snappedZ);

    sceneRef.current?.add(cube);
    blocksRef.current.set(key, cube);
  };

  const removeBlock = (object: THREE.Object3D | null) => {
    if (!object) return;

    for (const [key, mesh] of blocksRef.current.entries()) {
      if (mesh === object) {
        sceneRef.current?.remove(mesh);
        blocksRef.current.delete(key);
        break;
      }
    }
  };

  const handleCameraDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!orbitState.current.isDragging || !cameraRef.current) return;

    const deltaX = event.clientX - orbitState.current.lastX;
    const deltaY = event.clientY - orbitState.current.lastY;
    orbitState.current.lastX = event.clientX;
    orbitState.current.lastY = event.clientY;

    const rotationSpeed = 0.005;
    orbitState.current.azimuth -= deltaX * rotationSpeed;
    orbitState.current.polar -= deltaY * rotationSpeed;
    orbitState.current.polar = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, orbitState.current.polar));
  };

  const handlePointerInteraction = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current || !groundRef.current) return;

    const rect = rendererRef.current.domElement.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);

    const targets = [
      groundRef.current,
      ...Array.from(blocksRef.current.values()),
    ];
    const intersects = raycasterRef.current.intersectObjects(targets);

    if (intersects.length === 0) return;

    const [hit] = intersects;
    const isRemoving = event.shiftKey;

    if (isRemoving) {
      removeBlock(hit.object);
      return;
    }

    if (hit.object === groundRef.current) {
      placeBlock(hit.point);
      return;
    }

    if (hit.face) {
      // Add block next to the face clicked
      const normalOffset = hit.face.normal.clone().multiplyScalar(0.5);
      const targetPoint = hit.point.clone().add(normalOffset);
      placeBlock(targetPoint);
    }
  };

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button === 2 || event.altKey) {
      event.preventDefault();
      orbitState.current.isDragging = true;
      orbitState.current.lastX = event.clientX;
      orbitState.current.lastY = event.clientY;
      orbitState.current.dragPointerId = event.pointerId;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      return;
    }

    if (event.button !== 0) return;
    event.preventDefault();
    handlePointerInteraction(event);
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (orbitState.current.isDragging) {
      handleCameraDrag(event);
    }
  };

  const handleCanvasPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      orbitState.current.isDragging &&
      orbitState.current.dragPointerId === event.pointerId
    ) {
      orbitState.current.isDragging = false;
      orbitState.current.dragPointerId = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    nudgeCamera(0, 0, event.deltaY * 0.02);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Material activo:
        </span>
        {Object.keys(BLOCK_COLORS).map((key) => (
          <button
            key={key}
            onClick={() => setMaterialKey(key as keyof typeof BLOCK_COLORS)}
            className={`px-3 py-1 rounded border transition ${
              materialKey === key
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            {key}
          </button>
        ))}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p>Click izquierdo: colocar bloques · Shift + click: eliminar.</p>
          <p>Arrastra con clic derecho/Alt o usa los botones para mover la cámara.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <span className="font-semibold block mb-1">Rotar</span>
          <div className="flex gap-2">
            <button
              onClick={() => nudgeCamera(-0.2, 0, 0)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ◀
            </button>
            <button
              onClick={() => nudgeCamera(0.2, 0, 0)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ▶
            </button>
          </div>
        </div>
        <div>
          <span className="font-semibold block mb-1">Inclinación</span>
          <div className="flex gap-2">
            <button
              onClick={() => nudgeCamera(0, -0.15, 0)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ▲
            </button>
            <button
              onClick={() => nudgeCamera(0, 0.15, 0)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ▼
            </button>
          </div>
        </div>
        <div>
          <span className="font-semibold block mb-1">Zoom</span>
          <div className="flex gap-2">
            <button
              onClick={() => nudgeCamera(0, 0, -2)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              +
            </button>
            <button
              onClick={() => nudgeCamera(0, 0, 2)}
              className="rounded-md border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              −
            </button>
          </div>
        </div>
      </div>
      <div
        ref={mountRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerLeave={handleCanvasPointerUp}
        onWheel={handleWheel}
        onContextMenu={(event) => event.preventDefault()}
        className="mx-auto h-[260px] w-full max-w-[720px] rounded-lg border border-slate-300 bg-slate-200 shadow-inner dark:border-slate-700 dark:bg-slate-800 sm:h-[300px] md:h-[340px] lg:h-[380px]"
      />
    </section>
  );
}
