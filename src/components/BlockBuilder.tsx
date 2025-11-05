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
  const [materialKey, setMaterialKey] =
    useState<keyof typeof BLOCK_COLORS>("grass");

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

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
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
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Click para colocar bloques, Shift + click para eliminarlos.
        </span>
      </div>
      <div
        ref={mountRef}
        onPointerDown={handlePointer}
        className="h-[70vh] w-full rounded-lg border border-slate-300 bg-slate-200 shadow-inner dark:border-slate-700 dark:bg-slate-800"
      />
    </section>
  );
}
