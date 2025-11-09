const createVector3 = (x = 0, y = 0, z = 0) => {
  const vector: any = {
    x,
    y,
    z,
    clone() {
      return createVector3(vector.x, vector.y, vector.z);
    },
    add(vec: { x: number; y: number; z: number }) {
      vector.x += vec.x;
      vector.y += vec.y;
      vector.z += vec.z;
      return vector;
    },
    multiplyScalar(scale: number) {
      vector.x *= scale;
      vector.y *= scale;
      vector.z *= scale;
      return vector;
    },
    length() {
      return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
    },
  };

  vector.set = jest.fn((nx: number, ny: number, nz: number) => {
    vector.x = nx;
    vector.y = ny;
    vector.z = nz;
    return vector;
  });

  return vector;
};

export const WebGLRenderer = jest.fn().mockImplementation(() => ({
  setPixelRatio: jest.fn(),
  setSize: jest.fn(),
  setClearColor: jest.fn(),
  domElement: Object.assign(document.createElement("canvas"), {
    getBoundingClientRect: jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
    })),
  }),
  dispose: jest.fn(),
  render: jest.fn(),
}));

export const Scene = jest.fn().mockImplementation(() => ({
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  background: null,
  traverse: jest.fn(),
}));

export const PerspectiveCamera = jest.fn().mockImplementation(() => ({
  position: createVector3(),
  lookAt: jest.fn(),
  aspect: 1,
  updateProjectionMatrix: jest.fn(),
}));

export const AmbientLight = jest.fn();

export const DirectionalLight = jest.fn().mockImplementation(() => ({
  position: { set: jest.fn() },
}));

export const PointLight = jest.fn().mockImplementation(() => ({
  position: { set: jest.fn() },
}));

export const BoxGeometry = jest.fn().mockImplementation(() => ({ type: "box" }));
export const SphereGeometry = jest.fn();
export const RingGeometry = jest.fn();
export const PlaneGeometry = jest.fn().mockImplementation(() => ({ type: "plane" }));
export const GridHelper = jest.fn();

export const BufferGeometry = jest.fn().mockImplementation(() => ({
  setAttribute: jest.fn(),
}));

export const BufferAttribute = jest.fn();

export const MeshStandardMaterial = jest.fn().mockImplementation(() => ({
  color: { setHex: jest.fn(), set: jest.fn() },
}));

export const MeshPhongMaterial = jest.fn().mockImplementation(() => ({
  color: { setHex: jest.fn(), set: jest.fn() },
}));

export const MeshBasicMaterial = jest.fn().mockImplementation(() => ({
  color: { setHex: jest.fn(), set: jest.fn() },
}));

export const PointsMaterial = jest.fn();
export const SpriteMaterial = jest.fn();

export const Mesh = jest.fn().mockImplementation(() => ({
  position: { y: 0, x: 0, z: 0, set: jest.fn() },
  rotation: { x: 0, y: 0, z: 0 },
  material: { color: { setHex: jest.fn(), set: jest.fn() }, dispose: jest.fn() },
  geometry: { dispose: jest.fn() },
  add: jest.fn(),
}));

export const Points = jest.fn().mockImplementation(() => ({
  geometry: { dispose: jest.fn() },
  material: { dispose: jest.fn() },
}));

export const Sprite = jest.fn().mockImplementation(() => ({
  scale: { set: jest.fn() },
  position: { y: 0 },
}));

export const Group = jest.fn().mockImplementation(() => ({
  add: jest.fn(),
  position: { x: 0, z: 0, set: jest.fn() },
  rotation: { x: 0, y: 0 },
}));

export const CanvasTexture = jest.fn();

export const Raycaster = jest.fn().mockImplementation(() => ({
  setFromCamera: jest.fn(),
  intersectObjects: jest.fn(() => []),
}));

export const Vector2 = jest.fn();
export const Vector3 = jest.fn().mockImplementation((x = 0, y = 0, z = 0) => createVector3(x, y, z));
export const Color = jest.fn();
export const DoubleSide = "DoubleSide";

const THREE = {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  PointLight,
  BoxGeometry,
  SphereGeometry,
  RingGeometry,
  PlaneGeometry,
  GridHelper,
  BufferGeometry,
  BufferAttribute,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshBasicMaterial,
  PointsMaterial,
  SpriteMaterial,
  Mesh,
  Points,
  Sprite,
  Group,
  CanvasTexture,
  Raycaster,
  Vector2,
  Vector3,
  Color,
  DoubleSide,
};

export default THREE;
