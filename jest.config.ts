import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["<rootDir>/jest.env.ts"],
  transformIgnorePatterns: ["node_modules/(?!axios)"],
  globals: {
    "import.meta": {
      env: {
        VITE_API_URL: "http://tu-url-de-prueba.com/", // Reemplaza con tu URL de prueba
      },
    },
  },
};

export default config;
