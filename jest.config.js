export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transformIgnorePatterns: [
    "node_modules/(?!(three|react-globe.gl|@react-three)/)",
  ],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass|less)$": "identity-obj-proxy",
    "^three$": "<rootDir>/src/__mocks__/three.ts",
    "^three/examples/jsm/controls/OrbitControls$": "<rootDir>/src/__mocks__/three/examples/jsm/controls/OrbitControls.ts",
    "^three/(.*)$": "<rootDir>/src/__mocks__/three/$1",
    "^react-globe.gl$": "<rootDir>/src/__mocks__/react-globe.gl.ts",
  },
};