const OrbitControls = jest.fn().mockImplementation(() => ({
  enableDamping: true,
  dampingFactor: 0.05,
  enableZoom: true,
  enablePan: true,
  minDistance: 50,
  maxDistance: 500,
  update: jest.fn(),
  dispose: jest.fn(),
}));

export { OrbitControls };