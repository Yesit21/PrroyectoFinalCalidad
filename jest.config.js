export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(css|scss|sass|less)$": "identity-obj-proxy",
  },
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
    "^three$": "<rootDir>/node_modules/three/src/Three.js",
    "^three/(.*)$": "<rootDir>/node_modules/three/src/$1",
  },
};