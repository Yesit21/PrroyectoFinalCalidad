const THREE = {
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setPixelRatio: jest.fn(),
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    domElement: document.createElement('canvas'),
    dispose: jest.fn(),
    render: jest.fn(),
  })),
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    background: null,
    traverse: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
  })),
  PointLight: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
  })),
  BoxGeometry: jest.fn(),
  SphereGeometry: jest.fn(),
  RingGeometry: jest.fn(),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
  })),
  BufferAttribute: jest.fn(),
  MeshStandardMaterial: jest.fn().mockImplementation(() => ({
    color: { setHex: jest.fn(), set: jest.fn() },
  })),
  MeshPhongMaterial: jest.fn().mockImplementation(() => ({
    color: { setHex: jest.fn(), set: jest.fn() },
  })),
  MeshBasicMaterial: jest.fn().mockImplementation(() => ({
    color: { setHex: jest.fn(), set: jest.fn() },
  })),
  PointsMaterial: jest.fn(),
  SpriteMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { y: 0, x: 0, z: 0, set: jest.fn() },
    rotation: { x: 0, y: 0, z: 0 },
    material: { color: { setHex: jest.fn(), set: jest.fn() }, dispose: jest.fn() },
    geometry: { dispose: jest.fn() },
    add: jest.fn(),
  })),
  Points: jest.fn().mockImplementation(() => ({
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn() },
  })),
  Sprite: jest.fn().mockImplementation(() => ({
    scale: { set: jest.fn() },
    position: { y: 0 },
  })),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    position: { x: 0, z: 0, set: jest.fn() },
    rotation: { x: 0, y: 0 },
  })),
  CanvasTexture: jest.fn(),
  Raycaster: jest.fn().mockImplementation(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => []),
  })),
  Vector2: jest.fn(),
  Color: jest.fn(),
  DoubleSide: 'DoubleSide',
};

export default THREE;